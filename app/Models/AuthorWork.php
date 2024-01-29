<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed $author_id
 * @property mixed $work_id
 *
 * @method static where(string $string, $author_id)
 */
class AuthorWork extends Model {
    use HasFactory;

    protected $table = 'author_works';
    protected $fillable = [
        'Author_Id',
        'Work_Id',
    ];
}
