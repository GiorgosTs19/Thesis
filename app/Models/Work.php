<?php

namespace App\Models;

use App\Http\Controllers\DOIAPI;
use App\Http\Controllers\OpenAlexAPI;
use App\Utility\Ids;
use App\Utility\ULog;
use Exception;
use Illuminate\Database\Eloquent\{Factories\HasFactory, Model, Relations\BelongsToMany, Relations\MorphMany};
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

/**
 * @property mixed $id
 * @property string doi
 * @property string type
 * @property string title
 * @property boolean is_oa
 * @property string language
 * @property string cites_url
 * @property string created_date
 * @property int publication_year
 * @property string $open_alex_id
 * @property string open_alex_url
 * @property mixed publication_date
 * @property string last_updated_date
 * @property int referenced_works_count
 * @property string $source_title
 * @property string $subtype
 * @property string $event
 * @property string $abstract
 * @property int $is_referenced_by_count
 *
 * @method static openAlex($id)
 * @method static mostCitations(int $int)
 * @method static searchTitle(mixed $query)
 * @method static countByType()
 * @method static whereIn(string $string, Collection $uniqueWorkIds)
 * @method static where(string $string, mixed $mixed)
 * @method static find(int $int)
 */
class Work extends Model {
    use HasFactory;

    public const SORTING_OPTIONS = [
        ['name' => 'Alphabetically (A to Z)', 'value' => 0, 'default' => true],
        ['name' => 'Alphabetically (Z to A)', 'value' => 1, 'default' => false],
        ['name' => 'Oldest', 'value' => 2, 'default' => false],
        ['name' => 'Newest', 'value' => 3, 'default' => false],
        ['name' => 'Citations ( Ascending )', 'value' => 4, 'default' => false],
        ['name' => 'Citations ( Descending )', 'value' => 5, 'default' => false],
    ];
    const AUTHOR_WORKS_TABLE = 'author_work';

    public static array $UPDATE_FIELDS = ['id', 'open_alex_id', 'last_updated_date', 'is_oa', 'referenced_works_count'];

    protected $fillable = ['doi', 'title', 'publication_date', 'publication_year', 'referenced_works_count', 'language', 'type',
        'is_oa', 'open_alex_url', 'open_alex_id', 'cites_url', 'last_updated_date', 'created_date'];

    protected $hidden = ['last_updated_date', 'created_date', 'created_at'];

    /**
     * Creates a new work.
     *
     * @param $work
     * A work object straight from an OpenAlex API call response.
     * @return void
     * The newly created work.
     */
    public static function createNewWork($work): void {
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
            $newWork->open_alex_id = Ids::parseOpenAlexId($work->ids->openalex);
            $newWork->open_alex_url = $work->ids->openalex;
            $newWork->cites_url = $work->cited_by_api_url;
            $newWork->last_updated_date = $work->updated_date;
            $newWork->created_date = $work->created_date;
            $newWork->save();

            // Generate the counts_by_year statics for the work
            Statistic::generateStatistics($newWork->id, $work->counts_by_year, self::class);

            // Associate all authors from the array with the work being processed
            $newWork->parseAuthors($work->authorships);
            ULog::memory();
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
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
            $author_is_user = User::authorIsUser($ids[Ids::OPEN_ALEX_ID])['exists'];

            $newAuthor = null;
            // Check if an author exists by their Open Alex id or their OrcId
            ['exists' => $db_author_exists, 'author' => $newAuthor] = Author::authorExists($ids[Ids::OPEN_ALEX_ID]);

            if (!$author_is_user && !$db_author_exists)
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
        return !!Work::where('doi', $doi)->exists();
    }

    /**
     * Relationship
     * @return BelongsToMany
     * All the authors associated with the work.
     */
    public function authors(): BelongsToMany {
        return $this->belongsToMany(Author::class, self::AUTHOR_WORKS_TABLE);
    }

    /**
     * @param $query
     * @param $doi
     * @return mixed
     */
    public function scopeDoi($query, $doi): mixed {
        if ($doi !== '')
            return $query->orWhere('doi', $doi);
        return $query;
    }

    public function scopeMostCitations($query, int $limit) {
        return $query->orderBy('referenced_works_count', 'desc')->limit($limit)->get();
    }

    public function scopeIsOpenAccess($query, int $is_oa = 1) {
        return $query->where('is_oa', $is_oa);
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
    public function updateSelf(): void {
        $requestWork = OpenAlexAPI::workUpdateRequest($this->open_alex_id);

        $shouldUpdate = $requestWork->updated_date !== $this->last_updated_date;
        if (!$shouldUpdate)
            return;
        try {
            $this->referenced_works_count = $requestWork->referenced_works_count;

            $this->is_oa = $requestWork->open_access->is_oa;

            $this->last_updated_date = $requestWork->updated_date;

            $this->save();
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
        }
        // Retrieve the current year
        $year_to_update = date('Y');

        // Check local db for the work's statistics for the current year
        $databaseStatistic = $this->statistics()
            ->where('year', $year_to_update)
            ->first();

        // If there's no local record for this year's statistics for the current work,
        // make the api call to ensure it doesn't exist on OpenAlex as well.
        if (!$databaseStatistic) {
            $requestStatistic = Statistic::getCurrentYearsOpenAlexStatistic(Author::class, $requestWork->counts_by_year);
            // It seems like for some works there has not been any documented citations for the current year, or for years now,
            // so checking if the record we need exists in the first place
            if (!$requestStatistic) {
                ULog::log("No statistics were found for $this->open_alex_id for the year $year_to_update", ULog::META);
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
        return $this->morphMany(Statistic::class, 'asset')->orderBy('year');
    }

    public function scopeOpenAlex($query, $id, $type = 'url') {
        if ($id !== '')
            return match ($type) {
                'id' => $query->orWhere('open_alex_id', $id),
                'url' =>
                $query->orWhere('open_alex_url', $id)
            };
        return $query;
    }

    public function scopeSearchTitle($query, $title) {
        return $query->orWhere('title', 'LIKE', "%{$title}%");
    }

    public function scopeSearchDOI($query, $doi) {
        // Add "https://doi.org/" if not already present
        $doiToSearch = str_starts_with($doi, 'https://doi.org/') ? $doi : 'https://doi.org/' . $doi;
        return $query->orWhere('doi', $doiToSearch);
    }

    public function scopeSearchOpenAlex($query, $open_alex_id) {
        return $query->orWhere('open_alex_id', $open_alex_id);
    }

    public function scopeCountByType($query) {
        return $query->selectRaw('type, COUNT(*) as count')
            ->groupBy('type');
    }

    public static function getDynamicTypesList(int $threshold = 3) {
        $works_by_type = Work::countByType()->get();

        $totalWorks = $works_by_type->sum('count');

        // Filter types based on the threshold percentage
        $filteredTypes = $works_by_type->filter(function ($type) use ($totalWorks, $threshold) {
            return ($type->count / $totalWorks) * 100 >= $threshold;
        });

        // Sum the count of types that do not pass the threshold
        $otherCount = $works_by_type->whereNotIn('type', $filteredTypes->pluck('type')->toArray())->sum('count');

        // Create a new collection with the filtered types and 'Other'
        $filteredTypes->push(['type' => 'Other', 'count' => $otherCount]);

        return $filteredTypes;
    }

    public function syncWithOrcId($orc_id_work): void {
        $work_summary = data_get($orc_id_work, 'work-summary');
        if (!is_null($work_summary) && sizeof($work_summary) > 0) {
            $this->source_title = data_get($work_summary[0], 'journal-title.value');
            $this->save();
        }
    }

    public function syncWithDOI(): void {
        $doi_object = DOIAPI::DOIRequest($this->doi);
        $this->subtype = $doi_object->type ?? null;
        $this->event = $doi_object->event ?? null;
        $this->abstract = isset($doi_object->abstract) ? (string) simplexml_load_string($doi_object->abstract, null, LIBXML_NOERROR, 'jats', true) : null;
        $this->is_referenced_by_count = data_get($doi_object, 'is-referenced-by-count') ?? null;
        $this->save();
    }
}
