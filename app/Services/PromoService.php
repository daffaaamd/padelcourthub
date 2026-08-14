<?php

namespace App\Services;

use App\Models\Promo;
use App\Models\User;

class PromoService
{
    public function validate(string $code, ?User $user, int $amount): array
    {
        $promo = Promo::where('code', strtoupper(trim($code)))->first();

        if (!$promo) {
            return ['valid' => false, 'discount' => 0, 'message' => 'Kode promo tidak ditemukan.'];
        }

        if (!$promo->is_active) {
            return ['valid' => false, 'discount' => 0, 'message' => 'Kode promo sedang tidak aktif.'];
        }

        if (!$promo->isValidNow()) {
            return ['valid' => false, 'discount' => 0, 'message' => 'Kode promo sudah kedaluwarsa.'];
        }

        if (!$promo->hasUsesLeft()) {
            return ['valid' => false, 'discount' => 0, 'message' => 'Kuota penggunaan promo ini sudah habis.'];
        }

        if ($amount > 0 && $amount < $promo->min_transaction) {
            $min = 'Rp ' . number_format($promo->min_transaction, 0, ',', '.');
            return ['valid' => false, 'discount' => 0, 'message' => "Minimum transaksi untuk promo ini adalah {$min}."];
        }

        if ($user) {
            $userUsageCount = $promo->usages()->where('user_id', $user->id)->count();
            if ($userUsageCount >= $promo->max_uses_per_user) {
                return ['valid' => false, 'discount' => 0, 'message' => 'Kamu sudah mencapai batas maksimal penggunaan promo ini.'];
            }
        }

        $discount = $amount > 0 ? $promo->calculateDiscount($amount) : 0;

        return [
            'valid' => true,
            'promo' => [
                'id' => $promo->id,
                'code' => $promo->code,
                'name' => $promo->name,
                'type' => $promo->type,
                'value' => $promo->value,
                'min_transaction' => $promo->min_transaction,
            ],
            'discount' => $discount,
            'message' => "Promo '{$promo->code}' aktif!" . ($discount > 0 ? " Potongan Rp " . number_format($discount, 0, ',', '.') : ""),
        ];
    }

    public function consume(Promo $promo, User $user, int $bookingId): void
    {
        $promo->usages()->create([
            'user_id' => $user->id,
            'booking_id' => $bookingId,
            'used_at' => now(),
        ]);
        $promo->increment('used_count');
    }
}
