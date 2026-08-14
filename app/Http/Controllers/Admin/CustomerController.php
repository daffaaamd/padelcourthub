<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        $customers = User::where('role', 'customer')
            ->withCount('bookings')
            ->withSum(['bookings as total_spent' => fn($q) => $q->where('status', 'completed')], 'total')
            ->latest()
            ->paginate(20)
            ->through(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'avatar_url' => $u->avatar_url,
                'bookings_count' => $u->bookings_count,
                'total_spent' => $u->total_spent ?? 0,
                'joined_at' => $u->created_at->format('d M Y'),
            ]);

        return Inertia::render('Admin/Customers/Index', ['customers' => $customers]);
    }
}
