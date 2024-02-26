<?php

namespace App\Http\Requests\GroupRequests;

use App\Models\Author;
use App\Models\AuthorGroup;
use App\Models\Group;
use App\Rules\ExistsInTable;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AddGroupMemberRequest extends FormRequest {
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
            'group_id' => ['required', 'numeric', 'integer', new ExistsInTable('Groups')],
            'authors' => 'required|array',
            'authors.*' => ['numeric', 'integer', new ExistsInTable('Authors')]
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
            'authors.required' => 'The authors parameter is marked as required.',
            'authors.array' => 'The authors parameter must be an array.',
            'authors.*.integer' => 'The authors array should only consist of integers'
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     */
    public function after(): array {
        return [
            function (Validator $validator) {
                $validatedData = $this->validated();
                $group = Group::find($validatedData['group_id']);

                // Perform some additional validation for each author in the authors array.
                // The authors contained in the list are already valid authors and exist in the Authors table .
                foreach ($validatedData['authors'] as $key => $author_id) {
                    // Since a member of a group should be a registered user, check if the author is actually one.
                    $author_is_user = Author::find($author_id)->isUser();
                    if (!$author_is_user) {
                        $validator->errors()->add(
                            "authors.$key", "The author with this id ( $author_id ) is not a registered user."
                        );
                    }
                    // Check if the author is already a member of that group.
                    $existing_member = AuthorGroup::entry($group->id, $author_id)->exists();
                    if ($existing_member) {
                        $validator->errors()->add(
                            "authors.$key", "The author with this id ( $author_id ) is already a member of this group ( $group->id )."
                        );
                    }
                }
            }
        ];
    }
}
