<?php

namespace App\Utility;

class Auth {
    public static function resourceToArray($authenticatedUser): array {
        return [
            'id' => $authenticatedUser->am,
            'display_name' => $authenticatedUser->displayName,
            'first_name' => $authenticatedUser->cn,
            'last_name' => $authenticatedUser->sn,
            'role' => $authenticatedUser->eduPersonAffiliation,
            'email' => $authenticatedUser->mail,
        ];
    }
}