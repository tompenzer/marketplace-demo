<?php

use App\Models\Role;
use App\Models\RoleScope;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create an admin user and assign site admin role.
        if (User::email('admin@example.com')->count() === 0) {
            $user = User::create([
                'name' => 'admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin')
            ]);

            $user->roles()->attach(
                Role::name(Role::ROLE_ADMIN)
                    ->roleScope(RoleScope::ROLE_SCOPE_SITE)
                    ->first()->id
            );
        }

        // Use the generators to create 10 merchant users and associated stores
        // and products.
        factory(User::class, 10)->create()->each(function ($user) {
            // We'll make one store per merchant user.
            factory(App\Models\Store::class, 1)->create()->each(function ($store) use ($user) {
                // Create pivot table relationship and assign store admin role.
                $user->stores()->attach($store->id, [
                    'role_id' => Role::name(Role::ROLE_ADMIN)
                        ->roleScope(RoleScope::ROLE_SCOPE_STORE)
                        ->first()->id
                ]);

                // Generate 10 products for each store.
                factory(App\Models\Product::class, 10)->create(['store_id' => $store->id]);
            });
        });
    }
}
