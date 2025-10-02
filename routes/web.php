<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Inertia\Inertia;

// Route sederhana untuk testing
Route::get('/test', function () {
    return 'Hello World! Laravel berjalan dengan baik.';
});

// Authentication Routes - Separate for each role
Route::middleware('guest')->group(function () {
    // Admin Authentication
    Route::get('/admin/login', [AuthController::class, 'showAdminLogin'])->name('admin.login');
    Route::get('/admin/register', [AuthController::class, 'showAdminRegister'])->name('admin.register');
    Route::post('/admin/login', [AuthController::class, 'adminLogin']);
    Route::post('/admin/register', [AuthController::class, 'adminRegister']);
    
    // User Authentication
    Route::get('/user/login', [AuthController::class, 'showUserLogin'])->name('user.login');
    Route::get('/user/register', [AuthController::class, 'showUserRegister'])->name('user.register');
    Route::post('/user/login', [AuthController::class, 'userLogin']);
    Route::post('/user/register', [AuthController::class, 'userRegister']);
    
    // Porter Authentication
    Route::get('/porter/login', [AuthController::class, 'showPorterLogin'])->name('porter.login');
    Route::get('/porter/register', [AuthController::class, 'showPorterRegister'])->name('porter.register');
    Route::post('/porter/login', [AuthController::class, 'porterLogin']);
    Route::post('/porter/register', [AuthController::class, 'porterRegister']);
    
    // Generic routes (redirect to role selection)
    Route::get('/login', [AuthController::class, 'showRoleSelection'])->name('login');
    Route::get('/register', [AuthController::class, 'showRoleSelection'])->name('register');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    // Dashboard routes based on role
    Route::get('/admin/dashboard', [AuthController::class, 'dashboard'])->middleware('role:admin');
    Route::get('/user/dashboard', [AuthController::class, 'dashboard'])->middleware('role:user');
    Route::get('/porter/dashboard', [AuthController::class, 'dashboard'])->middleware('role:porter');
    
    // User specific routes
    Route::middleware('role:user')->group(function () {
        Route::get('/user/pesan-tiket', function () {
            return Inertia::render('User/PesanTiket');
        })->name('user.pesan-tiket');
    });
    
    // Generic dashboard route that redirects based on role
    Route::get('/dashboard', [AuthController::class, 'dashboard']);
});

// Root route - redirect to appropriate dashboard or login
Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});