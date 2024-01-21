<?php /** @noinspection ALL */

use App\Http\Controllers\{AuthorController, HomeController, WorkController};
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [HomeController::class, 'showHomePage'])->name('Home.Page');
Route::get('/author/{id}', [AuthorController::class, 'showAuthorPage'])->name('Author.Page');
Route::get('/work/{id}', [WorkController::class, 'showWorkPage'])->name('Work.Page');

Route::prefix('search')->group(function () {
    Route::get('/', [\App\Http\Controllers\SearchController::class, 'search'])->name('search');
});

Route::prefix('work')->group(function () {

});
