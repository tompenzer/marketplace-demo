<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
| Since this app uses a client-side JS front-end, we're just loading an empty
| container with some JS vars populated.
|
*/

Route::get('/{any}', 'AuthenticationController@welcome')->where('any', '.*');
