<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 */
class GroupResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'members' => AuthorResource::collection($this->whenLoaded('members')),
            'parent' => new GroupResource($this->whenLoaded('parent')),
            'works' => new WorkCollection($this->whenLoaded('works'))
        ];
    }
}
