<?php

namespace App\Http\Resources;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed asset_type
 * @property mixed updated_at
 * @property mixed cited_count
 * @property mixed works_count
 */
class StatisticResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'asset_type' => $this->asset_type,
            'cited_count' => $this->cited_count,
            'works_count' => $this->when($this->asset_type === Author::class
            ,$this->works_count),
            'updated_at' => $this->updated_at,
        ];
    }
}
