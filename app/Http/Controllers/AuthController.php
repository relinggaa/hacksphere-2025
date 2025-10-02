<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show role selection page
     */
    public function showRoleSelection()
    {
        return Inertia::render('Auth/RoleSelection');
    }

    /**
     * Show admin login form
     */
    public function showAdminLogin()
    {
        return Inertia::render('Auth/AdminLogin');
    }

    /**
     * Show admin register form
     */
    public function showAdminRegister()
    {
        return Inertia::render('Auth/AdminRegister');
    }

    /**
     * Show user login form
     */
    public function showUserLogin()
    {
        return Inertia::render('Auth/UserLogin');
    }

    /**
     * Show user register form
     */
    public function showUserRegister()
    {
        return Inertia::render('Auth/UserRegister');
    }

    /**
     * Show porter login form
     */
    public function showPorterLogin()
    {
        return Inertia::render('Auth/PorterLogin');
    }

    /**
     * Show porter register form
     */
    public function showPorterRegister()
    {
        return Inertia::render('Auth/PorterRegister');
    }

    /**
     * Handle admin login
     */
    public function adminLogin(Request $request)
    {
        return $this->handleRoleLogin($request, 'admin');
    }

    /**
     * Handle user login
     */
    public function userLogin(Request $request)
    {
        return $this->handleRoleLogin($request, 'user');
    }

    /**
     * Handle porter login
     */
    public function porterLogin(Request $request)
    {
        return $this->handleRoleLogin($request, 'porter');
    }

    /**
     * Generic login handler for specific role
     */
    private function handleRoleLogin(Request $request, string $role)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Check if user exists with the specified role
        $user = User::where('email', $request->email)
                   ->where('role', $role)
                   ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password tidak sesuai untuk role ' . ucfirst($role) . '.'],
            ]);
        }

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        // Redirect based on role
        return redirect($this->getRedirectUrl($user->role));
    }

    /**
     * Handle admin register
     */
    public function adminRegister(Request $request)
    {
        return $this->handleRoleRegister($request, 'admin');
    }

    /**
     * Handle user register
     */
    public function userRegister(Request $request)
    {
        return $this->handleRoleRegister($request, 'user');
    }

    /**
     * Handle porter register
     */
    public function porterRegister(Request $request)
    {
        return $this->handleRoleRegister($request, 'porter');
    }

    /**
     * Generic register handler for specific role
     */
    private function handleRoleRegister(Request $request, string $role)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role,
        ]);

        Auth::login($user);

        return redirect($this->getRedirectUrl($user->role));
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    /**
     * Get redirect URL based on role
     */
    private function getRedirectUrl($role)
    {
        return match($role) {
            'admin' => '/admin/dashboard',
            'user' => '/user/dashboard',
            'porter' => '/porter/dashboard',
            default => '/dashboard'
        };
    }


    /**
     * Show dashboard based on role
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        return match($user->role) {
            'admin' => Inertia::render('Dashboard/Admin', ['user' => $user]),
            'user' => Inertia::render('Dashboard/User', ['user' => $user]),
            'porter' => Inertia::render('Dashboard/Porter', ['user' => $user]),
            default => redirect('/login')
        };
    }
}