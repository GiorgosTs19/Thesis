<?php

namespace App\Models;

use Exception;
use App\Utility\Ids;
use App\Utility\ULog;
use Laravel\Sanctum\HasApiTokens;
use JetBrains\PhpStorm\ArrayShape;
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
     * The OpenAlex id of an author to check if they're a user.
     * @return array
     * An array that contains a boolean as its first element, indicating if a user with a matching id was found,
     * and the user ( it they exist, otherwise null ) as its second element.
     */
    #[ArrayShape(['exists' => "mixed", 'author' => "mixed"])] public static function isAuthorAUser($open_alex_id): array {
        $user_query = User::where(Ids::OPEN_ALEX_ID,$open_alex_id);
        $user_exists = boolval($user_query->exists());
        return ['exists'=>$user_exists, 'author'=>$user_query->first()];
    }

    /**
     * @param $professor
     * The Professor object to extract the info from.
     * @return void
     * Create a new user and save it to the database, using info from the OpenAlex API.
     */
    public static function createUserFromId($professor): void {
        // Check what type of id is used to fetch the author's info from OpenAlex api.
        $id_type = Ids::getIdType($professor['id']);

        $author = match ($id_type) {
            Ids::ORC_ID, Ids::OPEN_ALEX => APIController::authorRequest($professor['id']),
            // Using a filter request since OpenAlex can only find Authors by scopus using filters.
            Ids::SCOPUS => APIController::authorFilterRequest($professor['id'], false, true)
        };

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
        $ids = [Ids::SCOPUS_ID => $scopus_id, Ids::ORC_ID_ID => $orc_id, Ids::OPEN_ALEX_ID => $open_alex_id];

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
            $newUser->orc_id = $ids[Ids::ORC_ID_ID];
            $newUser->scopus_id = $ids[Ids::SCOPUS_ID];
            $newUser->open_alex_id = $ids[Ids::OPEN_ALEX_ID];
            $newUser->save();
            ULog::log("User $newUser->last_name $newUser->first_name has been created");
        } catch (Exception $exception ) {
            ULog::error($exception->getMessage(), ULog::META);
        }
        return $newUser;
    }

    public function scopeOrcId($query, $id) {
        if($id !== '')
            return $query->orWhere(Ids::ORC_ID_ID, $id);
        return $query;
    }

    public function scopeOpenAlex($query, $id) {
        if($id !== '')
            return $query->orWhere(Ids::OPEN_ALEX_ID, $id);
        return $query;
    }
}
