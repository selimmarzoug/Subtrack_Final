import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionService, Subscription, Provider } from '../../services/subscription.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CalendarModule,
  CalendarEvent,
  CalendarView,
} from 'angular-calendar';
import { addMonths, subMonths } from 'date-fns';
import { Subject, firstValueFrom } from 'rxjs';

// Stripe
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule],
  templateUrl: './subscription-form.html',
  styleUrls: ['./subscription-form.scss']
})
export class SubscriptionForm implements OnInit, AfterViewChecked {
  form!: FormGroup;
  subscriptions: Subscription[] = [];
  providers: Provider[] = [];
  subscriptionId?: number;
  isEditMode = false;
  error = '';
  success = '';
  showAgenda = false;
  selectedProviderLogo: string | null = null;
  showModal = false;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<void> = new Subject();

  notifications: { title: string; body: string; date: Date }[] = [];

  // Stripe
  stripe: Stripe | null = null;
  card!: StripeCardElement;
  clientSecret: string | null = null;

  @ViewChild('cardElement', { static: false }) cardElement?: ElementRef;

  private cardMounted = false;

  // ✅ Gestion des checkboxes
  allSelected = false;
  selectedSubscriptions: number[] = [];

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadNotificationsFromStorage();
    this.requestNotificationPermission();
    this.initForm();
    this.loadProviders();
    this.loadSubscriptions();

    this.subscriptionId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.subscriptionId) {
      this.isEditMode = true;
      this.loadSubscription(this.subscriptionId);
      this.openModal();
    }

    // Charger la clé publique Stripe
    this.stripe = await loadStripe('pk_test_51RrbRNGaZoKBj88LRcAB6cA3xrd6KQqLpRtG07b9gAY1whljuilbKetnCgMpZy1CmuFVr2ZkSA727mGpGGwGBkbt008b8HYUnW');

    // Vérifie les paiements à venir toutes les heures
    setInterval(() => {
      this.checkUpcomingPayments();
    }, 1000 * 60 * 60);
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      provider_id: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      billing_cycle: ['monthly', Validators.required],
      notes: [''],
      tags: [''],
      next_payment_date: [null, Validators.required],
    });
  }

  onProviderChange() {
    const providerId = this.form.get('provider_id')?.value;
    const provider = this.providers.find(p => p.id === providerId);
    this.selectedProviderLogo = provider?.logo || null;
  }

  loadProviders() {
    this.subscriptionService.getProviders().subscribe({
      next: (data) => this.providers = data,
      error: () => this.error = 'Erreur lors du chargement des fournisseurs.'
    });
  }

  loadSubscriptions() {
    this.subscriptionService.getSubscriptions().subscribe({
      next: (subs) => {
        this.subscriptions = subs;
        this.prepareCalendarEvents();
        this.refresh.next();
        this.cd.detectChanges();
        this.checkUpcomingPayments();
      },
      error: () => this.error = 'Erreur lors du chargement des abonnements.'
    });
  }

  loadSubscription(id: number) {
    this.subscriptionService.getSubscription(id).subscribe({
      next: (sub) => {
        this.form.patchValue({
          name: sub.name,
          provider_id: sub.provider_id,
          amount: sub.amount,
          billing_cycle: sub.billing_cycle,
          notes: sub.notes,
          tags: sub.tags?.join(', ') || '',
          next_payment_date: sub.next_payment_date?.split('T')[0] || null,
        });
        this.onProviderChange();
      },
      error: () => this.error = 'Erreur lors du chargement.'
    });
  }

  prepareCalendarEvents() {
    this.events = this.subscriptions
      .filter(sub => sub.next_payment_date)
      .map(sub => ({
        start: new Date(sub.next_payment_date!),
        title: `${sub.name} - Prochain paiement`,
        color: { primary: '#1e90ff', secondary: '#D1E8FF' },
        allDay: true,
      }));
  }

  ngAfterViewChecked() {
    if (this.showModal && this.clientSecret && this.cardElement && !this.cardMounted) {
      this.mountCardElement();
    }
  }

  async mountCardElement(): Promise<void> {
    if (!this.stripe || !this.clientSecret || !this.cardElement) return;

    if (this.cardMounted) {
      this.card.unmount();
      this.cardMounted = false;
    }

    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
    this.cardMounted = true;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    const formValue = { ...this.form.value };
    formValue.tags = formValue.tags
      ? formValue.tags.split(',').map((t: string) => t.trim())
      : [];

    try {
      const paymentIntent = await firstValueFrom(
        this.subscriptionService.createPaymentIntent(formValue.amount * 100, 'usd')
      );

      this.clientSecret = paymentIntent.clientSecret;

      const result = await this.stripe!.confirmCardPayment(this.clientSecret!, {
        payment_method: {
          card: this.card,
        },
      });

      if (result.error) {
        this.error = result.error.message || 'Erreur de paiement';
        return;
      }

      if (result.paymentIntent?.status === 'succeeded') {
        if (this.isEditMode && this.subscriptionId) {
          this.subscriptionService.updateSubscription(this.subscriptionId, formValue).subscribe({
            next: () => {
              this.success = 'Abonnement mis à jour avec succès ✅';
              this.resetForm();
              this.loadSubscriptions();
              this.closeModal();
            },
            error: () => this.error = 'Erreur lors de la mise à jour.'
          });
        } else {
          this.subscriptionService.createSubscription(formValue).subscribe({
            next: () => {
              this.success = 'Abonnement créé avec succès ✅';
              this.resetForm();
              this.loadSubscriptions();
              this.closeModal();
            },
            error: () => this.error = 'Erreur lors de la création.'
          });
        }
      }
    } catch (e: any) {
      this.error = e.message || 'Erreur inattendue';
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.subscriptionId = undefined;
    this.resetForm();
    if (this.cardMounted) {
      this.card.unmount();
      this.cardMounted = false;
    }
  }

  resetForm() {
    this.form.reset({ billing_cycle: 'monthly' });
    this.selectedProviderLogo = null;
    this.error = '';
    this.success = '';
    this.clientSecret = null;
  }

  deleteSubscription(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet abonnement ?')) {
      this.subscriptionService.deleteSubscription(id).subscribe({
        next: () => {
          this.success = 'Abonnement supprimé ✅';
          this.loadSubscriptions();
        },
        error: () => this.error = 'Erreur lors de la suppression.'
      });
    }
  }

  getProviderName(providerId: number): string {
    const provider = this.providers.find(p => p.id === providerId);
    return provider ? provider.nom : 'Inconnu';
  }

  editSubscription(sub: Subscription) {
    this.isEditMode = true;
    this.subscriptionId = sub.id;
    this.form.patchValue({
      name: sub.name,
      provider_id: sub.provider_id,
      amount: sub.amount,
      billing_cycle: sub.billing_cycle,
      notes: sub.notes,
      tags: sub.tags?.join(', ') || '',
      next_payment_date: sub.next_payment_date?.split('T')[0] || null,
    });
    this.onProviderChange();
    this.openModal();
  }

  increment() {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  decrement() {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  today() {
    this.viewDate = new Date();
  }

  toggleAgenda() {
    this.showAgenda = !this.showAgenda;
  }

  loadNotificationsFromStorage() {
    const stored = localStorage.getItem('app-notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.notifications = parsed.map((notif: any) => ({
          ...notif,
          date: new Date(notif.date)
        }));
      } catch {
        this.notifications = [];
      }
    }
  }

  saveNotificationsToStorage() {
    localStorage.setItem('app-notifications', JSON.stringify(this.notifications));
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          console.warn('Permission de notification refusée');
        }
      });
    }
  }

  checkUpcomingPayments() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const today = new Date();

    this.subscriptions.forEach(sub => {
      if (!sub.next_payment_date) return;

      const nextPaymentDate = new Date(sub.next_payment_date);
      const diffTime = nextPaymentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0 && diffDays <= 3) {
        const storageKey = `notified-sub-${sub.id}`;
        const lastNotifiedDateStr = localStorage.getItem(storageKey);

        if (lastNotifiedDateStr !== sub.next_payment_date) {
          const title = 'Prochain paiement';
          const body = `L’abonnement "${sub.name}" doit être payé dans ${diffDays} jour(s).`;

          new Notification(title, {
            body,
            icon: sub.logo_path || '',
          });

          this.notifications.unshift({ title, body, date: new Date() });
          this.saveNotificationsToStorage();
          localStorage.setItem(storageKey, sub.next_payment_date);
          this.cd.detectChanges();
        }
      } else {
        localStorage.removeItem(`notified-sub-${sub.id}`);
      }
    });
  }

  clearNotifications() {
    this.notifications = [];
    this.saveNotificationsToStorage();
  }

  hideImage(event: Event) {
    const target = event.target as HTMLElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  isPaymentDue(nextPaymentDate: string | null): boolean {
    if (!nextPaymentDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paymentDate = new Date(nextPaymentDate);
    paymentDate.setHours(0, 0, 0, 0);
    return paymentDate <= today;
  }

  async renewSubscription(sub: Subscription) {
    if (!sub || !sub.id) {
      this.error = "Données d'abonnement invalides ❌";
      window.alert("Impossible de renouveler : abonnement non valide !");
      return;
    }

    const confirmRenew = window.confirm(`Voulez-vous vraiment renouveler l'abonnement : ${sub.name} ?`);
    if (!confirmRenew) return;

    this.subscriptionService.renewSubscription(sub.id).subscribe({
      next: () => {
        this.success = '✅ Abonnement renouvelé avec succès !';
        window.alert(this.success);
        this.loadSubscriptions();
      },
      error: (err) => {
        console.error(err);
        this.error = '⚠️ Erreur lors du renouvellement. Veuillez réessayer.';
        window.alert(this.error);
      }
    });
  }

  // ============================
  // 🔔 Méthodes pour les Notifications
  // ============================
  getNotificationClass(notification: any): string {
    const title = notification.title?.toLowerCase() || '';
    const body = notification.body?.toLowerCase() || '';

    if (title.includes('retard') || title.includes('échéance') || body.includes('retard')) {
      return 'notification-danger';
    }
    if (title.includes('rappel') || body.includes('rappel')) {
      return 'notification-warning';
    }
    if (title.includes('succès') || title.includes('payé') || body.includes('succès')) {
      return 'notification-success';
    }
    return 'notification-info';
  }

  getNotificationIcon(notification: any): string {
    const title = notification.title?.toLowerCase() || '';
    const body = notification.body?.toLowerCase() || '';

    if (title.includes('retard') || title.includes('échéance') || body.includes('retard')) {
      return 'fas fa-exclamation-triangle';
    }
    if (title.includes('rappel') || body.includes('rappel')) {
      return 'fas fa-clock';
    }
    if (title.includes('succès') || title.includes('payé') || body.includes('succès')) {
      return 'fas fa-check-circle';
    }
    if (title.includes('paiement') || body.includes('paiement')) {
      return 'fas fa-credit-card';
    }
    return 'fas fa-info-circle';
  }

  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
  }

  // ============================
  // 📅 Méthodes pour l'Agenda
  // ============================
  getUpcomingPayments(): Subscription[] {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.subscriptions.filter(sub => {
      const paymentDate = new Date(sub.next_payment_date);
      return paymentDate >= today && paymentDate <= nextWeek;
    });
  }

  getTotalMonthlyAmount(): number {
    return this.subscriptions.reduce((total, sub) => {
      if (sub.billing_cycle === 'monthly') return total + sub.amount;
      return total + (sub.amount / 12);
    }, 0);
  }

  getTimelineItemClass(subscription: Subscription): string {
    if (this.isPaymentDue(subscription.next_payment_date)) return 'urgent';

    const today = new Date();
    const paymentDate = new Date(subscription.next_payment_date);
    const daysUntilPayment = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilPayment <= 3) return 'warning';
    if (daysUntilPayment <= 7) return 'success';
    return 'normal';
  }

  getTimelineDotClass(subscription: Subscription): string {
    return this.getTimelineItemClass(subscription);
  }

  getTimelineIcon(subscription: Subscription): string {
    const itemClass = this.getTimelineItemClass(subscription);
    switch (itemClass) {
      case 'urgent': return 'fas fa-exclamation-triangle';
      case 'warning': return 'fas fa-clock';
      case 'success': return 'fas fa-check-circle';
      default: return 'fas fa-calendar-day';
    }
  }

  getDateBadgeClass(subscription: Subscription): string {
    return this.getTimelineItemClass(subscription);
  }

  getDateStatusClass(subscription: Subscription): string {
    return this.getTimelineItemClass(subscription);
  }

  getDateStatusText(subscription: Subscription): string {
    const itemClass = this.getTimelineItemClass(subscription);
    switch (itemClass) {
      case 'urgent': return 'En retard';
      case 'warning': return 'Urgent';
      case 'success': return 'Bientôt';
      default: return 'À venir';
    }
  }

  // ============================
  // ✅ Gestion des checkboxes
  // ============================
toggleSelectAll() {
  this.allSelected = !this.allSelected;

  if (this.allSelected) {
    this.selectedSubscriptions = this.subscriptions.map(s => s.id!);

    // 🔹 Renouvellement automatique pour tous
    this.subscriptions.forEach(sub => this.renewSubscription(sub));
  } else {
    this.selectedSubscriptions = [];
  }
}


 toggleSelection(sub: Subscription) {
  const index = this.selectedSubscriptions.indexOf(sub.id!);

  if (index > -1) {
    this.selectedSubscriptions.splice(index, 1);
  } else {
    this.selectedSubscriptions.push(sub.id!);

    // 🚀 Lancer le renouvellement automatique si checkbox cochée
    this.renewSubscription(sub);
  }

  // Mise à jour de la checkbox "tout sélectionner"
  this.allSelected = this.selectedSubscriptions.length === this.subscriptions.length;
}


  getSelectedSubscriptions(): Subscription[] {
    return this.subscriptions.filter(sub => this.selectedSubscriptions.includes(sub.id));
  }
}
