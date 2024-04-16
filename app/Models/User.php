<?php

namespace App\Models;

use App\Utility\Ids;
use App\Utility\ULog;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use JetBrains\PhpStorm\ArrayShape;
use Laravel\Sanctum\HasApiTokens;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

/**
 * @property mixed last_name
 * @property mixed first_name
 * @property mixed open_alex_id
 * @property mixed scopus_id
 * @property string display_name
 * @property string email
 * @property mixed orc_id
 * @property mixed is_admin
 * @property mixed is_staff
 * @property mixed external_id
 * @method static orcId(string|null $orc_id)
 * @method static where(string $string, $orc_id)
 * @method static openAlex(string|null $open_alex_id)
 * @method static searchOpenAlex(mixed $query)
 * @method static firstOrCreate(array $array, array $array1)
 */
class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;

    const STAFF_AFFILIATION_NAME = 'staff';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'external_id',
        'first_name',
        'last_name',
        'display_name',
        'email',
        'orc_id',
        'scopus_id',
        'open_alex_id',
        'password'
    ];

    protected $primaryKey = 'id';

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
        'is_admin' => 'boolean',
        'is_staff' => 'boolean'
    ];

    public function isAdmin(): bool {
        return $this->is_admin === 1;
    }

    /**
     * @param string $open_alex_id
     * The OpenAlex id of an author to check if they're a user.
     * @return array
     * An array that contains a boolean as its first element, indicating if a user with a matching id was found,
     * and the user ( it they exist, otherwise null ) as its second element.
     */
    #[ArrayShape(['exists' => "mixed", 'author' => "mixed"])] public static function authorIsUser(string $open_alex_id): array {
        $user_query = self::where(Ids::OPEN_ALEX_ID, $open_alex_id);
        $user_exists = boolval($user_query->exists());
        return ['exists' => $user_exists, 'author' => $user_query->first()];
    }

    /**
     * @param $authenticatedUser
     * An associative array with the properties of the authenticated user.
     * @return User
     * The newly created or existing user.
     */
    public static function findOrUpdate(array $authenticatedUser): User {
        try {
            $user = User::firstOrCreate(['external_id' => $authenticatedUser['id']], [
                'first_name' => $authenticatedUser['first_name'],
                'last_name' => $authenticatedUser['last_name'],
                'email' => $authenticatedUser['email'],
                'display_name' => $authenticatedUser['display_name'],
                'is_staff' => $authenticatedUser['is_staff'],
            ]);
            ULog::log("User $user->last_name $user->first_name has been created");
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
        return $user;
    }

    public function scopeOrcId($query, $id) {
        if ($id !== '')
            return $query->orWhere(Ids::ORC_ID_ID, $id);
        return $query;
    }

    public function scopeScopus($query, $id) {
        if ($id !== '')
            return $query->orWhere(Ids::SCOPUS_ID, $id);
        return $query;
    }

    public function scopeName($query, $name) {
        if ($name !== '')
            return $query->orWhere('first_name', $name)->orWhere('last_name', $name);
        return $query;
    }

    public function scopeOpenAlex($query, $id) {
        if ($id !== '')
            return $query->orWhere(Ids::OPEN_ALEX_ID, $id);
        return $query;
    }

    public function scopeSearchOrcId($query, $orc_id) {
        if ($orc_id !== '')
            return $query->where(Ids::ORC_ID_ID, $orc_id)->orWhere(Ids::ORC_ID_ID, 'LIKE', "%{$orc_id}%");
        return $query;
    }

    public function scopeSearchScopus($query, $scopus_id) {
        if ($scopus_id !== '')
            return $query->where(Ids::SCOPUS_ID, $scopus_id)->orWhere(Ids::SCOPUS_ID, 'LIKE', "%{$scopus_id}%");
        return $query;
    }

    public function scopeSearchName($query, $name) {
        if ($name !== '')
            return $query->where('first_name', $name)->orWhere('first_name', 'LIKE', "%{$name}%")->orWhere('last_name', $name)->orWhere('last_name', 'LIKE', "%{$name}%");
        return $query;
    }

    public function scopeSearchEmail($query, $email) {
        if ($email !== '')
            return $query->orWhere('email', $email)->orWhere('email', 'LIKE', "%{$email}%");
        return $query;
    }

    public function scopeSearchOpenAlex($query, $open_alex_id) {
        if ($open_alex_id !== '')
            return $query->where(Ids::OPEN_ALEX_ID, $open_alex_id)->orWhere(Ids::OPEN_ALEX_ID, 'LIKE', "%{$open_alex_id}%");
        return $query;
    }

    public function groups(): BelongsToMany {
        return $this->belongsToMany(Group::class);
    }
}
