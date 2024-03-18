<?php

namespace Database\Seeders;

use App\Jobs\InitializeDatabaseJob;
use App\Jobs\UpdateDatabaseJob;
use App\Utility\ULog;
use Exception;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {

    public function run(): void {
        self::InitializeDatabase();
//        self::UpdateDatabase();
    }

    private function InitializeDatabase(): void {
        try {
            InitializeDatabaseJob::dispatchSync();
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }

    private function UpdateDatabase(): void {
        try {
            UpdateDatabaseJob::dispatchSync();
        } catch (Exception $error) {
            ULog::error($error->getMessage() . ", file: " . $error->getFile() . ", line: " . $error->getLine());
        }
    }
}
