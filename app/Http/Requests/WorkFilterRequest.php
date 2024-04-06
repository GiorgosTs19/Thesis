<?php

namespace App\Http\Requests;

use App\Models\Author;
use App\Models\Type;
use App\Models\Work;
use App\Rules\ExistsInTable;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WorkFilterRequest extends FormRequest {

    private const WORKS_SORTING_COLS = ['id', 'doi', 'title', 'publication_year', 'is_referenced_by_count', 'external_id', 'language', 'type', 'type_id'];

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
            'per_page' => 'numeric|integer',
            'author_ids' => 'array',
            'author_ids.*' => ['numeric', 'integer', new ExistsInTable((new Author())->getTable())],
            'sources' => 'array',
            'sources.*' => ['string', Rule::in([Work::$openAlexSource, Work::$orcIdSource, Work::$crossRefSource])],
            'from_pub_year' => ['numeric', 'integer'],
            'to_pub_year' => ['numeric', 'integer'],
            'min_citations' => ['numeric', 'integer'],
            'max_citations' => ['numeric', 'integer'],
            'type_filters' => 'array',
            'type_filters.*' => ['numeric', 'integer', new ExistsInTable((new Type())->getTable())],
            'work_types' => 'array',
            'work_types.*' => 'string',
            'with_versions' => 'boolean',
            'sort_by' => ['string', Rule::in(self::WORKS_SORTING_COLS)],
            'sort_direction' => ['string', Rule::in(['asc', 'desc'])]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array {
        $work_attrs_string = implode(', ', self::WORKS_SORTING_COLS);
        return [
            'per_page.numeric' => 'The per_page parameter must be a number.',
            'per_page.integer' => 'The per_page parameter must be an integer.',
            'author_ids.array' => 'The author_ids parameter must be an array.',
            'author_ids.*.numeric' => 'The author_ids array must only consist of numbers.',
            'author_ids.*.integer' => 'The author_ids array must only consist of integers.',
            'sources.array' => 'The sources parameter must be an array.',
            'sources.*.string' => 'The sources array must only consist of strings.',
            'from_pub_year.numeric' => 'The from_pub_year parameter must be a number.',
            'from_pub_year.integer' => 'The from_pub_year parameter must be an integer.',
            'to_pub_year.numeric' => 'The to_pub_year parameter must be a number.',
            'to_pub_year.integer' => 'The to_pub_year parameter must be an integer.',
            'min_citations.numeric' => 'The min_citations parameter must be a number.',
            'min_citations.integer' => 'The min_citations parameter must be an integer.',
            'max_citations.numeric' => 'The max_citations parameter must be a number.',
            'max_citations.integer' => 'The max_citations parameter must be an integer.',
            'work_types.array' => 'The work_types parameter must be an array.',
            'work_types.*.string' => 'The work_types array must only consist of strings.',
            'type_filters.array' => 'The type_filters parameter must be an array.',
            'type_filters.*.numeric' => 'The type_filters array must only consist of numbers.',
            'type_filters.*.integer' => 'The type_filters array must only consist of integers.',
            'with_versions.boolean' => 'The include versions parameter must be a boolean.',
            'sort_by.string' => "The sort_by parameter must be a string, and one of [ $work_attrs_string ].",
            'sort_by.in' => "The sort_by parameter must be one of [ $work_attrs_string ].",
            'sort_direction.string' => 'The sort_direction parameter must be a string and one of [asc, desc].',
            'sort_direction.in' => 'The sort_direction parameter must be one of [asc, desc].',
        ];
    }

}
