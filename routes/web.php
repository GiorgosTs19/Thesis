<?php /** @noinspection ALL */

use App\Http\Controllers\{AuthorController, Controller, WorkController};
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

Route::get('/', [Controller::class, 'showLogin']);
Route::get('/Author/{id}', [AuthorController::class, 'showAuthorPage'])->name('Author.Page');
Route::get('/Work/{id}', [WorkController::class, 'showWorkPage'])->name('Work.Page');
Route::get('/Article/{?oaurl}', [Controller::class, 'getArticle']);

Route::prefix('author')->group(function () {
    Route::get('/exists', [\App\Http\Controllers\SearchController::class, 'checkAuthorExists'])->name('check_author_exists');
});

Route::prefix('work')->group(function () {

});
