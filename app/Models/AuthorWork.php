<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed $author_id
 * @property mixed $work_id
 * @property mixed $position
 *
 * @method static where(string $string, $author_id)
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
}
