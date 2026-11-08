<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;


class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrNew([
            'email' => 'demo@posapp.com',
        ]);

        $user->name = 'Demo User';
        $user->password = 'DemoPos123!';
        $user->email_verified_at = now();

        $user->save();
    }
}
