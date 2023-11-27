<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Http;

class Author extends Model {
    use HasFactory, HasUuids;

    protected $fillable = [
        'display_name',
        'orc_id',
        'scopus_id',
        'open_alex_id',
        'cited_by_count',
        'is_user'
    ];

    public static function authorExistsByOrcId($orc_id, $shouldRetrieve = false) {
        $author_query = Author::where('orc_id',$orc_id);
        $author_exists = $author_query->exists();
        if($author_exists) {
            if(!$shouldRetrieve)
                return $author_exists;
            return $author_query->first();
        }
        return false;
    }

    public static function getAuthorDbIdByExternalId($external_id,$externalIdType ='orc_id') {
        return Author::where($externalIdType,$external_id)->first();
    }

    public function works(): BelongsToMany {
        return $this->belongsToMany(Work::class);
    }

    public function isUser() {
        return !!$this->is_user;
    }

    public function scopeOrcId($query, $id) {
        if($id !== '')
            return $query->orWhere('orc_id',$id);
        return $query;
    }

    public function parseWorks () {
        $works_response = Http::withOptions(['verify' => false])->get("https://api.openalex.org/works?filter=author.id:".$this->open_alex_id."&mailto=it185302@it.teithe.gr&per-page=5&page=1");
        $works = json_decode($works_response->body())->results;
        foreach ($works as $work) {
            $work_open_access = $work->open_access;
            $work_url = $work->doi ?? $work->open_access->oa_url ?? 'Empty';

            // Check if a work with this title already exists in the database, if so proceed to the next one
            if(Work::workExistsByDoi($work->doi))
                continue;

            // If not, create a new Work and save it to the database
            $newWork = new Work;
            $newWork->doi = $work_url;
            $newWork->title = $work->title;
            $newWork->publication_date = $work->publication_date;
            $newWork->language = $work->language;
            $newWork->type = $work->type;
            $newWork->is_oa = $work_open_access->is_oa;
            $newWork->open_alex_url = explode('/',$work->ids->openalex)[3];
            $newWork->save();

            $authors = [];
            $authorships = $work->authorships;
            foreach ($authorships as $authorship) {
                $author = $authorship->author;
                $authors = [...$authors, $author];
            }
                self::parseWorkAuthors($authors, $newWork);
            }

        return $works;
    }

    protected static function parseWorkAuthors($authors,$work) {
        foreach ($authors as $author) {
            $ids = ['open_alex_id' => self::parseOpenAlexId($author->id),
                'orc_id' => self::parseOrcId($author->orcid),
                'scopus_id'=> self::parseScopusId(property_exists($author, 'scopus') ? $author->scopus : '')];

            $db_Author = self::authorExistsByOpenAlexId($ids['open_alex_id'], true);
            if(!User::isAuthorAUserByOrcId($ids['orc_id']) && !(!!$db_Author))
                $newAuthor = Author::createAuthor($author,$ids);


            if(!AuthorWork::associationExists($work->id, $db_Author ? $db_Author->id : $newAuthor->id))
            $newAuthorWork = new AuthorWork;
            $newAuthorWork->author_id = $db_Author ? $db_Author->id : $newAuthor->id;
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

    public static function authorExistsByOpenAlexId($id, $shouldRetrieve = false) {
        $author_query =  Author::where('open_alex_id',$id);
        $author_exists = $author_query->exists();
        if($author_exists) {
            if(!$shouldRetrieve)
                return $author_exists;
            return $author_query->first();
        }
        return false;
    }

    public static function createAuthor($author, $ids, $is_user = false) {
        $newAuthor = new Author;
        $newAuthor->display_name = $author->display_name;
        $newAuthor->orc_id = $ids['orc_id'] !== '' ? $ids['orc_id'] : null;
        $newAuthor->open_alex_id = $ids['open_alex_id'] !== '' ? $ids['open_alex_id'] : null;
        $newAuthor->scopus_id = $ids['scopus_id'] !== '' ? $ids['scopus_id'] :  null;
        $newAuthor->cited_by_count = property_exists($author,'cited_by_count') ? $author->cited_by_count : null;
        $newAuthor->is_user = $is_user;
        $newAuthor->save();
        return $newAuthor;
    }
}
