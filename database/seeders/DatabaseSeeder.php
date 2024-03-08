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
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
        }
    }

    private function UpdateDatabase(): void {
        try {
            UpdateDatabaseJob::dispatchSync();
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
        }
    }
}
