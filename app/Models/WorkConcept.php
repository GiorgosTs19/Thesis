<?php

namespace App\Models;

use Illuminate\Contracts\Database\Query\Expression;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static select(string $string, Expression $raw)
 */
class WorkConcept extends Model {
    use HasFactory;

    protected $fillable = ['work_id', 'concept_id'];

    protected $table = 'work_concept';

    public function concept(): BelongsTo {
        return $this->belongsTo(Concept::class);
    }

}
