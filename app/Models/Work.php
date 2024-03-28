<?php

namespace App\Models;

use App\Http\Controllers\DOIAPI;
use App\Http\Controllers\OpenAlexAPI;
use App\Http\Controllers\OrcIdAPI;
use App\Utility\Ids;
use App\Utility\ULog;
use Exception;
use Illuminate\Database\Eloquent\{Factories\HasFactory, Model, Relations\BelongsToMany, Relations\MorphMany};
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

/**
 * @property integer $id
 * @property string doi
 * @property string type
 * @property string title
 * @property boolean is_oa
 * @property string language
 * @property string created_date
 * @property int publication_year
 * @property string source_url
 * @property string external_id
 * @property string last_updated_date
 * @property string $source_title
 * @property string $subtype
 * @property string $event
 * @property string $abstract
 * @property int $is_referenced_by_count
 * @property string source
 * @property string $authors_string
 *
 * @method static openAlex($id)
 * @method static mostCitations(int $int)
 * @method static searchTitle(mixed $query)
 * @method static countByType()
 * @method static whereIn(string $string, Collection $uniqueWorkIds)
 * @method static where(string $string, mixed $mixed)
 * @method static find(int $int)
 * @method static doi(string|null $work_doi)
 */
class Work extends Model {
    use HasFactory;

    public static string $openAlexSource = 'OpenAlex';
    public static string $orcIdSource = 'ORCID';
    public static string $crossRefSource = 'Crossref';
    public static string $aggregatedSource = 'Aggregated';

    public const SORTING_OPTIONS = [
        ['name' => 'Citations ( Ascending )', 'value' => 0, 'default' => false],
        ['name' => 'Citations ( Descending )', 'value' => 1, 'default' => true],
        ['name' => 'Alphabetically (A to Z)', 'value' => 2, 'default' => false],
        ['name' => 'Alphabetically (Z to A)', 'value' => 3, 'default' => false],
        ['name' => 'Oldest', 'value' => 4, 'default' => false],
        ['name' => 'Newest', 'value' => 5, 'default' => false],
    ];
    const AUTHOR_WORKS_TABLE = 'author_work';

    public static array $updateFields = ['id', 'open_alex_id', 'last_updated_date', 'is_oa', 'cited_by_count'];

    protected $fillable = ['doi', 'title', 'publication_year', 'language', 'type',
        'subtype', 'abstract', 'source_title', 'source_url', 'external_id', 'event',
        'is_oa', 'last_updated_date', 'created_date'];

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
            $new_work->is_referenced_by_count = $work->cited_by_count;
            $new_work->language = $work->language ?? 'Unknown';
            $new_work->type = $work->type;
            $new_work->is_oa = $work_open_access->is_oa;
            $new_work->external_id = Ids::parseOpenAlexId($work->ids->openalex);
            $new_work->source_url = $work->ids->openalex;
            $new_work->last_updated_date = $work->updated_date;
            $new_work->created_date = $work->created_date;
            $new_work->source = self::$openAlexSource;
            $new_work->save();

            // Generate the counts_by_year statics for the work
            Statistic::generateStatistics($new_work->id, $work->counts_by_year, self::class);

            // Associate all authors from the array with the work being processed
            $new_work->parseAuthors($work->authorships);
            $new_work->generateConcepts($work->concepts);
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }

    /**
     * Creates a new work from an orc id api response.
     *
     * @param $work_path
     * A work object straight from an OrcId API call response.
     * @return void
     * The newly created work.
     */
    public static function createNewOIWork($work_path, $doi): void {
        if (Work::where('doi', $doi)->where('source', Work::$orcIdSource))
            return;
        $new_orc_id_work = new Work;

        try {
            $orc_id_work = OrcIdAPI::workRequest($work_path);


            $new_orc_id_work->doi = $doi;
            $new_orc_id_work->title = data_get($orc_id_work, 'title.title.value') ?? '';
            $new_orc_id_work->publication_year = data_get($orc_id_work, 'publication-date.year.value');
            $new_orc_id_work->source_title = data_get($orc_id_work, 'journal-title.value');
            $new_orc_id_work->language = null;
            $new_orc_id_work->type = property_exists($orc_id_work, 'type') ? $orc_id_work->type : 'Unknown';
            $new_orc_id_work->event = null;
            $new_orc_id_work->is_oa = property_exists($orc_id_work, 'visibility') && $orc_id_work->visibility === 'public';
            $new_orc_id_work->external_id = $work_path;
            $new_orc_id_work->source_url = $doi;
            $new_orc_id_work->is_referenced_by_count = null;
            $new_orc_id_work->last_updated_date = null;
            $new_orc_id_work->subtype = null;
            $new_orc_id_work->created_date = null;
            $new_orc_id_work->source = self::$orcIdSource;
            $new_orc_id_work->save();


            $db_work_authors = AuthorWork::where('work_id', Work::where('doi', $doi)->source(Work::$openAlexSource)->first()->id)->get();

            if (sizeof($db_work_authors) > 0) {
                foreach ($db_work_authors as $author_entry) {
                    Author::find($author_entry->author_id)->associateToWork($new_orc_id_work, $author_entry->position);
                }
            } else {
                $authors_array = data_get($orc_id_work, 'contributors.contributor');
                $authors_string = '';
                foreach ($authors_array as $author) {
                    $authors_string .= data_get($author, 'credit-name');
                }
                $new_orc_id_work->authors_string = $authors_string;
            }
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
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

            $new_author->associateToWork($this, $index);
        }
    }

    /**
     * @return Collection - An array of strings containing the sources from which the info for this work came from.
     */
    public function versions(): Collection {
        if (!$this->doi)
            return collect([]);
        return Work::with(['authors'])->where('doi', $this->doi)->whereNotIn('id', [$this->id])->get();
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
     * @param $doi
     * The doi of the work to search against.
     * @return bool
     * A boolean indicating if a work with the given doi exists in the database.
     */
    public static function scopeSource($query, $source) {
        if (!in_array($source, [Work::$openAlexSource, Work::$orcIdSource, Work::$crossRefSource]))
            return $query;
        return $query->where('source', $source);
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
        return $query->orderBy('is_referenced_by_count', 'desc')->limit($limit)->get();
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
        if ($this->source !== self::$openAlexSource)
            return;
        $request_work = OpenAlexAPI::workUpdateRequest($this->external_id);

        $should_update = $request_work->updated_date !== $this->last_updated_date;
        if (!$should_update)
            return;

        try {
            $this->is_referenced_by_count = $request_work->cited_by_count;
            $this->is_oa = $request_work->open_access->is_oa;
            $this->last_updated_date = $request_work->updated_date;
            $this->save();
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
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
                ULog::log("No statistics were found for $this->id for the year $year_to_update ");
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
                'id' => $query->orWhere('external_id', $id),
                'url' => $query->orWhere('source_url', $id)
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
        return $query->orWhere('external_id', $open_alex_id);
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
     * @param string $doi
     * @return Work
     */
    public static function syncWithDOI(string $doi): Work {
        $doi_object = DOIAPI::doiRequest($doi);

        $new_work = new Work();
        $new_work->doi = $doi;
        $new_work->title = $doi_object->title;
        $new_work->type = $doi_object->type;
        $new_work->publication_year = data_get($doi_object, 'published-online.date-parts')[0];
        $new_work->source_title = null;
        $new_work->source_url = Ids::toDxDoiUrl($doi);
        $new_work->external_id = Ids::extractDoiFromUrl($doi);
        $new_work->is_oa = false;
        $new_work->language = $doi_object->language;
        $new_work->abstract = isset($doi_object->abstract) ? (string)simplexml_load_string($doi_object->abstract, null, LIBXML_NOERROR, 'jats', true) : null;
        $new_work->subtype = $doi_object->type ?? null;
        $new_work->event = $doi_object->event ?? null;
        $new_work->is_referenced_by_count = data_get($doi_object, 'is-referenced-by-count') ?? null;
        $new_work->source = self::$crossRefSource;
        $new_work->save();

        return $new_work;
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
