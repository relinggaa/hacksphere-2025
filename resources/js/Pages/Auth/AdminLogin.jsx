import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function AdminLogin() {
    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/admin/login', data, {
          
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 bg-white rounded-sm"></div>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">KAI Admin</span>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Before we can get your day started, lets sign in.
                        </p>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        type="button"
                        className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign in with Google
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={data.email}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={data.password}
                                onChange={handleChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                                    Keep my logged in
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    forgot password
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0">
                    {/* Floating geometric shapes */}
                    <div className="absolute top-20 left-20 w-16 h-16 bg-blue-200 rounded-lg transform rotate-12 opacity-60"></div>
                    <div className="absolute top-40 right-32 w-12 h-12 bg-purple-200 rounded-full opacity-50"></div>
                    <div className="absolute bottom-32 left-16 w-20 h-20 bg-indigo-200 rounded-lg transform -rotate-12 opacity-40"></div>
                    <div className="absolute bottom-20 right-20 w-14 h-14 bg-pink-200 rounded-full opacity-60"></div>
                    
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-12 gap-4 h-full">
                            {Array.from({ length: 144 }).map((_, i) => (
                                <div key={i} className="bg-blue-300 rounded-sm"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Illustration Container */}
                <div className="relative z-10 max-w-lg mx-auto">
                    {/* Central Dashboard Mockup */}
                    <div className="relative">
                        {/* Main Dashboard Card */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                                </div>
                                
                                {/* Charts */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg p-4 text-white">
                                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-2"></div>
                                        <div className="w-16 h-2 bg-white bg-opacity-60 rounded"></div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-4 text-white">
                                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-2"></div>
                                        <div className="w-16 h-2 bg-white bg-opacity-60 rounded"></div>
                                    </div>
                                </div>
                                
                                {/* Graph */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-end space-x-1 h-16">
                                        <div className="w-4 bg-blue-400 rounded-t" style={{height: '60%'}}></div>
                                        <div className="w-4 bg-blue-400 rounded-t" style={{height: '80%'}}></div>
                                        <div className="w-4 bg-blue-400 rounded-t" style={{height: '40%'}}></div>
                                        <div className="w-4 bg-blue-400 rounded-t" style={{height: '90%'}}></div>
                                        <div className="w-4 bg-blue-400 rounded-t" style={{height: '70%'}}></div>
                                        <div className="w-4 bg-blue-400 rounded-t" style={{height: '50%'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute -top-8 -right-8 bg-white rounded-xl shadow-lg p-4 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded opacity-80"></div>
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 transform rotate-12 hover:rotate-0 transition-transform duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded opacity-80"></div>
                            </div>
                        </div>
                    </div>

                    {/* People Illustrations */}
                    <div className="absolute -bottom-12 -left-12">
                        <div className="w-16 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-full"></div>
                        <div className="w-16 h-8 bg-blue-600 rounded-b-lg"></div>
                    </div>

                    <div className="absolute -top-8 -right-16">
                        <div className="w-14 h-18 bg-gradient-to-b from-purple-400 to-purple-600 rounded-t-full"></div>
                        <div className="w-14 h-6 bg-purple-600 rounded-b-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
