<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::post('posts/upload-image', [PostController::class, 'uploadImage'])->name('posts.upload-image');
    Route::resource('posts', PostController::class);
    Route::resource('comments', CommentController::class);
    Route::resource('categories', CategoryController::class);

    Route::get('users', [UserController::class, 'index'])->name('users.index');
});

require __DIR__.'/settings.php';
