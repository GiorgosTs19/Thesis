<?php

namespace App\Jobs;

use App\Models\{Author, Work};
use App\Utility\ULog;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\{ShouldBeUnique, ShouldQueue};
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\{InteractsWithQueue, SerializesModels};
use Illuminate\Support\Facades\DB;

class UpdateDatabaseJob implements ShouldQueue, ShouldBeUnique {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public int $timeout = 7200; // 2 hours

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public int $retryAfter = 7200; // 2 hours


    /**
     * Create a new job instance.
     */
    public function __construct() {
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        try {
//            SystemManager::enableMaintenanceMode();

            $started_time = date("H:i:s");
            ULog::log("Database Update started at $started_time");

            DB::transaction(function () {
                $this->updateAuthors();
                $this->updateWorks();
            });

            $ended_time = date("H:i:s");
            ULog::log("Database Update ended at $ended_time");

        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
//        finally {
//            SystemManager::disableMaintenanceMode();
//        }
    }

    /**
     * Initiate the update of the authors that are also users.
     * @return void
     */
    private function updateAuthors(): void {
        DB::transaction(function () {
            ULog::log('Starting Authors update');
            // An array of the ids of the authors to be updated.
            $authors = Author::users()->get(Author::$updateFields);

            $length = sizeof($authors);
            $completed = 0;

            foreach ($authors as $author) {
                $author->updateSelf();
                ULog::log('Author updates : ' . ++$completed . "/$length completed");
            }
        });
    }

    /**
     * Initiate the update of all the database's works.
     * @return void
     */
    private function updateWorks(): void {
        ULog::log('Starting Works update');
        DB::transaction(function () {
            // An array of the ids of the authors to be updated.
            $works = Work::all(Work::$updateFields);
            $length = sizeof($works);
            $completed = 0;
            foreach ($works as $work) {
                $work->updateSelf();
                ULog::log('Work updates : ' . ++$completed . "/$length completed");
            }
        });
    }
}
