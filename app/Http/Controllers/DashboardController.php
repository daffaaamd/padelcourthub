<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $upcoming = Booking::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('date', '>=', now()->toDateString())
            ->with(['court', 'venue'])
            ->orderBy('date')->orderBy('start_time')
            ->take(5)
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'booking_code' => $b->booking_code,
                'date' => $b->date->format('Y-m-d'),
                'date_formatted' => $b->date->locale('id')->isoFormat('dddd, D MMMM Y'),
                'start_time' => substr($b->start_time, 0, 5),
                'end_time' => substr($b->end_time, 0, 5),
                'status' => $b->status,
                'total' => $b->total,
                'court_name' => $b->court?->name,
                'venue_name' => $b->venue?->name,
                'venue_city' => $b->venue?->city,
                'venue_image' => $b->venue?->cover_image_url,
                'venue_cover_image' => $b->venue?->cover_image_url,
            ]);

        $recentBookings = Booking::where('user_id', $user->id)
            ->with(['court', 'venue'])
            ->latest('date')
            ->take(5)
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'booking_code' => $b->booking_code,
                'date' => $b->date->format('Y-m-d'),
                'date_formatted' => $b->date->locale('id')->isoFormat('dddd, D MMMM Y'),
                'start_time' => substr($b->start_time, 0, 5),
                'end_time' => substr($b->end_time, 0, 5),
                'status' => $b->status,
                'total' => $b->total,
                'court_name' => $b->court?->name,
                'venue_name' => $b->venue?->name,
                'venue_city' => $b->venue?->city,
                'venue_image' => $b->venue?->cover_image_url,
                'venue_cover_image' => $b->venue?->cover_image_url,
            ]);

        $stats = [
            'total_bookings' => Booking::where('user_id', $user->id)->count(),
            'upcoming_count' => Booking::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('date', '>=', now()->toDateString())
                ->count(),
            'completed_bookings' => Booking::where('user_id', $user->id)
                ->where('status', 'completed')
                ->count(),
            'pending_bookings' => Booking::where('user_id', $user->id)
                ->where('status', 'pending')
                ->count(),
            'total_games' => Booking::where('user_id', $user->id)
                ->where('status', 'completed')
                ->count(),
            'favorite_venues' => $user->favorites()->count(),
            'total_spent' => (int) Booking::where('user_id', $user->id)
                ->whereIn('status', ['confirmed', 'completed'])
                ->sum('total'),
        ];

        return Inertia::render('Dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar_url' => $user->avatar_url,
            ],
            'upcoming' => $upcoming,
            'recent_bookings' => $recentBookings,
            'stats' => $stats,
        ]);
    }
}
