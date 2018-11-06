<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuthClient;
use Auth;
use Cache;

class AuthenticationController extends Controller
{
    /**
     * Return auth status description.
     * @return string The auth status description.
     */
    public function loggedInApi()
    {
        $status = "logged out";

        if (Auth::check()) {
            $status = "logged in";
        }

        return response($status, 200);
    }

    /**
     * Wipe auth token(s) for the authenticated user.
     * @return string Success.
     */
    public function logoutApi()
    {
        if (Auth::check()) {
            Auth::user()->authTokens()->delete();
        }

        return response("logged out", 200);
    }

    /**
     * Return the cached Passport password client ID and secret with the welcome
     * blade so we can populate the JS vars in the head for use by the front-end.
     * @return view The 'welcome' view.
     */
    public function welcome()
    {
        $client_id = env('PASSPORT_PASSWORD_CLIENT_ID');
        $cache_tag = 'auth_client_secrets';
        $cache_duration_minutes = 60;

        if (Cache::tags($cache_tag)->has($client_id)) {
            $client_secret = Cache::tags($cache_tag)->get($client_id);
        } else {
            $client_secret = AuthClient::find($client_id)->secret;

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
    }
}
