<?php

namespace App\Services;

use App\Models\Court;
use App\Models\Booking;

class PricingService
{
    public function getPricePerHour(Court $court, string $date, string $startTime): int
    {
        $isWeekend = in_array(date('N', strtotime($date)), [6, 7]);
        $dayType = $isWeekend ? 'weekend' : 'weekday';

        $rule = $court->pricingRules()
            ->where(function ($q) use ($dayType) {
                $q->where('day_type', $dayType)->orWhere('day_type', 'all');
            })
            ->where('start_time', '<=', $startTime)
            ->where('end_time', '>', $startTime)
            ->orderByRaw("CASE WHEN day_type = '{$dayType}' THEN 1 ELSE 2 END")
            ->first();

        return $rule ? $rule->price_per_hour : 150000;
    }

    public function getBreakdown(Court $court, string $date, string $startTime, int|float $durationHours): array
    {
        $pricePerHour = $this->getPricePerHour($court, $date, $startTime);
        $subtotal = (int) round($pricePerHour * (float) $durationHours);
        $serviceFee = 5000;

        return [
            'price_per_hour' => $pricePerHour,
            'duration_hours' => (float) $durationHours,
            'subtotal' => $subtotal,
            'service_fee' => $serviceFee,
            'discount' => 0,
            'total' => $subtotal + $serviceFee,
        ];
    }
}
