<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class WorkCollection extends ResourceCollection {
    protected bool $shouldLoadVersions;

    public function __construct($resource, $loadVersions = true) {
        parent::__construct($resource);
        $this->shouldLoadVersions = $loadVersions;
    }

    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array {
        return $this->resource->collect()->map(function ($item) {
            return new WorkResource($item, $this->shouldLoadVersions);
        })->toArray();
    }
}
