import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ChatbotModal from '../User/components/ChatbotModal';
import { getCartItems } from '../../utils/cart';

export default function UserDashboard({ user }) {
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        try { setCartCount(getCartItems().length); } catch {}
        const onStorage = (e) => { if (e.key === 'kai_cart_items') setCartCount(getCartItems().length); };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            router.post('/logout');
        }
    };

    const handleAntarKota = () => {
        router.get('/user/pesan-tiket');
    };

    const handleOpenChatbot = () => {
        setChatbotOpen(true);
    };

    const handleBookingPorter = () => {
        router.visit('/user/booking-porter');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
            <div className="purple-curved-down px-4 pt-12 pb-6 z-10 relative">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-white/80 text-sm">Selamat Malam</p>
                        <p className="text-white text-lg font-semibold">{user.name.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                        </div>
                        <button 
                            onClick={() => router.visit('/public/cart')}
                            className="relative w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                            aria-label="Keranjang"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M7 22a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 rounded">{cartCount}</span>
                            )}
                        </button>
                        <button 
                            onClick={handleOpenChatbot}
                            className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                        >
                            <span className="text-white text-sm">🤖 Bantuan</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 mb-0 z-20 relative shadow-lg">
                    {/* KAI PAY Section */}
                    <div className="mb-8">
                        {/* Header */}
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-xl">KAI PAY</h3>
                                <p className="text-sm text-gray-500">Digital wallet untuk perjalanan</p>
                            </div>
                        </div>
                        
                        {/* Action Buttons Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 hover:bg-blue-100 transition-colors cursor-pointer mx-auto">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4m-4-4h4.01" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-600 font-medium">Scan</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 hover:bg-blue-700 transition-colors cursor-pointer mx-auto">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-600 font-medium">Top Up</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3 hover:bg-gray-200 transition-colors cursor-pointer mx-auto">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-500 font-medium">Riwayat</span>
                            </div>
                        </div>
                        
                        {/* Activation Button */}
                        <div className="w-full">
                            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl text-base font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                                Aktivasi KAIPay
                            </button>
                        </div>
                    </div>
                    
                    {/* RailPoin Section */}
                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                                    <span className="text-white text-base font-bold">360</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-xl">RailPoin</h3>
                                    <p className="text-sm text-gray-500">Loyalty points Anda</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-purple-50 px-5 py-3 rounded-full">
                                <span className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm mr-3">★</span>
                                <span className="text-purple-600 font-semibold text-base">Basic</span>
                                <svg className="w-5 h-5 text-purple-400 ml-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>



                
            </div>

            <div className="bg-white px-4 py-6 -mt-10 relative z-20 rounded-t-3xl shadow-lg">
                <div className="grid grid-cols-5 gap-4 mb-8">
                    <div className="text-center cursor-pointer group" onClick={handleAntarKota}>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Antar Kota</span>
                    </div>
                    <div className="text-center cursor-pointer group">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-orange-600 transition-colors">Lokal</span>
                    </div>
                    <div className="text-center cursor-pointer group">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-red-600 transition-colors">Commuter</span>
                    </div>
                    <div className="text-center cursor-pointer group">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-purple-600 transition-colors">LRT</span>
                    </div>
                    <div className="text-center cursor-pointer group">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:from-cyan-600 group-hover:to-cyan-700 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-cyan-600 transition-colors">Bandara</span>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="text-center cursor-pointer group" onClick={handleBookingPorter}>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-105">
                            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors">E-Porter</span>
                    </div>
                    <div className="text-center cursor-pointer group">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:from-emerald-100 group-hover:to-emerald-200 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-105">
                            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-emerald-600 transition-colors">Multi Trip</span>
                    </div>
                    <div className="text-center cursor-pointer group">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-indigo-600 transition-colors">KAI Logistik</span>
                    </div>
                    <div className="text-center cursor-pointer group">
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-105">
                            <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium group-hover:text-gray-600 transition-colors">Show more</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">TRIP Planner</h3>
                                <p className="text-white/80 text-sm">Buat perencanaan terbaik untuk perjalananmu.</p>
                            </div>
                        </div>
                        <button className="bg-white/20 border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium">
                            BUAT
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Promo Terbaru</h3>
                    <button className="text-blue-600 text-sm font-medium border border-blue-600 px-4 py-1 rounded-full">
                        Lihat Semua
                    </button>
                </div>

                <div className="bg-gray-100 rounded-2xl p-4 mb-20">
                    <div className="flex items-center">
                        <img src="/api/placeholder/60/40" alt="Promo" className="w-15 h-10 rounded-lg mr-3" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">Dapatkan Kartu Kredit Access Card</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
                <div className="flex justify-around">
                    <button 
                        onClick={() => router.visit('/public/dashboard')}
                        className="text-center"
                    >
                        <div className="w-6 h-6 bg-blue-600 rounded-full mx-auto mb-1"></div>
                        <span className="text-xs text-blue-600 font-medium">Beranda</span>
                    </button>
                    <button 
                        onClick={() => router.visit('/public/pesan-tiket')}
                        className="text-center hover:text-blue-600 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-400">Kereta</span>
                    </button>
                    <button className="text-center hover:text-blue-600 transition-colors">
                        <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        </svg>
                        <span className="text-xs text-gray-400">Tiket Saya</span>
                    </button>
                    <button className="text-center hover:text-blue-600 transition-colors">
                        <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        <span className="text-xs text-gray-400">Promo</span>
                    </button>
                    <button 
                        onClick={() => router.visit('/public/profile')}
                        className="text-center hover:text-blue-600 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-400">Profil</span>
                    </button>
                </div>
            </div>

            {/* Chatbot Modal */}
            <ChatbotModal 
                isOpen={chatbotOpen} 
                onClose={() => setChatbotOpen(false)} 
            />
        </div>
    );
}
