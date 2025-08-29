<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewSubscriptionNotification;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    // Calcule la date du prochain paiement en fonction du cycle
    private function calculateNextPaymentDate(string $billing_cycle, ?string $fromDate = null): string
    {
        $date = $fromDate ? now()->parse($fromDate) : now();

        return $billing_cycle === 'monthly'
            ? $date->addMonth()->toDateString()
            : $date->addYear()->toDateString();
    }

    // Liste abonnements utilisateur
    public function index()
    {
        $subscriptions = Auth::user()
            ->subscriptions()
            ->with('provider')
            ->get()
            ->map(function ($subscription) {
                return array_merge($subscription->toArray(), [
                    'logo_path' => $subscription->logo_path,
                ]);
            });

        return response()->json($subscriptions);
    }

    // Crée un abonnement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'provider_id' => 'required|exists:providers,id',
            'amount' => 'required|numeric',
            'billing_cycle' => 'required|in:monthly,yearly',
            'next_payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        $validated['user_id'] = Auth::id();

        if (empty($validated['next_payment_date'])) {
            $validated['next_payment_date'] = $this->calculateNextPaymentDate($validated['billing_cycle']);
        }

        $subscription = Subscription::create($validated);

        // Envoi d'email de confirmation
        Mail::to($subscription->user->email)
            ->send(new NewSubscriptionNotification($subscription));

        return response()->json(array_merge(
            $subscription->load('provider')->toArray(),
            ['logo_path' => $subscription->logo_path]
        ), 201);
    }

    // Affiche un abonnement
    public function show($id)
    {
        $subscription = Subscription::where('user_id', Auth::id())
            ->with('provider')
            ->findOrFail($id);

        return response()->json(array_merge(
            $subscription->toArray(),
            ['logo_path' => $subscription->logo_path]
        ));
    }

    // Met à jour un abonnement
    public function update(Request $request, $id)
    {
        $subscription = Subscription::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'provider_id' => 'sometimes|required|exists:providers,id',
            'amount' => 'sometimes|required|numeric',
            'billing_cycle' => 'sometimes|required|in:monthly,yearly',
            'next_payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        // Si le cycle est modifié → recalcul automatique de la prochaine date
        if (isset($validated['billing_cycle'])) {
            $validated['next_payment_date'] = $this->calculateNextPaymentDate($validated['billing_cycle']);
        }

        $subscription->update($validated);

        return response()->json(array_merge(
            $subscription->load('provider')->toArray(),
            ['logo_path' => $subscription->logo_path]
        ));
    }

    // Supprime un abonnement
    public function destroy($id)
    {
        $subscription = Subscription::where('user_id', Auth::id())->findOrFail($id);
        $subscription->delete();

        return response()->json(['message' => 'Abonnement supprimé avec succès']);
    }

    // Crée un PaymentIntent Stripe simple
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.5',
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            $intent = PaymentIntent::create([
                'amount' => intval($request->amount * 100), // en centimes
                'currency' => 'eur',
                'metadata' => [
                    'user_id' => Auth::id(),
                    'purpose' => 'subscription_payment'
                ],
            ]);

            return response()->json([
                'clientSecret' => $intent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Échec de la création du paiement : ' . $e->getMessage()
            ], 500);
        }
    }

    // 🔹 Renouvelle un abonnement (paiement + mise à jour date)
    public function renew(Request $request, $id)
    {
        $subscription = Subscription::where('user_id', Auth::id())->findOrFail($id);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // 1. Créer un PaymentIntent
            $intent = PaymentIntent::create([
                'amount' => intval($subscription->amount * 100), // montant en centimes
                'currency' => 'eur',
                'metadata' => [
                    'user_id' => Auth::id(),
                    'subscription_id' => $subscription->id,
                    'purpose' => 'subscription_renewal'
                ],
            ]);

            // 2. Mettre à jour la prochaine date de paiement
            $subscription->next_payment_date = $this->calculateNextPaymentDate(
                $subscription->billing_cycle,
                $subscription->next_payment_date
            );
            $subscription->save();

            return response()->json([
                'message' => 'Paiement Stripe créé pour le renouvellement',
                'clientSecret' => $intent->client_secret,
                'subscription' => $subscription
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Échec du renouvellement : ' . $e->getMessage()
            ], 500);
        }
    }
}
