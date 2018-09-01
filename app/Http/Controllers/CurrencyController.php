<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CurrencyController extends Controller
{
    const CACHE_TAG = 'global';

    const CACHE_NAME = 'currencies';

    const CACHE_DURATION_MINUTES = 30;

    public function index(Request $request)
    {
        $search = null;

        if ($request->has('q')) {
            $search = $request->input('q');
        }

        if (Cache::tags(self::CACHE_TAG)->has(self::CACHE_NAME)) {
            $currencies = Cache::tags(self::CACHE_TAG)->get(self::CACHE_NAME);
        } else {
            $currencies = Currency::search($search)
                ->orderBy('name')
                ->get();

            Cache::tags(self::CACHE_TAG)->put(self::CACHE_NAME, $currencies, self::CACHE_DURATION_MINUTES);
        }

        return response()->json($currencies);
    }

    public function show(Currency $currency)
    {
        return response()->json($currency);
    }
}
