// dashboard-admin.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../../services/auth';
import { ProviderService, Provider } from '../../../services/provider.service';
import { SubscriptionService, Subscription } from '../../../services/subscription.service';
import { ReclamationService, ReclamationData } from '../../../services/reclamation';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexResponsive,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule
} from 'ng-apexcharts';
import { firstValueFrom } from 'rxjs';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  colors: string[];
  legend: any;
  plotOptions: any;
  dataLabels: any;
  stroke: any;
  tooltip: any;
};

export type BarChartOptions = {
  series: { name: string; data: number[] }[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.scss']
})
export class DashboardAdmin implements OnInit {
  @ViewChild('chart') chart?: ChartComponent;

  // Données
  users: User[] = [];
  providers: Provider[] = [];
  subscriptions: Subscription[] = [];
  reclamations: ReclamationData[] = [];

  // Comptages
  userCount = 0;
  providerCount = 0;
  subscriptionCount = 0;

  loading = true;
  error: string | null = null;

  // Graphiques
  pieChartOptions!: Partial<PieChartOptions>;
  barChartOptions!: Partial<BarChartOptions>;

  // Modal utilisateurs
  showModal = false;
  editingUser: User | null = null;
  userFormModel: Partial<User> = {};

  // Modal réclamations
  showReclamationsModal = false;

  // Alert
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private authService: AuthService,
    private providerService: ProviderService,
    private subscriptionService: SubscriptionService,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const [users, providers, subscriptions] = await Promise.all([
        firstValueFrom(this.authService.getUsers()),
        firstValueFrom(this.providerService.getProviders()),
        firstValueFrom(this.subscriptionService.getAllSubscriptionsAdmin())
      ]);

      this.users = users;
      this.providers = providers;
      this.subscriptions = subscriptions;

      this.userCount = users.length;
      this.providerCount = providers.length;
      this.subscriptionCount = subscriptions.length;

      this.initPieChart();
      this.initBarChart();

      this.loading = false;
    } catch (err) {
      console.error('Erreur chargement dashboard', err);
      this.error = "Erreur lors du chargement des données.";
      this.loading = false;
    }
  }

  // Graphiques
  initPieChart(): void {
    const providerCounts: Record<string, number> = {};
    this.subscriptions.forEach(sub => {
      const providerName = sub.provider?.nom || 'Inconnu';
      providerCounts[providerName] = (providerCounts[providerName] || 0) + 1;
    });

    this.pieChartOptions = {
      series: Object.values(providerCounts),
      chart: {
        type: 'pie',
        height: 400,
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        }
      },
      labels: Object.keys(providerCounts),
      title: {
        text: 'Répartition des Abonnements par Fournisseur',
        style: {
          fontSize: '16px',
          fontWeight: '700',
          color: '#2c3e50'
        }
      },
      colors: [
        '#667eea', // Bleu-violet moderne
        '#764ba2', // Violet profond
        '#f093fb', // Rose-violet
        '#f5576c', // Rouge-rose
        '#4facfe', // Bleu clair
        '#00f2fe', // Cyan
        '#43e97b', // Vert moderne
        '#38f9d7', // Turquoise
        '#ffecd2', // Pêche
        '#fcb69f', // Orange doux
        '#a8edea', // Menthe
        '#fed6e3'  // Rose poudré
      ],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
        fontSize: '14px',
        fontWeight: 600,
        labels: {
          colors: '#2c3e50'
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: undefined,
          radius: 6,
          customHTML: undefined,
          onClick: undefined,
          offsetX: 0,
          offsetY: 0
        }
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
          expandOnClick: true,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 10
          },
          donut: {
            size: '0%',
            background: 'transparent'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return Math.round(val) + "%";
        },
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '600',
          colors: ['#fff']
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#fff',
          opacity: 0.9,
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            color: '#000',
            opacity: 0.45
          }
        },
        dropShadow: {
          enabled: false
        }
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: ['#fff'],
        width: 3,
        dashArray: 0
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        },
        y: {
          formatter: function (val: number) {
            return val + " abonnements";
          }
        },
        marker: {
          show: true
        }
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              width: 380,
              height: 350
            },
            legend: {
              position: 'bottom',
              offsetY: 0,
              height: 'auto'
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              width: 300,
              height: 300
            },
            legend: {
              position: 'bottom',
              offsetY: 0,
              height: 'auto'
            }
          }
        }
      ]
    };
  }

  initBarChart(): void {
    const monthlyCounts = Array(12).fill(0);
    this.subscriptions.forEach(sub => {
      const month = new Date(sub.created_at).getMonth();
      monthlyCounts[month]++;
    });

    this.barChartOptions = {
      series: [{ name: 'Abonnements', data: monthlyCounts }],
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'] },
      title: { text: 'Abonnements créés par mois' },
      responsive: [
        { breakpoint: 480, options: { chart: { width: 300 }, legend: { position: 'bottom' } } }
      ]
    };
  }

  // Utilisateurs
  openAddUser(): void {
    this.editingUser = null;
    this.userFormModel = {};
    this.showModal = true;
  }

  openEditUser(user: User): void {
    this.editingUser = user;
    this.userFormModel = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.userFormModel = {};
    this.editingUser = null;
  }

  saveUser(): void {
    if (this.editingUser) {
      this.authService.updateUser(this.userFormModel as User).subscribe({
        next: updated => {
          const index = this.users.findIndex(u => u.id === updated.id);
          if (index > -1) this.users[index] = updated;
          this.closeModal();
          this.showAlert('Utilisateur modifié avec succès', 'success');
        },
        error: err => {
          console.error(err);
          this.showAlert('Erreur lors de la modification', 'error');
        }
      });
    } else {
      this.authService.addUser(this.userFormModel).subscribe({
        next: added => {
          this.users.push(added);
          this.userCount++;
          this.closeModal();
          this.showAlert('Utilisateur ajouté avec succès', 'success');
        },
        error: err => {
          console.error(err);
          this.showAlert('Erreur lors de l\'ajout', 'error');
        }
      });
    }
  }

  deleteUser(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    this.authService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.userCount--;
        this.showAlert('Utilisateur supprimé avec succès', 'success');
      },
      error: err => {
        console.error(err);
        this.showAlert('Erreur lors de la suppression', 'error');
      }
    });
  }

  async openReclamations(): Promise<void> {
  try {
    this.reclamations = await firstValueFrom(this.reclamationService.getReclamations());
    this.showReclamationsModal = true;
  } catch (err) {
    console.error('Erreur lors du chargement des réclamations', err);
    this.showAlert('Impossible de charger les réclamations', 'error');
  }
}

closeReclamationsModal(): void {
  this.showReclamationsModal = false;
  this.reclamations = [];
}

// Exemple de suppression
deleteReclamation(id: number): void {
  if (!confirm('Voulez-vous vraiment supprimer cette réclamation ?')) return;
  this.reclamationService.deleteReclamation(id).subscribe({
    next: () => {
      this.reclamations = this.reclamations.filter(r => r.id !== id);
      this.showAlert('Réclamation supprimée avec succès', 'success');
    },
    error: err => {
      console.error(err);
      this.showAlert('Erreur lors de la suppression', 'error');
    }
  });
}


  // ============================
  // 🎭 Méthodes pour Modal Réclamations Ultra-Moderne
  // ============================

  /**
   * Obtient les réclamations par statut
   */
  getReclamationsByStatus(status: string): ReclamationData[] {
    return this.reclamations.filter(rec => rec.status === status);
  }

  /**
   * Détermine la classe CSS pour la carte de réclamation
   */
  getReclamationCardClass(status: string): string {
    return status || 'pending';
  }

  /**
   * Détermine la classe CSS pour le badge de statut
   */
  getStatusBadgeClass(status: string): string {
    return status || 'pending';
  }

  /**
   * Détermine l'icône pour le statut
   */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'resolved':
        return 'fas fa-check-circle';
      case 'rejected':
        return 'fas fa-times-circle';
      case 'pending':
      default:
        return 'fas fa-clock';
    }
  }

  /**
   * Détermine le texte pour le statut
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'resolved':
        return 'Résolu';
      case 'rejected':
        return 'Rejeté';
      case 'pending':
      default:
        return 'En Attente';
    }
  }

  /**
   * Met à jour le statut d'une réclamation
   */
  async updateReclamationStatus(id: number, newStatus: 'pending' | 'resolved' | 'rejected'): Promise<void> {
    try {
      // Trouver la réclamation
      const reclamation = this.reclamations.find(rec => rec.id === id);
      if (!reclamation) {
        this.showAlert('Réclamation introuvable', 'error');
        return;
      }

      // Mettre à jour le statut localement
      reclamation.status = newStatus;

      // Ici vous pouvez ajouter l'appel API pour mettre à jour en base
      // await this.reclamationService.updateStatus(id, newStatus);

      const statusText = this.getStatusText(newStatus);
      this.showAlert(`Réclamation marquée comme "${statusText}"`, 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      this.showAlert('Erreur lors de la mise à jour du statut', 'error');
    }
  }

  // Alert
  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertMessage = '', 5000);
  }
}
