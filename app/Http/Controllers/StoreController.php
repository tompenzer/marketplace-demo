<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequest;
use App\Models\Currency;
use App\Models\Role;
use App\Models\RoleScope;
use App\Models\Store;
use App\Models\Unit;
use Auth;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StoreController extends Controller
{
    const CACHE_TAG = 'stores';

    const CACHE_DURATION_MINUTES = 30;

    public function index(Request $request)
    {
        $page = 1;
        $search = null;

        if ($request->has('page')) {
            $page = $request->input('page');
        }

        if ($request->has('q')) {
            $search = $request->input('q');
        }

        $cache_name = "search:{$search}:page:{$page}";

        if (Cache::tags(self::CACHE_TAG)->has($cache_name)) {
            $stores = Cache::tags(self::CACHE_TAG)->get($cache_name);
        } else {
            $stores = Store::search($search)
                             ->orderBy('name')
                             ->paginate(20);

            Cache::tags(self::CACHE_TAG)->put($cache_name, $stores, self::CACHE_DURATION_MINUTES);
        }

        return response()->json($stores);
    }

    public function show(Store $store)
    {
        $store->setRelation('products', $store->products()->get());
        $store->setRelation('addresses', $store->addresses()->get());

        return response()->json($store);
    }

    public function store(StoreRequest $request)
    {
        if (! Auth::check()) {
            abort(403, 'Unauthorized action.');
        }

        $store = Store::create($request->validated());

        // Give store admin role to the user who created the store.
        Auth::user()->stores()->attach($store->id, [
            'role_id' => Role::name(Role::ROLE_ADMIN)
                ->roleScope(RoleScope::ROLE_SCOPE_STORE)
                ->first()->id
        ]);

        Cache::tags(self::CACHE_TAG)->flush();

        return response()->json($store);
    }

    public function update(StoreRequest $request, Store $store)
    {
        if (! $store->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $store->update($request->validated());

        Cache::tags(self::CACHE_TAG)->flush();

        return response()->json($store);
    }

    public function destroy(Store $store)
    {
        if (! $store->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $store->destroy();

        Cache::tags(self::CACHE_TAG)->flush();

        return response()->json([
            'status' => 'success',
            'message' => 'The store has been removed.'
        ]);
    }

    public function auth(Store $store)
    {
        return response()->json($store->userHasAuth());
    }
}
