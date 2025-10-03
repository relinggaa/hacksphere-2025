import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import ChatbotModal from '../User/components/ChatbotModal';

export default function UserDashboard({ user }) {
    const [chatbotOpen, setChatbotOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
            <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 px-4 pt-12 pb-6">
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
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                        </div>
                        <button 
                            onClick={handleOpenChatbot}
                            className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                        >
                            <span className="text-white text-sm">🤖 Bantuan</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 mb-0">
                    <div className="flex items-center justify-between mb-0">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-800">KAI PAY</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12v4m-4-4h4.01" />
                                    </svg>
                                </div>
                                <span className="text-xs text-gray-600">Scan</span>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-1">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <span className="text-xs text-gray-600">Top Up</span>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-xs text-gray-400">Riwayat</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-start">
                        <button className="bg-white text-blue-600 px-6 py-2 rounded-full border border-blue-600 text-sm font-medium">
                            Aktivasi KAIPay
                        </button>
                    </div>
                    <div className="flex items-center justify-between mb-3 mt-5">
                        <div className="flex items-center">
                            <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">360</span>
                            <span className="text-orange-500 font-medium">RailPoin</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs mr-2">★</span>
                            <span className="text-purple-600 font-medium">Basic</span>
                            <svg className="w-4 h-4 text-gray-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>



                
            </div>

            <div className="bg-white px-4 py-6">
                <div className="grid grid-cols-5 gap-4 mb-8">
                    <div className="text-center cursor-pointer" onClick={handleAntarKota}>
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2 mx-auto hover:bg-blue-700 transition-colors">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">Antar Kota</span>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">Lokal</span>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">Commuter Line</span>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">LRT</span>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">Bandara</span>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 mx-auto">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">Hotel</span>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 mx-auto">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">Kartu Multi Trip</span>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-2 mx-auto">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">KAI Logistik</span>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2 mx-auto">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <span className="text-xs text-gray-600">Show more</span>
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
                    <div className="text-center">
                        <div className="w-6 h-6 bg-blue-600 rounded-full mx-auto mb-1"></div>
                        <span className="text-xs text-blue-600 font-medium">Beranda</span>
                    </div>
                    <div className="text-center">
                        <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-400">Kereta</span>
                    </div>
                    <div className="text-center">
                        <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        </svg>
                        <span className="text-xs text-gray-400">Tiket Saya</span>
                    </div>
                    <div className="text-center">
                        <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        <span className="text-xs text-gray-400">Promo</span>
                    </div>
                    <div className="text-center">
                        <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-400">Akun</span>
                    </div>
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
