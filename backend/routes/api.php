<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\AdminSubscriptionController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ReclamationController;

// Routes publiques
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// Forgot / Reset password
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

// Réclamations accessibles à tous pour créer
Route::post('/reclamations', [ReclamationController::class, 'store']);

// Routes protégées par token
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::post('/stripe/payment-intent', [StripeController::class, 'createPaymentIntent']);

    // Routes utilisateurs normaux
    Route::middleware('user')->group(function () {
        Route::apiResource('subscriptions', SubscriptionController::class);

        // 🔹 Nouvelle route pour renouveler un abonnement
        Route::post('/subscriptions/{id}/renew', [SubscriptionController::class, 'renew']);

        Route::get('/providers', [ProviderController::class, 'index']);
    });

    // Routes admins
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/only', function () {
            return response()->json(['message' => 'Accès réservé aux admins']);
        });

        Route::get('/users', [AdminUserController::class, 'index']); 
        Route::post('/users', [AdminUserController::class, 'store']); 
        Route::put('/users/{id}', [AdminUserController::class, 'update']); 
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']); 

        Route::get('/subscriptions', [AdminSubscriptionController::class, 'index']);

        Route::apiResource('providers', ProviderController::class);

        Route::get('/reclamations', [ReclamationController::class, 'index']);
        Route::get('/reclamations/{id}', [ReclamationController::class, 'show']);
        Route::put('/reclamations/{id}', [ReclamationController::class, 'update']);
        Route::delete('/reclamations/{id}', [ReclamationController::class, 'destroy']);
    });
});
