import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function Profile({ auth }) {
    const [loading, setLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const handleBack = () => {
        router.visit('/public/dashboard');
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            // Call Laravel logout endpoint
            await axios.post('/logout');
            
            // Redirect to login page
            router.visit('/public/login');
        } catch (error) {
            console.error('Logout error:', error);
            
            // Clear local storage as fallback
            localStorage.clear();
            sessionStorage.clear();
            
            // Force redirect to login
            window.location.href = '/public/login';
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-blue-600 px-4 pt-12 pb-6">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={handleBack}
                        className="mr-4 text-white hover:text-white/80"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold text-white">Profil Pengguna</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6">
                {/* Profile Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center mb-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
                            <p className="text-gray-500">john.doe@example.com</p>
                            <div className="flex items-center mt-2">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-4 mb-8">
                    {/* Edit Profile */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <button className="w-full flex items-center hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900">Edit Profil</div>
                                <div className="text-sm text-gray-500">Ubah informasi pribadi</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <button className="w-full flex items-center hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                            <div className="w-10 h-c10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900">Keamanan</div>
                                <div className="text-sm text-gray-500">Ubah.kata.sandi</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <button className="w-full flex items-center hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-10a6 6 0 1112 0z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900">Notifikasi</div>
                                <div className="text-sm text-gray-500">Pengaturan notifikasi</div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-red-200">
                    <button 
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="w-full flex items-center hover:bg-red-50 rounded-lg p-2 -m-2 transition-colors disabled:opacity-50"
                    >
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                            {logoutLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                            ) : (
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1 text-left">
                            <div className={`font-medium ${logoutLoading ? 'text-red-400' : 'text-red-600'}`}>
                                Keluar
                            </div>
                            <div className="text-sm text-red-500">
                                {logoutLoading ? 'Sedang keluar...' : 'Logout dari akun'}
                            </div>
                        </div>
                        {!logoutLoading && (
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* App Info */}
                <div className="mt-8 text-center">
                    <div className="text-gray-400 text-sm mb-2">KAI Access App</div>
                    <div className="text-gray-300 text-xs">Version 1.0.0</div>
                </div>
            </div>
        </div>
    );
}
