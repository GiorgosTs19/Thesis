<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed updated_at
 * @property mixed created_at
 * @property mixed open_alex_id
 * @property mixed orc_id
 * @property mixed scopus_id
 * @property mixed email
 * @property mixed last_name
 * @property mixed first_name
 */
class UserResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'orc_id' => $this->orc_id,
            'scopus_id' => $this->scopus_id,
            'open_alex_id' => $this->open_alex_id,
            'updated_at' => $this->updated_at,
            'created_at' => $this->created_at
        ];
    }
}
