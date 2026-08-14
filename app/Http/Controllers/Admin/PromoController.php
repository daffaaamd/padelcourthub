<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromoController extends Controller
{
    public function index(): Response
    {
        $promos = Promo::withCount('usages')->latest()->paginate(20)->through(fn($p) => [
            'id' => $p->id,
            'code' => $p->code,
            'name' => $p->name,
            'type' => $p->type,
            'value' => $p->value,
            'min_transaction' => $p->min_transaction,
            'used_count' => $p->used_count,
            'max_uses' => $p->max_uses,
            'valid_from' => $p->valid_from->format('d M Y'),
            'valid_until' => $p->valid_until->format('d M Y'),
            'is_active' => $p->is_active,
            'is_valid' => $p->isValidNow(),
        ]);

        return Inertia::render('Admin/Promos/Index', ['promos' => $promos]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:promos,code|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|integer|min:1',
            'max_discount' => 'nullable|integer|min:0',
            'min_transaction' => 'required|integer|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'max_uses_per_user' => 'required|integer|min:1',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'is_active' => 'boolean',
        ]);

        $validated['code'] = strtoupper($validated['code']);
        Promo::create($validated);

        return redirect()->route('admin.promos.index')->with('success', 'Promo berhasil dibuat.');
    }

    public function update(Request $request, Promo $promo)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|integer|min:1',
            'min_transaction' => 'required|integer|min:0',
            'valid_until' => 'required|date',
            'is_active' => 'boolean',
        ]);

        $promo->update($validated);
        return redirect()->route('admin.promos.index')->with('success', 'Promo diperbarui.');
    }

    public function destroy(Promo $promo)
    {
        $promo->update(['is_active' => false]);
        return redirect()->route('admin.promos.index')->with('success', 'Promo dinonaktifkan.');
    }
}
