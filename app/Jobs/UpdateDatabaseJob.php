<?php

namespace App\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use App\Models\{Author, Work};
use function App\Providers\rocketDump;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\{Artisan, DB};
use Illuminate\Queue\{InteractsWithQueue, SerializesModels};
use Illuminate\Contracts\Queue\{ShouldBeUnique, ShouldQueue};

class UpdateDatabaseJob implements ShouldQueue, ShouldBeUnique {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct() {}

    /**
     * Execute the job.
     */
    public function handle(): void {
        try {
            $this->enableMaintenanceMode();
            rocketDump('Dispatching updateStatistics job');
            $this->updateAuthors();
            $this->updateWorks();
        } catch (Exception $err) {
            rocketDump("Something went wrong while updating the database,".$err->getMessage(),'error');
        }
        finally {
            $this->disableMaintenanceMode();
        }
    }

    /**
     * Enable Maintenance Mode while the database is updating.
     * @return void
     */
    private function enableMaintenanceMode(): void {
        // Enable maintenance mode
        rocketDump('Turning On Maintenance mode');
        Artisan::call('down');
    }

    /**
     * Initiate the update of the authors that are also users.
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
                rocketDump('Author updates : '.++$completed."/$length completed");
            }
        });
    }

    /**
     * Initiate the update of all the database's works.
     * @return void
     */
    private function updateWorks() : void  {
        rocketDump('Starting Works update');
        DB::transaction(function () {
            // An array of the ids of the authors to be updated.
            $works = Work::all(Work::$updateFields);
            $length = sizeof($works);
            $completed = 0;
            foreach ($works as $work) {
                $work->updateSelf();
                rocketDump('Work updates : '.++$completed."/$length completed");
            }
        });
    }

    /**
     * Disable Maintenance Mode after the database is done updating,
     * or an error occurs during that process.
     * @return void
     */
    private function disableMaintenanceMode(): void {
        // Disable maintenance mode
        rocketDump('Turning Off Maintenance mode');
        Artisan::call('up');
    }
}
