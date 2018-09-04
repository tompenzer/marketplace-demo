<?php

namespace App\Http\Controllers;

use Auth;
use Cache;
use App\Http\Requests\CartRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CartController extends Controller
{
    const CACHE_TAG = 'carts';

    const CACHE_DURATION_MINUTES = 60;

    public function index($cart_uid)
    {
        return response()->json(self::getCart($cart_uid));
    }

    public function store(CartRequest $request, $cart_uid)
    {
        $cart = self::getCart($cart_uid);

        $new_item = $request->validated();

        // If item is already in cart, remove it.
        foreach ($cart as $i => $item) {
            if ($item['product_id'] === $new_item['product_id']) {
                unset($cart[$i]);
            }
        }

        $cart[] = $new_item;

        self::setCart($cart_uid, $cart);

        return response()->json($cart);
    }

    public function destroy($cart_uid, $product_id)
    {
        $cart = self::getCart($cart_uid);

        // If item is already in cart, remove it.
        foreach ($cart as $i => $item) {
            if ($product_id && $item['product_id'] == $product_id) {
                unset($cart[$i]);
            }
        }

        self::setCart($cart_uid, $cart);

        return response()->json($cart);
    }

    private function getCart($cart_uid)
    {
        if (Cache::tags(self::CACHE_TAG)->has($cart_uid)) {
            $cart = Cache::tags(self::CACHE_TAG)->get($cart_uid);
            // Refresh the expiration upon fetch.
            self::setCart($cart_uid, $cart);
        } else {
            $cart = [];
        }

        return array_values($cart);// Respond with a JSON array, not object.
    }

    private function setCart($cart_uid, $cart)
    {
        return Cache::tags(self::CACHE_TAG)->put($cart_uid, $cart, self::CACHE_DURATION_MINUTES);
    }
}
