<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PassengerGroup;
use App\Models\Passenger;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PassengerGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $groups = PassengerGroup::forUser($user->id)
                ->with('passengers')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $groups,
                'message' => 'Groups retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve groups',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $validator = Validator::make($request->all(), [
                'group_name' => 'required|string|max:255',
                'passengers' => 'required|array|min:1',
                'passengers.*.name' => 'nullable|string|max:255|min:3',
                'passengers.*.nik' => 'required|string|size:16|regex:/^[0-9]+$/'
            ], [
                'group_name.required' => 'Nama grup harus diisi',
                'passengers.required' => 'Minimal satu penumpang harus ditambahkan',
                'passengers.min' => 'Minimal satu penumpang harus ditambahkan',
                'passengers.*.nik.required' => 'NIK harus diisi',
                'passengers.*.nik.size' => 'NIK harus 16 digit',
                'passengers.*.nik.regex' => 'NIK harus berupa angka'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if group name already exists for this user
            $existingGroup = PassengerGroup::forUser($user->id)
                ->where('group_name', $request->group_name)
                ->first();

            if ($existingGroup) {
                return response()->json([
                    'success' => false,
                    'error' => 'Nama grup sudah ada untuk user ini'
                ], 409);
            }

            DB::beginTransaction();
            try {
                // Create the group
                $group = PassengerGroup::create([
                    'user_id' => $user->id,
                    'group_name' => $request->group_name
                ]);

                // Create passengers for the group
                foreach ($request->passengers as $passengerData) {
                    Passenger::create([
                        'passenger_group_id' => $group->id,
                        'name' => $passengerData['name'] ?? null,
                        'nik' => $passengerData['nik']
                    ]);
                }

                DB::commit();

                // Load the group with passengers
                $group->load('passengers');

                return response()->json([
                    'success' => true,
                    'data' => $group,
                    'message' => 'Group created successfully'
                ], 201);
            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to create group',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $group = PassengerGroup::forUser($user->id)->with('passengers')->find($id);

            if (!$group) {
                return response()->json([
                    'success' => false,
                    'error' => 'Group not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $group,
                'message' => 'Group retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve group',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $group = PassengerGroup::forUser($user->id)->with('passengers')->find($id);

            if (!$group) {
                return response()->json([
                    'success' => false,
                    'error' => 'Group not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'group_name' => 'required|string|max:255',
                'passengers' => 'required|array|min:1',
                'passengers.*.name' => 'nullable|string|max:255|min:3',
                'passengers.*.nik' => 'required|string|size:16|regex:/^[0-9]+$/'
            ], [
                'group_name.required' => 'Nama grup harus diisi',
                'passengers.required' => 'Minimal satu penumpang harus ditambahkan',
                'passengers.min' => 'Minimal satu penumpang harus ditambahkan',
                'passengers.*.nik.required' => 'NIK harus diisi',
                'passengers.*.nik.size' => 'NIK harus 16 digit',
                'passengers.*.nik.regex' => 'NIK harus berupa angka'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if group name already exists for this user (excluding current group)
            $existingGroup = PassengerGroup::forUser($user->id)
                ->where('group_name', $request->group_name)
                ->where('id', '!=', $id)
                ->first();

            if ($existingGroup) {
                return response()->json([
                    'success' => false,
                    'error' => 'Nama grup sudah ada untuk user ini'
                ], 409);
            }

            DB::beginTransaction();
            try {
                // Update the group
                $group->update([
                    'group_name' => $request->group_name
                ]);

                // Delete existing passengers
                $group->passengers()->delete();

                // Create new passengers
                foreach ($request->passengers as $passengerData) {
                    Passenger::create([
                        'passenger_group_id' => $group->id,
                        'name' => $passengerData['name'] ?? null,
                        'nik' => $passengerData['nik']
                    ]);
                }

                DB::commit();

                // Reload the group with passengers
                $group->load('passengers');
            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }

            return response()->json([
                'success' => true,
                'data' => $group,
                'message' => 'Group updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to update group',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $group = PassengerGroup::forUser($user->id)->find($id);

            if (!$group) {
                return response()->json([
                    'success' => false,
                    'error' => 'Group not found'
                ], 404);
            }

            $group->delete();

            return response()->json([
                'success' => true,
                'message' => 'Group deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete group',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
