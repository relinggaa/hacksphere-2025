<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        $this->call([
            StasiunSeeder::class,
            KeretaSeeder::class,
            TiketAntarKotaSeeder::class,
            TiketCommuterSeeder::class,
            TiketLrtSeeder::class,
            TiketBandaraSeeder::class,
        ]);
    }
}
