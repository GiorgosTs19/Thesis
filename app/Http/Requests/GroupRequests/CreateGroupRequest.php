<?php

namespace App\Http\Requests\GroupRequests;

use App\Rules\ExistsInTable;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateGroupRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the CreateGroupRequest.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array {
        return [
            'name' => 'required|unique:groups|max:255',
            'description' => 'required|max:255',
            'parent' => ['nullable', 'numeric', 'integer', new ExistsInTable('Groups')]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array {
        return [
            'name.required' => 'The name parameter is marked as required.',
            'name.unique' => 'A group with that name already exists.',
            'name.max' => 'The name must be a maximum of 255 characters in length.',
            'description.required' => 'The description  parameter is marked as required.',
            'description.max' => 'The description must be a maximum of 255 characters in length.',
            'parent.numeric' => 'The parent id must be a number.',
            'parent.integer' => 'The parent id must be an integer.',
        ];
    }
}
