<?php

namespace App\Http\Requests\GroupRequests;

use App\Models\AuthorGroup;
use App\Rules\ExistsInTable;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class RemoveGroupMemberRequest extends FormRequest {
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
            'group_id' => ['required', 'numeric', 'integer', new ExistsInTable('groups')],
            'author_id' => ['required', 'numeric', 'integer', new ExistsInTable('authors')]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array {
        return [
            'group_id.required' => 'The group_id parameter is marked as required.',
            'group_id.numeric' => 'The group_id parameter must be a number.',
            'group_id.integer' => 'The group_id parameter must be an integer.',
            'author_id.required' => 'The author_id parameter is marked as required.',
            'author_id.numeric' => 'The author_id parameter must be a number.',
            'author_id.integer' => 'The author_id parameter must be an integer.',
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array {
        return [
            function (Validator $validator) {
                $validatedData = $this->validated();
                $group_id = $validatedData['group_id'];
                $author_id = $validatedData['author_id'];
                // Check if the author is already a member of that group.
                $existing_member = AuthorGroup::entry($group_id, $author_id)->exists();
                if (!$existing_member) {
                    $validator->errors()->add(
                        "authors_id", "The author with this id ( $author_id ) is not a member of this group ( $group_id )."
                    );
                }

            }
        ];
    }
}
