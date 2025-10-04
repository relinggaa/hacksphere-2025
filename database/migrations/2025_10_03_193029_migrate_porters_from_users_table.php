<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate porter data from users table to porters table
        $porters = DB::table('users')
            ->where('role', 'porter')
            ->get();

        foreach ($porters as $porter) {
            DB::table('porters')->insert([
                'id' => $porter->id,
                'name' => $porter->name,
                'email' => $porter->email,
                'password' => $porter->password,
                'status' => $porter->status,
                'keylogin' => $porter->keylogin,
                'no_telepon' => $porter->no_telepon,
                'no_identitas' => $porter->no_identitas,
                'photo_url' => $porter->photo_url ?? null,
                'email_verified_at' => $porter->email_verified_at,
                'remember_token' => $porter->remember_token,
                'created_at' => $porter->created_at,
                'updated_at' => $porter->updated_at,
            ]);
        }

        // Remove porter records from users table
        DB::table('users')->where('role', 'porter')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Move porter data back to users table
        $porters = DB::table('porters')->get();

        foreach ($porters as $porter) {
            DB::table('users')->insert([
                'id' => $porter->id,
                'name' => $porter->name,
                'email' => $porter->email,
                'password' => $porter->password,
                'role' => 'porter',
                'status' => $porter->status,
                'keylogin' => $porter->keylogin,
                'no_telepon' => $porter->no_telepon,
                'no_identitas' => $porter->no_identitas,
                'photo_url' => $porter->photo_url,
                'email_verified_at' => $porter->email_verified_at,
                'remember_token' => $porter->remember_token,
                'created_at' => $porter->created_at,
                'updated_at' => $porter->updated_at,
            ]);
        }

        // Remove porter records from porters table
        DB::table('porters')->truncate();
    }
};
