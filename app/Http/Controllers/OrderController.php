<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequest;
use App\Models\User;
use Auth;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StoreController extends Controller
{
    const CACHE_TAG = 'orders';

    const CACHE_DURATION_MINUTES = 30;

    public function index(Request $request, User $user)
    {
        if (! Auth::check() &&
            (Auth::user()->isSiteAdmin()
                || $user->id === Auth::user()->id
            )
        ) {
            abort(403, 'Unauthorized action.');
        }

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

    public function store(OrderRequest $request)
    {
        if (! Auth::check()) {
            abort(403, 'Unauthorized action.');
        }

        // Now validate the order items
        $items = $request->input('items');
        $this->validate($items, [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $order = Order::create($request->only(
            'user_id',
            'address_id',
            'subtotal',
            'shipping',
            'taxes',
            'total',
            'currency_id'
        ));

        foreach ($items as $item) {
            $product = Product::find($item['product_id'])->first();

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'price' => $product->price,
                'currency_id' => $product->currency_id,
                'quantity' => $item['quantity'],
            ]);
        }

        Cache::tags(self::CACHE_TAG)->flush();

        // Add related data
        $order->setRelation('address', $order->address()->first());
        $order->setRelation('items', $order->items()->get());
        $order->setRelation('user', $order->user()->first());

        return response()->json($order);
    }
}
