<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StasiunController;
use App\Http\Controllers\KeretaController;
use App\Http\Controllers\Api\StasiunController as ApiStasiunController;
use App\Http\Controllers\Api\User\ScheduleController;
use App\Http\Controllers\Api\User\AvailabilityController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\TiketAntarKotaController;
use App\Http\Controllers\TiketCommuterController;
use App\Http\Controllers\TiketLrtController;
use App\Http\Controllers\TiketBandaraController;
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
    Route::get('/login', [AuthController::class, 'showUserLogin'])->name('login');
    Route::get('/register', [AuthController::class, 'showRegisterUser'])->name('register');
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
        
        Route::get('/user/jadwal-kereta', function () {
            return Inertia::render('User/JadwalKereta', [
                'searchData' => request()->all()
            ]);
        })->name('user.jadwal-kereta');
        
        // API routes for user
        Route::get('/api/user/stations', [ApiStasiunController::class, 'index'])->name('api.user.stations');
        Route::get('/api/user/stations/all', [ApiStasiunController::class, 'all'])->name('api.user.stations.all');
  
        // API routes untuk chatbot
        Route::post('/api/user/chatbot/chat', [ChatbotController::class, 'chat'])->name('api.user.chatbot.chat');
        Route::get('/api/user/chatbot/health', [ChatbotController::class, 'health'])->name('api.user.chatbot.health');
    });
    
    // Generic dashboard route that redirects based on role
    Route::get('/dashboard', [AuthController::class, 'dashboard']);
    
    // Stasiun routes - only accessible by admin
    Route::middleware('role:admin')->group(function () {
        Route::get('/api/stasiuns', [StasiunController::class, 'index'])->name('stasiuns.index');
        Route::post('/api/stasiuns', [StasiunController::class, 'store'])->name('stasiuns.store');
        Route::get('/api/stasiuns/{id}', [StasiunController::class, 'show'])->name('stasiuns.show');
        Route::put('/api/stasiuns/{id}', [StasiunController::class, 'update'])->name('stasiuns.update');
        Route::delete('/api/stasiuns/{id}', [StasiunController::class, 'destroy'])->name('stasiuns.destroy');
        
        // Kereta routes - only accessible by admin
        Route::get('/api/keretas', [KeretaController::class, 'index'])->name('keretas.index');
        Route::post('/api/keretas', [KeretaController::class, 'store'])->name('keretas.store');
        Route::get('/api/keretas/{id}', [KeretaController::class, 'show'])->name('keretas.show');
        Route::put('/api/keretas/{id}', [KeretaController::class, 'update'])->name('keretas.update');
        Route::delete('/api/keretas/{id}', [KeretaController::class, 'destroy'])->name('keretas.destroy');
        
        // Tiket Antar Kota routes - only accessible by admin
        Route::get('/api/tiket-antar-kotas', [TiketAntarKotaController::class, 'index'])->name('tiket-antar-kotas.index');
        Route::post('/api/tiket-antar-kotas', [TiketAntarKotaController::class, 'store'])->name('tiket-antar-kotas.store');
        Route::get('/api/tiket-antar-kotas/{id}', [TiketAntarKotaController::class, 'show'])->name('tiket-antar-kotas.show');
        Route::put('/api/tiket-antar-kotas/{id}', [TiketAntarKotaController::class, 'update'])->name('tiket-antar-kotas.update');
        Route::delete('/api/tiket-antar-kotas/{id}', [TiketAntarKotaController::class, 'destroy'])->name('tiket-antar-kotas.destroy');
        
        // Tiket Commuter routes - only accessible by admin
        Route::get('/api/tiket-commuters', [TiketCommuterController::class, 'index'])->name('tiket-commuters.index');
        Route::post('/api/tiket-commuters', [TiketCommuterController::class, 'store'])->name('tiket-commuters.store');
        Route::get('/api/tiket-commuters/{id}', [TiketCommuterController::class, 'show'])->name('tiket-commuters.show');
        Route::put('/api/tiket-commuters/{id}', [TiketCommuterController::class, 'update'])->name('tiket-commuters.update');
        Route::delete('/api/tiket-commuters/{id}', [TiketCommuterController::class, 'destroy'])->name('tiket-commuters.destroy');
        
        // Tiket LRT routes - only accessible by admin
        Route::get('/api/tiket-lrt', [TiketLrtController::class, 'index'])->name('tiket-lrt.index');
        Route::post('/api/tiket-lrt', [TiketLrtController::class, 'store'])->name('tiket-lrt.store');
        Route::get('/api/tiket-lrt/{id}', [TiketLrtController::class, 'show'])->name('tiket-lrt.show');
        Route::put('/api/tiket-lrt/{id}', [TiketLrtController::class, 'update'])->name('tiket-lrt.update');
        Route::delete('/api/tiket-lrt/{id}', [TiketLrtController::class, 'destroy'])->name('tiket-lrt.destroy');
        
        // Tiket Bandara routes - only accessible by admin
        Route::get('/api/tiket-bandara', [TiketBandaraController::class, 'index'])->name('tiket-bandara.index');
        Route::post('/api/tiket-bandara', [TiketBandaraController::class, 'store'])->name('tiket-bandara.store');
        Route::get('/api/tiket-bandara/{id}', [TiketBandaraController::class, 'show'])->name('tiket-bandara.show');
        Route::put('/api/tiket-bandara/{id}', [TiketBandaraController::class, 'update'])->name('tiket-bandara.update');
        Route::delete('/api/tiket-bandara/{id}', [TiketBandaraController::class, 'destroy'])->name('tiket-bandara.destroy');
        
        // Additional routes for dropdown data
        Route::get('/api/dropdown/keretas', [TiketAntarKotaController::class, 'getKeretas'])->name('dropdown.keretas');
        Route::get('/api/dropdown/stasiuns', [TiketAntarKotaController::class, 'getStasiuns'])->name('dropdown.stasiuns');
        Route::get('/api/dropdown/commuter-keretas', [TiketCommuterController::class, 'getKeretas'])->name('dropdown.commuter-keretas');
        Route::get('/api/dropdown/commuter-stasiuns', [TiketCommuterController::class, 'getStasiuns'])->name('dropdown.commuter-stasiuns');
        Route::get('/api/dropdown/lrt-keretas', [TiketLrtController::class, 'getKeretas'])->name('dropdown.lrt-keretas');
        Route::get('/api/dropdown/lrt-stasiuns', [TiketLrtController::class, 'getStasiuns'])->name('dropdown.lrt-stasiuns');
        Route::get('/api/dropdown/bandara-keretas', [TiketBandaraController::class, 'getKeretas'])->name('dropdown.bandara-keretas');
        Route::get('/api/dropdown/bandara-stasiuns', [TiketBandaraController::class, 'getStasiuns'])->name('dropdown.bandara-stasiuns');
    });
});

// Public API routes for testing
Route::get('/api/public/schedules', [ScheduleController::class, 'getSchedules'])->name('api.public.schedules');
Route::get('/api/public/availability', [AvailabilityController::class, 'checkAvailability'])->name('api.public.availability');

// Public routes for testing
Route::get('/public/pesan-tiket', function () {
    return Inertia::render('User/PesanTiket');
})->name('public.pesan-tiket');

Route::get('/public/jadwal-kereta', [App\Http\Controllers\User\JadwalKeretaController::class, 'index'])->name('public.jadwal-kereta');

Route::get('/public/profile', function () {
    return Inertia::render('User/Profile', [
        'auth' => auth()->user()
    ]);
})->name('public.profile');

// Public API routes untuk jadwal kereta
Route::get('/api/public/schedules', [App\Http\Controllers\Api\User\ScheduleController::class, 'getSchedules'])->name('api.public.schedules');
Route::get('/api/public/availability', [App\Http\Controllers\Api\User\AvailabilityController::class, 'checkAvailability'])->name('api.public.availability');

// Cart page (public)
Route::get('/public/cart', function () {
    return Inertia::render('User/Cart');
})->name('public.cart');

Route::get('/public/tickets', function () {
    return Inertia::render('User/Tickets');
})->name('public.tickets');

Route::get('/public/receipt/{id}', function ($id) {
    return Inertia::render('User/Receipt', ['id' => $id]);
})->name('public.receipt');

// API Cart (auth)
Route::middleware('auth')->group(function () {
    Route::get('/api/cart', [App\Http\Controllers\Api\CartController::class, 'index']);
    Route::post('/api/cart', [App\Http\Controllers\Api\CartController::class, 'store']);
    Route::delete('/api/cart/items/{id}', [App\Http\Controllers\Api\CartController::class, 'destroyItem']);
    Route::delete('/api/cart/clear', [App\Http\Controllers\Api\CartController::class, 'clear']);

    // Orders Antar Kota
    Route::get('/api/orders/antar-kota', [App\Http\Controllers\Api\OrderAntarKotaController::class, 'index']);
    Route::post('/api/orders/antar-kota', [App\Http\Controllers\Api\OrderAntarKotaController::class, 'store']);
    Route::get('/api/orders/antar-kota/{id}', [App\Http\Controllers\Api\OrderAntarKotaController::class, 'show']);
});
// API routes untuk passenger groups (memerlukan authentication)
Route::middleware('auth')->group(function () {
    Route::apiResource('api/passenger-groups', App\Http\Controllers\Api\PassengerGroupController::class);
});

// Root route - redirect to appropriate dashboard or login
Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});