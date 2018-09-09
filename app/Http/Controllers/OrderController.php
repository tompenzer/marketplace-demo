<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Auth;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        if (! Auth::check()) {
            abort(403, 'Unauthorized action.');
        }

        $user = Auth::user();
        $search = null;

        if ($request->has('q')) {
            $search = $request->input('q');
        }

        $orders = Order::userIs($user->id)
                ->search($search)
                ->with('items')
                ->orderBy('id', 'desc')
                ->paginate(20);

        return response()->json($orders);
    }

    public function show(Order $order)
    {
        if (! $order->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        // Add related data
        $order->setRelation('address', $order->address()->first());
        $order->setRelation('items', $order->items()->get());
        $order->setRelation('user', $order->user()->first());

        return response()->json($order);
    }
}
