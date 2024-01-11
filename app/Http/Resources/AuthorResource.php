<?php

namespace App\Http\Resources;

use App\Utility\Ids;
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

        return [
            'name' => $this->display_name,
            Ids::OPEN_ALEX_ID => $this->open_alex_id,
            Ids::ORC_ID_ID => $this->orc_id,
            Ids::SCOPUS_ID => $this->scopus_id,
            'works_count' => $this->works_count,
            'citation_count' => $this->cited_by_count,
            'is_user' => !!$this->is_user,
            'updated_at' => $this->updated_at,
            'works'=>WorkResource::collection($this->whenLoaded('works')),
            'statistics'=>StatisticResource::collection($this->whenLoaded('statistics'))
        ];
    }
}
