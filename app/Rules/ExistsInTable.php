<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Translation\PotentiallyTranslatedString;

class ExistsInTable implements ValidationRule {
    protected string $table;
    protected ?string $customFailMessage;

    protected bool $negate;

    /**
     * Create a new rule instance.
     *
     * @param string $table - The table to be used for the rule validation
     * @param bool $negate - Whether the condition should be negated ( check if the primary key doesn't exist in the specified table )
     * @param string|null $customFailMessage - An optional custom message to be used if the validation fails
     */
    public function __construct(string $table, string $customFailMessage = null, bool $negate = false) {
        $this->table = $table;
        $this->customFailMessage = $customFailMessage;
        $this->negate = $negate;
    }

    /**
     * Run the validation rule.
     *
     * @param Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void {
        $query = DB::table($this->table)->where('id', $value);
        if ($this->negate ? $query->exists() : !$query->exists()) {
            // Get the singular form of the table name provided and use it as the model identifier
            // to generate the error message
            $model_identifier = Str::singular($this->table);
            $fail($this->customFailMessage ?? "The $model_identifier with this id ( $value ) does not exist.");
        }
    }
}
