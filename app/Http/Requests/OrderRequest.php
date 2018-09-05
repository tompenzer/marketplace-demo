<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
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
            'address' => ['required', 'array'],
            'subtotal' => ['required', 'numeric'],
            'shipping' => ['required', 'numeric'],
            'taxes' => ['required', 'numeric'],
            'total' => ['required', 'numeric'],
            'currency_id' => ['required', 'integer', 'exists:currencies,id'],
        ];
    }
}
