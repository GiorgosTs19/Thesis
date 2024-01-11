<?php

namespace App\Http\Resources;

use App\Models\Author;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed asset_type
 * @property mixed updated_at
 * @property mixed cited_count
 * @property mixed works_count
 * @property mixed $year
 */
class StatisticResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'asset_type' => match ($this->asset_type) {
                Author::class=>'Author',
                Work::class=>'Work'
            },
            'cited_count' => $this->cited_count,
            'works_count' => $this->when($this->asset_type === Author::class
            ,$this->works_count),
            'year'=>$this->year
        ];
    }
}
