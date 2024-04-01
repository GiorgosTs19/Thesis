<?php

namespace App\Utility;

use App\Http\Controllers\OpenAlexAPI;
use App\Models\Author;
use App\Models\Statistic;
use Exception;
use JetBrains\PhpStorm\ArrayShape;

class AuthorUtils {
    /**
     * @param $open_alex_id
     * The OpenAlex id to search an author with
     * @return array
     * An array that contains a boolean as its first element, indicating if an author with a matching id was found,
     *  and the author ( it they exist, otherwise null ) as its second element.
     */
    #[ArrayShape(['exists' => "mixed", 'author' => "mixed"])] public static function authorExists($open_alex_id): array {
        $author_query = Author::where(Ids::OPEN_ALEX_ID, $open_alex_id);
        $author_exists = $author_query->exists();
        return ['exists' => (boolean)$author_exists, 'author' => $author_query->first()];
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
    public static function createOAAuthor($author, array $ids = [], bool $is_user = false): ?Author {
        $new_author = new Author;
        if (!$is_user) {
            $author = OpenAlexAPI::authorRequest($ids[Ids::OPEN_ALEX_ID]);
        }
        try {
            // If an author with this OpenAlex id already exists, update them,
            // in any other case, create a new entry.
            $new_author = Author::updateOrCreate(
                [Ids::OPEN_ALEX_ID => $ids[Ids::OPEN_ALEX_ID]],
                [
                    Ids::SCOPUS_ID => $ids[Ids::SCOPUS_ID] ?? null,
                    Ids::ORC_ID_ID => $ids[Ids::ORC_ID_ID] ?? null,
                    'cited_by_count' => property_exists($author, 'cited_by_count') ? $author->cited_by_count : null,
                    'display_name' => $author->display_name,
                    'is_user' => $is_user,
                    'works_url' => property_exists($author, 'works_api_url') ? $author->works_api_url : Author::$authorWorksBaseUrl . $ids['open_alex_id'],
                    'last_updated_date' => property_exists($author, 'updated_date') ? $author->updated_date : null,
                    'created_date' => property_exists($author, 'created_date') ? $author->created_date : null,
                    'works_count' => $author->works_count,
                    'source' => Author::$openAlexSource
                ]
            );

            if (!property_exists($author, 'counts_by_year')) {
                return $new_author;
            }

            Statistic::generateStatistics($new_author->id, $author->counts_by_year, Author::class);
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
        return $new_author;
    }
}
