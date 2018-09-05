<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StoreController extends Controller
{
    const CACHE_TAG = 'orders';

    const CACHE_DURATION_MINUTES = 30;

    public function index(Request $request)
    {
        if (! Auth::check()) {
            abort(403, 'Unauthorized action.');
        }

        $user = Auth::user();
        $page = 1;
        $search = null;

        if ($request->has('page')) {
            $page = $request->input('page');
        }

        if ($request->has('q')) {
            $search = $request->input('q');
        }

        $cache_name = "user:{$user->id}:search:{$search}:page:{$page}";

        if (Cache::tags(self::CACHE_TAG)->has($cache_name)) {
            $orders = Cache::tags(self::CACHE_TAG)->get($cache_name);
        } else {
            $orders = Order::userIs($user->id)
                ->search($search)
                ->orderBy('id', 'desc')
                ->paginate(20);

            Cache::tags(self::CACHE_TAG)->put($cache_name, $orders, self::CACHE_DURATION_MINUTES);
        }

        return response()->json($orders);
    }

    public function show(Order $order)
    {
        // Add related data
        $order->setRelation('address', $order->address()->first());
        $order->setRelation('items', $order->items()->get());
        $order->setRelation('user', $order->user()->first());

        return response()->json($order);
    }
}
