<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

/**
 * @method static existsByName($display_name)
 * @method static create(array $array)
 * @method static find(int $int)
 */
class Concept extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'open_alex_id'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'open_alex_id'
    ];
    
    public function scopeExistsByName($query, $name) {
        return $query->where('name', $name);
    }

    /**
     * Relationship
     * @return BelongsToMany
     * All the works that belong to the concept.
     */
    public function works(): BelongsToMany {
        return $this->belongsToMany(Work::class, 'work_concept');
    }

    public function scopeCountByConcept($query) {
        return $query->selectRaw('type, COUNT(*) as count')
            ->groupBy('type');
    }

    public static function getDynamicConceptsList() {
        $top_concepts = WorkConcept::with('concept')->select('concept_id', DB::raw('COUNT(*) as count'))
            ->groupBy('concept_id')->orderByDesc('count')->limit(5)->get();


        return $top_concepts;
    }
}
