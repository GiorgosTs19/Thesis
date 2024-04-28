<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{Factories\HasFactory,
    Model,
    Relations\BelongsTo,
    Relations\BelongsToMany,
    Relations\HasMany};
use Illuminate\Support\Facades\Auth;

/**
 * @property int $id
 * @method static find(int $id)
 * @method static name(mixed $name)
 * @method static noParent()
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
        return $this->children()->with(['childrenRecursive'])->noMembers();
    }

    public function scopeNoMembers($query) {
        if (!Auth::check() || !Auth::user()?->isAdmin()) {
            return $query->has('members');
        }
        return $query;
    }

    public function scopeNoParent($query) {
        return $query->whereNull('parent_id');
    }

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

    public function works($source = 'Aggregate') {
        return Work::whereHas('authors', function ($query) {
            $members = $this->members->map(function (Author $author) {
                return $author->id;
            });
            $query->whereIn('author_id', $members);
        })->source($source)->get();
    }

    public function countWorkSources() {
        return Work::whereHas('authors', function ($query) {
            $members = $this->members->map(function (Author $author) {
                return $author->id;
            });
            $query->whereIn('author_id', $members);
        })
            ->groupBy('source')
            ->selectRaw('source, count(*) as count')
            ->get();
    }
}
