<?php

namespace App\Models;

use App\Http\Controllers\OpenAlexAPI;
use App\Http\Controllers\OrcIdAPI;
use App\Utility\{Ids, ULog, WorkUtils};
use Exception;
use Illuminate\Database\{Eloquent\Factories\HasFactory,
    Eloquent\Model,
    Eloquent\Relations\BelongsToMany,
    Eloquent\Relations\HasOne,
    Eloquent\Relations\MorphMany};
use Illuminate\Support\{Facades\Auth, Facades\Config};

/**
 * @method static updateOrCreate(array $array, array $array1)
 * @method static user()
 * @method static find($id)
 * @method static mostWorks(int $int)
 * @method static name(mixed $query)
 * @method static searchName(mixed $query)
 * @method static mostCitations(int $int)
 * @method static where(string $external_id_name, $external_id)
 * @method static count()
 * @method static users()
 * @method static searchOpenAlex(mixed $open_alex, bool $exactMatch)
 * @method static searchScopus(mixed $scopus, bool $exactMatch)
 * @method static searchOrcId(mixed $orc_id, bool $exactMatch)
 * @method static notClaimed()
 *
 * @property int id
 * @property string orc_id
 * @property boolean is_user
 * @property string scopus_id
 * @property string works_url
 * @property int $works_count
 * @property int cited_by_count
 * @property string display_name
 * @property string created_date
 * @property string open_alex_id
 * @property string last_updated_date
 * @property string $biography
 */
class Author extends Model {
    use HasFactory;

    public static string $openAlexSource = 'OpenAlex';

    public static array $updateFields = [
        'id',
        'open_alex_id',
        'last_updated_date',
        'cited_by_count',
        'works_count',
        'orc_id'
    ];
    /**
     * @var array|bool|mixed|string|null
     */
    public static mixed $authorWorksBaseUrl;
    protected $fillable = [
        'display_name',
        'orc_id',
        'scopus_id',
        'open_alex_id',
        'cited_by_count',
        'is_user',
        'works_count',
        'created_date',
        'last_updated_at',
        'works_url'
    ];

    protected $casts = [
        'updated_at' => 'datetime:Y-m-d'
    ];

    protected $hidden = ['created_at', 'last_updated_date', 'created_date'];

    public function __construct(array $attributes = []) {
        parent::__construct($attributes);
        self::$authorWorksBaseUrl = Config::get('openAlex.author_works_base_url');
    }

    /**
     * Class Utility Function
     * @return bool
     * A boolean indicating if the author is also a user or not.
     */
    public function isUser(): bool {
        return !!$this->is_user;
    }

    /**
     * Scope
     * A local scope that can help filter out authors based on their "is_user" status.
     * @param $query - The query that the scope should be chained to ( injected automatically )'
     * @param $is_user - An optional parameter that can be passed to filter out the authors that are users or not,
     * "1" for authors that are also users and "0" for those who are not.
     * @return mixed
     */
    public function scopeUsers($query, int $is_user = 1): mixed {
        return $query->where('is_user', $is_user);
    }

    /**
     * Scope
     * A local scope that can help filter out authors based on their OpenAlex id.
     * @param $query - The query that the scope should be chained to ( injected automatically )'
     * @param $open_alex_id - The OpenAlex id of to search for.
     * @return mixed
     */
    public function scopeOpenAlex($query, string $open_alex_id): mixed {
        return $query->where('open_alex_id', $open_alex_id);
    }

    /**
     * @param $work
     * The work to be associated with the author.
     * @return Author The author associated, to allow for chaining methods.
     * Creates a row in the AuthorWorks table, associating the given work with an author.
     */
    public function associateToWork($work, $position): Author {
        if (!$this->associationExists($work->id)) {
            try {
                $new_author_work = new AuthorWork;
                $new_author_work->author_id = $this->id;
                $new_author_work->work_id = $work->id;
                $new_author_work->position = $position;
                $new_author_work->save();
            } catch (Exception $error) {
                ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
                return $this;
            }
        }
        return $this;
    }

    /**
     * @param $work_id
     * The work id to check the association for.
     * @return bool
     * A boolean indicating if an association between the author and the given work already exists in the database.
     */
    public function associationExists($work_id): bool {
        return AuthorWork::where('author_id', $this->id)->where('work_id', $work_id)->exists();
    }

    /**
     * Updates the author ( if any changes are detected on the OpenAlex's api response ).
     * It compares the update date on the response, to the local last_updated_date ( last updated on the OpenAlex's database since the last local update )
     * if the values are different, it will check for updates on the fields below and if any of them has changed, it will get updated:
     * - cited_by_count,
     * - works_count,
     * - counts_by_year ( only for the current year )
     * @return void
     */
    public function updateSelf(): void {
        $request_author = OpenAlexAPI::authorUpdateRequest($this->open_alex_id);

        if ($request_author->works_count !== $this->works_count) {
            ULog::log("New works found for $this->display_name");
            $this->parseWorks(0, 1, true);
        }

        $this->syncWithOrcId();

        if ($request_author->updated_date === $this->last_updated_date)
            return;

        try {
            $this->cited_by_count = $request_author->cited_by_count;
            $this->works_count = $request_author->works_count;
            $this->last_updated_date = $request_author->updated_date;

            $this->save();
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }

        $year_to_update = date('Y');
        $db_statistic = $this->statistics()
            ->where('year', $year_to_update)
            ->first();

        if (!$db_statistic) {
            $req_statistic = Statistic::getCurrentYearsOpenAlexStatistic(Author::class, $request_author->counts_by_year);
            if (!$req_statistic)
                return;
            Statistic::generateStatistic($this->id, $req_statistic, Auth::class);
            return;
        }
        $db_statistic->updateStatistic($this, $request_author->counts_by_year);
    }

    /**
     * @param int $prev_count
     * Keeps the amount of works already parsed ( used only if the function is called recursively, to keep track of parsed works ).
     * @param int $page
     * The page number used in the query ( used only if the function is called recursively, to fetch the next page of works )
     * @param bool $checkNew
     * A boolean indicating if the function should check for new works on the OpenAlex database.
     * If set to true, the function will only request works published in the current year,
     * Defaults to false.
     * @return void
     *  Retrieves all the works ( or a specified number of them ) from the OpenAlex API and parses them,
     *  stores them in the database, parses all the authors associated with each one and creates a new author entry for any of them that doesn't already exist.
     *  It will also create an association for each work and for each of the authors that exist and are associated with them.
     */
    public function parseWorks(int $prev_count = 0, int $page = 1, bool $checkNew = false): void {
        [$works, $meta, $works_count] = OpenAlexAPI::authorWorksRequest($this->open_alex_id, $page, false,
            $checkNew ? ['publication_year' => date('Y')] : []);
        $total_work_count = $meta->count;

        foreach ($works->generator() as $work) {
            // Check if a work with this title already exists in the database, if so proceed to the next one
            if (Work::openAlex($work->id)->exists())
                continue;

            // If not, create a new Work and save it to the database
            WorkUtils::createNewOAWork($work);
        }
        unset($works);
        // Update the $have_been_parsed_count based on the works that have been parsed from this request to keep track of the total amount parsed.
        // This will allow us to check whether all the author's works have been fetched, processed and stored in our DB
        $have_been_parsed = $prev_count + $works_count;
        ULog::memory();
        ULog::log($have_been_parsed . '/' . $total_work_count . ' works parsed for ' . $this->display_name);

        // If an author has more works than the maximum count a request can fetch ( current max count is 200/request ),
        // then keep calling the function while incrementing the page parameter passed to the request,
        // until all the author's works have been parsed and stored.
        if ($have_been_parsed < $total_work_count) {
            $this->parseWorks($have_been_parsed, ++$page, $checkNew);
        }
    }

    /**
     * Retrieve the author's works from OrcId, parse and store them in the database;
     * @return void
     */
    public function syncWithOrcId(): void {
        if (!$this->orc_id)
            return;
        $orc_id_response = OrcIdAPI::authorRequest($this->orc_id);
        $this->biography = $orc_id_response->biography;
        $this->save();
        WorkUtils::syncWorksOrcId($orc_id_response->works, $this->id);
    }

    /**
     * Relationship
     * @return MorphMany
     * All the cited_counts by year associated with an author.
     */
    public function statistics(): MorphMany {
        return $this->morphMany(Statistic::class, 'asset')->orderBy('year');
    }

    /**
     * A custom scope used to retrieve the authors with the highest works count.
     * @param $query
     * @param int $limit
     * @return mixed
     */
    public function scopeMostWorks($query, int $limit) {
        return $query->orderBy('works_count', 'desc')->limit($limit);
    }

    /**
     * A custom scope used to retrieve the authors with the highest citations count.
     * @param $query
     * @param int $limit
     * @return mixed
     */
    public function scopeMostCitations($query, int $limit) {
        return $query->orderBy('cited_by_count', 'desc')->limit($limit);
    }

    /**
     * A custom scope used to search authors by their name.
     * @param $query
     * @param $name
     * @return mixed
     */
    public function scopeSearchName($query, $name) {
        return $query->where('display_name', $name)->orWhere('display_name', 'LIKE', "%$name%");
    }

    /**
     * A custom scope used to search authors by their Scopus external ids.
     * @param $query
     * @param $scopus_id - The scopus id to search for.
     * @param bool $exactMatch - A boolean to indicate whether the query should match the result exactly.
     * @return mixed
     */
    public function scopeSearchScopus($query, $scopus_id, bool $exactMatch = false) {
        if ($exactMatch) {
            if (empty($scopus_id))
                return $query;
            return $query->where(Ids::SCOPUS_ID, $scopus_id);
        }
        return $query->orWhere(Ids::SCOPUS_ID, $scopus_id)->orWhere('scopus_id', 'LIKE', "%$scopus_id%");
    }

    /**
     * A custom scope used to search authors by their OrcId external ids.
     * @param $query
     * @param $orc_id - The ORCID id to search for.
     * @param bool $exactMatch - A boolean to indicate whether the query should match the result exactly.
     * @return mixed
     */
    public function scopeSearchOrcId($query, $orc_id, bool $exactMatch = false) {
        if ($exactMatch) {
            if (empty($orc_id))
                return $query;
            return $query->where(Ids::ORC_ID_ID, $orc_id);
        }
        return $query->orWhere(Ids::ORC_ID_ID, $orc_id)->orWhere(Ids::ORC_ID_ID, 'LIKE', "%$orc_id%");
    }


    /**
     * A custom scope used to search authors by their Open Alex external ids.
     * @param $query
     * @param $open_alex_id - The OpenAlex id to search for.
     * @param bool $exactMatch - A boolean to indicate whether the query should match the result exactly.
     * @return mixed
     */
    public function scopeSearchOpenAlex($query, $open_alex_id, bool $exactMatch = false) {
        if ($exactMatch) {
            if (empty($open_alex_id)) {
                return $query;
            }
            return $query->where(Ids::OPEN_ALEX_ID, $open_alex_id);
        }
        return $query->orWhere(Ids::OPEN_ALEX_ID, $open_alex_id)->orWhere(Ids::OPEN_ALEX_ID, 'LIKE', "%$open_alex_id%");
    }

    /**
     * Relationship
     * @return BelongsToMany
     * All the groups the author belongs to.
     */
    public function groups(): BelongsToMany {
        return $this->belongsToMany(Group::class, 'author_group');
    }

    /**
     * Relationship
     * @return BelongsToMany
     * All the works associated with the author.
     */
    public function works(): BelongsToMany {
        return $this->belongsToMany(Work::class, 'author_work');
    }

    public function user(): HasOne {
        return $this->hasOne(User::class);
    }

    public function scopeNotClaimed($query) {
        return $query->doesntHave('user');
    }
}
