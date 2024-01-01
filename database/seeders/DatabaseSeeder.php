<?php

namespace Database\Seeders;

use Exception;
use Illuminate\Database\Seeder;
use App\Jobs\UpdateDatabaseJob;
use App\Jobs\InitializeDatabaseJob;
use function App\Providers\rocketDump;

class DatabaseSeeder extends Seeder {

    public function run(): void {
//        self::InitializeDatabase();
        self::UpdateDatabase();
    }

    private function InitializeDatabase (): void {
        try {
            InitializeDatabaseJob::dispatchSync();
        } catch (Exception $exception) {
            rocketDump($exception->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
        }
    }

    private function UpdateDatabase (): void {
        try {
            UpdateDatabaseJob::dispatchSync();
        } catch (Exception $exception) {
            rocketDump($exception->getMessage(), 'error', [__FUNCTION__,__FILE__,__LINE__]);
        }
    }
}
