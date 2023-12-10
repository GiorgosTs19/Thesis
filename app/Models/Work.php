<?php

namespace App\Models;

use App\Http\Controllers\APIController;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;
use function App\Providers\logMemory;
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
 * @property mixed $id
 * @property string $open_alex_id
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
            $newWork->open_alex_id = explode('/',$work->ids->openalex)[3];
            $newWork->open_alex_url = $work->ids->openalex;
            $newWork->cites_url = $work->cited_by_api_url;
            $newWork->last_updated_date = $work->updated_date;
            $newWork->created_date = $work->created_date;
            $newWork->save();

            // Generate the counts_by_year statics for the work
            Statistic::generateStatistics($newWork->id,$work->counts_by_year,self::class);

            // Associate all authors from the array with the work being processed
            $newWork->parseAuthors($work->authorships);
            logMemory();
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

    public function updateSelf() : void {
        $requestWork = APIController::workUpdateRequest($this->open_alex_id);

        $shouldUpdate = $requestWork->updated_date !== $this->last_updated_date;
        if(!$shouldUpdate)
            return;
        try {
            $shouldUpdate_referenced_count = $requestWork->referenced_works_count !== $this->referenced_works_count;

            if($shouldUpdate_referenced_count) $this->referenced_works_count = $requestWork->referenced_works_count;

            $shouldUpdate_referenced_count = $requestWork->open_access->is_oa !== $this->is_oa;

            if($shouldUpdate_referenced_count) $this->is_oa = $requestWork->open_access->is_oa;

            $this->last_updated_date = $requestWork->updated_date;

            $this->save();
        } catch (Exception $exception) {
            rocketDump($exception->getMessage(), 'error', [__FUNCTION__, __FILE__, __LINE__]);
        }

        $year_to_update =  date('Y');
        $databaseStatistic = $this->statistics()
            ->where('year',$year_to_update)
            ->first();

        if (!$databaseStatistic) {
            rocketDump($requestWork->counts_by_year, 'info', [__FUNCTION__,__FILE__,__LINE__]);
            $requestStatistic = Statistic::getLatestOpenAlexStatistic($this, Author::class,$requestWork->counts_by_year,$year_to_update);
            Statistic::generateStatistic($this->id, $requestStatistic, Auth::class);
            return;
        }

        $databaseStatistic->updateStatistic($this, $requestWork->counts_by_year, $year_to_update);
    }

    /**
     * Relationship
     * @return MorphMany
     * All the cited_counts by year associated with an author.
     */
    public function statistics(): MorphMany {
        return $this->morphMany(Statistic::class, 'asset');
    }
}
