<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\Models\Order::class, function (Faker $faker) {
    // 2-digit float from 10.00-250.00
    $subtotal = number_format(rand(1000, 25000) / 100, 2, '.', ',');
    $shipping = 10;
    $taxes = number_format(0.1 * $subtotal, 2, '.', '');

    return [
        'user_id' => function () {
            return factory(App\Models\User::class)->create()->id;
        },
        'address_id' => function () {
            return factory(App\Models\Address::class)->create()->id;
        },
        'subtotal' => $subtotal,
        'shipping' => $shipping,
        'taxes' => $taxes,
        'total' => number_format($subtotal + $shipping + $taxes, 2, '.', ''),
        'currency_id' => 1, // USD
    ];
});
