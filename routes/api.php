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
Route::get('cart/{cart_uid}/totals', 'CartController@showCartTotals');
Route::get('countries', 'CountryController@index');
Route::get('countries/{country}', 'CountryController@show');
Route::get('currencies', 'CurrencyController@index');
Route::get('currencies/{currency}', 'CurrencyController@show');
Route::get('products', 'ProductController@index');
Route::get('products/{product}', 'ProductController@show');
Route::get('stores', 'StoreController@index');
Route::get('stores/{store}', 'StoreController@show');
Route::get('units', 'UnitController@index');
Route::get('units/{unit}', 'UnitController@show');
Route::post('register', 'Auth\RegisterController@register');
Route::post('logout', 'AuthenticationController@logoutAPI');

Route::group(["middleware" => 'auth:api'], function () {
    Route::get('user', 'UserController@showSelf')->name('login');
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
    // address routes
    Route::get('user/{user}/addresses', 'AddressController@indexUser');
    Route::get('user/{user}/address/{address}', 'AddressController@showUser');
    Route::post('user/{user}/addresses', 'AddressController@storeUser');
    Route::put('user/{user}/address/{address}/update', 'AddressController@updateUser');
    Route::put('user/{user}/address/{address}/delete', 'AddressController@destroyUser');
    // user order routes
    Route::get('orders', 'OrderController@index');
    Route::get('order/{order}', 'OrderController@show');
    Route::post('order/{cart_uid}', 'CartController@storeOrder');
    // validate promo code
    Route::post('validatepromo', 'OrderController@validate_promo_api');
});
