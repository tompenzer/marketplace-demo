<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CountryController extends Controller
{
    const CACHE_TAG = 'global';

    const CACHE_NAME = 'countries';

    const CACHE_DURATION_MINUTES = 30;

    public function index(Request $request)
    {
        $search = null;

        if ($request->has('q')) {
            $search = $request->input('q');
        }

        if (Cache::tags(self::CACHE_TAG)->has(self::CACHE_NAME)) {
            $countries = Cache::tags(self::CACHE_TAG)->get(self::CACHE_NAME);
        } else {
            $countries = Country::search($search)
                ->get();

            Cache::tags(self::CACHE_TAG)->put(self::CACHE_NAME, $countries, self::CACHE_DURATION_MINUTES);
        }

        return response()->json($countries);
    }

    public function show(Country $country)
    {
        return response()->json($country);
    }
}
