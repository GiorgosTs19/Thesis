<?php

namespace App\Http\Resources;

use App\Utility\Ids;
use App\Utility\Requests;
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
        $ids = Ids::extractIds($this,property_exists($this,'ids') ?
            Requests::Request_Asset : Requests::Database_Asset);
        return [
            'name' => $this->display_name,
            Ids::OpenAlex_Id => $ids[Ids::OpenAlex],
            Ids::OrcId_Id => $this->orc_id,
            Ids::Scopus_Id => $this->scopus_id,
            'works_count' => $this->works_count,
            'cited_by_count' => $this->cited_by_count,
            'is_user' => $this->is_user,
            'updated_at' => $this->updated_at
        ];
    }
}
