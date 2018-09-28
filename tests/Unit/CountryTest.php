<?php

namespace Tests\Unit;

use App\Models\Country;
use Faker\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CountryTest extends TestCase
{
    use RefreshDatabase;

    public function testScopeSearch()
    {
        $country = Country::find(1)->first();// US

        // Ensure a search for the country name prepended with unexpected
        // characters does not return any results.
        $this->assertCount(0, Country::search('abc' . $country->name)->get());

        // Ensure a search for the first five characters of the country's name
        // returns at least one result.
        $this->assertTrue(Country::search(mb_substr($country->name, 0, 5))->count() > 0);

        // Ensure a search for the country abbreviation prepended with
        // unexpected characters does not return any results.
        $this->assertCount(0, Country::search('abc' . $country->abbreviation)->get());

        // Ensure a search for the country's abbreviation code returns at least
        // one result.
        $this->assertTrue(Country::search($country->abbreviation)->count() > 0);
    }
}
