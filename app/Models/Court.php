<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Court extends Model
{
    use HasFactory;

    protected $fillable = [
        'venue_id', 'name', 'type', 'description',
        'cover_image', 'images', 'status',
    ];

    protected $casts = [
        'images' => 'array',
    ];

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function pricingRules(): HasMany
    {
        return $this->hasMany(PricingRule::class);
    }

    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    public function getPriceForSlot(string $date, string $startTime, int $durationHours): int
    {
        $isWeekend = in_array(date('N', strtotime($date)), [6, 7]);
        $dayType = $isWeekend ? 'weekend' : 'weekday';

        $rule = $this->pricingRules()
            ->where(function ($q) use ($dayType) {
                $q->where('day_type', $dayType)->orWhere('day_type', 'all');
            })
            ->where('start_time', '<=', $startTime)
            ->where('end_time', '>', $startTime)
            ->orderByDesc('day_type') // prefer specific day_type over 'all'
            ->first();

        $pricePerHour = $rule ? $rule->price_per_hour : 150000;
        return $pricePerHour * $durationHours;
    }

    public function getCoverImageUrlAttribute(): string
    {
        if ($this->cover_image && str_starts_with($this->cover_image, 'http')) {
            return $this->cover_image;
        }
        if ($this->cover_image && str_starts_with($this->cover_image, '/')) {
            return asset(ltrim($this->cover_image, '/'));
        }
        if ($this->cover_image) {
            return asset('storage/' . $this->cover_image);
        }
        return asset('images/venues/padel_senayan_arena.jpg');
    }
}
