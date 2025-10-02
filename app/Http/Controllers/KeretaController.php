<?php

namespace App\Http\Controllers;

use App\Models\Kereta;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class KeretaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $keretas = Kereta::orderBy('train_id', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $keretas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data: ' . $e->getMessage()
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
            ], [
                'nama_kereta.required' => 'Nama kereta wajib diisi',
                'nama_kereta.max' => 'Nama kereta maksimal 255 karakter',
                'kelas.required' => 'Kelas wajib diisi',
                'kelas.max' => 'Kelas maksimal 255 karakter',
            ]);

            $kereta = Kereta::create([
                'nama_kereta' => $validated['nama_kereta'],
                'kelas' => $validated['kelas'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data kereta berhasil ditambahkan!',
                'data' => $kereta
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
            $kereta = Kereta::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $kereta
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data kereta tidak ditemukan'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $kereta = Kereta::findOrFail($id);
            
            $validated = $request->validate([
                'nama_kereta' => 'required|string|max:255',
                'kelas' => 'required|string|max:255',
            ], [
                'nama_kereta.required' => 'Nama kereta wajib diisi',
                'nama_kereta.max' => 'Nama kereta maksimal 255 karakter',
                'kelas.required' => 'Kelas wajib diisi',
                'kelas.max' => 'Kelas maksimal 255 karakter',
            ]);

            $kereta->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Data kereta berhasil diupdate!',
                'data' => $kereta
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
            $kereta = Kereta::findOrFail($id);
            $kereta->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data kereta berhasil dihapus!'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()
            ], 500);
        }
    }
}