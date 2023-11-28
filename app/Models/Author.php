<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Http;

class Author extends Model {
    use HasFactory, HasUuids;

    // Limits the number of works that will be fetched for each author
    protected $perPage = 5;
    // Basically retrieve the first $perPage number of works ( based on a default sorting )
    protected int $page = 1;
    // An email is required for the OpenAlex api to function correctly.
    protected string $mailTo = 'it185302@it.teithe.gr';

    protected $fillable = [
        'display_name',
        'orc_id',
        'scopus_id',
        'open_alex_id',
        'cited_by_count',
        'is_user'
    ];

    /**
     * @param $orc_id
     * @return array
     * A key-value pair array with an "exists" key indicating if the author requested exists,
     *  an "author" key that will include the author ( if they exist ).
     */
    public static function authorExistsByOrcId($orc_id) {
        $author_query = Author::where('orc_id',$orc_id);
        $author_exists = $author_query->exists();
        return ['exists'=>$author_exists, 'author'=>$author_query->first()];
    }

    /**
     * @param $external_id
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
     * Returns all the works associated with an author.
     * @return BelongsToMany
     */
    public function works(): BelongsToMany {
        return $this->belongsToMany(Work::class);
    }

    /**
     * Returns a boolean indicating if the author is also a user or not.
     * @return bool
     */
    public function isUser(): bool {
        return !!$this->is_user;
    }

    /**
     * A local scope that can help filter out authors based on their "is_user" status.
     * @param $query 'The query that the scope should be chained to ( injected automatically )'
     * @param $is_user 'An optional parameter that can be passed to filter out the authors that are users or not,
     * "1" for authors that are also users and "0" for those who are not.
     * @return mixed
     */
    public function scopeUser($query, int $is_user = 1): mixed{
        return $query->where('is_user',$is_user);
    }

    /**
     * Retrieves all the works ( or a specified number of them ) from the OpenAlex API and parses them,
     * saving all of them in the database, parsing all the authors associated with each one and creating a new author for any author that doesn't already exist.
     * It will also create an association for each work and for each of the authors that exist and are associated with them.
     */
    public function parseWorks () {
        $url = "https://api.openalex.org/works?filter=author.id:".$this->open_alex_id.
            "&mailto=".$this->mailTo."&per-page=".$this->perPage."&page=".$this->page;
        $works_response = Http::withOptions(['verify' => false])->get($url);
        $works = json_decode($works_response->body())->results;
        foreach ($works as $work) {
            // Check if a work with this title already exists in the database, if so proceed to the next one
            if(Work::workExistsByDoi($work->doi))
                continue;

            // If not, create a new Work and save it to the database
            $newWork = Work::createNewWork($work);

            $authors = [];
            $authorships = $work->authorships;
            foreach ($authorships as $authorship) {
                $author = $authorship->author;
                $authors = [...$authors, $author];
            }
                self::parseWorkAuthors($authors, $newWork);
            }
        var_dump(sizeof($works).' works have been saved for '.$this->display_name);
    }

    protected static function parseWorkAuthors($authors,$work) {
        foreach ($authors as $author) {
            $ids = ['open_alex_id' => self::parseOpenAlexId($author->id),
                'orc_id' => self::parseOrcId($author->orcid),
                'scopus_id'=> self::parseScopusId(property_exists($author, 'scopus') ? $author->scopus : '')];

            ['exists' => $db_author_exists, 'author' => $db_Author] = self::authorExistsByOpenAlexId($ids['open_alex_id']);
            if(!User::isAuthorAUserByOrcId($ids['orc_id'])['exists'] && !$db_Author)
                $newAuthor = Author::createAuthor($author,$ids);


            if(!AuthorWork::associationExists($work->id, $db_author_exists ? $db_Author->id : $newAuthor->id))
            $newAuthorWork = new AuthorWork;
            $newAuthorWork->author_id = $db_author_exists ? $db_Author->id : $newAuthor->id;
            $newAuthorWork->work_id = $work->id;
            $newAuthorWork->save();
        }
    }

    public static function parseOpenAlexId($id, $author=null) {
        if($author)
            return property_exists($author->ids, 'openalex') ? explode('/', parse_url($author->ids->openalex, PHP_URL_PATH))[1] : '';
        if($id === '')
            return '';
        $parsed_id = explode('/', parse_url($id, PHP_URL_PATH));
        if(!is_array($parsed_id))
            return $parsed_id;
        if(sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    public static function parseOrcId($id, $author=null) {
        if($author)
            return property_exists($author->ids, 'orcid') ? explode('/', parse_url($author->orcid, PHP_URL_PATH))[1] : '';
        if($id === '')
            return '';
        $parsed_id = explode('/', parse_url($id, PHP_URL_PATH));
        if(!is_array($parsed_id))
            return $parsed_id;
        if(sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    public static function parseScopusId($id, $author=null) {
        if($author)
            return property_exists($author->ids, 'scopus') ? explode('=', explode('&',$author->ids->scopus)[0])[1] : '';
        if($id === '')
            return '';
        $parsed_id = explode('=', explode('&',$id)[0]);
        if(!is_array($parsed_id))
            return $parsed_id;
        if(sizeof($parsed_id) === 1)
            return $parsed_id[0];
        return $parsed_id[1];
    }

    /**
     * @param $open_alex_id
     * @return array 'A key-value pair array with an "exists" key indicating if the author requested exists,
     *  an "author" key that will include the author ( if they exist ).
     */
    public static function authorExistsByOpenAlexId($open_alex_id) {
        $author_query =  Author::where('open_alex_id',$open_alex_id);
        $author_exists = $author_query->exists();
        return ['exists'=>$author_exists, 'author'=>$author_query->first()];
    }

    /**
     * @param $author
     * An author object straight from the response of an OpenAlex api call.
     * @param $ids
     * An associative array of the available ids of the author ( ?orc_id, ?open_alex_id, ?scopus_id )
     * @param bool $is_user
     * A boolean indicating if the new author is also a user.
     * @return Author
     * The newly created author.
     */
    public static function createAuthor($author, $ids, bool $is_user = false): Author {
        $newAuthor = new Author;
        $newAuthor->display_name = $author->display_name;
        $newAuthor->orc_id = $ids['orc_id'] !== '' ? $ids['orc_id'] : null;
        $newAuthor->open_alex_id = $ids['open_alex_id'] !== '' ? $ids['open_alex_id'] : null;
        $newAuthor->scopus_id = $ids['scopus_id'] !== '' ? $ids['scopus_id'] :  null;
        $newAuthor->cited_by_count = property_exists($author,'cited_by_count') ? $author->cited_by_count : null;
        $newAuthor->is_user = $is_user;
        $newAuthor->save();
        var_dump("Author ".$newAuthor->display_name." has been created");
        return $newAuthor;
    }
}
