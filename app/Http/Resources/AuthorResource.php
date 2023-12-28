<?php

namespace App\Http\Resources;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed display_name
 * @property mixed works_count
 * @property mixed open_alex_id
 * @property mixed scopus_id
 * @property mixed orc_id
 * @property mixed is_user
 * @property mixed updated_at
 * @property mixed cited_by_count
 */

class AuthorResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array {
        $ids = Author::extractIds($this,property_exists($this,'ids') ? 'request' : 'database');
        return [
            'name' => $this->display_name,
            'open_alex_id' => $ids['open_alex'],
            'orc_id' => $this->orc_id,
            'scopus_id' => $this->scopus_id,
            'works_count' => $this->works_count,
            'cited_by_count' => $this->cited_by_count,
            'is_user' => $this->is_user,
            'updated_at' => $this->updated_at
        ];
    }
}
