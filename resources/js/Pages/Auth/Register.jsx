import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Register() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user'
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/register', data, {
            onSuccess: (page) => {
                // Show success alert
                alert('Registrasi berhasil! Selamat datang di KAI Access.');
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
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getRoleDescription = (role) => {
        const descriptions = {
            user: 'Akses untuk memesan tiket, melihat jadwal kereta, dan mengelola perjalanan Anda.',
            porter: 'Akses untuk mengelola layanan bagasi, membantu penumpang, dan koordinasi dengan tim.',
            admin: 'Akses penuh untuk mengelola sistem, user, dan semua operasional KAI Access.'
        };
        return descriptions[role] || '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-green-600 text-white text-2xl font-bold py-3 px-6 rounded-lg mb-4 inline-block">
                        🚂 KAI Access
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Daftar Akun Baru</h2>
                    <p className="text-gray-600 mt-2">Bergabunglah dengan KAI Access sekarang</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Masukkan nama lengkap Anda"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Masukkan email Anda"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih Role
                        </label>
                        <select
                            name="role"
                            value={data.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        >
                            <option value="user">👤 User (Penumpang)</option>
                            <option value="porter">🎒 Porter (Petugas Bagasi)</option>
                            <option value="admin">👨‍💼 Admin (Administrator)</option>
                        </select>
                        
                        {/* Role Description */}
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-600">
                                <strong>Deskripsi:</strong> {getRoleDescription(data.role)}
                            </p>
                        </div>
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
                            placeholder="Minimal 8 karakter"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Konfirmasi Password
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Ulangi password Anda"
                            required
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Sudah punya akun?{' '}
                        <a
                            href="/login"
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Masuk di sini
                        </a>
                    </p>
                </div>

                {/* Terms */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                        Dengan mendaftar, Anda menyetujui{' '}
                        <a href="#" className="text-green-600 hover:underline">Syarat & Ketentuan</a>
                        {' '}dan{' '}
                        <a href="#" className="text-green-600 hover:underline">Kebijakan Privasi</a>
                        {' '}KAI Access.
                    </p>
                </div>
            </div>
        </div>
    );
}
