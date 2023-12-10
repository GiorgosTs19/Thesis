<?php

namespace App\Jobs;

use Exception;
use App\Models\{Author, User, Work};
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\{ShouldBeUnique, ShouldQueue};
use Illuminate\Queue\{InteractsWithQueue, SerializesModels};
use Illuminate\Support\Facades\{Artisan, DB};
use function App\Providers\rocketDump;

class UpdateDatabaseJob implements ShouldQueue, ShouldBeUnique {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct() {
        rocketDump('Work dispatched', 'info', [__FUNCTION__,__FILE__,__LINE__]);
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        $this->enableMaintenanceMode();
        try {
            rocketDump('Dispatching updateStatistics job','info',[__FUNCTION__,__FILE__,__LINE__]);
            $this->updateAuthors();
            $this->updateWorks();
        } catch (Exception $err) {
            rocketDump("Something went wrong while updating the database,".$err->getMessage(),'error', [__FUNCTION__,__FILE__,__LINE__]);
        }
        finally {
            $this->disableMaintenanceMode();
        }
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
     * Updates the statistics for the authors that are also users. For the time being,
     * only authors that are user have statistics associated to them.
     * @return void
     */
    private function updateAuthors() : void {
        DB::transaction(function () {
            rocketDump('Starting Authors update');
            // An array of the ids of the authors to be updated.
            $authors = Author::user()->get(Author::$updateFields);

            $length = sizeof($authors);
            $completed = 0;

            foreach ($authors as $author) {
                $author->updateSelf();
                rocketDump('Author updates completed : '.++$completed."/$length completed");
            }
        });
    }

    private function updateWorks() : void  {
        rocketDump('Starting Works update');
        DB::transaction(function () {
            // An array of the ids of the authors to be updated.
            $works = Work::all(Work::$updateFields);
            $length = sizeof($works);
            $completed = 0;
            foreach ($works as $work) {
                $work->updateSelf();
                rocketDump('Work updates completed : '.++$completed."/$length completed");
            }
        });
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
