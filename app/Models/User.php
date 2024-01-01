<?php

namespace App\Models;

use Exception;
use App\Utility\Ids;
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
 * @method static openAlex(string|null $open_alex_id)
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
    #[ArrayShape(['exists' => "mixed", 'author' => "mixed"])] public static function isAuthorAUser($open_alex_id): array {
        $user_query = User::where(Ids::OpenAlex_Id,$open_alex_id);
        $user_exists = boolval($user_query->exists());
        return ['exists'=>$user_exists, 'author'=>$user_query->first()];
    }

    /**
     * @param $professor
     * @return void
     * Create a new user and save it to the database, using info from the OpenAlex API.
     */
    public static function createUserFromId($professor): void {
        $author = null;
        // Check what type of id is used to fetch the author's info from OpenAlex api.
        // If the id contains '-', then OrcId id is used.
        if(str_contains($professor['id'], '-'))
            $author = APIController::authorRequest($professor['id']);
        // If the id starts/contains 'A', then OpenAlex id is used.
        elseif (str_contains($professor['id'], 'A'))
            $author = APIController::authorRequest($professor['id']);
        // If the id is just numbers, then scopus is used.
        else
            $author = APIController::authorFilterRequest($professor['id'], false, true);

        if(!$author)
            return;
        if((is_array($author) && sizeof($author) === 0))
            return;

        if(is_array($author))
            $author = $author[0];

        // Parse the ids of the author
        $orc_id = Ids::parseOrcIdFromObj($author);
        $scopus_id = Ids::parseScopusIdFromObj($author);
        $open_alex_id = Ids::parseOpenAlexIdFromObj($author);

        // Add all the parsed ids in an array
        $ids = [Ids::Scopus_Id => $scopus_id, Ids::OrcId_Id => $orc_id, Ids::OpenAlex_Id => $open_alex_id];

        // If a user with the same openAlex id exists. return;
        if(User::openAlex($open_alex_id)->exists())
            return;

        // Else create a new user.
        User::createNewUser($professor,$ids);

        Author::createAuthor($author,$ids, true);
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
            $newUser->orc_id = $ids[Ids::OrcId_Id];
            $newUser->scopus_id = $ids[Ids::Scopus_Id];
            $newUser->open_alex_id = $ids[Ids::OpenAlex_Id];
            $newUser->save();
            rocketDump("User $newUser->last_name $newUser->first_name has been created", 'error', [__FUNCTION__,__FILE__,__LINE__]);
        } catch (Exception $error ) {
            rocketDump($error->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
        }
        return $newUser;
    }

    public function scopeOrcId($query, $id) {
        if($id !== '')
            return $query->orWhere(Ids::OrcId_Id, $id);
        return $query;
    }

    public function scopeOpenAlex($query, $id) {
        if($id !== '')
            return $query->orWhere(Ids::OpenAlex_Id, $id);
        return $query;
    }
}
