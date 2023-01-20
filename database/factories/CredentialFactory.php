<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory
 */
class CredentialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id'   => User::factory(),
            'folder_id' => null,
            'item_type' => 'login',
            'name'      => $this->faker->name,
            'username'  => $this->faker->userName,
            'password'  => \Hash::make('password'),
            'url'       => $this->faker->url,
            'notes'     => $this->faker->paragraph,

        ];
    }
}
