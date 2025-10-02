import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function UserLogin() {
    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [formKey, setFormKey] = useState(Date.now()); // Key untuk force re-render

    // Reset session dan clear form saat component mount
    useEffect(() => {
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear any cookies related to authentication
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Force clear form dengan timeout untuk memastikan DOM sudah ready
        setTimeout(() => {
            // Reset form data ke nilai kosong
            setData({
                email: '',
                password: '',
                remember: false
            });
            
            // Clear errors
            setErrors({});
            
            // Reset processing state
            setProcessing(false);
            
            // Force re-render form
            setFormKey(Date.now());
            
            // Clear any form elements directly
            const emailInput = document.querySelector('input[name="email"]');
            const passwordInput = document.querySelector('input[name="password"]');
            
            if (emailInput) emailInput.value = '';
            if (passwordInput) passwordInput.value = '';
        }, 100);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/user/login', data, {
            onSuccess: (page) => {
                // Show success alert
                alert('Login berhasil! Selamat datang di KAI Access.');
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
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-6 bg-transparent z-50"></div>
            <div className="flex flex-col min-h-screen">
                <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8"></div>
                <div className="bg-white rounded-t-3xl px-6 py-8 min-h-[60vh] shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
                            Selamat Datang Di Access!
                        </h1>
                        <p className="text-gray-600 text-sm leading-relaxed text-left">
                            Login atau Register sekarang! untuk menikmati<br />
                            Semua fitur yang tersedia di Access.
                        </p>
                    </div>
                    <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-light text-gray-700 mb-2">
                                Email / No. Telp
                            </label>
                            <input
                                key={`email-${formKey}`}
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 text-base"
                                placeholder="Masukkan email atau no telp anda"
                                required
                                autoComplete="off"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-light text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                key={`password-${formKey}`}
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 text-base"
                                placeholder="Masukkan password"
                                required
                                autoComplete="off"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                        >
                            {processing ? 'Memproses...' : 'MASUK'}
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-gray-600 text-sm">
                            <a>Belum punya akun Access? {' '}</a>
                            <a
                                href="/user/register"
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                            >
                                Daftar Sekarang
                            </a>
                        </p>
                    </div>
                    <div className="text-center mt-6 mb-6">
                        <span className="text-gray-400 text-sm">Atau gunakan akun</span>
                    </div>
                    <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-sm">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Sign in with Google</span>
                    </button>
                    <div className="text-center mt-8">
                        <a
                            href="#"
                            className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300"
                        >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            Mengalami Kendala? Hubungi Kami
                            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
