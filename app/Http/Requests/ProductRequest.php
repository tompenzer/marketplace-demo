<?php

namespace App\Http\Requests;

use App\Models\Store;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
            'store_id' => ['required', 'integer', 'exists:stores,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'width' => ['required', 'numeric'],
            'width_unit_id' => ['required', 'integer', 'exists:units,id'],
            'height' => ['required', 'numeric'],
            'height_unit_id' => ['required', 'integer', 'exists:units,id'],
            'length' => ['required', 'numeric'],
            'length_unit_id' => ['required', 'integer', 'exists:units,id'],
            'weight' => ['required', 'numeric'],
            'weight_unit_id' => ['required', 'integer', 'exists:units,id'],
            'price' => ['required', 'numeric'],
            'currency_id' => ['required', 'integer', 'exists:currencies,id'],
        ];
    }
}
