<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{Factories\HasFactory,
    Model,
    Relations\BelongsTo,
    Relations\BelongsToMany,
    Relations\HasMany};

class Group extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'parent_id'
    ];

    public function parent(): BelongsTo {
        return $this->belongsTo(Group::class, 'parent_id');
    }

    public function children(): HasMany {
        return $this->hasMany(Group::class, 'parent_id');
    }

    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class);
    }
}
