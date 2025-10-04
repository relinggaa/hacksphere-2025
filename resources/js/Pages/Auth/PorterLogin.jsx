import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function PorterLogin() {
    const [data, setData] = useState({
        email: '',
        key: '',
        remember: false
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/porter/login', data, {
            onSuccess: (page) => {
                alert('Login berhasil! Selamat datang di Portal Porter KAI Access.');
                
                console.log('Login successful, redirecting to dashboard...');
                console.log('Current URL:', window.location.href);
                
                window.location.href = '/porter/dashboard';
            },
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
        <div className="min-h-screen bg-gray-50">
            <div className="bg-green-500 px-4 pt-12 pb-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                            <span className="text-2xl">🚂</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">KAI Access</h1>
                            <p className="text-green-100 text-sm">Portal Porter</p>
                        </div>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6">
                {/* Welcome Card */}
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🎒</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang Porter</h2>
                        <p className="text-gray-600">Masuk untuk melayani penumpang dan mengelola pesanan</p>
                    </div>
                </div>

                {/* Login Form Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                Email Porter
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                                    placeholder="porter@kai.com"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                            )}
                        </div>

                        {/* Key */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                Key Login
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="key"
                                    value={data.key}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                                    placeholder="Masukkan key login porter"
                                    required
                                />
                            </div>
                            {errors.key && (
                                <p className="text-red-500 text-sm mt-2">{errors.key}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Key login diberikan saat pendaftaran porter
                            </p>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={handleChange}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label className="ml-3 block text-sm font-medium text-gray-700">
                                Ingat saya
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                        >
                            {processing ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                'Masuk ke Portal Porter'
                            )}
                        </button>
                    </form>
                </div>

                {/* Links */}
                <div className="mt-6 space-y-4">
                    <div className="text-center">
                        <p className="text-gray-600">
                            Belum terdaftar sebagai porter?{' '}
                            <a
                                href="/porter/register"
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                Daftar di sini
                            </a>
                        </p>
                    </div>
                    
                    <div className="text-center">
                        <a
                            href="/login"
                            className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                            ← Kembali ke pilihan role
                        </a>
                    </div>
                </div>

                {/* Info Cards */}
          
                    {/* Porter Services */}
                            
             
            </div>
        </div>
    );
}
