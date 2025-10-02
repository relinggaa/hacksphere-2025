import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function UserLogin() {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            
            {/* Main Container with Glassmorphism */}
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="relative inline-block mb-6">
                        <div className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 text-white text-3xl font-bold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-float">
                            🚂 KAI Access
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl mb-6 inline-flex items-center border border-white/30">
                        <span className="text-2xl mr-3">👤</span>
                        <span className="font-semibold text-lg">Portal Penumpang</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        Login Penumpang
                    </h2>
                    <p className="text-blue-100 text-lg">Masuk untuk memesan tiket dan menggunakan layanan kereta</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-3">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/70 transition-all duration-300"
                            placeholder="user@example.com"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-300 text-sm mt-2">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-3">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/70 transition-all duration-300"
                            placeholder="Masukkan password Anda"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-300 text-sm mt-2">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-white/30 rounded bg-white/20"
                        />
                        <label className="ml-3 block text-sm text-white">
                            Ingat saya
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                    >
                        {processing ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                {/* Links */}
                <div className="mt-8 space-y-4">
                    <div className="text-center">
                        <p className="text-white/80">
                            Belum punya akun?{' '}
                            <a
                                href="/user/register"
                                className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors duration-300"
                            >
                                Daftar sebagai penumpang
                            </a>
                        </p>
                    </div>
                    
                    <div className="text-center">
                        <a
                            href="/login"
                            className="text-white/60 hover:text-white/80 text-sm transition-colors duration-300"
                        >
                            ← Kembali ke pilihan role
                        </a>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <h4 className="font-medium text-white text-lg mb-4 text-center">Fitur Penumpang:</h4>
                    <ul className="text-sm text-white/80 space-y-3">
                        <li className="flex items-center"><span className="mr-3 text-lg">🎫</span> Pesan tiket kereta online</li>
                        <li className="flex items-center"><span className="mr-3 text-lg">📅</span> Lihat jadwal kereta real-time</li>
                        <li className="flex items-center"><span className="mr-3 text-lg">🎒</span> Pesan layanan porter</li>
                        <li className="flex items-center"><span className="mr-3 text-lg">📋</span> Riwayat perjalanan</li>
                        <li className="flex items-center"><span className="mr-3 text-lg">💳</span> Pembayaran digital</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
