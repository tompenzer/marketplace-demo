<?php

namespace Tests\Unit;

use App\Models\Currency;
use Faker\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CurrencyTest extends TestCase
{
    use RefreshDatabase;

    public function testScopeSearch()
    {
        $currency = Currency::find(1)->first();// USD

        // Ensure a search for the currency name prepended with unexpected
        // characters does not return any results.
        $this->assertCount(0, Currency::search('abc' . $currency->name)->get());

        // Ensure a search for the first five characters of the currency's name
        // returns at least one result.
        $this->assertTrue(Currency::search(mb_substr($currency->name, 0, 5))->count() > 0);

        // Ensure a search for the currency abbreviation prepended with
        // unexpected characters does not return any results.
        $this->assertCount(0, Currency::search('abc' . $currency->abbreviation)->get());

        // Ensure a search for the first two characters of the currency's ISO
        // code returns at least one result.
        $this->assertTrue(Currency::search(mb_substr($currency->abbreviation, 0, 2))->count() > 0);
    }

    public function testScopeCode()
    {
        $currency = Currency::find(1)->first();// USD

        // Ensure scoping for the currency ISO code prepended with unexpected
        // characters does not return any results.
        $this->assertCount(0, Currency::code('abc' . $currency->abbreviation)->get());

        // Ensure scoping for the currency's ISO code returns exactly one result.
        $this->assertCount(1, Currency::code($currency->abbreviation)->get());
    }
}
