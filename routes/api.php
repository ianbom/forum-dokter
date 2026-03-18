<?php

use App\Http\Controllers\Api\WilayahController;
use Illuminate\Support\Facades\Route;

Route::prefix('wilayah')->group(function (): void {
    Route::get('provinces', [WilayahController::class, 'provinces']);
    Route::get('cities', [WilayahController::class, 'cities']);
});
