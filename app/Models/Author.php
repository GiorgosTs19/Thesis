<?php

namespace App\Models;

use Exception;
use App\Utility\{Ids, ULog, SystemManager};
use JetBrains\PhpStorm\ArrayShape;
use Illuminate\Support\{Facades\Auth, Facades\Config};
use App\Http\Controllers\APIController;
use Illuminate\Database\{Eloquent\Model,
    Eloquent\Relations\MorphMany,
    Eloquent\Factories\HasFactory,
    Eloquent\Relations\BelongsToMany};

/**
 * @method static updateOrCreate(array $array, array $array1)
 * @method static where(string $string, $orc_id)
 * @method static user()
 * @method static find($id)
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
 */

class Author extends Model {
    use HasFactory;

    public static array $UPDATE_FIELDS = [
        'id',
        'open_alex_id',
        'last_updated_date',
        'cited_by_count',
        'works_count'
    ];
    /**
     * @var array|bool|mixed|string|null
     */
    private static mixed $AUTHOR_WORKS_BASE_URL;
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
        'updated_at'=>'datetime:Y-m-d'
    ];

    protected $hidden = ['created_at', 'last_updated_date', 'created_date'];

    public function __construct(array $attributes = []) {
        parent::__construct($attributes);
        self::$AUTHOR_WORKS_BASE_URL = Config::get('openAlex.author_works_base_url');
    }

    /**
     * Static Utility Function
     * @param $external_id
     * The external id to search the author with
     * @param string $external_id_name
     * The name of the external id that will be provided to search for the user
     * ( defaults to "orc_id" ).
     * Accepted external ids : "orc_id", "scopus_id", "open_alex_id"
     * @return mixed
     * The author if they exist.
     */
    public static function getAuthorDbIdByExternalId($external_id, string $external_id_name ='orc_id'): mixed {
        return Author::where($external_id_name,$external_id)->first();
    }

    /**
     * @param $open_alex_id
     * The OpenAlex id to search an author with
     * @return array
     * An array that contains a boolean as its first element, indicating if an author with a matching id was found,
     *  and the author ( it they exist, otherwise null ) as its second element.
     */
    #[ArrayShape(['exists' => "mixed", 'author' => "mixed"])] public static function authorExists($open_alex_id): array {
        $author_query =  Author::where(Ids::OPEN_ALEX_ID,$open_alex_id);
        $author_exists = $author_query->exists();
        return ['exists'=>(boolean)$author_exists, 'author'=>$author_query->first()];
    }

    /**
     * Static Utility Function
     * @param $author
     * An author object straight from the response of an OpenAlex api call.
     * @param array $ids
     * An associative array of the available ids of the author ( ?orc_id, ?open_alex_id, ?scopus_id )
     * @param bool $is_user
     * A boolean indicating if the new author is also a user.
     * @return Author|null
     * The newly created author.
     */
    public static function createAuthor($author, array $ids = [], bool $is_user = false): ?Author {
        $newAuthor = new Author;
        if(!$is_user) {
            $author = APIController::authorRequest($ids[Ids::OPEN_ALEX_ID]);
        }
        try {
            // If an author with this OpenAlex id already exists, update them,
            // in any other case, create a new entry.
            $newAuthor = Author::updateOrCreate(
                [Ids::OPEN_ALEX_ID => $ids[Ids::OPEN_ALEX_ID]],
                [
                    Ids::SCOPUS_ID => $ids[Ids::SCOPUS_ID] ??  null,
                    Ids::ORC_ID_ID => $ids[Ids::ORC_ID_ID] ?? null,
                    'cited_by_count' => property_exists($author,'cited_by_count') ? $author->cited_by_count : null,
                    'display_name' => $author->display_name,
                    'is_user' => $is_user,
                    'works_url'=>property_exists($author,'works_api_url') ? $author->works_api_url : self::$AUTHOR_WORKS_BASE_URL.$ids['open_alex_id'],
                    'last_updated_date'=>property_exists($author,'updated_date') ? $author->updated_date : null,
                    'created_date'=>property_exists($author,'created_date') ? $author->created_date : null,
                    'works_count' => $author->works_count
                ]
            );

            if(!property_exists($author,'counts_by_year')) {
                return $newAuthor;
            }

            Statistic::generateStatistics($newAuthor->id,$author->counts_by_year, self::class);
        } catch (Exception $error) {
            ULog::error($error->getMessage(),SystemManager::LOG_META);
        }
        return $newAuthor;
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
     * Relationship
     * @return BelongsToMany
     * All the works associated with the author.
     */
    public function works(): BelongsToMany {
        return $this->belongsToMany(Work::class);
    }

    /**
     * Scope
     * A local scope that can help filter out authors based on their "is_user" status.
     * @param $query - The query that the scope should be chained to ( injected automatically )'
     * @param $is_user - An optional parameter that can be passed to filter out the authors that are users or not,
     * "1" for authors that are also users and "0" for those who are not.
     * @return mixed
     */
    public function scopeUser($query, int $is_user = 1): mixed{
        return $query->where('is_user',$is_user);
    }

    /**
     * Scope
     * A local scope that can help filter out authors based on their OpenAlex id.
     * @param $query - The query that the scope should be chained to ( injected automatically )'
     * @param $open_alex_id - The OpenAlex id of to search for.
     * @return mixed
     */
    public function scopeOpenAlex($query, string $open_alex_id): mixed{
        return $query->where('open_alex_id',$open_alex_id);
    }

    /**
     * @param $work
     * The work to be associated with the author.
     * @return void
     * Creates a row in the AuthorWorks table, associating the given work with an author.
     */
    public function associateAuthorToWork($work): void {
        if(!$this->associationExists($work->id)) {
            try {
                $newAuthorWork = new AuthorWork;
                $newAuthorWork->author_id = $this->id;
                $newAuthorWork->work_id = $work->id;
                $newAuthorWork->save();
            } catch (Exception $error) {
                ULog::error($error->getMessage(), ULog::META);
            }
        }
    }

    /**
     * @param $work_id
     * The work id to check the association for.
     * @return bool
     * A boolean indicating if an association between the author and the given work already exists in the database.
     */
    public function associationExists($work_id): bool {
        return AuthorWork::where('author_id',$this->id)->where('work_id',$work_id)->exists();
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

        $requestAuthor = APIController::authorUpdateRequest($this->open_alex_id);

        if($requestAuthor->works_count !== $this->works_count) {
            ULog::log("New works found for $this->display_name");
            $this->parseWorks(0, 1, true);
        }

        if($requestAuthor->updated_date === $this->last_updated_date)
            return;

        try {
            $this->cited_by_count = $requestAuthor->cited_by_count;
            $this->works_count = $requestAuthor->works_count;
            $this->last_updated_date = $requestAuthor->updated_date;

            $this->save();
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
        }

        $year_to_update =  date('Y');
        $databaseStatistic = $this->statistics()
            ->where('year',$year_to_update)
            ->first();

        if (!$databaseStatistic) {
            $requestStatistic = Statistic::getCurrentYearsOpenAlexStatistic(Author::class, $requestAuthor->counts_by_year);
            if(!$requestStatistic)
                return;
            Statistic::generateStatistic($this->id, $requestStatistic, Auth::class);
            return;
        }

        $databaseStatistic->updateStatistic($this, $requestAuthor->counts_by_year);
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
        [$works, $meta, $works_count] = APIController::authorWorksRequest($this->open_alex_id, $page, false,
        $checkNew ? ['publication_year'=>date('Y')] : []);
        $total_work_count = $meta->count;

        foreach ($works->generator() as $work) {
            // Check if a work with this title already exists in the database, if so proceed to the next one
            if(Work::openAlex($work->id)->exists())
                continue;

            // If not, create a new Work and save it to the database
            Work::createNewWork($work);
        }
        // Update the $have_been_parsed_count based on the works that have been parsed from this request to keep track of the total amount parsed.
        // This will allow us to check whether all the author's works have been fetched, processed and stored in our DB
        $have_been_parsed_count = $prev_count + $works_count;
        ULog::log($have_been_parsed_count.'/'.$total_work_count.' works parsed for '.$this->display_name);

        // If an author has more works than the maximum count a request can fetch ( current max count is 200/request ),
        // then keep calling the function while incrementing the page parameter passed to the request,
        // until all the author's works have been parsed and stored.
        if($have_been_parsed_count < $total_work_count) {
            $this->parseWorks($have_been_parsed_count, ++$page, $checkNew);
        }
    }

    /**
     * Relationship
     * @return MorphMany
     * All the cited_counts by year associated with an author.
     */
    public function statistics(): MorphMany {
        return $this->morphMany(Statistic::class, 'asset')->orderBy('year');
    }
}
