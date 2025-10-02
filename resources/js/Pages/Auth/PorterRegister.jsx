import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function PorterRegister() {
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

        router.post('/porter/register', data, {
            onSuccess: (page) => {
                // Show success alert
                alert('Registrasi porter berhasil! Selamat bergabung dengan tim KAI Access.');
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
        <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-green-600 text-white text-2xl font-bold py-3 px-6 rounded-lg mb-4 inline-block">
                        🚂 KAI Access
                    </div>
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4 inline-flex items-center">
                        <span className="text-xl mr-2">🎒</span>
                        <span className="font-semibold">Daftar Porter</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Registrasi Porter</h2>
                    <p className="text-gray-600 mt-2">Bergabunglah sebagai porter dan dapatkan penghasilan tambahan</p>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="porter@example.com"
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
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Daftar sebagai Porter'}
                    </button>
                </form>

                {/* Links */}
                <div className="mt-6 space-y-4">
                    <div className="text-center">
                        <p className="text-gray-600">
                            Sudah terdaftar sebagai porter?{' '}
                            <a
                                href="/porter/login"
                                className="text-green-600 hover:text-green-700 font-medium"
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

                {/* Porter Benefits */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Keuntungan Menjadi Porter:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                        <li>💰 Penghasilan Rp 300K - 1.5M/bulan</li>
                        <li>⏰ Jam kerja fleksibel</li>
                        <li>📱 Aplikasi mudah digunakan</li>
                        <li>⭐ Sistem rating transparan</li>
                        <li>🎁 Bonus performa bulanan</li>
                        <li>🏥 Asuransi kecelakaan kerja</li>
                    </ul>
                </div>

                {/* Requirements */}
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Persyaratan Porter:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Usia 18-55 tahun</li>
                        <li>• Sehat jasmani dan rohani</li>
                        <li>• Memiliki smartphone</li>
                        <li>• Bersedia bekerja di stasiun</li>
                        <li>• Berpenampilan rapi dan sopan</li>
                    </ul>
                </div>

                {/* Next Steps */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                        <strong>Langkah selanjutnya:</strong> Setelah registrasi, tim kami akan menghubungi 
                        Anda dalam 1-2 hari kerja untuk proses verifikasi dan orientasi.
                    </p>
                </div>
            </div>
        </div>
    );
}
