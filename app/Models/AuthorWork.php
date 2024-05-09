<?php

namespace App\Models;

use App\Utility\Requests;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * @property mixed $author_id
 * @property mixed $work_id
 * @property mixed $position
 *
 * @method static where(string $string, $author_id)
 * @method static create(array $array)
 */
class AuthorWork extends Model {
    use HasFactory;

    protected $table = 'author_work';

    protected $fillable = [
        'author_id',
        'work_id',
        'position',
        'visibility'
    ];


    /**
     * Checks whether an author is associated with the given work.
     * @param $author_id - The work id to check.
     * @param $author_id - The author id to check.
     * @return bool
     */
    public static function isAuthor($author_id, $work_id): bool {
       return (bool)AuthorWork::where('author_id', $author_id)->where('work_id', $work_id)->exists();
    }

    public static function getAuthorWorkRelation($author_id, $work_id) {
        return AuthorWork::where('author_id',$author_id)->where('work_id', $work_id)->first();
    }

    public static function hideWork($author_id, $work_id): bool {
        $relation = self::getAuthorWorkRelation($author_id, $work_id);
        $relation->visibility = false;
        return $relation->save();
    }
}
