<?php

namespace App\Rules;

use GuzzleHttp\Client;
use Illuminate\Contracts\Validation\Rule;

class AddressRule implements Rule
{
    /**
     * Validates for one or more groups of one or more letters or numbers (or
     * letter component marks), each separated by a single separator (space
     * equivalent in any script, apostrophe, underscore or dash).
     */
    public function passes($attribute, $value)
    {
        if (! is_string($value)) {
            return false;
        }

        $special_chars_removed = preg_replace("/[^ \w]+/", "", $value);
        $spaces_replaced = str_replace(' ', '+', $special_chars_removed);

        $client = new Client(['verify' => false]);

        $result = $client->request('GET', 'https://maps.googleapis.com/maps/api/geocode/json', [
            'query' => ['address' => $spaces_replaced]
        ]);

        $response = json_decode($result->getBody());

        return $response->status == 'OK';
    }

    /**
     * Get the validation error message.
     */
    public function message(): string
    {
        return 'We were unable to verify the provided address.';
    }
}
