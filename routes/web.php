<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CourtController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VenueController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/courts', [CourtController::class, 'index'])->name('courts.index');
Route::get('/api/courts/{court}/availability', [CourtController::class, 'availability'])->name('courts.availability');
Route::get('/venues', [VenueController::class, 'index'])->name('venues.index');
Route::get('/venues/{slug}', [VenueController::class, 'show'])->name('venues.show');
Route::get('/promos', [PromoController::class, 'index'])->name('promos.index');
Route::post('/api/promos/validate', [PromoController::class, 'validate'])->name('promos.validate');

// Authenticated customer routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Booking flow
    Route::get('/booking/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/booking', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/booking/{code}/checkout', [BookingController::class, 'checkout'])->name('bookings.checkout');
    Route::post('/booking/{code}/pay', [BookingController::class, 'processPayment'])->name('bookings.pay');
    Route::get('/booking/{code}/confirmation', [BookingController::class, 'confirmation'])->name('bookings.confirmation');

    // Booking management
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{code}', [BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{code}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

    // Reviews
    Route::post('/bookings/{code}/review', [ReviewController::class, 'store'])->name('reviews.store');

    // Favorites
    Route::post('/venues/{venue}/favorite', [FavoriteController::class, 'toggle'])->name('venues.favorite');

    // Profile
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [\App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

    // Venues
    Route::get('/venues', [Admin\VenueController::class, 'index'])->name('venues.index');
    Route::get('/venues/create', [Admin\VenueController::class, 'create'])->name('venues.create');
    Route::post('/venues', [Admin\VenueController::class, 'store'])->name('venues.store');
    Route::get('/venues/{venue}/edit', [Admin\VenueController::class, 'edit'])->name('venues.edit');
    Route::put('/venues/{venue}', [Admin\VenueController::class, 'update'])->name('venues.update');
    Route::delete('/venues/{venue}', [Admin\VenueController::class, 'destroy'])->name('venues.destroy');

    // Courts
    Route::get('/courts', [Admin\CourtController::class, 'index'])->name('courts.index');
    Route::post('/courts', [Admin\CourtController::class, 'store'])->name('courts.store');
    Route::put('/courts/{court}', [Admin\CourtController::class, 'update'])->name('courts.update');
    Route::delete('/courts/{court}', [Admin\CourtController::class, 'destroy'])->name('courts.destroy');

    // Bookings
    Route::get('/bookings', [Admin\BookingController::class, 'index'])->name('bookings.index');
    Route::patch('/bookings/{booking}/status', [Admin\BookingController::class, 'updateStatus'])->name('bookings.status');

    // Promos
    Route::get('/promos', [Admin\PromoController::class, 'index'])->name('promos.index');
    Route::post('/promos', [Admin\PromoController::class, 'store'])->name('promos.store');
    Route::put('/promos/{promo}', [Admin\PromoController::class, 'update'])->name('promos.update');
    Route::delete('/promos/{promo}', [Admin\PromoController::class, 'destroy'])->name('promos.destroy');

    // Customers
    Route::get('/customers', [Admin\CustomerController::class, 'index'])->name('customers.index');
});

require __DIR__.'/auth.php';
