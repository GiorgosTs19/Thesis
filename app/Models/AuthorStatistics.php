<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * @property mixed $author_id
 * @property mixed $year
 * @property mixed $works_count
 * @property mixed $cited_count
 */
class AuthorStatistics extends Model {
    use HasFactory;
    protected $fillable = [
        'year',
        'count'
        ];

    public function author(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(Author::class);
    }

    public static function yearExistsForAuthor($author_id,$year): bool {
        return AuthorStatistics::where('author_id',$author_id)->where('year',$year)->exists();
    }
}
