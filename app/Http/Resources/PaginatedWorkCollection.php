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
        $filter = $request->has('filter') ? $request->only(['filter'])['filter'] : -1;
        $totalForFilter = Work::where('type_id', $filter)->count();
        $works = $this->resource->collect();
        if ($filter > 0) {
            $resources = $works->where('type_id', '=', $filter)->map(function ($item) {
                return new WorkResource($item);
            });
        } else {
            $resources = $works->map(function ($item) {
                return new WorkResource($item);
            });
        }

        return [
            'data' => $resources,
            'links' => $this->when(sizeof($resources) > $this->perPage(),
                [
                    'first' => $this->url(1),
                    'last' => $this->url($this->lastPage()),
                    'prev' => $this->previousPageUrl(),
                    'next' => $this->nextPageUrl(),
                ]),
            'meta' => $this->when(sizeof($resources) > $this->perPage(), [
                'current_page' => $this->currentPage(),
                'from' => $this->firstItem(),
                'last_page' => $this->lastPage(),
                'path' => $this->path(),
                'per_page' => $this->perPage(),
                'to' => $this->lastItem(),
                'total' => $filter ? $totalForFilter : $this->total(),
                'links' => $this->resource->linkCollection(),
                'filter' => $filter
            ]),
        ];
    }
}
