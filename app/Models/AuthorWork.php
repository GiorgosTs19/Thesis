<?php

namespace App\Models;

use App\Utility\ULog;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return AuthorWork::where('author_id', $author_id)->where('work_id', $work_id)->first();
    }

    public static function toggleWorkVisibility($author_id, $work_id, $visibility): bool {
        try {
            $versions = Work::where('doi', Work::find($work_id)->doi)->get();
            foreach ($versions as $version) {
                $relation = self::getAuthorWorkRelation($author_id, $version->id);
                if (!$relation)
                    continue;
                $relation->visibility = $visibility;
                $relation->save();
            }
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
            return false;
        }
        return true;
    }
}
