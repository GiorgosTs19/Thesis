<?php

namespace App\Utility;

class Auth {
    private static function isAdmin($userId) {

        return in_array($userId, config('admin.external_ids'));
    }

    public static function resourceToArray($authenticatedUser): array {
        return [
            'id' => $authenticatedUser->am,
            'display_name' => property_exists($authenticatedUser,'displayName') ?  $authenticatedUser->displayName : $authenticatedUser->cn,
            'first_name' => $authenticatedUser->cn,
            'last_name' => $authenticatedUser->sn,
            'role' => $authenticatedUser->eduPersonAffiliation,
            'email' => $authenticatedUser->mail,
            'is_admin' => self::isAdmin($authenticatedUser->am)
        ];
    }
}
