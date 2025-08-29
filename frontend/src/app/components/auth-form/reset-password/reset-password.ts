import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPasswordComponent {
  // Propriétés du formulaire
  email = '';
  password = '';
  confirmPassword = '';
  token = '';

  // États de l'interface ultra-moderne
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    // Récupération des query params
    const params = new URLSearchParams(window.location.search);
    this.token = params.get('token') || '';
    this.email = params.get('email') || '';
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
   * Efface tous les messages d'erreur et de succès
   */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Valide les mots de passe
   */
  private validatePasswords(): boolean {
    this.clearMessages();

    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return false;
    }

    return true;
  }

  /**
   * Réinitialise le mot de passe avec validation et messages modernes
   */
  onReset(): void {
    if (!this.validatePasswords()) {
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      password: this.password,
      password_confirmation: this.confirmPassword,
    }).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe réinitialisé avec succès ! Redirection vers la connexion...';
        setTimeout(() => {
          this.router.navigate(['/auth-form']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur lors de la réinitialisation:', error);
        this.errorMessage = 'Erreur lors de la réinitialisation. Veuillez réessayer ou demander un nouveau lien.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
