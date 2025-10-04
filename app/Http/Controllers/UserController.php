<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . auth()->id(),
                'no_telepon' => 'nullable|string|max:20',
                'no_identitas' => 'nullable|string|max:50',
                'photo_url' => 'nullable|url|max:500',
            ]);

            $user = auth()->user();
            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui',
                'user' => $user->fresh()
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui profil: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getProfile()
    {
        $user = auth()->user();
        
        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }
}
