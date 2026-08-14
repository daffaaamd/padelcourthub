<?php

namespace App\Http\Controllers;

use App\Models\Court;
use App\Models\Venue;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class CourtController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    public function index(Request $request): Response
    {
        $date = $request->date;
        if ($date && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            $date = null;
        }
        $time = $request->time;
        if ($time && !preg_match('/^\d{2}:\d{2}$/', $time)) {
            $time = null;
        }

        $query = Court::where('status', 'available')
            ->with(['venue', 'pricingRules'])
            ->whereHas('venue', fn($q) => $q->where('is_active', true));

        if ($request->city) {
            $query->whereHas('venue', fn($q) => $q->where('city', $request->city));
        }
        if ($request->type) {
            $query->where('type', $request->type);
        }
        if ($request->venue_id) {
            $query->where('venue_id', $request->venue_id);
        }

        $courts = $query->get();

        // Filter by real availability when date/time is requested
        if ($date) {
            $courts = $courts->filter(function ($court) use ($date, $time) {
                $slots = collect($this->bookingService->getAvailableSlots($court, $date));
                if ($time) {
                    $timeFull = $time . ':00';
                    return $slots->contains(fn($s) => $s['status'] === 'available' && $s['start'] === $timeFull);
                }
                return $slots->contains('status', 'available');
            })->values();
        }

        $page = LengthAwarePaginator::resolveCurrentPage();
        $paginated = (new LengthAwarePaginator(
            $courts->forPage($page, 12)->values(),
            $courts->count(),
            12,
            $page,
            ['path' => LengthAwarePaginator::resolveCurrentPath(), 'query' => $request->query()]
        ))->through(fn($c) => [
            'id' => $c->id,
            'name' => $c->name,
            'type' => $c->type,
            'status' => $c->status,
            'cover_image_url' => $c->cover_image_url,
            'venue' => [
                'name' => $c->venue->name,
                'slug' => $c->venue->slug,
                'city' => $c->venue->city,
                'cover_image_url' => $c->venue->cover_image_url,
                'average_rating' => $c->venue->average_rating,
                'reviews_count' => $c->venue->reviews_count,
                'facilities' => $c->venue->facilities ?? [],
            ],
            'starting_price' => $c->pricingRules->min('price_per_hour') ?? 0,
        ]);

        return Inertia::render('Courts/Index', [
            'courts' => $paginated,
            'cities' => Venue::where('is_active', true)->distinct()->pluck('city'),
            'filters' => $request->only(['city', 'type', 'date', 'time', 'sort']),
        ]);
    }

    public function availability(Request $request, Court $court): JsonResponse
    {
        $request->validate(['date' => 'required|date']);

        if (!$court->isAvailable()) {
            return response()->json(['error' => 'Court sedang dalam maintenance.'], 422);
        }

        $slots = $this->bookingService->getAvailableSlots($court, $request->date);

        return response()->json([
            'court_id' => $court->id,
            'date' => $request->date,
            'slots' => $slots,
        ]);
    }
}
