<?php

namespace App\Http\Controllers;

use App\Models\TiketLrt;
use App\Models\Kereta;
use App\Models\Stasiun;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TiketLrtController extends Controller
{
    public function index()
    {
        try {
            $tikets = TiketLrt::orderBy('id', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Data tiket LRT berhasil dimuat',
                'data' => $tikets
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data tiket LRT: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nama_kereta' => 'required|string|max:255',
                'harga_termurah' => 'required|string|max:255',
                'jam' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'penumpang' => 'required|integer|min:1',
                'stasiun_asal' => 'required|string|max:255',
                'stasiun_tujuan' => 'required|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $tiket = TiketLrt::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Data tiket LRT berhasil disimpan',
                'data' => $tiket
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data tiket LRT: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $tiket = TiketLrt::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $tiket
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tiket LRT tidak ditemukan'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $tiket = TiketLrt::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'nama_kereta' => 'required|string|max:255',
                'harga_termurah' => 'required|string|max:255',
                'jam' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'penumpang' => 'required|integer|min:1',
                'stasiun_asal' => 'required|string|max:255',
                'stasiun_tujuan' => 'required|string|max:255'
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
                'message' => 'Data tiket LRT berhasil diupdate',
                'data' => $tiket
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate data tiket LRT: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $tiket = TiketLrt::findOrFail($id);
            $tiket->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data tiket LRT berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data tiket LRT: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get keretas data for dropdown
    public function getKeretas()
    {
        try {
            // Filter keretas yang mungkin untuk LRT
            $keretas = Kereta::all(['train_id', 'nama_kereta', 'kelas']);
            
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
            $stasiuns = Stasiun::orderBy('nama_stasiun')->get(['station_id', 'nama_stasiun', 'kota']);
            
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