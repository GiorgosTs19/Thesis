<?php

namespace App\Http\Resources;

use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property array|mixed $additionalParameters
 * @property mixed $childrenRecursive
 */
class GroupResource extends JsonResource {
    private mixed $additionalParameters;

    public function __construct($resource, $additionalParameters = null) {
        parent::__construct($resource);
        $this->additionalParameters = $additionalParameters;

    }

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
            'works' => new PaginatedWorkCollection($this->whenLoaded('works')),
            'children' => $this->whenLoaded('childrenRecursive', GroupResource::collection($this->childrenRecursive)),
            'uniqueWorksCount' => $this->when(isset($this->additionalParameters['open_alex_works']) && isset($this->additionalParameters['orcid_works']) && isset($this->additionalParameters['crossref_works']),
                [Work::$openAlexSource => data_get($this->additionalParameters, 'open_alex_works', 0), Work::$orcIdSource => data_get($this->additionalParameters, 'orcid_works', 0),
                    Work::$crossRefSource => data_get($this->additionalParameters, 'crossref_works', 0)])
        ];
    }
}
