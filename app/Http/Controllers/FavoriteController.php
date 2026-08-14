<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function toggle(Request $request, Venue $venue)
    {
        $user = Auth::user();
        $existing = Favorite::where('user_id', $user->id)->where('venue_id', $venue->id)->first();

        if ($existing) {
            $existing->delete();
            $favorited = false;
        } else {
            Favorite::create(['user_id' => $user->id, 'venue_id' => $venue->id]);
            $favorited = true;
        }

        return response()->json(['favorited' => $favorited]);
    }
}
