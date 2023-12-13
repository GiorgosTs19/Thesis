<?php /** @noinspection ALL */

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthorController;

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

Route::get('/',[Controller::class, 'showLogin']);
Route::get('/Author',[AuthorController::class, 'getAuthor']);
Route::get('/Article/{?oaurl}', [Controller::class, 'getArticle']);

Route::prefix('author')->group(function () {
    Route::get('/exists',[\App\Http\Controllers\SearchController::class,'checkAuthorExists'])->name('check_author_exists');
});

Route::prefix('work')->group(function () {

});
