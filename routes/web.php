<?php

use App\Http\Controllers\DashboardController;
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
    Route::get('posts', function () {
        return Inertia::render('admin/posts/index');
    })->name('posts.index');

    Route::get('posts/{post}', function () {
        return Inertia::render('admin/posts/show');
    })->name('posts.show');

    Route::get('users', function () {
        return Inertia::render('admin/users/index');
    })->name('users.index');
});

require __DIR__.'/settings.php';
