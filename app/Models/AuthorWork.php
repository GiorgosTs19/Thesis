<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuthorWork extends Model {
    use HasFactory;

    protected $table = 'author_work';

    protected $fillable = [
        'Author_Id',
        'Work_Id',
    ];

    public static function associationExists($work_id,$author_id) {
        return AuthorWork::where('author_id',$author_id)->where('work_id',$work_id)->exists();
    }
}
