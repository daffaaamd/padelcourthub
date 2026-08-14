<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Court;
use App\Models\Promo;
use App\Services\BookingService;
use App\Services\PromoService;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService,
        private PromoService $promoService,
        private PricingService $pricingService,
    ) {}

    public function create(Request $request): Response
    {
        $court = Court::with(['venue', 'pricingRules'])->findOrFail($request->court_id);

        return Inertia::render('Bookings/Create', [
            'court' => [
                'id' => $court->id,
                'name' => $court->name,
                'type' => $court->type,
                'status' => $court->status,
                'cover_image_url' => $court->cover_image_url,
                'venue' => [
                    'id' => $court->venue->id,
                    'name' => $court->venue->name,
                    'slug' => $court->venue->slug,
                    'city' => $court->venue->city,
                    'opening_time' => $court->venue->opening_time,
                    'closing_time' => $court->venue->closing_time,
                ],
                'pricing_rules' => $court->pricingRules,
            ],
            'preselected' => [
                'date' => $request->date,
                'start_time' => $request->start_time,
                'promo' => $request->promo ?? $request->promo_code,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'court_id' => 'required|exists:courts,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required',
            'duration_hours' => 'required|numeric|min:1|max:4',
            'promo_code' => 'nullable|string',
            'notes' => 'nullable|string|max:500',
        ]);

        // Ensure start_time has H:i:s format
        if (strlen($validated['start_time']) === 5) {
            $validated['start_time'] .= ':00';
        }

        $promo = null;
        if (!empty($validated['promo_code'])) {
            $court = Court::with('pricingRules')->find($validated['court_id']);
            $breakdown = $this->pricingService->getBreakdown(
                $court, $validated['date'], $validated['start_time'], $validated['duration_hours']
            );
            $result = $this->promoService->validate($validated['promo_code'], Auth::user(), $breakdown['total']);
            if (!$result['valid']) {
                return back()->withErrors(['promo_code' => $result['message']]);
            }
            $promo = Promo::find($result['promo']['id'] ?? null);
        }

        try {
            $booking = $this->bookingService->createBooking(Auth::user(), $validated, $promo);
            return redirect()->route('bookings.checkout', $booking->booking_code);
        } catch (\Exception $e) {
            return back()->withErrors(['slot' => $e->getMessage()]);
        }
    }

    public function checkout(string $code): Response
    {
        $booking = Booking::where('booking_code', $code)
            ->where('user_id', Auth::id())
            ->with(['court', 'venue', 'payment', 'promo'])
            ->firstOrFail();

        if ($booking->status !== 'pending') {
            return redirect()->route('bookings.show', $code);
        }

        return Inertia::render('Bookings/Checkout', [
            'booking' => $this->formatBooking($booking),
        ]);
    }

    public function processPayment(Request $request, string $code)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:bank_transfer,e_wallet,credit_card,virtual_account,cash',
            'bank_name' => 'nullable|string',
        ]);

        $booking = Booking::where('booking_code', $code)
            ->where('user_id', Auth::id())
            ->where('status', 'pending')
            ->firstOrFail();

        $this->bookingService->confirmPayment($booking, $validated['payment_method'], $validated['bank_name'] ?? null);

        return redirect()->route('bookings.confirmation', $code);
    }

    public function confirmation(string $code): Response
    {
        $booking = Booking::where('booking_code', $code)
            ->where('user_id', Auth::id())
            ->with(['court', 'venue', 'payment', 'promo'])
            ->firstOrFail();

        return Inertia::render('Bookings/Confirmation', [
            'booking' => $this->formatBooking($booking),
        ]);
    }

    public function index(Request $request): Response
    {
        $status = $request->query('status');

        $query = Booking::where('user_id', Auth::id())
            ->with(['court.venue', 'venue', 'payment'])
            ->latest('date')
            ->latest('start_time');

        if ($status && in_array($status, ['pending', 'confirmed', 'completed', 'cancelled'])) {
            $query->where('status', $status);
        }

        $bookings = $query->paginate(10)->withQueryString()->through(function ($b) {
            $venue = $b->venue ?? $b->court?->venue;
            return [
                'id' => $b->id,
                'booking_code' => $b->booking_code,
                'venue_name' => $venue?->name ?? 'Padel Venue',
                'court_name' => $b->court?->name ?? 'Court',
                'venue_city' => $venue?->city ?? 'Indonesia',
                'venue_cover_image' => $venue?->cover_image_url ?? $b->court?->cover_image_url ?? '',
                'date' => $b->date->format('Y-m-d'),
                'start_time' => substr($b->start_time, 0, 5),
                'end_time' => substr($b->end_time, 0, 5),
                'duration_hours' => (float) $b->duration_hours,
                'total' => (int) $b->total,
                'status' => $b->status,
                'payment_status' => $b->payment?->status ?? 'pending',
                'can_cancel' => $b->canBeCancelled(),
                'created_at' => $b->created_at->format('d M Y H:i'),
            ];
        });

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
            'filters' => [
                'status' => $status ?? '',
            ],
        ]);
    }

    public function show(string $code): Response
    {
        $booking = Booking::where('booking_code', $code)
            ->where('user_id', Auth::id())
            ->with(['court', 'venue', 'payment', 'promo', 'review'])
            ->firstOrFail();

        return Inertia::render('Bookings/Show', [
            'booking' => $this->formatBooking($booking),
        ]);
    }

    public function cancel(Request $request, string $code)
    {
        $request->validate(['reason' => 'nullable|string|max:500']);

        $booking = Booking::where('booking_code', $code)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        try {
            $this->bookingService->cancelBooking($booking, $request->reason ?? '');
            return redirect()->route('bookings.index')->with('success', 'Booking berhasil dibatalkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['cancel' => $e->getMessage()]);
        }
    }

    private function formatBooking(Booking $b): array
    {
        $venueData = $b->venue ? [
            'id' => $b->venue->id,
            'name' => $b->venue->name,
            'slug' => $b->venue->slug,
            'city' => $b->venue->city,
            'address' => $b->venue->address,
            'cover_image_url' => $b->venue->cover_image_url,
        ] : ($b->court?->venue ? [
            'id' => $b->court->venue->id,
            'name' => $b->court->venue->name,
            'slug' => $b->court->venue->slug,
            'city' => $b->court->venue->city,
            'address' => $b->court->venue->address,
            'cover_image_url' => $b->court->venue->cover_image_url,
        ] : null);

        return [
            'id' => $b->id,
            'booking_code' => $b->booking_code,
            'date' => $b->date->format('Y-m-d'),
            'date_formatted' => $b->date->locale('id')->isoFormat('dddd, D MMMM Y'),
            'start_time' => substr($b->start_time, 0, 5),
            'end_time' => substr($b->end_time, 0, 5),
            'duration_hours' => (float) $b->duration_hours,
            'subtotal' => $b->subtotal,
            'service_fee' => $b->service_fee,
            'discount' => $b->discount,
            'total' => $b->total,
            'status' => $b->status,
            'notes' => $b->notes,
            'can_cancel' => $b->canBeCancelled(),
            'can_review' => $b->canBeReviewed(),
            'court' => $b->court ? [
                'id' => $b->court->id,
                'name' => $b->court->name,
                'type' => $b->court->type,
                'cover_image_url' => $b->court->cover_image_url,
                'venue' => $venueData,
            ] : null,
            'venue' => $venueData,
            'payment' => $b->payment ? [
                'method' => $b->payment->method,
                'method_label' => $b->payment->method_label,
                'status' => $b->payment->status,
                'paid_at' => $b->payment->paid_at?->format('d M Y H:i'),
            ] : null,
            'promo' => $b->promo ? ['code' => $b->promo->code, 'name' => $b->promo->name] : null,
            'has_review' => $b->review !== null,
            'created_at' => $b->created_at->format('d M Y H:i'),
        ];
    }
}
