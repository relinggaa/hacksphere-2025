<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PesananAntarKota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderAntarKotaController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);
        $orders = PesananAntarKota::where('user_id', $user->id)->orderByDesc('created_at')->get();
        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $validator = Validator::make($request->all(), [
            'train_id' => 'nullable|integer',
            'nama_kereta' => 'required|string',
            'kelas' => 'nullable|string',
            'tanggal' => 'required|date',
            'jam' => 'nullable|string',
            'stasiun_asal' => 'required|string',
            'stasiun_tujuan' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'passenger_name' => 'nullable|string',
            'passenger_nik' => 'required|string|size:16|regex:/^[0-9]+$/',
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $bookingCode = 'AK' . now()->format('ymd') . strtoupper(substr(md5(uniqid()), 0, 6));

        $order = PesananAntarKota::create([
            'user_id' => $user->id,
            'train_id' => $request->train_id,
            'nama_kereta' => $request->nama_kereta,
            'kelas' => $request->kelas,
            'tanggal' => $request->tanggal,
            'jam' => $request->jam,
            'stasiun_asal' => $request->stasiun_asal,
            'stasiun_tujuan' => $request->stasiun_tujuan,
            'harga' => $request->harga,
            'passenger_name' => $request->passenger_name,
            'passenger_nik' => $request->passenger_nik,
            'status' => 'dibuat',
            'booking_code' => $bookingCode,
        ]);

        return response()->json(['success' => true, 'data' => $order]);
    }

    public function show($id)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);
        $order = PesananAntarKota::where('user_id', $user->id)->find($id);
        if (!$order) return response()->json(['success' => false, 'error' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $order]);
    }
}


