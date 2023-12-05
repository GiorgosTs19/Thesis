<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use function App\Providers\rocketDump;

/**
 * @property mixed $author_id
 * @property mixed $work_id
 */
class AuthorWork extends Model {
    use HasFactory;

    protected $table = 'author_work';

    protected $fillable = [
        'Author_Id',
        'Work_Id',
    ];

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

    public static function associateAuthorToWork($author, $ids, $work, ): void {
        // Check if an author exists by their Open Alex id
        ['exists' => $db_author_exists_oa, 'author' => $db_Author_oa] = Author::authorExistsByOpenAlexId($ids['open_alex_id']);
        // Since for some reason Open Alex can sometimes be unreliable, check if an author exists by their orcId as well.
        ['exists' => $db_author_exists_orc, 'author' => $db_Author_orc] = Author::authorExistsByOrcId($ids['orc_id']);
        // Check if an author is a user.
        $author_is_user = User::isAuthorAUserByOpenAlexId($ids['open_alex_id'])['exists'];

        // Might have to switch to open_alex_id because some professors do not have an orc_id
        if(!$author_is_user && !$db_author_exists_oa && !$db_author_exists_orc)
            $newAuthor = Author::createAuthor($author,$ids);

        if(!AuthorWork::associationExists($work->id, $db_author_exists_oa ? $db_Author_oa->id : ($db_author_exists_orc ? $db_Author_orc->id : $newAuthor->id))) {
            try {
                $newAuthorWork = new AuthorWork;
                $newAuthorWork->author_id = $db_author_exists_oa ? $db_Author_oa->id : ($db_author_exists_orc ? $db_Author_orc->id : $newAuthor->id);
                $newAuthorWork->work_id = $work->id;
                $newAuthorWork->save();
            } catch (\Exception $error) {
                rocketDump($error->getMessage(),[__FUNCTION__,__FILE__,__LINE__]);
            }
        }
    }
}
