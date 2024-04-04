<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Type extends Model {
    use HasFactory;

    protected $fillable = ['name'];
    protected $hidden = ['updated_at', 'created_at'];

    public function works(): HasMany {
        return $this->hasMany(Work::class);
    }
}
