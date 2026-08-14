<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Venue::where('is_active', true)
            ->with(['courts', 'reviews'])
            ->withCount(['bookings', 'reviews']);

        if ($request->city) {
            $query->where('city', $request->city);
        }

        if ($request->type) {
            $query->whereHas('courts', fn($q) => $q->where('type', $request->type));
        }

        if ($request->min_price || $request->max_price) {
            $query->whereHas('courts.pricingRules', function ($q) use ($request) {
                if ($request->min_price) $q->where('price_per_hour', '>=', $request->min_price);
                if ($request->max_price) $q->where('price_per_hour', '<=', $request->max_price);
            });
        }

        if ($request->rating) {
            $query->having('avg_rating', '>=', $request->rating);
        }

        $sort = $request->get('sort', 'popular');
        match ($sort) {
            'price_asc' => $query->orderBy('starting_price'),
            'price_desc' => $query->orderByDesc('starting_price'),
            'rating' => $query->orderByDesc('reviews_count'),
            default => $query->orderByDesc('bookings_count'),
        };

        $venues = $query->paginate(12)->through(fn($v) => [
            'id' => $v->id,
            'name' => $v->name,
            'slug' => $v->slug,
            'city' => $v->city,
            'address' => $v->address,
            'cover_image_url' => $v->cover_image_url,
            'facilities' => $v->facilities ?? [],
            'average_rating' => $v->average_rating,
            'reviews_count' => $v->reviews_count,
            'starting_price' => $v->starting_price,
            'courts_count' => $v->courts->count(),
            'has_indoor' => $v->courts->contains('type', 'indoor'),
            'has_outdoor' => $v->courts->contains('type', 'outdoor'),
        ]);

        $cities = Venue::where('is_active', true)->distinct()->pluck('city');

        return Inertia::render('Venues/Index', [
            'venues' => $venues,
            'cities' => $cities,
            'filters' => $request->only(['city', 'type', 'min_price', 'max_price', 'rating', 'sort']),
        ]);
    }

    public function show(string $slug): Response
    {
        $venue = Venue::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'courts.pricingRules',
                'reviews' => fn($q) => $q->where('is_published', true)->latest()->take(10),
                'reviews.user',
            ])
            ->firstOrFail();

        $ratingDistribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $count = $venue->reviews->where('rating', $i)->count();
            $ratingDistribution[$i] = [
                'count' => $count,
                'percentage' => $venue->reviews->count() > 0
                    ? round($count / $venue->reviews->count() * 100)
                    : 0,
            ];
        }

        $isFavorited = auth()->check()
            ? auth()->user()->favorites()->where('venue_id', $venue->id)->exists()
            : false;

        return Inertia::render('Venues/Show', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
                'description' => $venue->description,
                'address' => $venue->address,
                'city' => $venue->city,
                'phone' => $venue->phone,
                'email' => $venue->email,
                'cover_image_url' => $venue->cover_image_url,
                'images' => $venue->images ?? [],
                'facilities' => $venue->facilities ?? [],
                'opening_time' => $venue->opening_time,
                'closing_time' => $venue->closing_time,
                'average_rating' => $venue->average_rating,
                'reviews_count' => $venue->reviews_count,
                'latitude' => $venue->latitude,
                'longitude' => $venue->longitude,
                'courts' => $venue->courts->map(fn($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'type' => $c->type,
                    'status' => $c->status,
                    'cover_image_url' => $c->cover_image_url,
                    'description' => $c->description,
                    'pricing_rules' => $c->pricingRules->map(fn($p) => [
                        'name' => $p->name,
                        'day_type' => $p->day_type,
                        'start_time' => $p->start_time,
                        'end_time' => $p->end_time,
                        'price_per_hour' => $p->price_per_hour,
                    ]),
                ]),
                'reviews' => $venue->reviews->map(fn($r) => [
                    'id' => $r->id,
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'created_at' => $r->created_at->format('d M Y'),
                    'user' => ['name' => $r->user->name, 'avatar_url' => $r->user->avatar_url],
                ]),
                'rating_distribution' => $ratingDistribution,
            ],
            'is_favorited' => $isFavorited,
        ]);
    }
}
