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
        $sorting_options = [];

        foreach (Work::SORTING_OPTIONS as $optionKey => $option) {
            // Generating URL for each sorting option
            $url = URL::route('Author.Page', ['id' => $authorId, 'sort' => $option['value']]);

            // Including the URL in the sortingOptions object
            $sorting_options[$optionKey] = [
                'name' => $option['name'],
                'value' => $option['value'],
                'url' => $url,
                'default' => $option['default']
            ];
        }

        return $sorting_options;
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
        $works_query = $author->works()->with('authors');

        $orc_id_works = $author->works()->where('source', '=', Work::$orcIdSource)->count();
        $open_alex_works = $author->works()->where('source', '=', Work::$openAlexSource)->count();

        // Check if sorting is specified in the request
        if ($request->has('sort')) {
            // Implement your sorting logic here based on the 'sort' query parameter
            // You can use orderBy() or any other method that suits your needs
            // For example, assuming 'sort' parameter contains the field to sort by
            $sort_field = $request->get('sort');
            $current_sorting_method = $sort_field;
            $this->applySorting($works_query, $sort_field);
        } else {
            // If no sorting is specified, use the default sorting option
            $default_sorting = collect(Work::SORTING_OPTIONS)->firstWhere('default', true);
            $this->applySorting($works_query, $default_sorting['value']);
            $current_sorting_method = $default_sorting['value'];
        }

        // Paginate the sorted works
        $works = $works_query->paginate(10);

        // Generate URLs for each sorting option and include them in the sortingOptions object
        $sorting_options = $this->generateSortingOptions($id);

        // Append the current sort parameter to pagination links
        $works->appends(['sort' => $request->get('sort')]);


        return Inertia::render('Routes/Author/AuthorPage', [
            'author' => new AuthorResource($author),
            'works' => WorkResource::collection($works),
            'sortingOptions' => $sorting_options,
            'currentSortOption' => (int)$current_sorting_method,
            'uniqueWorksCounts' => [Work::$openAlexSource => $open_alex_works, Work::$orcIdSource => $orc_id_works]
        ]);
    }
}

