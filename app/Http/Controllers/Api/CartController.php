<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $cart = Cart::firstOrCreate([
            'user_id' => $user->id,
            'status' => 'open'
        ]);

        $cart->load('items');
        return response()->json(['success' => true, 'data' => $cart]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.passenger_nik' => 'required|string|size:16|regex:/^[0-9]+$/'
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        DB::transaction(function () use ($user, $request) {
            $cart = Cart::firstOrCreate([
                'user_id' => $user->id,
                'status' => 'open'
            ]);
            foreach ($request->items as $it) {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'train_id' => $it['train_id'] ?? null,
                    'nama_kereta' => $it['nama_kereta'] ?? null,
                    'kelas' => $it['kelas'] ?? null,
                    'tanggal' => $it['tanggal'] ?? null,
                    'jam' => $it['jam'] ?? null,
                    'stasiun_asal' => $it['asal'] ?? null,
                    'stasiun_tujuan' => $it['tujuan'] ?? null,
                    'harga' => $it['harga'] ?? 0,
                    'passenger_name' => $it['passenger']['name'] ?? null,
                    'passenger_nik' => $it['passenger']['nik'],
                ]);
            }
        });

        return response()->json(['success' => true]);
    }

    public function destroyItem($id)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $item = CartItem::find($id);
        if (!$item) return response()->json(['success' => false, 'error' => 'Item not found'], 404);
        if ($item->cart->user_id !== $user->id) return response()->json(['error' => 'Forbidden'], 403);
        $item->delete();
        return response()->json(['success' => true]);
    }

    public function clear()
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);
        $cart = Cart::firstOrCreate([
            'user_id' => $user->id,
            'status' => 'open'
        ]);
        $cart->items()->delete();
        return response()->json(['success' => true]);
    }
}


