<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkResource;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller {
    /**
     * @param $authorId
     * @return array
     */
    private function generateSortingOptions($authorId): array {
        $sortingOptions = [];

        foreach (Work::SORTING_OPTIONS as $optionKey => $option) {
            // Generating URL for each sorting option
            $url = URL::route('Author.Page', ['id' => $authorId, 'sort' => $option['value']]);

            // Including the URL in the sortingOptions object
            $sortingOptions[$optionKey] = [
                'name' => $option['name'],
                'value' => $option['value'],
                'url' => $url,
                'default' => $option['default']
            ];
        }

        return $sortingOptions;
    }

    private function applySorting($worksQuery, $sortingCriteria): void {
        switch ($sortingCriteria) {
            case 0:
                $worksQuery->orderBy('title');
                break;
            case 1:
                $worksQuery->orderByDesc('title');
                break;
            case 2:
                $worksQuery->orderBy('publication_date');
                break;
            case 3:
                $worksQuery->orderByDesc('publication_date');
                break;
            case 4:
                $worksQuery->orderBy('referenced_works_count');
                break;
            case 5:
                $worksQuery->orderByDesc('referenced_works_count');
                break;
        }
    }

    public function showWorkPage(Request $request, $id): Response {
        $work = Work::with(['authors', 'statistics'])->openAlex($id, 'id')->firstOrFail();

        return Inertia::render('Routes/Work/WorkPage', [
            'work' => new WorkResource($work),
        ]);
    }
}
