<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Work extends Model {
    use HasFactory, HasUuids;


    public static function workExistsByDoi($doi) {
        return $doi !== '' ? Work::where('doi',$doi)->exists() : false;
    }

    public function authors(): BelongsToMany {
        return $this->belongsToMany(Author::class, 'author_works');
    }

    public function scopeDoi($query, $doi) {
        if($doi !== '')
            return $query->orWhere('doi',$doi);
        return $query;
    }
}
