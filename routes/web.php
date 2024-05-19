<?php /** @noinspection ALL */

use App\Http\Controllers\{AuthenticationController,
    AuthorController,
    GroupController,
    HomeController,
    SearchController,
    WorkController};
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

Route::middleware('identified')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('Home.Page');
    Route::get('/author/{id}', [AuthorController::class, 'index'])->name('Author.Page');
    Route::get('/work/{id}', [WorkController::class, 'index'])->name('Work.Page');
    Route::get('/groups', [GroupController::class, 'index'])->name('Groups.Page');
});

Route::prefix('search')->group(function () {
    Route::get('/', [SearchController::class, 'search'])->name('Search');

    Route::prefix('authors')->group(function () {
        Route::get('/identifiers', [SearchController::class, 'searchAuthorsByIdentifiers'])->name('Search.Authors.Identifiers');
        Route::get('/not-in-group', [SearchController::class, 'searchWhereNotInGroup'])->name('Search.Authors.Users.Group');

    });

    Route::get('/works', [SearchController::class, 'search'])->name('Search.Works');

    // TODO Make sure only admins can access this route ( when roles are implemented in THESIS-5 )
    Route::get('/users', [SearchController::class, 'searchUsers'])->name('Search.Users');
});

// TODO Make sure only admins can access these routes ( when roles are implemented in THESIS-5 )
Route::prefix('/groups')->group(function () {
    Route::prefix('/all')->group(function () {
        Route::get('/', [GroupController::class, 'getAllGroups'])->name('Group.All');
        Route::get('/minimal-info', [GroupController::class, 'getGroupsMinInfo'])->name('Group.Minimal.Info');

    });
    Route::get('/{id}', [GroupController::class, 'getGroup'])->name('Groups.Get.Group');
    Route::post('/create', [GroupController::class, 'create'])->name('Group.Create');
    Route::post('/delete', [GroupController::class, 'destroy'])->name('Group.Delete');
    Route::prefix('/members')->group(function () {
        Route::post('/add', [GroupController::class, 'addMember'])->name('Group.Add.Member');
        Route::post('/remove', [GroupController::class, 'removeMember'])->name('Group.Remove.Member');
    });

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
    Route::post('/visibility/toggle', [WorkController::class, 'toggleWorkVisibility'])->name('Work.Visibility.Toggle');
    Route::get('/hidden', [WorkController::class, 'getHiddenAuthorWorks'])->name('Works.Hidden');
});

Route::prefix('/auth')->group(function () {
    Route::get('/iee', [AuthenticationController::class, 'toIEELogin'])->name('Auth.Login');
    Route::get('/verify/link-author', [AuthenticationController::class, 'showUserIdentifiers'])->name('Auth.Verify.Author');
    Route::get('/sign-in/iee/redirect', [AuthenticationController::class, 'handleIEECallback'])->name('Auth.Callback');
    Route::get('/check', [AuthenticationController::class, 'check'])->name('Auth.Check');
    Route::post('/logout', [AuthenticationController::class, 'logout'])->name('Auth.Logout');
    Route::post('/claim-author', [AuthenticationController::class, 'claimAuthor'])->name('Auth.Claim');
});

Route::prefix('/success')->group(function () {
    Route::get('/authenticated', [AuthenticationController::class, 'success'])->name('Success.Authentication');
});

Route::prefix('/test')->group(function () {
    Route::get('/', [\App\Http\Controllers\Controller::class, 'test']);
});
