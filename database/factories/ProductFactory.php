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

$factory->define(App\Models\Product::class, function (Faker $faker) {
    return [
        'name'              => $faker->sentence,
        'description'       => $faker->text,
        'width'             => rand(3, 150),
        'width_unit_id'     => 1,// in
        'length'            => rand(3, 150),
        'length_unit_id'    => 1,
        'height'            => rand(3, 150),
        'height_unit_id'    => 1,
        'weight'            => number_format(rand(100, 2500) / 100, 2, '.', ','),// 2-digit float from 1.00-25.00
        'weight_unit_id'    => 6,// lb
        'price'             => number_format(rand(1000, 25000) / 100, 2, '.', ','),// 2-digit float from 10.00-250.00,
        'currency_id'       => 1,// USD
    ];
});
