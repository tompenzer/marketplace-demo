<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use GuzzleHttp\Client;

class Address implements Rule
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

        $remove_special_char = preg_replace("/[^ \w]+/", "", $value);
        $remove_spaces = str_replace(' ', '+', $remove_special_char);

        $client = new Client(['verify' => false]);

        $result = $client->request('GET', 'https://maps.googleapis.com/maps/api/geocode/json', [
            'query' => ['address' => $remove_spaces]
        ]);

        $response = json_decode($result->getBody());

        if ($response->status=='OK') {
            return true;
        }

        return false;
    }

    /**
     * Get the validation error message.
     */
    public function message(): string
    {
        return 'We were unable to verify the provided address.';
    }
}
