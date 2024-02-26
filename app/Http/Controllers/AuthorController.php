<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthorResource;
use App\Http\Resources\WorkResource;
use App\Models\{Author, Work};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\{Inertia, Response};

class AuthorController extends Controller {
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

    public function showAuthorPage(Request $request, $id): Response {
        $author = Author::with(['works.authors', 'statistics'])->openAlex($id)->firstOrFail();

        // Retrieve works with authors
        $worksQuery = $author->works()->with('authors');

        $current_sorting_method = 0;
        // Check if sorting is specified in the request
        if ($request->has('sort')) {
            // Implement your sorting logic here based on the 'sort' query parameter
            // You can use orderBy() or any other method that suits your needs
            // For example, assuming 'sort' parameter contains the field to sort by
            $sortField = $request->get('sort');
            $current_sorting_method = $sortField;
            $this->applySorting($worksQuery, $sortField);
        } else {
            // If no sorting is specified, use the default sorting option
            $defaultSorting = collect(Work::SORTING_OPTIONS)->firstWhere('default', true);
            $this->applySorting($worksQuery, $defaultSorting['value']);
            $current_sorting_method = $defaultSorting['value'];
        }

        // Paginate the sorted works
        $works = $worksQuery->paginate(10);

        // Generate URLs for each sorting option and include them in the sortingOptions object
        $sortingOptions = $this->generateSortingOptions($id);

        // Append the current sort parameter to pagination links
        $works->appends(['sort' => $request->get('sort')]);

        return Inertia::render('Routes/Author/AuthorPage', [
            'author' => new AuthorResource($author),
            'works' => WorkResource::collection($works),
            'sortingOptions' => $sortingOptions,
            'currentSortOption' => (int)$current_sorting_method
        ]);
    }
}

