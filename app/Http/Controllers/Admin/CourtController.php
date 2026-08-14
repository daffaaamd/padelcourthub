<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Court;
use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourtController extends Controller
{
    public function index(): Response
    {
        $courts = Court::with(['venue', 'pricingRules'])
            ->withCount('bookings')
            ->latest()
            ->paginate(20)
            ->through(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'type' => $c->type,
                'status' => $c->status,
                'cover_image_url' => $c->cover_image_url,
                'venue_name' => $c->venue->name,
                'venue_city' => $c->venue->city,
                'bookings_count' => $c->bookings_count,
                'min_price' => $c->pricingRules->min('price_per_hour') ?? 0,
            ]);

        $venues = Venue::where('is_active', true)->get(['id', 'name', 'city']);

        return Inertia::render('Admin/Courts/Index', ['courts' => $courts, 'venues' => $venues]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'venue_id' => 'required|exists:venues,id',
            'name' => 'required|string|max:100',
            'type' => 'required|in:indoor,outdoor',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'status' => 'required|in:available,maintenance,inactive',
        ]);

        $court = Court::create($validated);

        // Create default pricing rules
        $defaultRules = [
            ['name' => 'Weekday Pagi', 'day_type' => 'weekday', 'start_time' => '07:00:00', 'end_time' => '17:00:00', 'price_per_hour' => 120000],
            ['name' => 'Weekday Malam', 'day_type' => 'weekday', 'start_time' => '17:00:00', 'end_time' => '23:00:00', 'price_per_hour' => 150000],
            ['name' => 'Weekend', 'day_type' => 'weekend', 'start_time' => '07:00:00', 'end_time' => '23:00:00', 'price_per_hour' => 175000],
        ];

        foreach ($defaultRules as $rule) {
            $court->pricingRules()->create($rule);
        }

        return redirect()->route('admin.courts.index')->with('success', 'Court berhasil ditambahkan.');
    }

    public function update(Request $request, Court $court)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'required|in:indoor,outdoor',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'status' => 'required|in:available,maintenance,inactive',
        ]);

        $court->update($validated);
        return redirect()->route('admin.courts.index')->with('success', 'Court berhasil diperbarui.');
    }

    public function destroy(Court $court)
    {
        $court->update(['status' => 'inactive']);
        return redirect()->route('admin.courts.index')->with('success', 'Court dinonaktifkan.');
    }
}
