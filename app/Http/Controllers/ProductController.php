<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\Store;
use Auth;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    const CACHE_TAG = 'products';

    const CACHE_DURATION_MINUTES = 30;

    public function index(Request $request)
    {
        $page = 1;
        $search = null;
        $store_id = null;

        if ($request->has('page')) {
            $page = $request->input('page');
        }

        if ($request->has('q')) {
            $search = $request->input('q');
        }

        if ($request->has('store_id')) {
            $store_id = $request->input('store_id');
        }

        $cache_name = "store:{$store_id}:search:{$search}:page:{$page}";

        if (Cache::tags(self::CACHE_TAG)->has($cache_name)) {
            $products = Cache::tags(self::CACHE_TAG)->get($cache_name);
        } else {
            $products = Product::search($search);

            if ($store_id) {
                $products = $products->store($store_id);
            }

            $products = $products->with('store')
                 ->orderBy('name')
                 ->paginate(20);

            Cache::tags(self::CACHE_TAG)->put($cache_name, $products, self::CACHE_DURATION_MINUTES);
        }

        return response()->json($products);
    }

    public function show(Product $product)
    {
        // Add store and currency related data.
        $product->setRelation('store', $product->store()->first());
        $product->setRelation('currency', $product->currency()->first());

        return response()->json($product);
    }

    public function store(ProductRequest $request)
    {
        $store = Store::find($request->input('store_id'))->first();

        if ($store->userHasAuth()) {
            $product = Product::create(array_filter($request->only([
                'store_id',
                'name',
                'description',
                'width',
                'width_unit_id',
                'height',
                'height_unit_id',
                'length',
                'length_unit_id',
                'weight',
                'weight_unit_id',
                'price',
                'currency_id',
            ])));

            return response()->json($product);
        }

        return redirect()->route('login');
    }

    public function destroy(Store $store, Product $product)
    {
        if (Auth::check()
            && (Auth::user()->isSiteAdmin()
                || $store->hasUser(Auth::user()->id)
            )
        ) {
            $product->destroy();

            return response()->json([
                'status' => 'success',
                'message' => 'The product has been removed.'
            ]);
        }

        return redirect()->route('login');
    }
}
