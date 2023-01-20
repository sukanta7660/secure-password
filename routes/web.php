<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\CommandController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\CredentialController;
use App\Http\Controllers\FolderController;
use App\Http\Middleware\EnsureUserHasPermission;
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\EnvController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['auth'])->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/password-generator', function () {
        return \Inertia\Inertia::render('Admin/Password/Generator');
    })->name('password.generator');


    Route::prefix('profile')->group(function(){
        Route::get('/', [ProfileController::class, 'show'])->name('profile');
        Route::patch('/change-password', [ProfileController::class, 'changePassword'])->name('change-password');
        Route::put('/update', [ProfileController::class, 'update'])->name('update-profile');
    });
    Route::prefix('folder')->name('folder.')->group(function(){
        Route::get('/', [FolderController::class, 'index'])->name('index');
        Route::post('/', [FolderController::class, 'store'])->name('store');
        Route::patch('/{folder}', [FolderController::class, 'update'])->name('update');
        Route::delete('/{folder}', [FolderController::class, 'destroy'])->name('delete');
    });

    Route::prefix('credential')->name('credential.')->group(function(){
        Route::get('/', [CredentialController::class, 'index'])->name('index');
        Route::post('/', [CredentialController::class, 'store'])->name('store');
        Route::patch('/{credential}', [CredentialController::class, 'update'])->name('update');
        Route::delete('/{credential}', [CredentialController::class, 'destroy'])->name('delete');
        Route::post('/move', [CredentialController::class, 'move'])->name('move');
        Route::post('/import/credentials', [CredentialController::class, 'importCsv'])->name('import.csv');
    });

    Route::post('/password/check', [CredentialController::class, 'checkMasterPassword'])->name('check.password');

});

//Route::get('/', fn() => redirect()->route('dashboard'));

require __DIR__ . '/auth.php';
