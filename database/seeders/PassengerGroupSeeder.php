<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PassengerGroup;
use App\Models\Passenger;

class PassengerGroupSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        
        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'role' => 'user'
            ]);
        }

        $groupsData = [
            [
                'group_name' => 'Keluarga',
                'passengers' => [
                    ['name' => 'John Doe', 'nik' => '3201234567890123'],
                    ['name' => 'Jane Doe', 'nik' => '3201234567890124'],
                    ['name' => 'Bobby Doe', 'nik' => '3201234567890125']
                ]
            ],
            [
                'group_name' => 'Teman Kerja',
                'passengers' => [
                    ['name' => 'Alice Smith', 'nik' => '3201234567890126'],
                    ['name' => 'Bob Wilson', 'nik' => '3201234567890127']
                ]
            ],
            [
                'group_name' => 'Teman Kuliah',
                'passengers' => [
                    ['name' => 'Charlie Brown', 'nik' => '3201234567890128']
                ]
            ]
        ];

        foreach ($groupsData as $groupData) {
            $group = PassengerGroup::create([
                'user_id' => $user->id,
                'group_name' => $groupData['group_name']
            ]);

            foreach ($groupData['passengers'] as $passengerData) {
                Passenger::create([
                    'passenger_group_id' => $group->id,
                    'name' => $passengerData['name'],
                    'nik' => $passengerData['nik']
                ]);
            }
        }
    }
}
