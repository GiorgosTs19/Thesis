<?php

namespace App\Http\Resources;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @property mixed publication_year
 * @property mixed title
 * @property mixed doi
 * @property mixed referenced_works_count
 * @property mixed language
 * @property mixed is_oa
 * @property mixed open_alex_url
 * @property mixed updated_at
 * @property mixed cites_url
 * @property mixed $id
 * @property mixed $type
 * @property mixed $open_alex_id
 * @property mixed $event
 * @property mixed $source_title
 * @property mixed $subtype
 * @property mixed $is_referenced_by_count
 * @property mixed $abstract
 * @property string $source
 * @method sources()
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
            'referenced_works_count' => $this->referenced_works_count,
            'language' => $this->language,
            'is_oa' => !!$this->is_oa,
            'open_alex_url' => $this->open_alex_url,
            'updated_at' => Carbon::parse($this->updated_at)->format('d-m-Y'),
            'cites_url' => $this->cites_url,
            'authors' => AuthorResource::collection($this->whenLoaded('authors')),
            'statistics' => StatisticResource::collection($this->whenLoaded('statistics')),
            'open_alex_id' => $this->open_alex_id,
            'local_url' => route('Work.Page', ['id' => $this->id]),
            'concepts' => ConceptResource::collection($this->whenLoaded('concepts')),
            'sources' => $this->sources()
        ];
    }
}
