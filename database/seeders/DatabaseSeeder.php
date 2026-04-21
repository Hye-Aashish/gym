<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User if not exists
        User::updateOrCreate(
            ['email' => 'admin@fitnesspoint.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin'),
            ]
        );
    }
}
