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

            $products = $products->with(
                'store',
                'currency',
                'widthUnit',
                'heightUnit',
                'lengthUnit',
                'weightUnit'
            )
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
        $product->setRelation('width_unit', $product->widthUnit()->first());
        $product->setRelation('height_unit', $product->heightUnit()->first());
        $product->setRelation('length_unit', $product->lengthUnit()->first());
        $product->setRelation('weight_unit', $product->weightUnit()->first());

        return response()->json($product);
    }

    public function store(ProductRequest $request)
    {
        $store = Store::find($request->input('store_id'))->first();

        if (! $store->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $product = Product::create($request->validated());

        Cache::tags(self::CACHE_TAG)->flush();

        return response()->json($product);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $store = Store::find($request->input('store_id'))->first();

        if (! $store->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $product->update($request->validated());

        Cache::tags(self::CACHE_TAG)->flush();

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $store = Store::find($product->store_id)->first();

        if (! $store->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $product->destroy();

        Cache::tags(self::CACHE_TAG)->flush();

        return response()->json([
            'status' => 'success',
            'message' => 'The product has been removed.'
        ]);
    }
}
