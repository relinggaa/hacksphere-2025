<?php

namespace App\Http\Controllers;

use App\Models\TiketCommuter;
use App\Models\Kereta;
use App\Models\Stasiun;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TiketCommuterController extends Controller
{
    public function index()
    {
        try {
            $tikets = TiketCommuter::orderBy('id', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Data tiket commuter berhasil dimuat',
                'data' => $tikets
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data tiket commuter: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nama_kereta' => 'required|string|max:255',
                'kelas' => 'required|string|max:255',
                'harga_murah' => 'required|numeric|min:0',
                'harga_normal' => 'required|numeric|min:0',
                'jam_operasional' => 'required|string|max:255',
                'stasiun_asal' => 'required|string|max:255',
                'stasiun_tujuan' => 'required|string|max:255',
                'interval_jam' => 'required|integer|min:1',
                'kapasitas_kursi' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $tiket = TiketCommuter::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Data tiket commuter berhasil disimpan',
                'data' => $tiket
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data tiket commuter: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $tiket = TiketCommuter::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $tiket
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tiket commuter tidak ditemukan'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $tiket = TiketCommuter::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'nama_kereta' => 'required|string|max:255',
                'kelas' => 'required|string|max:255',
                'harga_murah' => 'required|numeric|min:0',
                'harga_normal' => 'required|numeric|min:0',
                'jam_operasional' => 'required|string|max:255',
                'stasiun_asal' => 'required|string|max:255',
                'stasiun_tujuan' => 'required|string|max:255',
                'interval_jam' => 'required|integer|min:1',
                'kapasitas_kursi' => 'required|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $tiket->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Data tiket commuter berhasil diupdate',
                'data' => $tiket
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate data tiket commuter: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $tiket = TiketCommuter::findOrFail($id);
            $tiket->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data tiket commuter berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data tiket commuter: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get keretas data for dropdown
    public function getKeretas()
    {
        try {
            // Filter keretas yang specific untuk commuter (biasanya kelas ekonomi)
            $keretas = Kereta::where('kelas', 'Ekonomi')->get(['nama_kereta', 'kelas']);
            
            return response()->json([
                'success' => true,
                'message' => 'Data kereta untuk dropdown berhasil dimuat',
                'data' => $keretas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data kereta: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get stasiuns data for dropdown
    public function getStasiuns()
    {
        try {
            $stasiuns = Stasiun::orderBy('nama_stasiun')->get(['nama_stasiun', 'kota']);
            
            return response()->json([
                'success' => true,
                'message' => 'Data stasiun untuk dropdown berhasil dimuat',
                'data' => $stasiuns
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data stasiun: ' . $e->getMessage()
            ], 500);
        }
    }
}