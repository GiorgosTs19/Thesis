<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Work extends Model {
    use HasFactory, HasUuids;


    public function authors(): BelongsToMany {
        return $this->belongsToMany(Author::class, 'author_works');
    }
}
