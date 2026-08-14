<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use App\Services\PromoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class PromoController extends Controller
{
    public function __construct(private PromoService $promoService) {}

    public function index(): Response
    {
        $promos = Promo::where('is_active', true)
            ->whereDate('valid_until', '>=', now())
            ->latest()
            ->paginate(12)
            ->through(fn($p) => [
                'id' => $p->id,
                'code' => $p->code,
                'name' => $p->name,
                'description' => $p->description,
                'banner_image_url' => $p->banner_image_url,
                'type' => $p->type,
                'value' => $p->value,
                'min_transaction' => $p->min_transaction,
                'used_count' => $p->used_count,
                'max_uses' => $p->max_uses,
                'valid_from' => $p->valid_from ? $p->valid_from->format('d M Y') : '',
                'valid_until' => $p->valid_until ? $p->valid_until->format('d M Y') : '',
                'is_active' => (bool)$p->is_active,
                'is_valid' => $p->isValidNow() && $p->hasUsesLeft(),
            ]);

        return Inertia::render('Promos/Index', ['promos' => $promos]);
    }

    public function validate(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'nullable|integer|min:0',
        ]);

        $code = (string) $request->input('code', '');
        $amount = (int) $request->input('amount', 0);

        $result = $this->promoService->validate($code, auth()->user(), $amount);

        return response()->json($result);
    }
}
