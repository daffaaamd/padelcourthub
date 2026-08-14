<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promo extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'name', 'description', 'banner_image', 'type', 'value',
        'max_discount', 'min_transaction', 'max_uses', 'used_count',
        'max_uses_per_user', 'valid_from', 'valid_until', 'is_active',
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_until' => 'date',
        'is_active' => 'boolean',
    ];

    public function usages(): HasMany
    {
        return $this->hasMany(PromoUsage::class);
    }

    public function isValidNow(): bool
    {
        return $this->is_active
            && now()->greaterThanOrEqualTo($this->valid_from->startOfDay())
            && now()->lessThanOrEqualTo($this->valid_until->endOfDay());
    }

    public function hasUsesLeft(): bool
    {
        if ($this->max_uses === null) return true;
        return $this->used_count < $this->max_uses;
    }

    public function calculateDiscount(int $amount): int
    {
        if ($this->type === 'fixed') {
            return min($this->value, $amount);
        }
        // percentage
        $discount = (int) ($amount * $this->value / 100);
        if ($this->max_discount) {
            $discount = min($discount, $this->max_discount);
        }
        return $discount;
    }

    public function getBannerImageUrlAttribute(): string
    {
        if ($this->banner_image && str_starts_with($this->banner_image, 'http')) {
            return $this->banner_image;
        }
        return 'https://images.unsplash.com/photo-1624126808016-88ad0b7de5c8?w=800&q=80';
    }
}
