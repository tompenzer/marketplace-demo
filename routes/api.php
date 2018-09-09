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

// Public store and product routes
Route::get('products', 'ProductController@index');
Route::get('products/{product}', 'ProductController@show');
Route::get('stores', 'StoreController@index');
Route::get('stores/{store}', 'StoreController@show');

// Shopping cart routes
Route::get('cart/{cart_uid}', 'CartController@index');
Route::post('cart/{cart_uid}', 'CartController@store');
Route::put('cart/{cart_uid}/item/{product_id}', 'CartController@update');
Route::delete('cart/{cart_uid}/item/{product_id}', 'CartController@destroy');
Route::get('cart/{cart_uid}/totals', 'CartController@showCartTotals');

// Utility models
Route::get('countries', 'CountryController@index');
Route::get('countries/{country}', 'CountryController@show');
Route::get('currencies', 'CurrencyController@index');
Route::get('currencies/{currency}', 'CurrencyController@show');
Route::get('units', 'UnitController@index');
Route::get('units/{unit}', 'UnitController@show');

// Custom API auth
Route::post('register', 'Auth\RegisterController@register');
Route::post('logout', 'AuthenticationController@logoutApi');

// Authenticated routes
Route::group(["middleware" => 'auth:api'], function () {
    // Authenticated user info.
    Route::get('user', 'UserController@showSelf');

    // Create/delete stores, get store auth status
    Route::post('stores', 'StoreController@store');
    Route::put('stores/{store}/update', 'StoreController@update');
    Route::delete('stores/{store}', 'StoreController@destroy');
    Route::get('stores/{store}/auth', 'StoreController@auth');

    // Create/delete products
    Route::post('products', 'ProductController@store');
    Route::put('products/{product}/update', 'ProductController@update');
    Route::delete('stores/{store}/products/{product}', 'ProductController@destroy');

    // Address routes
    Route::get('user/{user}/addresses', 'AddressController@indexUser');
    Route::get('user/{user}/address/{address}', 'AddressController@showUser');
    Route::post('user/{user}/addresses', 'AddressController@storeUser');
    Route::put('user/{user}/address/{address}/update', 'AddressController@updateUser');
    Route::put('user/{user}/address/{address}/delete', 'AddressController@destroyUser');

    // User order routes
    Route::get('orders', 'OrderController@index');
    Route::get('order/{order}', 'OrderController@show');
    Route::post('order/{cart_uid}', 'CartController@storeOrder');// Handled by Cart controller.
});
