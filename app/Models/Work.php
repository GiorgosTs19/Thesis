<?php

namespace App\Models;

use Exception;
use App\Utility\Ids;
use Illuminate\Support\Facades\Auth;
use function App\Providers\logMemory;
use function App\Providers\rocketDump;
use App\Http\Controllers\APIController;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
 * @method static openAlex($id)
 */
class Work extends Model {
    use HasFactory;

    const AuthorWorksTable = 'author_works';

    public static array $updateFields = ['id', 'open_alex_id', 'last_updated_date', 'is_oa', 'referenced_works_count'];

    protected $fillable = ['doi', 'title', 'publication_date', 'publication_year', 'referenced_works_count', 'language', 'type',
    'is_oa','open_alex_url', 'open_alex_id', 'cites_url', 'last_updated_date', 'created_date'];

    protected $hidden = ['last_updated_date', 'created_date', 'created_at'];

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
     * Associates the given authors with the work. Creates AuthorWorks records.
     */
    public function parseAuthors($authorObjects): void {
        foreach ($authorObjects as $index => $authorObject) {
            $ids = Ids::extractIds($authorObject->author);

            // Check if an author is a user.
            $author_is_user = User::isAuthorAUser($ids[Ids::OpenAlex_Id])['exists'];

            $newAuthor = null;
            // Check if an author exists by their Open Alex id or their OrcId
            ['exists' => $db_author_exists, 'author' => $newAuthor] = Author::authorExists($ids[Ids::OpenAlex_Id]);

            if(!$author_is_user && !$db_author_exists)
                $newAuthor = Author::createAuthor($authorObject->author, $ids);

            $newAuthor->associateAuthorToWork($this);
        }
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

    /**
     * Relationship
     * @return BelongsToMany
     * All the authors associated with the work.
     */
    public function authors(): BelongsToMany {
        return $this->belongsToMany(Author::class, self::AuthorWorksTable);
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

    /**
     * Updates the work ( if any changes are detected on the OpenAlex's api response ).
     * It compares the update date on the response, to the local last_updated_date ( last updated on the OpenAlex's database since the last local update )
     * if the values are different, it will check for updates on the fields below and if any of them has changed, it will get updated:
     * - referenced_works_count,
     * - is_oa,
     * - counts_by_year ( only for the current year )
     * @return void
     */
    public function updateSelf() : void {
        $requestWork = APIController::workUpdateRequest($this->open_alex_id);

        $shouldUpdate = $requestWork->updated_date !== $this->last_updated_date;
        if(!$shouldUpdate)
            return;
        try {
            $this->referenced_works_count = $requestWork->referenced_works_count;

            $this->is_oa = $requestWork->open_access->is_oa;

            $this->last_updated_date = $requestWork->updated_date;

            $this->save();
        } catch (Exception $exception) {
            rocketDump($exception->getMessage(), 'error', [__FUNCTION__, __FILE__, __LINE__]);
        }
        // Retrieve the current year
        $year_to_update =  date('Y');

        // Check local db for the work's statistics for the current year
        $databaseStatistic = $this->statistics()
            ->where('year',$year_to_update)
            ->first();

        // If there's no local record for this year's statistics for the current work,
        // make the api call to ensure it doesn't exist on OpenAlex as well.
        if (!$databaseStatistic) {
            $requestStatistic = Statistic::getCurrentYearsOpenAlexStatistic(Author::class,$requestWork->counts_by_year);
            // It seems like for some works there has not been any documented citations for the current year, or for years now,
            // so checking if the record we need exists in the first place
            if(!$requestStatistic) {
                rocketDump("No statistics were found for $this->open_alex_id for the year $year_to_update", 'info');
                return;
            }
            // If there is, and for some reason it has not been parsed on a previous update, create the new statistic for the current year.
            Statistic::generateStatistic($this->id, $requestStatistic, Auth::class);
            return;
        }
        // If there is a local record check for any changes and update accordingly.
        $databaseStatistic->updateStatistic($this, $requestWork->counts_by_year);
    }

    /**
     * Relationship
     * @return MorphMany
     * All the cited_counts by year associated with a work.
     */
    public function statistics(): MorphMany {
        return $this->morphMany(Statistic::class, 'asset');
    }

    public function scopeOpenAlex($query, $id, $type = 'url') {
        if($id !== '')
            return match ($type) {'id'=>$query->orWhere('open_alex_id',$id), 'url'=>
            $query->orWhere('open_alex_url',$id)};
        return $query;
    }
}
