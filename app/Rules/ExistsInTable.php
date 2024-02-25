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

    /**
     * Create a new rule instance.
     *
     * @param string $table - The table to be used for the rule validation
     * @param string|null $customFailMessage - An optional custom message to be used if the validation fails
     */
    public function __construct(string $table, string $customFailMessage = null) {
        $this->table = $table;
        $this->customFailMessage = $customFailMessage;
    }

    /**
     * Run the validation rule.
     *
     * @param Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void {
        if (!DB::table($this->table)->where('id', $value)->exists()) {
            // Get the singular form of the table name provided and use it as the model identifier
            // to generate the error message
            $model_identifier = Str::singular($this->table);
            $fail($this->customFailMessage ?? "A $model_identifier with this id does not exist.");
        }
    }
}
