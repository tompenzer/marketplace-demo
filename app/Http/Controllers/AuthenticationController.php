<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class AuthenticationController extends Controller
{
    // Wipe access token(s) for the authenticated user.
    public function logoutApi()
    {
        if (Auth::check()) {
            Auth::user()->accessToken()->delete();
        }

        return response("logged out", 200);
    }
}
