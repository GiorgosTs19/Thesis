<?php

namespace App\Http\Requests\GroupRequests;

use App\Models\Group;
use App\Rules\ExistsInTable;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DeleteGroupRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array {
        return [
            'id' => ['required', new ExistsInTable((new Group())->getTable())],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array {
        return [
            'id.required' => 'The id parameter is marked as required.',
        ];
    }
}
