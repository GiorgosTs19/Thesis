<?php

namespace App\Jobs;

use Exception;
use App\Http\Controllers\APIController;
use App\Models\{Author, Statistic, Work};
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\{ShouldBeUnique, ShouldQueue};
use Illuminate\Queue\{InteractsWithQueue, SerializesModels};
use Illuminate\Support\{Arr, Facades\Artisan, Facades\Auth, Facades\DB};
use function App\Providers\rocketDump;

class UpdateDatabaseJob implements ShouldQueue, ShouldBeUnique {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private array $authorUpdateFields = ['id', 'open_alex_id','last_updated_date', 'cited_by_count', 'works_count'];
    private array $workUpdateFields = ['id', 'open_alex_id', 'last_updated_date', 'is_oa', 'referenced_works_count'];

    /**
     * Create a new job instance.
     */
    public function __construct() {
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
//        $this->enableMaintenanceMode();
//        try {
            rocketDump('Dispatching updateStatistics job','info',[__FUNCTION__,__FILE__,__LINE__]);
            $this->updateAuthors();
            $this->updateWorks();
//        } catch (Exception $err) {
//            rocketDump("Something went wrong while updating the database,".$err->getMessage(),'error', [__FUNCTION__,__FILE__,__LINE__]);
//        }
//        finally {
//            $this->disableMaintenanceMode();
//        }
    }

    /**
     * Updates the statistics for the authors that are also users. For the time being,
     * only authors that are user have statistics associated to them.
     * @return void
     */
    private function updateAuthors() : void {
        DB::transaction(function () {
            $year_to_update = date('Y');
            // An array of the ids of the authors to be updated.
            $authors = Author::user()->get($this->authorUpdateFields);

            $length = sizeof($authors);
            $completed = 0;

            foreach ($authors as $author) {
                $author->updateSelf();
                rocketDump(++$completed."/$length completed", 'info', [__FUNCTION__,__FILE__,__LINE__]);
            }
        });
    }

    private function updateWorks() : void  {
        DB::transaction(function () {
            // An array of the ids of the authors to be updated.
            $works = Work::all($this->workUpdateFields);

            foreach ($works as $work) {
                $work->updateSelf();
            }
        });
    }

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
}
