<?php

namespace App\Http\Resources;

use App\Models\Work;
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
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array {
        $works = $this->resource->collect()->map(function ($item) {
            return new WorkResource($item);
        });

        return [
            'data' => $works,
            'links' => $this->when(sizeof($works) > $this->perPage(),
                [
                    'first' => $this->url(1),
                    'last' => $this->url($this->lastPage()),
                    'prev' => $this->previousPageUrl(),
                    'next' => $this->nextPageUrl(),
                ]),
            'meta' => $this->when(sizeof($works) > $this->perPage(), [
                'current_page' => $this->currentPage(),
                'from' => $this->firstItem(),
                'last_page' => $this->lastPage(),
                'path' => $this->path(),
                'per_page' => $this->perPage(),
                'to' => $this->lastItem(),
                'total' => $this->total(),
                'links' => $this->resource->linkCollection(),
            ]),
        ];
    }
}
