<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use function App\Providers\rocketDump;

/**
 * @property string doi
 * @property string title
 * @property mixed publication_date
 * @property int publication_year
 * @property string open_alex_url
 * @property boolean is_oa
 * @property string type
 * @property string language
 * @property string cites_url
 * @property int referenced_works_count
 * @property string last_updated_date
 * @property string created_date
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
     * @return void
     * The newly created work.
     */
    public static function createNewWork ($work): void {
        $work_open_access = $work->open_access;
        $work_url = $work->ids->doi ?? $work_open_access->oa_url;
        $newWork = new Work;
        try {
            $newWork->doi = $work_url;
            $newWork->title = $work->title ?? '';
            $newWork->publication_date = $work->publication_date;
            $newWork->publication_year = $work->publication_year;
            $newWork->referenced_works_count = $work->referenced_works_count;
            $newWork->language = $work->language ?? 'Unknown';
            $newWork->type = $work->type;
            $newWork->is_oa = $work_open_access->is_oa;
            $newWork->open_alex_url = explode('/',$work->ids->openalex)[3];
            $newWork->cites_url = $work->cited_by_api_url;
            $newWork->last_updated_date = $work->updated_date;
            $newWork->created_date = $work->created_date;
            $newWork->save();

            // Associate all authors from the array with the work being processed
            $newWork->parseAuthors($work->authorships);
        } catch (Exception $error) {
            rocketDump($error->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
        }
    }

    /**
     * Static Utility Function
     * @param $authorObjects
     * An array of authors to be associated with the given work
     * @return void
     * Associates the given authors with the given work. Creates AuthorWorks records.
     */
    public function parseAuthors($authorObjects): void {
        foreach ($authorObjects as $index => $authorObject) {
            $ids = ['scopus_id'=>property_exists($authorObject->author,'scopus') ? Author::parseScopusId($authorObject->author->scopus) : null,
                'orc_id'=>Author::parseOrcId($authorObject->author->orcid),
                'open_alex_id'=>Author::parseOpenAlexId($authorObject->author->id)];

            // Check if an author is a user.
            $author_is_user = User::isAuthorAUser($ids['open_alex_id'],$ids['orc_id'])['exists'];

            $newAuthor = null;
            // Check if an author exists by their Open Alex id or their OrcId
            ['exists' => $db_author_exists, 'author' => $newAuthor] = Author::authorExists($ids['open_alex_id'],$ids['orc_id']);


            if(!$author_is_user && !$db_author_exists)
                $newAuthor = Author::createAuthor($authorObject->author, $ids);

//            rocketDump("Parsed $index/".sizeOf($authorObjects)." of work authors.", 'info', [__FUNCTION__,__FILE__,__LINE__]);
            $newAuthor->associateAuthorToWork($this);
        }
    }

    /**
     * Static Utility Function
     * @param $doi
     * The doi of the work to search against.
     * @return bool
     * A boolean indicating if a work with the given doi exists in the database.
     */
    public static function workExistsByDoi($doi): bool {
        return !!Work::where('doi',$doi)->exists();
    }

    /**
     * Relationship
     * @return BelongsToMany
     * All the authors that are associated with the work.
     */
    public function authors(): BelongsToMany {
        return $this->belongsToMany(Author::class, 'author_works');
    }

    /**
     * @param $query
     * @param $doi
     * @return mixed
     */
    public function scopeDoi($query, $doi): mixed {
        if($doi !== '')
            return $query->orWhere('doi',$doi);
        return $query;
    }
}
