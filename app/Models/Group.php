<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{Factories\HasFactory,
    Model,
    Relations\BelongsTo,
    Relations\BelongsToMany,
    Relations\HasMany};

/**
 * @property int $id
 * @method static find(int $id)
 * @method static name(mixed $name)
 */
class Group extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        'parent_id',
        'description'
    ];

    public function parent(): BelongsTo {
        return $this->belongsTo(Group::class, 'parent_id')->with(['members', 'parent']);
    }

    public function children(): HasMany {
        return $this->hasMany(Group::class, 'parent_id');
    }

    public function members(): BelongsToMany {
        return $this->belongsToMany(Author::class);
    }

    public function childrenRecursive(): HasMany {
        return $this->children()->with('childrenRecursive', 'members')->with('parent');
    }

    //    public function membersRecursive(): BelongsToMany {
    //        return $this->members()->with('membersRecursive');
    //    }


    public function scopeName($query, $name) {
        return $query->where('name', $name);
    }

    public function addMember($author_id): bool {
        $newMember = new AuthorGroup([
            'author_id' => $author_id,
            'group_id' => $this->id
        ]);
        return $newMember->save();
    }
}
