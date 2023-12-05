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
 *
 * @method static where(string $string, $author_id)
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

    public static function generateStatistics($author, $statistics): void {
        $newYearlyCitations = new AuthorStatistics;
        $newYearlyCitations->author_id = $author->id;
        $newYearlyCitations->year = $statistics->year;
        $newYearlyCitations->works_count = $statistics->works_count;
        $newYearlyCitations->cited_count = $statistics->cited_by_count;
        $newYearlyCitations->save();
    }
}
