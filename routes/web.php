<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route sederhana untuk testing
Route::get('/test', function () {
    return 'Hello World! Laravel berjalan dengan baik.';
});

// Route Inertia (pastikan npm run dev sudah berjalan)
Route::get('/', function () {
    return Inertia::render('Test');
});