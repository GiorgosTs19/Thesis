<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * @method url(int $int)
 * @method lastPage()
 * @method previousPageUrl()
 * @method nextPageUrl()
 * @method currentPage()
 * @method firstItem()
 * @method path()
 * @method perPage()
 * @method total()
 * @method lastItem()
 */
class PaginatedWorkCollection extends ResourceCollection {

    protected bool $shouldLoadVersions;

    public function __construct($resource, $shouldLoadVersions = true) {
        parent::__construct($resource);
        $this->shouldLoadVersions = $shouldLoadVersions;
    }

    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array {
        $works = $this->collection->map(function ($item) {
            return new WorkResource($item, $this->shouldLoadVersions);
        });

        return [
            'data' => $works,
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $this->currentPage(),
                'from' => $this->firstItem(),
                'last_page' => $this->lastPage(),
                'path' => $this->path(),
                'per_page' => $this->perPage(),
                'to' => $this->lastItem(),
                'total' => $this->total(),
                'links' => $this->resource->linkCollection(),
            ]
        ];
    }
}
