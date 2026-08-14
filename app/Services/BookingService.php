<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Court;
use App\Models\Payment;
use App\Models\Promo;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function __construct(
        private PricingService $pricingService,
        private PromoService $promoService,
    ) {}

    public function checkAvailability(int $courtId, string $date, string $startTime, string $endTime): bool
    {
        return !Booking::where('court_id', $courtId)
            ->where('date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where(function ($q2) use ($startTime, $endTime) {
                    $q2->where('start_time', '<', $endTime)
                       ->where('end_time', '>', $startTime);
                });
            })
            ->exists();
    }

    public function getAvailableSlots(Court $court, string $date): array
    {
        $court->loadMissing('venue');
        $openingHour = $court->venue ? (int) substr($court->venue->opening_time, 0, 2) : 6;
        $closingHour = $court->venue ? (int) substr($court->venue->closing_time, 0, 2) : 23;
        if ($openingHour <= 0) $openingHour = 6;
        if ($closingHour <= $openingHour) $closingHour = 23;

        $slots = [];

        $bookedSlots = Booking::where('court_id', $court->id)
            ->where('date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->get(['start_time', 'end_time']);

        for ($hour = $openingHour; $hour < $closingHour; $hour++) {
            $slotStart = sprintf('%02d:00:00', $hour);
            $slotEnd = sprintf('%02d:00:00', $hour + 1);

            $isBooked = $bookedSlots->first(function ($b) use ($slotStart, $slotEnd) {
                return $b->start_time < $slotEnd && $b->end_time > $slotStart;
            });

            $tz = config('app.timezone', 'Asia/Jakarta');
            $isPast = Carbon::parse($date . ' ' . $slotStart, $tz)->isPast();

            $pricePerHour = $this->pricingService->getPricePerHour($court, $date, $slotStart);

            $isAvailable = !$isPast && !$isBooked;

            $slots[] = [
                'time' => sprintf('%02d:00', $hour),
                'start' => $slotStart,
                'end' => $slotEnd,
                'status' => $isPast ? 'past' : ($isBooked ? 'booked' : 'available'),
                'available' => (bool) $isAvailable,
                'price' => $pricePerHour,
            ];
        }

        return $slots;
    }

    public function createBooking(User $user, array $data, Promo|array|null $promo = null): Booking
    {
        return DB::transaction(function () use ($user, $data, $promo) {
            $court = Court::with('venue')->findOrFail($data['court_id']);

            $promoModel = null;
            if ($promo instanceof Promo) {
                $promoModel = $promo;
            } elseif (is_array($promo) && !empty($promo['id'])) {
                $promoModel = Promo::find($promo['id']);
            } elseif (is_numeric($promo)) {
                $promoModel = Promo::find($promo);
            }

            $startTime = $data['start_time'];
            $durationHours = (float) $data['duration_hours'];
            $minutes = (int) round($durationHours * 60);
            $endTime = Carbon::parse($startTime)->addMinutes($minutes)->format('H:i:s');

            // Final availability check inside transaction
            if (!$this->checkAvailability($court->id, $data['date'], $startTime, $endTime)) {
                throw new \Exception('Slot sudah tidak tersedia. Silakan pilih waktu lain.');
            }

            $breakdown = $this->pricingService->getBreakdown($court, $data['date'], $startTime, $durationHours);

            $discount = 0;
            if ($promoModel) {
                $discount = $promoModel->calculateDiscount($breakdown['subtotal'] + $breakdown['service_fee']);
            }

            $total = $breakdown['subtotal'] + $breakdown['service_fee'] - $discount;

            $booking = Booking::create([
                'booking_code' => $this->generateBookingCode(),
                'user_id' => $user->id,
                'court_id' => $court->id,
                'venue_id' => $court->venue_id,
                'promo_id' => $promoModel?->id,
                'date' => $data['date'],
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration_hours' => $durationHours,
                'subtotal' => $breakdown['subtotal'],
                'service_fee' => $breakdown['service_fee'],
                'discount' => $discount,
                'total' => max(0, $total),
                'status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ]);

            // Create pending payment
            Payment::create([
                'booking_id' => $booking->id,
                'amount' => $booking->total,
                'status' => 'pending',
            ]);

            // Consume promo
            if ($promoModel) {
                $this->promoService->consume($promoModel, $user, $booking->id);
            }

            return $booking;
        });
    }

    public function confirmPayment(Booking $booking, string $method, string $bankName = null): void
    {
        DB::transaction(function () use ($booking, $method, $bankName) {
            $booking->update(['status' => 'confirmed']);
            $booking->payment()->update([
                'method' => $method,
                'bank_name' => $bankName,
                'status' => 'paid',
                'reference_number' => 'PC-REF-' . strtoupper(Str::random(10)),
                'paid_at' => now(),
            ]);
        });
    }

    public function cancelBooking(Booking $booking, string $reason = ''): void
    {
        if (!$booking->canBeCancelled()) {
            throw new \Exception('Booking ini tidak dapat dibatalkan karena waktu bermain telah lewat atau booking sudah selesai.');
        }

        DB::transaction(function () use ($booking, $reason) {
            $booking->update([
                'status' => 'cancelled',
                'cancellation_reason' => $reason,
                'cancelled_at' => now(),
            ]);

            if ($booking->payment) {
                if ($booking->payment->status === 'paid') {
                    $booking->payment->update(['status' => 'refunded']);
                } elseif ($booking->payment->status === 'pending') {
                    $booking->payment->update(['status' => 'failed']);
                }
            }
        });
    }

    private function generateBookingCode(): string
    {
        do {
            $year = date('Y');
            $code = 'PC-' . $year . '-' . str_pad(random_int(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (Booking::where('booking_code', $code)->exists());

        return $code;
    }
}
