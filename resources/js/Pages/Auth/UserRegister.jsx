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
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            });
            
            // Clear errors
            setErrors({});
            
            // Reset processing state
            setProcessing(false);
            
            // Force re-render form
            setFormKey(Date.now());
        }, 100);
    }, []);

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
        <div className="min-h-screen bg-white">
            {/* Header dengan back button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button 
                    onClick={() => window.history.back()}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                >
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
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-light text-gray-700 mb-2">
                            Nama Lengkap
                        </label>
                        <input
                            key={`name-${formKey}`}
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

                    {/* Email */}
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

                    {/* Email Verification Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Pastikan email kamu aktif, ya! Kode verifikasi akan dikirim ke alamat yang didaftarkan.
                            </p>
                        </div>
                    </div>

                    {/* Password */}
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

                    {/* Confirm Password */}
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

                {/* Submit Button - Fixed at bottom */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                    >
                        {processing ? 'Memproses...' : 'LANJUTKAN'}
                    </button>
                </div>

                {/* Spacer untuk fixed button */}
                <div className="pb-24"></div>
            </div>
        </div>
    );
}
