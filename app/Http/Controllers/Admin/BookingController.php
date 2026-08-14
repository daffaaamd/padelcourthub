<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Booking::with(['user', 'venue', 'court', 'payment'])
            ->latest();

        if ($request->status) $query->where('status', $request->status);
        if ($request->venue_id) $query->where('venue_id', $request->venue_id);
        if ($request->date_from) $query->whereDate('date', '>=', $request->date_from);
        if ($request->date_to) $query->whereDate('date', '<=', $request->date_to);
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('booking_code', 'like', "%{$request->search}%")
                  ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$request->search}%"));
            });
        }

        $bookings = $query->paginate(20)->through(fn($b) => [
            'id' => $b->id,
            'booking_code' => $b->booking_code,
            'user_name' => $b->user->name,
            'user_email' => $b->user->email,
            'venue_name' => $b->venue->name,
            'court_name' => $b->court->name,
            'date' => $b->date->format('d M Y'),
            'start_time' => substr($b->start_time, 0, 5),
            'end_time' => substr($b->end_time, 0, 5),
            'duration_hours' => $b->duration_hours,
            'total' => $b->total,
            'status' => $b->status,
            'payment_status' => $b->payment?->status ?? 'pending',
            'payment_method' => $b->payment?->method_label ?? '-',
            'created_at' => $b->created_at->format('d M Y H:i'),
        ]);

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['status', 'venue_id', 'date_from', 'date_to', 'search']),
        ]);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $request->validate(['status' => 'required|in:confirmed,completed,cancelled']);
        $booking->update(['status' => $request->status]);

        return back()->with('success', 'Status booking diperbarui.');
    }
}
