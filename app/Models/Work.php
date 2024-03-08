<?php

namespace App\Models;

use App\Http\Controllers\DOIAPI;
use App\Http\Controllers\OpenAlexAPI;
use App\Utility\Ids;
use App\Utility\ULog;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\{Factories\HasFactory, Model, Relations\BelongsToMany, Relations\MorphMany};
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

/**
 * @property integer $id
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
 * @property string last_updated_date
 * @property int referenced_works_count
 * @property string $source_title
 * @property string $subtype
 * @property string $event
 * @property string $abstract
 * @property int $is_referenced_by_count
 * @property int orc_id_put_code
 * @property string orc_id_url
 * @property boolean orcid_source
 * @property boolean open_alex_source
 * @property boolean crossref_source
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

    public static string $OPEN_ALEX_SOURCE_FIELD = 'open_alex_source';
    public static string $ORCID_SOURCE_FIELD = 'orcid_source';
    public static string $CROSSREF_SOURCE_FIELD = 'crossref_source';

    public static string $openAlexSource = 'OpenAlex';
    public static string $orcIdSource = 'ORCID';
    public static string $crossRefSource = 'Crossref';

    public const SORTING_OPTIONS = [
        ['name' => 'Citations ( Ascending )', 'value' => 0, 'default' => false],
        ['name' => 'Citations ( Descending )', 'value' => 1, 'default' => true],
        ['name' => 'Alphabetically (A to Z)', 'value' => 2, 'default' => false],
        ['name' => 'Alphabetically (Z to A)', 'value' => 3, 'default' => false],
        ['name' => 'Oldest', 'value' => 4, 'default' => false],
        ['name' => 'Newest', 'value' => 5, 'default' => false],
    ];
    const AUTHOR_WORKS_TABLE = 'author_work';

    public static array $updateFields = ['id', 'open_alex_id', 'last_updated_date', 'is_oa', 'referenced_works_count'];

    protected $fillable = ['doi', 'title', 'publication_year', 'referenced_works_count', 'language', 'type',
        'is_oa', 'open_alex_url', 'open_alex_id', 'cites_url', 'last_updated_date', 'created_date', 'orcid_source', 'open_alex_source', 'crossref_source'];

    protected $hidden = ['last_updated_date', 'created_date', 'created_at'];

    /**
     * Creates a new work.
     *
     * @param $work
     * A work object straight from an OpenAlex API call response.
     * @return void
     * The newly created work.
     */
    public static function createNewOAWork($work): void {
        $work_open_access = $work->open_access;
        $work_url = $work->ids->doi ?? $work_open_access->oa_url;
        $new_work = new Work;
        try {
            $new_work->doi = $work_url;
            $new_work->title = $work->title ?? '';
            $new_work->publication_year = $work->publication_year;
            $new_work->referenced_works_count = $work->referenced_works_count;
            $new_work->is_referenced_by_count = $work->cited_by_count;
            $new_work->language = $work->language ?? 'Unknown';
            $new_work->type = $work->type;
            $new_work->is_oa = $work_open_access->is_oa;
            $new_work->open_alex_id = Ids::parseOpenAlexId($work->ids->openalex);
            $new_work->open_alex_url = $work->ids->openalex;
            $new_work->cites_url = $work->cited_by_api_url;
            $new_work->last_updated_date = $work->updated_date;
            $new_work->created_date = $work->created_date;
            $new_work->open_alex_source = true;
            $new_work->save();

            // Generate the counts_by_year statics for the work
            Statistic::generateStatistics($new_work->id, $work->counts_by_year, self::class);

            // Associate all authors from the array with the work being processed
            $new_work->parseAuthors($work->authorships);
            $new_work->generateConcepts($work->concepts);
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
        }
    }

    /**
     * Creates a new work from an orc id api response.
     *
     * @param $work
     * A work object straight from an OrcId API call response.
     * @return ?Work
     * The newly created work.
     */
    public static function createNewOIWork($work, $doi): ?Work {
        $new_work = new Work;
        try {
            $doi_work_object = DOIAPI::doiRequest($doi);

            $new_work->doi = $doi;
            $new_work->title = data_get($work, 'title.title.value') ?? '';
            $new_work->publication_year = Carbon::parse(data_get($doi_work_object, 'created.date-time'))->format('Y');
            $new_work->referenced_works_count = data_get($doi_work_object, 'reference-count');
            $new_work->source_title = data_get($work, 'journal-title.value');
            $new_work->language = $doi_work_object->language ?? 'Unknown';
            $new_work->type = $work->type;
            $new_work->event = null;
            $new_work->is_oa = $work->visibility === 'PUBLIC';
            $new_work->open_alex_id = null;
            $new_work->open_alex_url = null;
            $new_work->orc_id_put_code = data_get($work, 'put-code');
            $new_work->orc_id_url = Ids::formOrcIdUrl($work->path);
            $new_work->cites_url = null;
            $new_work->is_referenced_by_count = data_get($doi_work_object, 'is-referenced-by-count');
            $new_work->last_updated_date = null;
            $new_work->subtype = $doi_work_object->type;
            $new_work->created_date = Carbon::parse(data_get($doi_work_object, 'created.date-time'))->format('Y-m-d H:i:s');
            $new_work->orcid_source = true;
            $new_work->save();

            return $new_work;
            // Associate all authors from the array with the work being processed
//            $new_work->parseAuthors($work->authorships);
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
            return null;
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
        foreach ($authorObjects as $index => $author_object) {
            $ids = Ids::extractIds($author_object->author);

            // Check if an author is a user.
            $author_is_user = User::authorIsUser($ids[Ids::OPEN_ALEX_ID])['exists'];

            $new_author = null;
            // Check if an author exists by their Open Alex id or their OrcId
            ['exists' => $db_author_exists, 'author' => $new_author] = Author::authorExists($ids[Ids::OPEN_ALEX_ID]);

            if (!$author_is_user && !$db_author_exists)
                $new_author = Author::createOpenAlexAuthor($author_object->author, $ids);

            $new_author->associateAuthorToWork($this);
        }
    }

    /**
     * @return array - An array of strings containing the sources from which the info for this work came from.
     */
    public function sources(): array{
        $sources = [];
        if($this->crossref_source) {
            $sources = [...$sources,Work::$crossRefSource];
        }
        if($this->open_alex_source) {
            $sources = [...$sources,Work::$openAlexSource];
        }
        if($this->orcid_source) {
            $sources = [...$sources,Work::$orcIdSource];
        }
        return $sources;
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
     * Relationship
     * @return BelongsToMany
     * All the concepts associated with the work.
     */
    public function concepts(): BelongsToMany {
        return $this->belongsToMany(Concept::class, 'work_concept');
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
        $request_work = OpenAlexAPI::workUpdateRequest($this->open_alex_id);

        $should_update = $request_work->updated_date !== $this->last_updated_date;
        if (!$should_update)
            return;
        try {
            $this->referenced_works_count = $request_work->referenced_works_count;
            $this->is_referenced_by_count = $request_work->cited_by_count;
            $this->is_oa = $request_work->open_access->is_oa;
            $this->last_updated_date = $request_work->updated_date;
            $this->save();
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
        }
        // Retrieve the current year
        $year_to_update = date('Y');

        // Check local db for the work's statistics for the current year
        $db_statistic = $this->statistics()
            ->where('year', $year_to_update)
            ->first();

        // If there's no local record for this year's statistics for the current work,
        // make the api call to ensure it doesn't exist on OpenAlex as well.
        if (!$db_statistic) {
            $req_statistic = Statistic::getCurrentYearsOpenAlexStatistic(Author::class, $request_work->counts_by_year);
            // It seems like for some works there has not been any documented citations for the current year, or for years now,
            // so checking if the record we need exists in the first place
            if (!$req_statistic) {
                ULog::log("No statistics were found for $this->open_alex_id for the year $year_to_update ", ULog::META);
                return;
            }
            // If there is, and for some reason it has not been parsed on a previous update, create the new statistic for the current year.
            Statistic::generateStatistic($this->id, $req_statistic, Auth::class);
            return;
        }
        // If there is a local record check for any changes and update accordingly.
        $db_statistic->updateStatistic($this, $request_work->counts_by_year);
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
        $doi_to_search = str_starts_with($doi, 'https://doi.org/') ? $doi : 'https://doi.org/' . $doi;
        return $query->orWhere('doi', $doi_to_search);
    }

    public function scopeSearchOpenAlex($query, $open_alex_id) {
        return $query->orWhere('open_alex_id', $open_alex_id);
    }

    public function scopeCountByType($query) {
        return $query->selectRaw('type, COUNT(*) as count')
            ->groupBy('type');
    }

    public static function getDynamicTypes(int $threshold = 3) {
        $works_by_type = Work::countByType()->get();

        $total_works = $works_by_type->sum('count');

        // Filter types based on the threshold percentage
        $filtered_types = $works_by_type->filter(function ($type) use ($total_works, $threshold) {
            return ($type->count / $total_works) * 100 >= $threshold;
        });

        // Sum the count of types that do not pass the threshold
        $other_count = $works_by_type->whereNotIn('type', $filtered_types->pluck('type')->toArray())->sum('count');

        // Create a new collection with the filtered types and 'Other'
        $filtered_types->push(['type' => 'Other', 'count' => $other_count]);

        return $filtered_types;
    }

    /**
     * @param $orc_id_work
     * @return void
     */
    public function syncWithOrcId($orc_id_work): void {
        $work_summary = data_get($orc_id_work, 'work-summary');
        if (!is_null($work_summary) && sizeof($work_summary) > 0) {
            $this->source_title = data_get($work_summary[0], 'journal-title.value');
            $this->orcid_source = true;
            $this->orc_id_put_code = data_get($work_summary[0], 'put-code');
            $this->orc_id_url = Ids::formOrcIdUrl($work_summary[0]->path);
            $this->save();
        }
    }

    /**
     * @return void
     */
    public function syncWithDOI(): void {
        $doi_object = DOIAPI::doiRequest($this->doi);
        $this->subtype = $doi_object->type ?? null;
        $this->event = $doi_object->event ?? null;
        $this->abstract = isset($doi_object->abstract) ? (string)simplexml_load_string($doi_object->abstract, null, LIBXML_NOERROR, 'jats', true) : null;
        $this->is_referenced_by_count = data_get($doi_object, 'is-referenced-by-count') ?? null;
        $this->crossref_source = true;
        $this->save();
    }

    private function generateConcepts($concepts): void {
        foreach ($concepts as $concept) {
            $database_concept = Concept::existsByName($concept->display_name)->first();
            if (!$database_concept) {
                $database_concept = new Concept(['name' => $concept->display_name, 'open_alex_id' => $concept->id]);
                $database_concept->save();
            }

            (new WorkConcept(['work_id' => $this->id, 'concept_id' => $database_concept->id]))->save();
        }
    }
}
