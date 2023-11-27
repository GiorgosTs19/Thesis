<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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
     * @param $ids 'An associative array containing the orc_id, scopus_id, open_alex_id'
     * @return User
     */
    public static function createNewUser($professor, $ids){
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

    public static function isAuthorAUserByOrcId($orc_id, $shouldRetrieve = false) {
        $user_query = User::where('orc_id',$orc_id);
        $user_exists = $user_query->exists();
        if($user_exists) {
            if(!$shouldRetrieve)
                return $user_exists;
            return $user_query->first();
        }
        return false;
    }

    public function scopeOrcId($query, $id) {
        if($id !== '')
            return $query->orWhere('orc_id', $id);
        return $query;
    }
}
