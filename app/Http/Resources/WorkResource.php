<?php

namespace App\Http\Resources;


use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property mixed publication_year
 * @property mixed title
 * @property mixed doi
 * @property mixed language
 * @property mixed is_oa
 * @property mixed updated_at
 * @property mixed $id
 * @property mixed $type
 * @property mixed $event
 * @property mixed $source_title
 * @property mixed $subtype
 * @property mixed $is_referenced_by_count
 * @property mixed $abstract
 * @property string $source
 * @property string $source_url
 * @property string external_id
 * @method versions()
 */
class WorkResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'doi' => $this->doi ?? '',
            'title' => $this->title,
            'type' => $this->type,
            'event' => $this->event,
            'subtype' => $this->subtype,
            'source_title' => $this->source_title,
            'referenced_by_count' => $this->is_referenced_by_count,
            'abstract' => $this->abstract,
            'published_at_year' => $this->publication_year,
            'language' => $this->language,
            'is_oa' => !!$this->is_oa,
            'source_url' => $this->source_url,
            'updated_at' => Carbon::parse($this->updated_at)->format('d-m-Y'),
            'authors' => AuthorResource::collection($this->whenLoaded('authors')),
            'statistics' => StatisticResource::collection($this->whenLoaded('statistics')),
            'external_id' => $this->external_id,
            'local_url' => route('Work.Page', ['id' => $this->id]),
            'concepts' => ConceptResource::collection($this->whenLoaded('concepts')),
            'source' => $this->source,
            'versions' => $this->when($this->source === Work::$openAlexSource, WorkResource::collection($this->versions()), [])
        ];
    }
}
