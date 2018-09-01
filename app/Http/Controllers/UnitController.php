<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UnitController extends Controller
{
    const CACHE_TAG = 'global';

    const CACHE_NAME = 'units';

    const CACHE_DURATION_MINUTES = 30;

    public function index(Request $request)
    {
        $search = null;

        if ($request->has('q')) {
            $search = $request->input('q');
        }

        if (Cache::tags(self::CACHE_TAG)->has(self::CACHE_NAME)) {
            $units = Cache::tags(self::CACHE_TAG)->get(self::CACHE_NAME);
        } else {
            $units = Unit::search($search)
                ->with('type')
                ->get();

            Cache::tags(self::CACHE_TAG)->put(self::CACHE_NAME, $units, self::CACHE_DURATION_MINUTES);
        }

        return response()->json($units);
    }

    public function show(Unit $unit)
    {
        return response()->json($unit);
    }
}
