<?php

namespace App\Models;

use Exception;
use Laravel\Sanctum\HasApiTokens;
use JetBrains\PhpStorm\ArrayShape;
use function App\Providers\rocketDump;
use App\Http\Controllers\APIController;
use Illuminate\Notifications\Notifiable;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * @property mixed last_name
 * @property mixed first_name
 * @property mixed open_alex_id
 * @property mixed scopus_id
 * @property mixed email
 * @property mixed orc_id
 *
 * @method static orcId(string|null $orc_id)
 * @method static where(string $string, $orc_id)
 */
class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'orc_id',
        'scopus_id',
        'open_alex_id',
        'password'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * @param $open_alex_id
     * The OpenAlex id to search a user with
     * @param $orc_id
     * The OrcId id to search a user with
     * @return array
     * An array that contains a boolean as its first element, indicating if a user with a matching id was found,
     * and the user ( it they exist, otherwise null ) as its second element.
     */
    #[ArrayShape(['exists' => "mixed", 'author' => "mixed"])] public static function isAuthorAUser($open_alex_id, $orc_id): array {
        $user_query = User::where('open_alex_id',$open_alex_id)->orWhere('orc_id',$orc_id);
        $user_exists = boolval($user_query->exists());
        return ['exists'=>$user_exists, 'author'=>$user_query->first()];
    }

    /**
     * @param $professor
     * @return void
     * Create a new user and save it to the database, using info from the OpenAlex API.
     */
    public static function createUserFromId($professor): void {

        $author = str_contains($professor['id'], '-') ? APIController::authorRequest($professor['id']) : APIController::authorFilterRequest($professor['id'], 'scopus', false, true);
        if(!$author)
            return;
        if((is_array($author) && sizeof($author) === 0))
            return;

        if(is_array($author))
            $author = $author[0];

        // Parse the ids of the author
        $orc_id = Author::parseOrcId('',$author);
        $scopus_id = Author::parseScopusId('',$author);
        $open_alex_id = Author::parseOpenAlexId('',$author);

        // Add all the parsed ids in an array
        $ids = ['scopus_id'=>$scopus_id,'orc_id'=>$orc_id, 'open_alex_id'=>$open_alex_id];

        // If no orc_id is present, return
        if(User::orcId($orc_id)->exists())
            return;
        // Else create a new user.
        User::createNewUser($professor,$ids);

        // If an author doesn't already exist for that user then create a new author.
        // if(!Author::authorExistsByOpenAlexId($open_alex_id)['exists']) {
            Author::createAuthor($author,$ids, true);
//        }

    }

    /**
     * @param $professor
     * A professor associative array from the hard-coded professors in the seeder.
     * @param array $ids 'An associative array containing the orc_id, scopus_id, open_alex_id'
     * @return User
     * The newly created user.
     */
    public static function createNewUser($professor, array $ids): User {
        $newUser = new User;
        try {
            $newUser->first_name = $professor['first'];
            $newUser->last_name = $professor['last'];
            $newUser->email = $professor['email'];
            $newUser->orc_id = $ids['orc_id'];
            $newUser->scopus_id = $ids['scopus_id'];
            $newUser->open_alex_id = $ids['open_alex_id'];
            $newUser->save();
        } catch (Exception $error ) {
            rocketDump($error->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
        }
        return $newUser;
    }

    public function scopeOrcId($query, $id) {
        if($id !== '')
            return $query->orWhere('orc_id', $id);
        return $query;
    }
}
