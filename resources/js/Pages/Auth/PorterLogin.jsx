import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function PorterLogin() {
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

        router.post('/porter/login', data, {
            onSuccess: (page) => {
                // Show success alert
                alert('Login berhasil! Selamat datang di Portal Porter KAI Access.');
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
        <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-green-600 text-white text-2xl font-bold py-3 px-6 rounded-lg mb-4 inline-block">
                        🚂 KAI Access
                    </div>
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4 inline-flex items-center">
                        <span className="text-xl mr-2">🎒</span>
                        <span className="font-semibold">Portal Porter</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Login Porter</h2>
                    <p className="text-gray-600 mt-2">Masuk untuk melayani penumpang dan mengelola pesanan</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Porter
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="porter@kai.com"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Masukkan password porter"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Ingat saya
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Masuk ke Portal Porter'}
                    </button>
                </form>

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

                {/* Porter Info */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Layanan Porter:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                        <li>🎒 Bantuan angkut bagasi</li>
                        <li>🚶‍♂️ Antar penumpang ke peron</li>
                        <li>💰 Kelola pendapatan harian</li>
                        <li>📱 Terima pesanan real-time</li>
                        <li>⭐ Sistem rating dan review</li>
                    </ul>
                </div>

                {/* Working Hours */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                        <strong>Jam Operasional:</strong> 05:00 - 23:00 WIB
                    </p>
                </div>
            </div>
        </div>
    );
}
