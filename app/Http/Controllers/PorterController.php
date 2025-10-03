<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PorterController extends Controller
{
    /**
     * List all porters (admin only).
     */
    public function index()
    {
        $porters = User::where('role', 'porter')
            ->orderByDesc('id')
            ->get(['id','name','email','status','keylogin','no_telepon','no_identitas','created_at']);

        return response()->json([
            'success' => true,
            'data' => $porters,
        ]);
    }

    /**
     * Create a porter (admin only).
     */
    public function store(Request $request)
    {
        \Log::info('Porter store request received', [
            'request_data' => $request->all(),
            'csrf_token' => $request->header('X-CSRF-TOKEN'),
            'user_authenticated' => auth()->check(),
            'user_role' => auth()->user()?->role ?? 'not authenticated'
        ]);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'status' => 'required|in:ONLINE,OFFLINE',
            'keylogin' => 'required|string|min:8',
            'no_telepon' => 'nullable|string|max:50',
            'no_identitas' => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => 'porter',
            'status' => $validated['status'],
            'keylogin' => $validated['keylogin'],
            'no_telepon' => $validated['no_telepon'] ?? null,
            'no_identitas' => $validated['no_identitas'] ?? null,
            // gunakan keylogin sebagai password login awal
            'password' => Hash::make($validated['keylogin']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Akun porter berhasil dibuat',
            'data' => $user,
        ], 201);
    }
}