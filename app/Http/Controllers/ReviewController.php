<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, string $bookingCode)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $booking = Booking::where('booking_code', $bookingCode)
            ->where('user_id', Auth::id())
            ->where('status', 'completed')
            ->whereDoesntHave('review')
            ->firstOrFail();

        Review::create([
            'user_id' => Auth::id(),
            'venue_id' => $booking->venue_id,
            'booking_id' => $booking->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'is_published' => true,
        ]);

        return redirect()->route('bookings.show', $bookingCode)
            ->with('success', 'Terima kasih atas ulasanmu!');
    }
}
