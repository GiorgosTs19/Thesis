<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed $author_id
 * @property mixed $work_id
 */
class AuthorWork extends Model {
    use HasFactory;

    protected $table = 'author_work';

    protected $fillable = [
        'Author_Id',
        'Work_Id',
    ];

    /**
     * @param $work_id
     * The work id to check the association for.
     * @param $author_id
     * The author id to check the association for.
     * @return bool
     * A boolean indicating if an association between the requested author and work already exists in the database.
     */
    public static function associationExists($work_id, $author_id): bool {
        return AuthorWork::where('author_id',$author_id)->where('work_id',$work_id)->exists();
    }
}
