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
        Route::get('/users/group', [SearchController::class, 'searchWhereNotInGroup'])->name('Search.Authors.Users.Group');

    });

    Route::get('/works', [SearchController::class, 'search'])->name('Search.Works');

    // TODO Make sure only admins can access this route ( when roles are implemented in THESIS-5 )
    Route::get('/users', [SearchController::class, 'searchUsers'])->name('Search.Users');
});

// TODO Make sure only admins can access these routes ( when roles are implemented in THESIS-5 )
Route::prefix('/groups')->group(function () {
    Route::get('/', [\App\Http\Controllers\GroupController::class, 'show'])->name('Groups.Page');
    Route::get('/{id}', [\App\Http\Controllers\GroupController::class, 'getGroup'])->name('Groups.Get.Group');
    Route::post('/create', [\App\Http\Controllers\GroupController::class, 'create'])->name('Group.Create');
    Route::post('/delete', [\App\Http\Controllers\GroupController::class, 'destroy'])->name('Group.Delete');
    Route::post('/add/member', [\App\Http\Controllers\GroupController::class, 'addMember'])->name('Group.Add.Member');
    Route::post('/remove/member', [\App\Http\Controllers\GroupController::class, 'removeMember'])->name('Group.Remove.Member');
});

Route::prefix('works')->group(function () {
    Route::post('/filter', [WorkController::class, 'filterWorks'])->name('Works.Filter');
});

Route::prefix('test')->group(function () {
    Route::get('/', [\App\Http\Controllers\Controller::class, 'testOrcIdAuthorRequest']);
});
