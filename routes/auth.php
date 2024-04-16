<?php /** @noinspection ALL */

use App\Http\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('/auth')->middleware('web')->group(function () {
    Route::get('sign-in/iee', [AuthController::class, 'iee'])->name('Auth.Login');
    Route::get('sign-in/iee/redirect', [AuthController::class, 'ieeRedirect'])->name('Auth.Login.Redirect');
});