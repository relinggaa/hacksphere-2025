import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function UserRegister() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/user/register', data, {
            onSuccess: (page) => {
                // Show success alert
                alert('Registrasi berhasil! Selamat datang di KAI Access. Selamat menikmati perjalanan Anda!');
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-blue-600 text-white text-2xl font-bold py-3 px-6 rounded-lg mb-4 inline-block">
                        🚂 KAI Access
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mb-4 inline-flex items-center">
                        <span className="text-xl mr-2">👤</span>
                        <span className="font-semibold">Daftar Penumpang</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Registrasi Penumpang</h2>
                    <p className="text-gray-600 mt-2">Bergabunglah dengan KAI Access untuk kemudahan perjalanan kereta</p>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan nama lengkap sesuai KTP"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="user@example.com"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ulangi password"
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>

                {/* Links */}
                <div className="mt-6 space-y-4">
                    <div className="text-center">
                        <p className="text-gray-600">
                            Sudah punya akun?{' '}
                            <a
                                href="/user/login"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Login di sini
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

                {/* Benefits */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Keuntungan Bergabung:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>🎫 Pesan tiket online 24/7</li>
                        <li>💳 Pembayaran digital yang aman</li>
                        <li>📱 E-tiket langsung ke HP</li>
                        <li>🎒 Akses layanan porter</li>
                        <li>🎁 Poin reward setiap perjalanan</li>
                        <li>📧 Notifikasi jadwal dan promo</li>
                    </ul>
                </div>

                {/* Terms */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                        Dengan mendaftar, Anda menyetujui{' '}
                        <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a>
                        {' '}dan{' '}
                        <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a>
                        {' '}KAI Access.
                    </p>
                </div>
            </div>
        </div>
    );
}
