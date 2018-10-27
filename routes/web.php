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
*/

Route::get('/{any}', function () {
    // Fetch the cached Passport auth password client secret and pass it to the
    // welcome blade so we can populate the JS vars in the head for use by the
    // front-end.
    $client_id = env('PASSPORT_PASSWORD_CLIENT_ID');
    $cache_tag = 'oauth_client_secrets';
    $cache_duration_minutes = 60;

    if (Cache::tags($cache_tag)->has($client_id)) {
        $client_secret = Cache::tags($cache_tag)->get($client_id);
    } else {
        $client_secret = DB::table('oauth_clients')
            ->where('id', $client_id)
            ->first()
            ->secret;

        Cache::tags($cache_tag)->put(
            $client_id,
            $client_secret,
            $cache_duration_minutes
        );
    }

    return view('welcome', [
        'client_id' => $client_id,
        'client_secret' => $client_secret,
    ]);
})->where('any', '.*');
