<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use JetBrains\PhpStorm\ArrayShape;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property mixed $last_name
 * @property mixed $first_name
 * @property mixed $open_alex_id
 * @property mixed $scopus_id
 * @property mixed $email
 * @property mixed $orc_id
 * @method static orcId(string|null $orc_id)
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
     * @param $professor
     * A professor associative array from the hard-coded professors in the seeder.
     * @param array $ids 'An associative array containing the orc_id, scopus_id, open_alex_id'
     * @return User
     * The newly created user.
     */
    public static function createNewUser($professor, array $ids): User {
        $newUser = new User;
        $newUser->first_name = $professor['first'];
        $newUser->last_name = $professor['last'];
        $newUser->email = $professor['email'];
        $newUser->orc_id = $ids['orc_id'];
        $newUser->scopus_id = $ids['scopus_id'];
        $newUser->open_alex_id = $ids['open_alex_id'];
        $newUser->save();
        return $newUser;
    }

    /**
     * @param $orc_id
     * @return array
     */
    #[ArrayShape(['exists' => "mixed", 'author' => "mixed"])] public static function isAuthorAUserByOrcId($orc_id): array {
        $user_query = User::where('orc_id',$orc_id);
        $user_exists = boolval($user_query->exists());
        return ['exists'=>$user_exists, 'author'=>$user_query->first()];
    }

    /**
     * @param $orc_id
     * @return array
     */
    #[ArrayShape(['exists' => "mixed", 'author' => "mixed"])] public static function isAuthorAUserByOpenAlexId($orc_id): array {
        $user_query = User::where('open_alex_id',$orc_id);
        $user_exists = boolval($user_query->exists());
        return ['exists'=>$user_exists, 'author'=>$user_query->first()];
    }

    public function scopeOrcId($query, $id) {
        if($id !== '')
            return $query->orWhere('orc_id', $id);
        return $query;
    }
}
