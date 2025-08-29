import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-form.html',
  styleUrls: ['./auth-form.scss'],
})
export class AuthForm implements AfterViewInit {
  @ViewChild('formContainer', { static: true }) formContainer!: ElementRef;

  // Propriétés du formulaire
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  // États de l'interface ultra-moderne
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    // Initialisation moderne des événements
    this.initializeModernEvents();
  }

  /**
   * Initialise les événements modernes
   */
  private initializeModernEvents(): void {
    // Gestion moderne du mot de passe oublié
    const forgotLink = this.formContainer.nativeElement.querySelector('.forgot-pass');
    if (forgotLink) {
      this.renderer.listen(forgotLink, 'click', (e: Event) => {
        e.preventDefault();
        this.handleForgotPassword();
      });
    }
  }

  /**
   * Gère la demande de mot de passe oublié
   */
  private handleForgotPassword(): void {
    this.clearMessages();

    if (!this.email) {
      this.errorMessage = 'Veuillez saisir votre email avant de demander une réinitialisation';
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.successMessage = 'Un email de réinitialisation a été envoyé. Vérifiez votre boîte mail.';
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la demande de réinitialisation';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Signup
  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => alert('Inscription réussie !'),
      error: () => alert('Échec de l’inscription !'),
    });
  }

  // Login
  onLogin(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.setToken(res.access_token);
        this.authService.setUser(res.user);
        const role = res.user?.role;
        if (role === 'admin') this.router.navigate(['/dashboard-admin']);
        else this.router.navigate(['/default']);
      },
      error: () => {
        this.errorMessage = 'Email ou mot de passe incorrect';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // ============================
  // 🎨 Méthodes Ultra-Modernes
  // ============================

  /**
   * Bascule l'affichage du mot de passe principal
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Bascule l'affichage du mot de passe de confirmation
   */
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Bascule entre les formulaires de connexion et d'inscription avec animation fluide
   */
  toggleForm(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    // Effacer les messages et champs avant la transition
    this.clearMessages();

    // Ajouter une petite animation avant le basculement
    const formsContainer = this.formContainer.nativeElement;
    formsContainer.style.transform = 'scale(0.98)';

    setTimeout(() => {
      formsContainer.classList.toggle('show-signup');
      formsContainer.style.transform = 'scale(1)';
      this.clearForm();
    }, 150);
  }

  /**
   * Efface tous les messages d'erreur et de succès
   */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Efface tous les champs du formulaire
   */
  private clearForm(): void {
    this.name = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
  }
}
