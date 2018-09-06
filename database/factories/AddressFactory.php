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

$factory->define(App\Models\Address::class, function (Faker $faker) {
    return [
        'name' => 'Seeded',
        'recipient' => $faker->name,
        'street_1' => $faker->streetAddress,
        'city' => $faker->city,
        'state' => $faker->stateAbbr,
        'postal_code' => $faker->postcode,
        'country_id' => 1,// USA
        'phone' => $faker->phoneNumber,
    ];
});
