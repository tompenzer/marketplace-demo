<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'id' => ['nullable', 'exists:addresses,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'recipient' => ['required', 'string', 'max:255'],
            'street_1' => ['required', 'string', 'max:255'],
            'street_2' => ['max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:255'],
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'phone' => ['required', 'string', 'min:10', 'max:255'],
        ];
    }
}
