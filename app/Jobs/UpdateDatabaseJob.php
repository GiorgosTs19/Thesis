<?php

namespace App\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use App\Models\{Author, Work};
use App\Utility\SystemManager;
use Illuminate\Support\Facades\DB;
use function App\Providers\_log;
use Illuminate\Foundation\Bus\Dispatchable;
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
            SystemManager::enableMaintenanceMode();

            $started_time = date("H:i:s");
            _log("Database Update started at $started_time");

            DB::transaction(function () {
                $this->updateAuthors();
                $this->updateWorks();
            });

            $ended_time = date("H:i:s");
            _log("Database Update ended at $ended_time");

        } catch (Exception $err) {
            _log("Something went wrong while updating the database,".$err->getMessage(),SystemManager::ERROR_LOG);
        }
        finally {
            SystemManager::disableMaintenanceMode();
        }
    }

    /**
     * Initiate the update of the authors that are also users.
     * @return void
     */
    private function updateAuthors() : void {
        DB::transaction(function () {
            _log('Starting Authors update');
            // An array of the ids of the authors to be updated.
            $authors = Author::user()->get(Author::$UPDATE_FIELDS);

            $length = sizeof($authors);
            $completed = 0;

            foreach ($authors as $author) {
                $author->updateSelf();
                _log('Author updates : '.++$completed."/$length completed");
            }
        });
    }

    /**
     * Initiate the update of all the database's works.
     * @return void
     */
    private function updateWorks() : void  {
        _log('Starting Works update');
        DB::transaction(function () {
            // An array of the ids of the authors to be updated.
            $works = Work::all(Work::$UPDATE_FIELDS);
            $length = sizeof($works);
            $completed = 0;
            foreach ($works as $work) {
                $work->updateSelf();
                _log('Work updates : '.++$completed."/$length completed");
            }
        });
    }
}
