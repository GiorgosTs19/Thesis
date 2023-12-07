<?php

namespace App\Jobs;

use Exception;
use App\Http\Controllers\APIController;
use App\Models\{Author, AuthorStatistics};
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\{ShouldBeUnique, ShouldQueue};
use Illuminate\Queue\{InteractsWithQueue, SerializesModels};
use Illuminate\Support\{Arr, Facades\Artisan, Facades\DB};
use function App\Providers\rocketDump;

class UpdateDatabaseJob implements ShouldQueue, ShouldBeUnique {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Enable MaintenanceMode while the database is updating.
     * @return void
     */
    private function enableMaintenanceMode(): void {
        // Enable maintenance mode
        rocketDump('Turning On Maintenance mode');
        Artisan::call('down');
    }

    /**
     * Disable MaintenanceMode after the database is done updating,
     * or an error occurs during that process.
     * @return void
     */
    private function disableMaintenanceMode(): void {
        // Disable maintenance mode
        rocketDump('Turning Off Maintenance mode');
        Artisan::call('up');
    }

    /**
     * Create a new job instance.
     */
    public function __construct() {
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        $this->enableMaintenanceMode();
        try {
            rocketDump('Dispatching updateStatistics job','info',[__FUNCTION__,__FILE__,__LINE__]);
            $this->updateStatistics();
        } catch (Exception $err) {
            rocketDump("Something went wrong while updating the database,".$err->getMessage(),'error', [__FUNCTION__,__FILE__,__LINE__]);
        }
        finally {
            $this->disableMaintenanceMode();
        }
    }

    /**
     * Updates the statistics for the authors that are also users. For the time being,
     * only authors that are user have statistics associated to them.
     * @return void
     */
    private function updateStatistics(): void {
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
                    rocketDump("No statistics updates required for $author->display_name for the year $requestStatistic->year");
                    continue;
                }

                if ($works_count_differ) {
                    $databaseStatistics->works_count = $requestStatistic->works_count;
                    rocketDump("Works count has been updated for $author->display_name ", 'info', [__FUNCTION__,__FILE__,__LINE__]);
                }

                if ($citation_count_differ) {
                    $databaseStatistics->cited_count = $requestStatistic->cited_by_count;
                    rocketDump("Citation count has been updated for $author->display_name ", 'info', [__FUNCTION__,__FILE__,__LINE__]);
                }

                $databaseStatistics->save();

                $completed++;
                rocketDump($completed."/$length completed", 'info', [__FUNCTION__,__FILE__,__LINE__]);
            }
        });
    }
}
