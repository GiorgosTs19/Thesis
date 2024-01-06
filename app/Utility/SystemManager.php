<?php

namespace App\Utility;

use Illuminate\Support\Facades\Artisan;

class SystemManager {

    const INFO_LOG = 'info';
    const ERROR_LOG = 'error';
    const DEBUG_LOG = 'debug';
    const WARNING_LOG = 'warning';
    const LOG_META = [__FUNCTION__,__FILE__,__LINE__];
    /**
     * Enable Maintenance Mode.
     * @return void
     */
    public static function enableMaintenanceMode(): void {
        // Enable maintenance mode
        ULog::log('Turning On Maintenance mode');
        Artisan::call('down');
    }

    /**
     * Disable Maintenance Mode.
     * @return void
     */
    public static function disableMaintenanceMode(): void {
        // Disable maintenance mode
        ULog::log('Turning Off Maintenance mode');
        Artisan::call('up');
    }
}
