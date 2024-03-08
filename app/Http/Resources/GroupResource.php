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
 */
class GroupResource extends JsonResource {
    public function __construct($resource, $additionalParameters = []) {
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
            'works' => new WorkCollection($this->whenLoaded('works')),
            'uniqueWorksCount' => $this->when(isset($this->additionalParameters['open_alex_works']) && isset($this->additionalParameters['orc_id_works']),
                [Work::$openAlexSource => data_get($this->additionalParameters, 'open_alex_works', 0), Work::$orcIdSource => data_get($this->additionalParameters, 'orc_id_works', 0)])
        ];
    }
}
