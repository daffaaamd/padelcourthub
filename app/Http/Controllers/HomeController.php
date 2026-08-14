<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\Booking;
use App\Models\Court;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $popularVenues = Venue::where('is_active', true)
            ->with(['courts', 'reviews'])
            ->withCount(['bookings', 'reviews'])
            ->orderBy('bookings_count', 'desc')
            ->take(6)
            ->get()
            ->map(fn($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'slug' => $v->slug,
                'city' => $v->city,
                'cover_image_url' => $v->cover_image_url,
                'facilities' => $v->facilities ?? [],
                'average_rating' => $v->average_rating,
                'reviews_count' => $v->reviews_count,
                'starting_price' => $v->starting_price,
                'courts_count' => $v->courts->count(),
            ]);

        $stats = [
            'total_courts' => Court::where('status', 'available')->count(),
            'total_venues' => Venue::where('is_active', true)->count(),
            'total_bookings' => Booking::whereIn('status', ['confirmed', 'completed'])->count(),
            'average_rating' => round(\App\Models\Review::avg('rating') ?? 4.8, 1),
        ];

        return Inertia::render('Home', [
            'popularVenues' => $popularVenues,
            'stats' => $stats,
        ]);
    }
}
