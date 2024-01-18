<?php

namespace App\Http\Resources;

use App\Models\Author;
use App\Models\Statistic;
use App\Utility\Ids;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\MissingValue;
use Illuminate\Support\Carbon;

/**
 * @property mixed display_name
 * @property mixed works_count
 * @property mixed open_alex_id
 * @property mixed scopus_id
 * @property mixed orc_id
 * @property mixed is_user
 * @property mixed updated_at
 * @property mixed cited_by_count
 * @property mixed $id
 */
class AuthorResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array {
        $statistics = $this->whenLoaded('statistics');

        $statisticsAreValid = !$statistics instanceof MissingValue && sizeof($statistics) > 0;

        if ($statistics && $statisticsAreValid) {
            $years = $statistics->pluck('year')->toArray();
            $allYears = range(min($years), max($years));

            // Fill in missing years with default values
            foreach ($allYears as $year) {
                $found = false;
                foreach ($statistics as $item) {
                    if ($item['year'] == $year) {
                        $found = true;
                        break;
                    }
                }

                // If the year is not found, add an object with default values
                if (!$found) {
                    $statistics[] = new Statistic([
                        'asset_type' => Author::class,
                        'cited_count' => 0,
                        'works_count' => 0,
                        'year' => $year,
                    ]);
                }
            }

            // Update the existing collection with the modified array
            $statistics = collect($statistics);
        }


        return [
            'id' => $this->id,
            'name' => $this->display_name,
            Ids::OPEN_ALEX_ID => $this->open_alex_id,
            Ids::ORC_ID_ID => $this->orc_id,
            Ids::SCOPUS_ID => $this->scopus_id,
            'works_count' => $this->works_count,
            'citation_count' => $this->cited_by_count,
            'is_user' => !!$this->is_user,
            'updated_at' => Carbon::parse($this->updated_at)->format('d-m-Y'),
            'works' => WorkResource::collection($this->whenLoaded('works')),
            'statistics' => $statisticsAreValid ? StatisticResource::collection($statistics) : [],
            'local_url' => route('Author.Page', ['id' => $this->open_alex_id])
        ];
    }
}
