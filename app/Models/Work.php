<?php

namespace App\Models;

use App\Http\Controllers\DOIAPI;
use App\Http\Controllers\OpenAlexAPI;
use App\Utility\AuthorUtils;
use App\Utility\Ids;
use App\Utility\ULog;
use App\Utility\WorkUtils;
use Closure;
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
 * @property mixed $type_id
 *
 * @method static openAlex($id)
 * @method static mostCitations(int $int)
 * @method static searchTitle(mixed $query)
 * @method static countByType()
 * @method static whereIn(string $string, Collection $uniqueWorkIds)
 * @method static where(string $string, mixed $mixed)
 * @method static find(int $int)
 * @method static doi(string|null $work_doi)
 * @method static source(string $source)
 * @method static min(string $string)
 * @method static max(string $string)
 * @method static distinct()
 * @method static whereHas(string $string, Closure $param)
 */
class Work extends Model {
    use HasFactory;

    public static string $openAlexSource = 'OpenAlex';
    public static string $orcIdSource = 'ORCID';
    public static string $crossRefSource = 'Crossref';
    public static string $aggregateSource = 'Aggregate';
    public static string $unknownLanguageCode = '-';
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
        'authors_string', 'is_oa', 'last_updated_date', 'created_date'];

    protected $hidden = ['last_updated_date', 'created_date', 'created_at'];

    /**
     * Static Utility Function
     * @param $authorObjects
     * An array of authors to be associated with the given work
     * @return void
     * Associates the given authors with the work. Creates AuthorWorks records.
     */
    public function parseAuthors($authorObjects): void {
        foreach ($authorObjects as $index => $author_object) {
            $author_ids = Ids::extractIds($author_object->author);

            // Check if an author is a user.
            $author_is_user = User::authorIsUser($author_ids[Ids::OPEN_ALEX_ID])['exists'];

            $new_author = null;
            // Check if an author exists by their Open Alex id or their OrcId
            ['exists' => $db_author_exists, 'author' => $new_author] = AuthorUtils::authorExists($author_ids[Ids::OPEN_ALEX_ID]);

            if (!$author_is_user && !$db_author_exists)
                $new_author = AuthorUtils::createOAAuthor($author_object->author, $author_ids);

            $new_author->associateToWork($this, $index + 1);
        }
    }

    /**
     * @return Collection - An array of strings containing the sources from which the info for this work came from.
     */
    public function versions(): Collection {
        if (!$this->doi)
            return collect();
        return Work::with(['authors'])->where('doi', $this->doi)->whereNotIn('id', [$this->id])->get();
    }

    /**
     * @param $query - The query object.
     * @param $source - The source to use for filtering.
     * @param bool $or - A boolean to indicate whether the "where" statement should be used with an "or" or "and" prefix.
     * @return bool
     * A boolean indicating if a work with the given doi exists in the database.
     */
    public static function scopeSource($query, $source, bool $or = false) {
        if (!in_array($source, [Work::$openAlexSource, Work::$orcIdSource, Work::$crossRefSource, Work::$aggregateSource]))
            return $query;
        return $or ? $query->orWhere('source', $source) : $query->where('source', $source);
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
        $this->type = WorkUtils::getCustomType($this->type);

        if ($this->source === self::$aggregateSource)
            return;

        match ($this->source) {
            self::$openAlexSource => $this->updateSelfOpenAlex(),
            self::$orcIdSource => $this->updateSelfORCID(),
            self::$crossRefSource => $this->updateSelfCrossref()
        };
    }

    /**
     * Updates the current instance with data from the OpenAlex API.
     *
     * This function fetches updated work data from the OpenAlex API using the
     * instance's external ID. If the data has been updated since the last check,
     * it updates the local instance with the new citation count, open access status,
     * and last updated date. It also handles the statistics for the current year,
     * ensuring they are up-to-date.
     *
     * @return void
     * @throws Exception If there is an error during the API call or data update process.
     */
    private function updateSelfOpenAlex() {
        $request_work = OpenAlexAPI::workUpdateRequest($this->external_id);

        $should_update = $request_work->updated_date !== $this->last_updated_date;
        if (!$should_update)
            return;

        try {
            $this->is_referenced_by_count = $request_work->cited_by_count;
            $this->is_oa = $request_work->open_access->is_oa;
            $this->last_updated_date = $request_work->updated_date;
            $this->save();
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
        } catch (Exception $error) {
            ULog::error("Failed to updated Work $this->id from OPENALEX" . $error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }

    /**
     * Updates the current instance with data from the ORCID API.
     *
     * This function is intended to fetch and update work data from the ORCID API using the
     * instance's external ID. The implementation is currently commented out and needs to be
     * completed.
     *
     * @return void
     */
    private function updateSelfORCID(): void {
        try {
//        $orc_id_work = OrcIdAPI::workRequest($this->external_id);
        } catch (Exception $error) {
            ULog::error("Failed to updated Work $this->id from ORCID" . $error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }

    /**
     * Updates the current instance with data from the Crossref API.
     *
     * This function fetches updated work data from the Crossref API using the
     * instance's DOI. It updates the local instance with the new citation count.
     *
     * @return void
     * @throws Exception If there is an error during the API call or data update process.
     */
    private function updateSelfCrossref(): void {
        try {
            $doi_work = DOIAPI::workRequest($this->doi);
            $this->is_referenced_by_count = data_get($doi_work, 'is-referenced-by-count') ?? null;
            $this->save();
        } catch (Exception $error) {
            ULog::error("Failed to updated Work $this->id from Crossref" . $error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }

    /**
     * Retrieve the aggregated version of the current work ( if it exists )
     * @return Work|null
     */
    public function getAggregateVersion(): ?Work {
        return Work::source(self::$aggregateSource)->doi($this->doi)->first();
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

    public function scopeMinCitations($query, $min_citations) {
        if (!$min_citations)
            return $query;
        return $query->where('is_referenced_by_count', '>=', $min_citations);
    }

    public function scopeMaxCitations($query, $max_citations) {
        if (!$max_citations)
            return $query;
        return $query->where('is_referenced_by_count', '<=', $max_citations);
    }

    public function scopeFromPublicationYear($query, $from_year) {
        if (!$from_year)
            return $query;
        return $query->where('publication_year', '>=', $from_year)->orWhereNull('publication_year');
    }

    public function scopeToPublicationYear($query, $to_year) {
        if (!$to_year)
            return $query;
        return $query->where('publication_year', '<=', $to_year)->orWhereNull('publication_year');
    }

    public function scopeSources($query, $sources) {
        if (!$sources || sizeof($sources) === 0)
            return $query;
        return $query->whereIn('source', $sources);
    }

    public function scopeTypes($query, $types) {
        if (!$types || sizeof($types) === 0)
            return $query;
        return $query->whereIn('type', $types);
    }

    public function scopeCustomType($query, $custom_type) {
        if (!$custom_type)
            return $query;
        return $query->where('type_id', $custom_type);
    }

    public function scopeOrder($query, $col, $direction) {
        if (!$col)
            return $query->orderBy('id', $direction);
        return $query->orderBy($col, $direction);
    }

    public function generateConcepts($concepts): void {
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
