<?php

namespace Database\Seeders;

use App\Jobs\InitializeDatabaseJob;
use App\Jobs\UpdateDatabaseJob;
use App\Utility\ULog;
use Exception;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {

    public function run(): void {
//        self::initDatabase();
        self::UpdateDatabase();
    }

    private function initDatabase(): void {
        try {
            InitializeDatabaseJob::dispatchSync();
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }

    private function updateDatabase(): void {
        try {
            UpdateDatabaseJob::dispatchSync();
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }
}
