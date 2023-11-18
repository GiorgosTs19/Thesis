<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Author extends Model {
    use HasFactory, HasUuids;

    protected $fillable = [
        'Name',
        'OrcId',
        'ScopusId',
        'OpenAlexId',
        'Cited_By_Count'
    ];

    public function works(): BelongsToMany {
        return $this->belongsToMany(Work::class);
    }
}
