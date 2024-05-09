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

    private const WORKS_SORTING_COLS = ['id', 'doi', 'title', 'publication_year', 'is_referenced_by_count', 'language', 'type'];

    protected function prepareForValidation(): void {
        $this->merge([
            'per_page' => $this->query('per_page', 10),
            'author_ids' => $this->query('author_ids', []),
            'sources' => $this->query('sources', []),
            'from_pub_year' => $this->query('from_pub_year'),
            'to_pub_year' => $this->query('to_pub_year'),
            'min_citations' => $this->query('min_citations'),
            'max_citations' => $this->query('max_citations'),
            'type_filter' => $this->query('type_filter'),
            'work_types' => $this->query('work_types'),
            'with' => $this->query('with', ['authors']),
            'sort_by' => $this->query('sort_by', 'title'),
            'sort_direction' => $this->query('sort_direction', 'asc')]);
    }


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
            'per_page' => 'numeric|integer|nullable',
            'author_ids' => 'array|nullable',
            'author_ids.*' => ['numeric', 'integer', new ExistsInTable((new Author())->getTable())],
            'sources' => 'array|nullable',
            'sources.*' => ['string', Rule::in([Work::$openAlexSource, Work::$orcIdSource, Work::$crossRefSource])],
            'from_pub_year' => ['numeric', 'integer', 'nullable'],
            'to_pub_year' => ['numeric', 'integer', 'nullable'],
            'min_citations' => ['numeric', 'integer', 'nullable'],
            'max_citations' => ['numeric', 'integer', 'nullable'],
            'type_filter' => ['numeric', 'nullable', 'integer', new ExistsInTable((new Type())->getTable())],
            'work_types' => 'array|nullable',
            'work_types.*' => 'string',
            'with' => 'array|nullable',
            'with.*' => ['string', Rule::in(['authors', 'versions', 'statistics'])],
            'sort_by' => ['string', 'nullable', Rule::in(self::WORKS_SORTING_COLS)],
            'sort_direction' => ['string', 'nullable', Rule::in(['asc', 'desc'])]
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array {
        $work_attrs_string = implode(', ', self::WORKS_SORTING_COLS);
        $work_sources_string = implode(', ', [Work::$openAlexSource, Work::$orcIdSource, Work::$crossRefSource]);
        $work_relationships = implode(', ', ['authors', 'versions', 'statistics']);
        return [
            'per_page.numeric' => 'The per_page parameter must be a number.',
            'per_page.integer' => 'The per_page parameter must be an integer.',
            'author_ids.array' => 'The author_ids parameter must be an array.',
            'author_ids.*.numeric' => 'The author_ids array must only consist of numbers.',
            'author_ids.*.integer' => 'The author_ids array must only consist of integers.',
            'sources.array' => 'The sources parameter must be an array.',
            'sources.*.string' => 'The sources array must only consist of strings.',
            'sources.*.in' => "The sources can be any of [ $work_sources_string ]",
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
            'type_filter.numeric' => 'The type_filter array must only consist of numbers.',
            'type_filter.integer' => 'The type_filter array must only consist of integers.',
            'with' => 'The with parameter must be an array.',
            'with.*.string' => 'The values contained in the with parameter, must be strings.',
            'with.*.in' => "The values contained in the with parameter, must be any of [ $work_relationships ].",
            'sort_by.string' => "The sort_by parameter must be a string, and one of [ $work_attrs_string ].",
            'sort_by.in' => "The sort_by parameter must be one of [ $work_attrs_string ].",
            'sort_direction.string' => 'The sort_direction parameter must be a string and one of [asc, desc].',
            'sort_direction.in' => 'The sort_direction parameter must be one of [asc, desc].',
        ];
    }

}
