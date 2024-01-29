<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static entry(int $id, $author_id)
 */
class AuthorGroup extends Model {
    use HasFactory;

    protected $table = 'author_group';

    protected $fillable = [
        'author_id',
        'group_id'
    ];

    public function scopeEntry($query, $group, $author) {
        return $query->where('group_id', $group)->where('author_id', $author);
    }
}
