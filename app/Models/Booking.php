<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code', 'user_id', 'court_id', 'venue_id', 'promo_id',
        'date', 'start_time', 'end_time', 'duration_hours',
        'subtotal', 'service_fee', 'discount', 'total',
        'status', 'notes', 'cancellation_reason', 'cancelled_at',
    ];

    protected $casts = [
        'date' => 'date',
        'duration_hours' => 'float',
        'cancelled_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function promo(): BelongsTo
    {
        return $this->belongsTo(Promo::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function promoUsage(): HasOne
    {
        return $this->hasOne(PromoUsage::class);
    }

    public function getFormattedTotalAttribute(): string
    {
        return 'Rp ' . number_format($this->total, 0, ',', '.');
    }

    public function getTimeRangeAttribute(): string
    {
        return substr($this->start_time, 0, 5) . ' — ' . substr($this->end_time, 0, 5);
    }

    public function canBeCancelled(): bool
    {
        if (!in_array($this->status, ['pending', 'confirmed'])) {
            return false;
        }

        // Pending bookings can always be cancelled
        if ($this->status === 'pending') {
            return true;
        }

        // Confirmed bookings can be cancelled if the match schedule is in the future
        $dateStr = $this->date instanceof \Carbon\Carbon ? $this->date->format('Y-m-d') : (string) $this->date;
        $bookingDateTime = \Carbon\Carbon::parse($dateStr . ' ' . $this->start_time);

        return $bookingDateTime->isFuture();
    }

    public function canBeReviewed(): bool
    {
        return $this->status === 'completed' && !$this->review;
    }
}
