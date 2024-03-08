<?php

namespace Database\Seeders;

use Exception;
use App\Utility\ULog;
use Illuminate\Database\Seeder;
use App\Jobs\UpdateDatabaseJob;
use App\Jobs\InitializeDatabaseJob;

class DatabaseSeeder extends Seeder {

    public function run(): void {
//        self::InitializeDatabase();
        self::UpdateDatabase();
    }

    private function InitializeDatabase (): void {
        try {
            InitializeDatabaseJob::dispatchSync();
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
        }
    }

    private function UpdateDatabase (): void {
        try {
            UpdateDatabaseJob::dispatchSync();
        } catch (Exception $exception) {
            ULog::error($exception->getMessage(), ULog::META);
        }
    }
}
