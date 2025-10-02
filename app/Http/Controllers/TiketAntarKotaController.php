<?php

namespace App\Http\Controllers;

use App\Models\TiketAntarKota;
use App\Models\Kereta;
use App\Models\Stasiun;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TiketAntarKotaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $tikets = TiketAntarKota::orderBy('id', 'desc')->get();
            return response()->json([
                'success' => true,
                'message' => 'Data tiket antar kota berhasil dimuat!',
                'data' => $tikets
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memuat data tiket: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama_kereta' => 'required|string|max:255',
                'kelas' => 'required|string|max:255',
                'harga_termurah' => 'required|numeric|min:0',
                'jam' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'penumpang' => 'required|integer|min:1',
                'stasiun_asal' => 'required|string|max:255',
                'stasiun_tujuan' => 'required|string|max:255',
            ], [
                'nama_kereta.required' => 'Nama kereta wajib diisi',
                'nama_kereta.max' => 'Nama kereta maksimal 255 karakter',
                'kelas.required' => 'Kelas wajib diisi',
                'kelas.max' => 'Kelas maksimal 255 karakter',
                'harga_termurah.required' => 'Harga termurah wajib diisi',
                'harga_termurah.numeric' => 'Harga termurah harus berupa angka',
                'harga_termurah.min' => 'Harga termurah minimal 0',
                'jam.required' => 'Jam keberangkatan wajib diisi',
                'jam.max' => 'Jam keberangkatan maksimal 255 karakter',
                'tanggal.required' => 'Tanggal keberangkatan wajib diisi',
                'tanggal.date' => 'Tanggal keberangkatan harus berupa tanggal yang valid',
                'penumpang.required' => 'Jumlah penumpang wajib diisi',
                'penumpang.integer' => 'Jumlah penumpang harus berupa angka',
                'penumpang.min' => 'Jumlah penumpang minimal 1',
                'stasiun_asal.required' => 'Stasiun asal wajib diisi',
                'stasiun_asal.max' => 'Stasiun asal maksimal 255 karakter',
                'stasiun_tujuan.required' => 'Stasiun tujuan wajib diisi',
                'stasiun_tujuan.max' => 'Stasiun tujuan maksimal 255 karakter',
            ]);

            $tiket = TiketAntarKota::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Data tiket antar kota berhasil ditambahkan!',
                'data' => $tiket
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $tiket = TiketAntarKota::findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Data tiket antar kota berhasil ditemukan!',
                'data' => $tiket
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tiket antar kota tidak ditemukan: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $tiket = TiketAntarKota::findOrFail($id);
            
            $validated = $request->validate([
                'nama_kereta' => 'required|string|max:255',
                'kelas' => 'required|string|max:255',
                'harga_termurah' => 'required|numeric|min:0',
                'jam' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'penumpang' => 'required|integer|min:1',
                'stasiun_asal' => 'required|string|max:255',
                'stasiun_tujuan' => 'required|string|max:255',
            ], [
                'nama_kereta.required' => 'Nama kereta wajib diisi',
                'nama_kereta.max' => 'Nama kereta maksimal 255 karakter',
                'kelas.required' => 'Kelas wajib diisi',
                'kelas.max' => 'Kelas maksimal 255 karakter',
                'harga_termurah.required' => 'Harga termurah wajib diisi',
                'harga_termurah.numeric' => 'Harga termurah harus berupa angka',
                'harga_termurah.min' => 'Harga termurah minimal 0',
                'jam.required' => 'Jam keberangkatan wajib diisi',
                'jam.max' => 'Jam keberangkatan maksimal 255 karakter',
                'tanggal.required' => 'Tanggal keberangkatan wajib diisi',
                'tanggal.date' => 'Tanggal keberangkatan harus berupa tanggal yang valid',
                'penumpang.required' => 'Jumlah penumpang wajib diisi',
                'penumpang.integer' => 'Jumlah penumpang harus berupa angka',
                'penumpang.min' => 'Jumlah penumpang minimal 1',
                'stasiun_asal.required' => 'Stasiun asal wajib diisi',
                'stasiun_asal.max' => 'Stasiun asal maksimal 255 karakter',
                'stasiun_tujuan.required' => 'Stasiun tujuan wajib diisi',
                'stasiun_tujuan.max' => 'Stasiun tujuan maksimal 255 karakter',
            ]);

            $tiket->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Data tiket antar kota berhasil diupdate!',
                'data' => $tiket
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengupdate data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $tiket = TiketAntarKota::findOrFail($id);
            $tiket->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data tiket antar kota berhasil dihapus!'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all keretas for dropdown
     */
    public function getKeretas()
    {
        try {
            $keretas = Kereta::select('nama_kereta', 'kelas')
                            ->orderBy('nama_kereta')
                            ->get();
            
            return response()->json([
                'success' => true,
                'data' => $keretas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memuat data kereta: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all stasiuns for dropdown
     */
    public function getStasiuns()
    {
        try {
            $stasiuns = Stasiun::select('nama_stasiun', 'kota')
                              ->orderBy('nama_stasiun')
                              ->get();
            
            return response()->json([
                'success' => true,
                'data' => $stasiuns
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memuat data stasiun: ' . $e->getMessage()
            ], 500);
        }
    }
}