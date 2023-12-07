<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use function App\Providers\rocketDump;

/**
 * @property mixed $author_id
 * @property mixed $work_id
 *
 * @method static where(string $string, $author_id)
 */
class AuthorWork extends Model {
    use HasFactory;

    protected $table = 'author_work';

    protected $fillable = [
        'Author_Id',
        'Work_Id',
    ];

    public static function associateAuthorToWork($author, $ids, $work ): void {
        // Check if an author exists by their Open Alex id
        ['exists' => $db_author_exists_oa, 'author' => $db_Author_oa] = Author::authorExistsByOpenAlexId($ids['open_alex_id']);
//        // Since for some reason Open Alex can sometimes be unreliable, check if an author exists by their orcId as well.
//        ['exists' => $db_author_exists_orc, 'author' => $db_Author_orc] = Author::authorExistsByOrcId($ids['orc_id']);
        // Check if an author is a user.
        $author_is_user = User::isAuthorAUserByOpenAlexId($ids['open_alex_id'])['exists'];

        $newAuthor = null;
        rocketDump($db_author_exists_oa, 'info', [__FUNCTION__,__FILE__,__LINE__]);
        rocketDump($author_is_user, 'info', [__FUNCTION__,__FILE__,__LINE__]);

        if(!$author_is_user && !$db_author_exists_oa)
            $newAuthor = Author::createAuthor($author,$ids);

        $author_to_search = $db_author_exists_oa ? $db_Author_oa :  $newAuthor;

        if(!$author_to_search)
            return;

        if(!AuthorWork::associationExists($work->id, $author_to_search->id)) {
            try {
                $newAuthorWork = new AuthorWork;
                $newAuthorWork->author_id = $author_to_search->id;
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
     * @param $author_id
     * The author id to check the association for.
     * @return bool
     * A boolean indicating if an association between the requested author and work already exists in the database.
     */
    public static function associationExists($work_id, $author_id): bool {
        return AuthorWork::where('author_id',$author_id)->where('work_id',$work_id)->exists();
    }
}
