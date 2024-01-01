<?php

namespace App\Utility;

use Illuminate\Support\Facades\Artisan;
use function App\Providers\rocketDump;

class SystemManager {

    /**
     * Enable Maintenance Mode.
     * @return void
     */
    public static function enableMaintenanceMode(): void {
        // Enable maintenance mode
        rocketDump('Turning On Maintenance mode');
        Artisan::call('down');
    }

    /**
     * Disable Maintenance Mode.
     * @return void
     */
    public static function disableMaintenanceMode(): void {
        // Disable maintenance mode
        rocketDump('Turning Off Maintenance mode');
        Artisan::call('up');
    }
}
