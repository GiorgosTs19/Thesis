<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property mixed $doi
 * @property mixed|string $title
 * @property mixed $publication_date
 * @property mixed $publication_year
 * @property mixed|string $open_alex_url
 * @property mixed $is_oa
 * @property mixed $type
 * @property mixed|string $language
 * @property mixed $referenced_works_count
 *
 * @method static where(string $string, $doi)
 */
class Work extends Model {
    use HasFactory;

    /**
     * Creates a new work.
     *
     * @param $work
     * A work object straight from an OpenAlex API call response.
     * @return Work
     * The newly created work.
     */
    public static function createNewWork ($work): Work {
        $work_open_access = $work->open_access;
        $work_url = $work->doi ?? $work->open_access->oa_url;

        $newWork = new Work;
        $newWork->doi = $work_url;
        $newWork->title = $work->title ?? '';
        $newWork->publication_date = $work->publication_date;
        $newWork->publication_year = $work->publication_year;
        $newWork->referenced_works_count = $work->referenced_works_count;
        $newWork->language = $work->language ?? 'Unknown';
        $newWork->type = $work->type;
        $newWork->is_oa = $work_open_access->is_oa;
        $newWork->open_alex_url = explode('/',$work->ids->openalex)[3];
        $newWork->save();

        return $newWork;
    }

    /**
     * @param $doi
     * The doi of the work to search against.
     * @return bool
     * A boolean indicating if a work with the given doi exists in the database.
     */
    public static function workExistsByDoi($doi): bool {
        return !!Work::where('doi',$doi)->exists();
    }

    public function authors(): BelongsToMany {
        return $this->belongsToMany(Author::class, 'author_works');
    }

    public function scopeDoi($query, $doi) {
        if($doi !== '')
            return $query->orWhere('doi',$doi);
        return $query;
    }
}
