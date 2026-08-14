<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Venue extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name', 'slug', 'description', 'address', 'city', 'province',
        'latitude', 'longitude', 'phone', 'email', 'cover_image',
        'images', 'facilities', 'opening_time', 'closing_time', 'is_active',
    ];

    protected $casts = [
        'images' => 'array',
        'facilities' => 'array',
        'is_active' => 'boolean',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function courts(): HasMany
    {
        return $this->hasMany(Court::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function getAverageRatingAttribute(): float
    {
        $avg = $this->reviews()->where('is_published', true)->avg('rating');
        return round($avg ?? 0, 1);
    }

    public function getReviewsCountAttribute(): int
    {
        return $this->reviews()->where('is_published', true)->count();
    }

    public function getStartingPriceAttribute(): int
    {
        return $this->courts()
            ->join('pricing_rules', 'courts.id', '=', 'pricing_rules.court_id')
            ->min('pricing_rules.price_per_hour') ?? 0;
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
