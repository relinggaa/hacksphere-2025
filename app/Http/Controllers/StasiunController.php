<?php

namespace App\Http\Controllers;

use App\Models\Stasiun;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class StasiunController extends Controller
{
    /**
     * Store a newly created stasiun in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validasi input
            $validated = $request->validate([
                'nama_stasiun' => 'required|string|max:255',
                'kota' => 'required|string|max:255',
            ], [
                'nama_stasiun.required' => 'Nama stasiun wajib diisi',
                'nama_stasiun.max' => 'Nama stasiun maksimal 255 karakter',
                'kota.required' => 'Kota wajib diisi',
                'kota.max' => 'Kota maksimal 255 karakter',
            ]);

            // Simpan data stasiun (station_id akan auto increment)
            $stasiun = Stasiun::create([
                'nama_stasiun' => $validated['nama_stasiun'],
                'kota' => $validated['kota'],
            ]);

            // Return JSON response for AJAX request
            return response()->json([
                'success' => true,
                'message' => 'Data stasiun berhasil ditambahkan!',
                'data' => $stasiun
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
     * Display a listing of stasiuns.
     */
    public function index()
    {
        try {
            $stasiuns = Stasiun::orderBy('station_id', 'asc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $stasiuns
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified stasiun.
     */
    public function show($id)
    {
        try {
            $stasiun = Stasiun::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $stasiun
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Stasiun tidak ditemukan'
            ], 404);
        }
    }

    /**
     * Update the specified stasiun in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $stasiun = Stasiun::findOrFail($id);

            // Validasi input
            $validated = $request->validate([
                'nama_stasiun' => 'required|string|max:255',
                'kota' => 'required|string|max:255',
            ], [
                'nama_stasiun.required' => 'Nama stasiun wajib diisi',
                'nama_stasiun.max' => 'Nama stasiun maksimal 255 karakter',
                'kota.required' => 'Kota wajib diisi',
                'kota.max' => 'Kota maksimal 255 karakter',
            ]);

            // Update data stasiun
            $stasiun->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Data stasiun berhasil diupdate!',
                'data' => $stasiun
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
     * Remove the specified stasiun from storage.
     */
    public function destroy($id)
    {
        try {
            $stasiun = Stasiun::findOrFail($id);
            $stasiun->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data stasiun berhasil dihapus!'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()
            ], 500);
        }
    }
}