<?php

namespace App\Http\Controllers;

use Auth;
use Cache;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CartController extends Controller
{
    const CACHE_TAG = 'carts';

    const CACHE_DURATION_MINUTES = 60;

    public function index(Request $request)
    {
        return response()->json(self::getCart($request));
    }

    public function store(Request $request)
    {
        $arguments = $request->only(
            'product_id',
            'name',
            'quantity',
            'price',
            'currency'
        );

        // Required fields
        if (! $arguments['product_id']
            || ! $arguments['name']
            || ! $arguments['price']
            || ! $arguments['currency']
        ) {
            return;
        }

        $cart = self::getCart($request);

        if ($arguments['quantity']) {
            $cart[$arguments['product_id']] = [
                'id'        => $arguments['product_id'],
                'name'      => $arguments['name'],
                'quantity'  => $arguments['quantity'],
                'price'     => $arguments['price'],
                'currency'  => $arguments['currency'],
            ];
        } else {
            unset($cart[$arguments['product_id']]);
        }

        $cart = self::setCart($request, $cart);

        return response()->json($cart);
    }

    public function destroy(Request $request, $product_id)
    {
        if (! $product_id) {
            return;
        }

        $cart = self::getCart($request);

        unset($cart[$product_id]);

        $cart = self::setCart($request, $cart);

        return response()->json($cart);
    }

    /**
     * If we've put a user ID in the session, use it, otherwise, generate
     * one as appropriate for the user and stick it in the session. This way
     * we can persist a cart through login and not require login to add to
     * cart.
     *
     * @param  Request $request The request
     * @return string           The user's cart ID
     */
    private function getUid(Request $request)
    {
        if (session('cart_uid')) {
            $user_id = session('cart_uid');
        } else {
            if (Auth::check()) {
                $user_id = 'user:' . Auth::user()->id;
            } else {
                $user_id = uniqid('uuid:', true);
            }
            session(['cart_uid' => $user_id]);
        }

        return $user_id;
    }

    private function getCart(Request $request)
    {
        $user_id = self::getUid($request);

        if (Cache::tags(self::CACHE_TAG)->has($user_id)) {
            $cart = Cache::tags(self::CACHE_TAG)->get($user_id);
            // Refresh the expiration upon fetch.
            Cache::tags(self::CACHE_TAG)->put($user_id, $cart, self::CACHE_DURATION_MINUTES);
        } else {
            $cart = [];
        }

        return $cart;
    }

    private function setCart(Request $request, $cart)
    {
        $user_id = self::getUid($request);

        $cart[key($cart)]['uid'] = $user_id;
Cache::tags(self::CACHE_TAG)->put($user_id, $cart, self::CACHE_DURATION_MINUTES);
        return $cart;
    }
}
