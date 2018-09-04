<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// shopping cart routes
Route::get('cart/{cart_uid}', 'CartController@index');
Route::post('cart/{cart_uid}', 'CartController@store');
Route::put('cart/{cart_uid}/item/{product_id}', 'CartController@update');
Route::delete('cart/{cart_uid}/item/{product_id}', 'CartController@destroy');

Route::get('currencies', 'CurrencyController@index');
Route::get('currencies/{currency}', 'CurrencyController@show');
Route::get('products', 'ProductController@index');
Route::get('products/{product}', 'ProductController@show');
Route::get('stores', 'StoreController@index');
Route::get('stores/{store}', 'StoreController@show');
Route::get('units', 'UnitController@index');
Route::get('units/{unit}', 'UnitController@show');
Route::get('/category/{subcategory}', 'CategoryController@subcategory_products');
Route::post('register', 'Auth\RegisterController@register');
Route::post('logout', 'AuthenticationController@logoutAPI');
Route::post('placeorder', 'OrderController@place_order');
//Route::get('testemail', 'OrderController@test_email');
Route::post('contact', 'ContactController@contact');

Route::group(["middleware" => 'auth:api'], function () {
    Route::get('user', ['as' => 'login', function (Request $request) {
        return response()->json($request->user());
    }]);
    // create/delete stores, get auth status
    Route::post('stores', 'StoreController@store');
    Route::put('stores/{store}/update', 'StoreController@update');
    Route::delete('stores/{store}', 'StoreController@destroy');
    Route::get('stores/{store}/auth', 'StoreController@auth');
    // create/delete products
    Route::post('products', 'ProductController@store');
    Route::put('products/{product}/update', 'ProductController@update');
    Route::delete('stores/{store}/products/{product}', 'ProductController@destroy');
    // wishlist routes
    Route::get('getuserwishlist', 'WishlistController@get_user_wishlist');
    Route::post('addtowishlist', 'WishlistController@add_to_wishlist');
    Route::delete('removefromwishlist/{product_id}', 'WishlistController@remove_from_wishlist');
    Route::post('wishlistcart', 'WishlistController@wishlist_to_cart');
    // checkout routes
    Route::get('checkoutinformation', 'OrderController@get_checkout_user_information');
    // user order routes
    Route::get('userorders', 'OrderController@get_user_orders');
    Route::get('order/{order_id}', 'OrderController@order_detail');
    // validate promo code
    Route::post('validatepromo', 'OrderController@validate_promo_api');
});
