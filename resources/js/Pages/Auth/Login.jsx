import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
        role: 'user',
        remember: false
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/login', data, {
            onSuccess: (page) => {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-600 text-white text-2xl font-bold py-3 px-6 rounded-lg mb-4 inline-block">
                        🚂 KAI Access
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Masuk ke Akun Anda</h2>
                    <p className="text-gray-600 mt-2">Silakan pilih role dan masukkan kredensial Anda</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih Role
                        </label>
                        <select
                            name="role"
                            value={data.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="user">👤 User (Penumpang)</option>
                            <option value="porter">🎒 Porter (Petugas Bagasi)</option>
                            <option value="admin">👨‍💼 Admin (Administrator)</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan email Anda"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan password Anda"
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Ingat saya
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Belum punya akun?{' '}
                        <a
                            href="/register"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Daftar di sini
                        </a>
                    </p>
                </div>

                {/* Role Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Informasi Role:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>👤 <strong>User:</strong> Akses untuk penumpang kereta</li>
                        <li>🎒 <strong>Porter:</strong> Akses untuk petugas bagasi</li>
                        <li>👨‍💼 <strong>Admin:</strong> Akses penuh sistem</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
