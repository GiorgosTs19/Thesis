<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $displayName - The display name of the User.
 * @property mixed $cn
 * @property mixed $sn
 * @property mixed $eduPersonAffiliation
 * @property mixed $am
 * @property mixed $mail
 */
class AuthenticatedUserResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id' => $this->am,
            'display_name' => $this->displayName,
            'first_name' => $this->cn,
            'last_name' => $this->sn,
            'role' => $this->eduPersonAffiliation,
            'email' => $this->mail,
        ];
    }
}
