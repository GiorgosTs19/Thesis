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
 * @property mixed $id
 * @property mixed $is_admin
 * @property mixed $is_staff
 * @property mixed $display_name
 */
class UserResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'displayName' => $this->display_name,
            'admin' => $this->is_admin,
            'staff' => $this->is_staff,
            'email' => $this->email,
            'orcId' => $this->orc_id,
            'scopus' => $this->scopus_id,
            'openAlex' => $this->open_alex_id,
        ];
    }
}
