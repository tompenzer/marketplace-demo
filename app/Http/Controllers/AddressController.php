<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddressRequest;
use App\Models\Address;
use App\Models\Country;
use App\Models\User;
use App\Rules\Address as AddressRule;
use Auth;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AddressController extends Controller
{
    const CACHE_TAG = 'addresses';

    const CACHE_DURATION_MINUTES = 30;

    public function indexUser(User $user)
    {
        if (! $user->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        return response()->json($user->addresses()->get());
    }

    public function showUser(User $user, Address $address)
    {
        if (! $user->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        return response()->json($address);
    }

    public function storeUser(AddressRequest $request, User $user)
    {
        if (! $user->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $arguments = $request->validated();

        $this->validate([
            'address' => implode(' ', [
                    $arguments['street_1'],
                    $arguments['street_2'],
                    $arguments['city'],
                    $arguments['state'],
                    $arguments['postal_code'],
                    Country::find($arguments['country_id'])->first()->abbreviation,
                ])
        ], new AddressRule);

        $address = Address::create($request->validated());

        // Give store admin role to the user who created the store.
        $user->addresses()->attach($address->id);

        return response()->json($address);
    }

    public function updateUser(AddressRequest $request, User $user, Address $address)
    {
        if (! $user->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $address->update($request->validated());

        return response()->json($address);
    }

    public function destroyUser(User $user, Address $address)
    {
        if (! $user->userHasAuth()) {
            abort(403, 'Unauthorized action.');
        }

        $address->destroy();

        return response()->json([
            'status' => 'success',
            'message' => 'The address has been removed.'
        ]);
    }
}
