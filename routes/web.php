<?php /** @noinspection ALL */

use App\Http\Controllers\{AuthorController, HomeController, SearchController, WorkController};
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
    Route::get('/', [SearchController::class, 'search'])->name('Search');

    Route::prefix('authors')->group(function () {
        Route::get('/', [SearchController::class, 'search'])->name('Search.Authors');
        Route::get('/users', [SearchController::class, 'searchAuthorUsers'])->name('Search.Authors.Users');
    });

    Route::get('/works', [SearchController::class, 'search'])->name('Search.Works');

    // TODO Make sure only admins can access this route ( when roles are implemented in THESIS-5 )
    Route::get('/users', [SearchController::class, 'searchUsers'])->name('Search.Users');
});

Route::prefix('work')->group(function () {

});
