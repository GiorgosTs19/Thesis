<?php /** @noinspection ALL */

use App\Http\Controllers\{AuthorController, GroupController, HomeController, SearchController, WorkController};
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
    Route::get('/', [GroupController::class, 'show'])->name('Groups.Page');
    Route::get('/all', [GroupController::class, 'getAllGroups'])->name('Group.All');
    Route::get('/{id}', [GroupController::class, 'getGroup'])->name('Groups.Get.Group');
    Route::post('/create', [GroupController::class, 'create'])->name('Group.Create');
    Route::post('/delete', [GroupController::class, 'destroy'])->name('Group.Delete');
    Route::post('/add/member', [GroupController::class, 'addMember'])->name('Group.Add.Member');
    Route::post('/remove/member', [GroupController::class, 'removeMember'])->name('Group.Remove.Member');
    Route::get('/get/all/info/minimal', [GroupController::class, 'getGroupMinInfo'])->name('Group.Minimal.Info');

    Route::prefix('/omea')->group(function () {
        Route::prefix('/stats')->group(function () {
            Route::get('/authors/{id}', [GroupController::class, 'getOmeaAuthorStats'])->name('Group.Omea.Author.Stats');
            Route::get('/types/{id}/{min?}/{max?}', [GroupController::class, 'getOmeaTypeStats'])->name('Group.Omea.Type.Stats');
        });
    });
});

Route::prefix('works')->group(function () {
    Route::get('/filter', [WorkController::class, 'filterWorks'])->name('Works.Filter');
    Route::get('/metadata', [WorkController::class, 'getMetadata'])->name('Works.Metadata');
});

Route::prefix('/auth')->group(function () {
    Route::get('/iee', [\App\Http\Controllers\AuthenticationController::class, 'toIEELogin'])->name('Auth.Login');
    Route::get('/sign-in/iee/redirect', [\App\Http\Controllers\AuthenticationController::class, 'handleIEECallback'])->name('Auth.Callback');
    Route::get('/check', [\App\Http\Controllers\AuthenticationController::class, 'check'])->name('Auth.Check');
    Route::post('/logout', [\App\Http\Controllers\AuthenticationController::class, 'logout'])->name('Auth.Logout');
});

Route::prefix('/success')->group(function () {
    Route::get('/authenticated', [\App\Http\Controllers\AuthenticationController::class, 'success'])->name('Success.Authentication');
});

Route::prefix('test')->group(function () {
    Route::get('/', [\App\Http\Controllers\Controller::class, 'testOrcIdAuthorRequest']);
});
