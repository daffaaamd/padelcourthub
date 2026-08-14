<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    public function index(): Response
    {
        $venues = Venue::withCount(['courts', 'bookings', 'reviews'])
            ->latest()
            ->paginate(15)
            ->through(fn($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'slug' => $v->slug,
                'city' => $v->city,
                'is_active' => $v->is_active,
                'courts_count' => $v->courts_count,
                'bookings_count' => $v->bookings_count,
                'reviews_count' => $v->reviews_count,
                'cover_image_url' => $v->cover_image_url,
                'created_at' => $v->created_at->format('d M Y'),
            ]);

        return Inertia::render('Admin/Venues/Index', ['venues' => $venues]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Venues/Form', ['venue' => null]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'province' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'opening_time' => 'required',
            'closing_time' => 'required',
            'facilities' => 'nullable|array',
            'cover_image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Venue::create($validated);
        return redirect()->route('admin.venues.index')->with('success', 'Venue berhasil ditambahkan.');
    }

    public function edit(Venue $venue): Response
    {
        return Inertia::render('Admin/Venues/Form', ['venue' => $venue]);
    }

    public function update(Request $request, Venue $venue)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'province' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'opening_time' => 'required',
            'closing_time' => 'required',
            'facilities' => 'nullable|array',
            'cover_image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $venue->update($validated);
        return redirect()->route('admin.venues.index')->with('success', 'Venue berhasil diperbarui.');
    }

    public function destroy(Venue $venue)
    {
        $venue->update(['is_active' => false]);
        return redirect()->route('admin.venues.index')->with('success', 'Venue berhasil dinonaktifkan.');
    }
}
