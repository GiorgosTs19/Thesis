<?php

namespace Database\Seeders;

use Exception;
use App\Utility\SystemManager;
use Illuminate\Database\Seeder;
use App\Jobs\UpdateDatabaseJob;
use App\Jobs\InitializeDatabaseJob;
use function App\Providers\_log;

class DatabaseSeeder extends Seeder {

    public function run(): void {
//        self::InitializeDatabase();
        self::UpdateDatabase();
    }

    private function InitializeDatabase (): void {
        try {
            InitializeDatabaseJob::dispatchSync();
        } catch (Exception $exception) {
            _log($exception->getMessage(), SystemManager::ERROR_LOG, SystemManager::LOG_META);
        }
    }

    private function UpdateDatabase (): void {
        try {
            UpdateDatabaseJob::dispatchSync();
        } catch (Exception $exception) {
            _log($exception->getMessage(), SystemManager::ERROR_LOG,SystemManager::LOG_META);
        }
    }
}
