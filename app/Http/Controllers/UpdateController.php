<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\AuthorStatistics;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use function App\Providers\rocketDump;

class UpdateController extends Controller {
    /**
     * @return void
     * Updates the statistics for the authors that are also users. For the time being,
     * only authors that are user have statistics associated to them.
     */
    public static function updateStatistics(): void {
        DB::transaction(function () {
            // An array of the ids of the authors to be updated.
            $year_to_update = date('Y');
            $authorsStatistics = Author::user()->with(['statistics' => function ($query) use ($year_to_update) {
                $query->where('year', $year_to_update);
            }])->get();

            $length = sizeof($authorsStatistics);
            $completed = 0;
            foreach ($authorsStatistics as $author) {
                $requestStatistic = Arr::first(APIController::authorRequest($author->open_alex_id,'open_alex')->counts_by_year,
                function ($value) use ($year_to_update) {
                    return $value->year == (int)$year_to_update;
                });

                $databaseStatistics = $author->statistics
                    ->where('year', $requestStatistic->year)
                    ->first();

                if (!$databaseStatistics) {
                    AuthorStatistics::generateStatistics($author->id, $requestStatistic);
                    continue;
                }

                $works_count_differ = $requestStatistic->works_count !== $databaseStatistics->works_count;
                $citation_count_differ = $requestStatistic->cited_by_count !== $databaseStatistics->cited_count;

                if (!$works_count_differ && !$citation_count_differ) {
                    rocketDump("No statistics updates required for $author->display_name for the year $requestStatistic->year" ,
                        __FUNCTION__.' '.__FILE__.' '.__LINE__,'info',false);
                    continue;
                }

                if ($works_count_differ) {
                    $databaseStatistics->works_count = $requestStatistic->works_count;
                    rocketDump("Works count has been updated for $author->display_name " ,__FUNCTION__.' '.__FILE__.' '.__LINE__);
                }

                if ($citation_count_differ) {
                    $databaseStatistics->cited_count = $requestStatistic->cited_by_count;
                    rocketDump("Citation count has been updated for $author->display_name " ,__FUNCTION__.' '.__FILE__.' '.__LINE__);
                }

                $databaseStatistics->save();

                $completed++;
                rocketDump($completed."/$length completed" ,__FUNCTION__.' '.__FILE__.' '.__LINE__);
            }
        });
    }
}
