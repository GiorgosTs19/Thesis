<?php

namespace App\Http\Resources;


use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed publication_year
 * @property mixed publication_date
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
 */
class WorkResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id'=>$this->id,
            'doi' => $this->doi ?? '',
            'title' => $this->title,
            'type' => $this->type,
            'published_at' =>  Carbon::parse($this->publication_date)->format('d-m-Y'),
            'published_at_year' => $this->publication_year,
            'referenced_works_count' => $this->referenced_works_count,
            'language' => $this->language,
            'is_oa' => !!$this->is_oa,
            'open_alex_url' => $this->open_alex_url,
            'updated_at' => Carbon::parse($this->updated_at)->format('d-m-Y'),
            'cites_url' => $this->cites_url,
            'authors'=>AuthorResource::collection($this->whenLoaded('authors')),
        ];
    }
}
