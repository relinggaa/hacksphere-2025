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

    public function showRoleSelection()
    {
        return Inertia::render('Auth/RoleSelection');
    }

 
    public function showAdminLogin()
    {
        return Inertia::render('Auth/AdminLogin');
    }

   
    public function showAdminRegister()
    {
        return Inertia::render('Auth/AdminRegister');
    }

    public function showUserLogin()
    {
        return Inertia::render('Auth/UserLogin');
    }

 
    public function showUserRegister()
    {
        return Inertia::render('Auth/UserRegister');
    }

  
    public function showPorterLogin()
    {
        return Inertia::render('Auth/PorterLogin');
    }


    public function showPorterRegister()
    {
        return Inertia::render('Auth/PorterRegister');
    }

 
    public function adminLogin(Request $request)
    {
        return $this->handleRoleLogin($request, 'admin');
    }

   
    public function userLogin(Request $request)
    {
        return $this->handleRoleLogin($request, 'user');
    }

 
    public function porterLogin(Request $request)
    {
        return $this->handleRoleLogin($request, 'porter');
    }

   
    private function handleRoleLogin(Request $request, string $role)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

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

        return redirect($this->getRedirectUrl($user->role));
    }

 
    public function adminRegister(Request $request)
    {
        return $this->handleRoleRegister($request, 'admin');
    }

   
    public function userRegister(Request $request)
    {
        return $this->handleRoleRegister($request, 'user');
    }


    public function porterRegister(Request $request)
    {
        return $this->handleRoleRegister($request, 'porter');
    }


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


    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }


    private function getRedirectUrl($role)
    {
        return match($role) {
            'admin' => '/admin/dashboard',
            'user' => '/user/dashboard',
            'porter' => '/porter/dashboard',
            default => '/dashboard'
        };
    }


  
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