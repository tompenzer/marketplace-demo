<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Auth;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function show(User $user)
    {
        // Add related data
        $user->setRelation('addresses', $user->addresses()->get());
        $user->setRelation('orders', $user->orders()->get());

        return response()->json($user);
    }

    public function showSelf()
    {
        return self::show(Auth::user());
    }

    public function store(UserRequest $request)
    {
        $user = User::create($request->validated());

        return response()->json($user);
    }

    public function update(UserRequest $request, User $user)
    {
        if (! $user->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $user->update($request->validated());

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        if (! $user->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $user->destroy();

        return response()->json([
            'status' => 'success',
            'message' => 'The user has been removed.'
        ]);
    }
}
