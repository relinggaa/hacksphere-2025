import React, { useState, useEffect } from 'react';
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
    const [formKey, setFormKey] = useState(Date.now());


    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/user/register', data, {
            onSuccess: (page) => {
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
        <div className="min-h-screen bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button onClick={() => window.history.back()} className="flex items-center text-gray-600 hover:text-gray-800">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-lg font-medium text-gray-800">Daftar Akun</h1>
                <div className="w-6"></div> {/* Spacer untuk center alignment */}
            </div>

            {/* Main Content */}
            <div className="px-6 py-8">
                {/* Welcome Text */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-left">
                        Daftar Akun Access!
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed text-left">
                        Daftar akun Access untuk menikmati semua<br />
                        layanan dan fitur di Access!
                    </p>
                </div>

                <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
        
                    <div>
                        <label className="block text-sm font-light text-gray-700 mb-2">
                            Nama Lengkap
                        </label>
                        <input key={`name-${formKey}`}
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 text-base"
                            placeholder="Masukkan nama lengkap sesuai KTP"
                            required
                            autoComplete="off"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-light text-gray-700 mb-2">
                            Alamat Email
                        </label>
                        <input
                            key={`email-${formKey}`}
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 text-base"
                            placeholder="Masukkan alamat email"
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
                            placeholder="Minimal 8 karakter"
                            required
                            autoComplete="off"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-light text-gray-700 mb-2">
                            Konfirmasi Password
                        </label>
                        <input
                            key={`password_confirmation-${formKey}`}
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={handleChange}
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 text-base"
                            placeholder="Ulangi password"
                            required
                            autoComplete="off"
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-sm mt-2">{errors.password_confirmation}</p>
                        )}
                    </div>
                </form>
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
                    <button onClick={handleSubmit} disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                    >
                        {processing ? 'Memproses...' : 'LANJUTKAN'}
                    </button>
                </div>
                <div className="pb-24"></div>
            </div>
        </div>
    );
}
