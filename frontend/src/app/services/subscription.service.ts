import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subscription {
  id?: number;
  name: string;
  provider_id: number;
  provider?: Provider; // ✅ Ajout pour l'accès direct
  amount: number;
  billing_cycle: 'monthly' | 'yearly';
  notes?: string;
  tags?: string[];
  logo_path?: string;
  user_id?: number;
  created_at: string;
  next_payment_date?: string; // ou Date selon ton backend
}

export interface Provider {
  id: number;
  nom: string;
  logo: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:8080/api'; // URL de ton backend

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token manquant');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Méthode Stripe : création d'un Payment Intent
  createPaymentIntent(amount: number, currency: string = 'usd'): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(
      `${this.apiUrl}/stripe/payment-intent`,
      { amount, currency },
      { headers: this.getAuthHeaders() }
    );
  }

  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/subscriptions`, {
      headers: this.getAuthHeaders(),
    });
  }

  getSubscription(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/subscriptions/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createSubscription(data: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/subscriptions`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  updateSubscription(id: number, data: Subscription): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/subscriptions/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteSubscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/subscriptions/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.apiUrl}/providers`, {
      headers: this.getAuthHeaders(),
    });
  }
  getAllSubscriptionsAdmin(): Observable<Subscription[]> {
  return this.http.get<Subscription[]>(`${this.apiUrl}/admin/subscriptions`, {
    headers: this.getAuthHeaders(),
  });
}
renewSubscription(id: number): Observable<Subscription> {
  return this.http.post<Subscription>(
    `${this.apiUrl}/subscriptions/${id}/renew`,
    {},
    { headers: this.getAuthHeaders() }
  );
}

}
