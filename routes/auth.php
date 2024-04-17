<?php /** @noinspection ALL */

use App\Http\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/login', [AuthController::class, 'index'])->name('login');