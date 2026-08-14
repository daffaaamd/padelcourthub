<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Court;
use App\Models\User;
use App\Models\Venue;
use App\Models\Payment;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();
        $thisMonth = now()->format('Y-m');
        $lastMonth = now()->subMonth()->format('Y-m');

        $stats = [
            'total_revenue' => Payment::where('status', 'paid')->sum('amount'),
            'bookings_today' => Booking::whereDate('created_at', $today)->count(),
            'total_bookings' => Booking::count(),
            'active_customers' => User::where('role', 'customer')->count(),
            'active_courts' => Court::where('status', 'available')->count(),
            'this_month_revenue' => Payment::where('status', 'paid')
                ->whereYear('paid_at', now()->year)
                ->whereMonth('paid_at', now()->month)
                ->sum('amount'),
            'last_month_revenue' => Payment::where('status', 'paid')
                ->whereYear('paid_at', now()->subMonth()->year)
                ->whereMonth('paid_at', now()->subMonth()->month)
                ->sum('amount'),
        ];

        // Last 7 days booking chart
        $bookingChart = collect(range(6, 0))->map(function ($daysAgo) {
            $date = now()->subDays($daysAgo)->toDateString();
            return [
                'date' => $date,
                'label' => now()->subDays($daysAgo)->locale('id')->isoFormat('D MMM'),
                'bookings' => Booking::whereDate('created_at', $date)->count(),
                'revenue' => Payment::where('status', 'paid')->whereDate('paid_at', $date)->sum('amount'),
            ];
        });

        $recentBookings = Booking::with(['user', 'venue', 'court', 'payment'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn($b) => [
                'booking_code' => $b->booking_code,
                'user_name' => $b->user->name,
                'venue_name' => $b->venue->name,
                'court_name' => $b->court->name,
                'date' => $b->date->format('d M Y'),
                'total' => $b->total,
                'status' => $b->status,
                'payment_status' => $b->payment?->status ?? 'pending',
                'created_at' => $b->created_at->diffForHumans(),
            ]);

        $popularVenues = Venue::withCount('bookings')
            ->orderByDesc('bookings_count')
            ->take(5)
            ->get()
            ->map(fn($v) => [
                'name' => $v->name,
                'city' => $v->city,
                'bookings_count' => $v->bookings_count,
                'cover_image_url' => $v->cover_image_url,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'booking_chart' => $bookingChart,
            'recent_bookings' => $recentBookings,
            'popular_venues' => $popularVenues,
        ]);
    }
}
