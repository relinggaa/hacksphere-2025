<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create test user only if it doesn't exist
        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        // Seed stasiun dan kereta data
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
