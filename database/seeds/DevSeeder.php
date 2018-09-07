<?php

use App\Models\Role;
use App\Models\RoleScope;
use App\Models\User;
use Illuminate\Database\Seeder;

class DevSeeder extends Seeder
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

        // Generate 10 merchant users and associated stores with 10 products per
        // store. Then generate an order for each of those products, each from a
        // newly created consumer user.
        factory(User::class, 10)->create()->each(function ($user) {
            // We'll make one store per merchant user.
            $store = factory(App\Models\Store::class)->create();

            // Create pivot table relationship and assign store admin role.
            $user->stores()->attach($store->id, [
                'role_id' => Role::name(Role::ROLE_ADMIN)
                    ->roleScope(RoleScope::ROLE_SCOPE_STORE)
                    ->first()->id
            ]);

            // Generate 10 products for each store, with an order for each.
            factory(App\Models\Product::class, 10)
                ->create(['store_id' => $store->id])
                ->each(function ($product) {
                    $order = factory(App\Models\Order::class)->create();

                    App\Models\OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => 1,
                        'price' => $product->price,
                        'currency_id' => $product->currency_id,
                    ]);
                });
        });
    }
}
