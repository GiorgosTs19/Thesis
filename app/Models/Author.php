<?php

namespace App\Models;

use Exception;
use JetBrains\PhpStorm\ArrayShape;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use function App\Providers\rocketDump;
use App\Http\Controllers\APIController;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @method static updateOrCreate(array $array, array $array1)
 * @method static where(string $string, $orc_id)
 * @method static user()
 *
 * @property int id
 * @property string display_name
 * @property string open_alex_id
 * @property string orc_id
 * @property string scopus_id
 * @property boolean is_user
 * @property int cited_by_count
 * @property string works_url
 * @property string last_updated_date
 * @property string created_date
 * @property int $works_count
 */

class Author extends Model {
    use HasFactory;

    public static array $updateFields = ['id', 'open_alex_id','last_updated_date', 'cited_by_count', 'works_count'];
    /**
     * @var array|bool|mixed|string|null
     */
    private static mixed $author_works_base_url;
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

    public function __construct(array $attributes = []) {
        parent::__construct($attributes);
        self::$author_works_base_url = Config::get('openAlex.author_works_base_url');
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
     * @param $orc_id
     * The OpenAlex id to search an author with
     * @return array
     * An array that contains a boolean as its first element, indicating if an author with a matching id was found,
     *  and the author ( it they exist, otherwise null ) as its second element.
     */
    #[ArrayShape(['exists' => "mixed", 'author' => "mixed"])] public static function authorExists($open_alex_id, $orc_id): array {
        $author_query =  Author::where('open_alex_id',$open_alex_id)->orWhere('orc_id',$orc_id);
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
            $author = APIController::authorRequest($ids['open_alex_id'], 'open_alex');
        }
        try {
            $newAuthor = Author::updateOrCreate(
                [
                    'open_alex_id' => $ids['open_alex_id']
                ],
                ['scopus_id'=>$ids['scopus_id'] !== '' ? $ids['scopus_id'] :  null,
                    'cited_by_count' => property_exists($author,'cited_by_count') ? $author->cited_by_count : null,
                    'display_name' => $author->display_name,
                    'is_user' => $is_user,
                    'orc_id' => $ids['orc_id'],
                    'works_url'=>property_exists($author,'works_api_url') ? $author->works_api_url : self::$author_works_base_url.$ids['open_alex_id'],
                    'last_updated_date'=>property_exists($author,'updated_date') ? $author->updated_date : null,
                    'created_date'=>property_exists($author,'created_date') ? $author->created_date : null,
                    'works_count' => $author->works_count
                ]
            );

            Statistic::generateStatistics($newAuthor->id,$author->counts_by_year, self::class);

            if(!property_exists($author,'counts_by_year')) {
                return $newAuthor;
            }

        } catch (Exception $error) {
            rocketDump($error->getMessage(), 'error',[__FUNCTION__,__FILE__,__LINE__]);
        }
        return $newAuthor;
    }

    /**
     * Static Utility Function
     * @param $id
     * The id to be parsed
     * @param $author
     *  The author object to retrieve the id from ( only when an id is not provided ).
     * @return string|null
     */
    public static function parseOpenAlexId($id, $author=null): ?string {
        if($author !== null) {
            return property_exists($author->ids, 'openalex') ? explode('/', parse_url($author->ids->openalex, PHP_URL_PATH))[1] : null;
        }
        if(strlen($id) === 0)
            return null;
        $parsed_id = explode('/', parse_url($id, PHP_URL_PATH));
        if(!is_array($parsed_id))
            return $parsed_id;
        if(sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    /**
     * Static Utility Function
     * @param $id
     * The id to be parsed.
     * @param $author
     * The author object to retrieve the id from ( only when an id is not provided ).
     * @return string|null
     */
    public static function parseOrcId($id, $author=null): ?string {
        if($author !== null) {
            return property_exists($author->ids, 'orcid') ? explode('/', parse_url($author->orcid, PHP_URL_PATH))[1] : null;
        }
        if(strlen($id) === 0)
            return null;
        $parsed_id = explode('/', parse_url($id, PHP_URL_PATH));
        if(!is_array($parsed_id))
            return $parsed_id;
        if(sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    // Class utility functions

    /**
     * Static Utility Function
     * @param $id
     * The id to be parsed
     * @param $author
     * The author object to retrieve the id from ( only when an id is not provided ).
     * @return string|null
     */
    public static function parseScopusId($id, $author=null): ?string {
        if($author !== null) {
            return property_exists($author->ids, 'scopus') ? explode('=', explode('&',$author->ids->scopus)[0])[1] : null;
        }
        if(strlen($id) === 0)
            return null;
        $parsed_id = explode('=', explode('&',$id)[0]);
        if(!is_array($parsed_id))
            return $parsed_id;
        if(sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
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
     * Class Utility Function
     * Retrieves all the works ( or a specified number of them ) from the OpenAlex API and parses them,
     * saving all of them in the database, parsing all the authors associated with each one and creating a new author for any author that doesn't already exist.
     * It will also create an association for each work and for each of the authors that exist and are associated with them.
     */
    public function parseWorks($prev_count = 0, $page = 1): void {
        [$works, $meta, $works_count] = APIController::authorWorksRequest($this->open_alex_id, $page);
        $total_work_count = $meta->count;

        foreach ($works->generator() as $work) {
            // Check if a work with this title already exists in the database, if so proceed to the next one
            if(Work::workExistsByDoi(property_exists($work->ids,'doi')?$work->ids->doi:$work->open_access->oa_url))
                continue;

            // If not, create a new Work and save it to the database
            Work::createNewWork($work);
        }
        // Update the $have_been_parsed_count based on the works that have been parsed from this request to keep track of the total amount parsed.
        // This will allow us to check whether all the author's works have been fetched, processed and stored in our DB
        $have_been_parsed_count = $prev_count + $works_count;
        rocketDump($have_been_parsed_count.'/'.$total_work_count.' works parsed for '.$this->display_name, 'info', [__FUNCTION__,__FILE__,__LINE__]);

        // If an author has more works than the maximum count a request can fetch ( current max count is 200/request ),
        // then keep calling the function while incrementing the page parameter passed to the request,
        // until all the author's works have been parsed and stored.
        if($have_been_parsed_count < $total_work_count) {
            $this->parseWorks($have_been_parsed_count, ++$page);
        }
    }

    //

    public function associateAuthorToWork($work): void {
        if(!$this->associationExists($work->id)) {
            try {
                $newAuthorWork = new AuthorWork;
                $newAuthorWork->author_id = $this->id;
                $newAuthorWork->work_id = $work->id;
                $newAuthorWork->save();
            } catch (Exception $error) {
                rocketDump($error->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
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
        rocketDump($this->open_alex_id, 'info', [__FUNCTION__,__FILE__,__LINE__]);
        $requestAuthor = APIController::authorUpdateRequest($this->open_alex_id);

        if($requestAuthor->updated_date === $this->last_updated_date)
            return;
        try {
            if($this->cited_by_count !== $requestAuthor->cited_by_count) $this->cited_by_count = $requestAuthor->cited_by_count;
            if($this->works_count !== $requestAuthor->works_count) $this->works_count = $requestAuthor->works_count;

            $this->last_updated_date = $requestAuthor->updated_date;

            $this->save();
        } catch (Exception $exception) {
            rocketDump($exception->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
        }

        $year_to_update =  date('Y');
        $databaseStatistic = $this->statistics()
            ->where('year',$year_to_update)
            ->first();

        if (!$databaseStatistic) {
            $requestStatistic = Statistic::getCurrentYearsOpenAlexStatistic(Author::class, $requestAuthor->counts_by_year);
            Statistic::generateStatistic($this->id, $requestStatistic, Auth::class);
            return;
        }

        $databaseStatistic->updateStatistic($this, $requestAuthor->counts_by_year);
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
