import React from 'react';
import { router } from '@inertiajs/react';

export default function UserDashboard({ user }) {
    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            router.post('/logout');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
            
            {/* Header */}
            <header className="relative bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="text-3xl font-bold text-white animate-float">🚂 KAI Access</div>
                            <div className="ml-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl text-sm border border-white/30">
                                <span className="text-xl mr-2">👤</span>
                                <span className="text-white font-medium">Portal Penumpang</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-white/90 text-sm">Selamat datang, <strong className="text-cyan-300">{user.name}</strong></span>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg text-white"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                        Selamat Datang di KAI Access
                    </h1>
                    <p className="text-white/80 text-lg">
                        Nikmati perjalanan kereta api yang nyaman dan mudah bersama kami. Pesan tiket, cek jadwal, dan gunakan layanan porter dengan mudah.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 cursor-pointer">
                            <div className="text-center">
                                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎫</div>
                                <h3 className="text-lg font-semibold text-white mb-2">Pesan Tiket</h3>
                                <p className="text-sm text-white/70">Pesan tiket kereta api</p>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 cursor-pointer">
                            <div className="text-center">
                                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📋</div>
                                <h3 className="text-lg font-semibold text-white mb-2">Tiket Saya</h3>
                                <p className="text-sm text-white/70">Lihat tiket yang dipesan</p>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 cursor-pointer">
                            <div className="text-center">
                                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🕐</div>
                                <h3 className="text-lg font-semibold text-white mb-2">Jadwal</h3>
                                <p className="text-sm text-white/70">Cek jadwal kereta</p>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 cursor-pointer">
                            <div className="text-center">
                                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎒</div>
                                <h3 className="text-lg font-semibold text-white mb-2">Porter</h3>
                                <p className="text-sm text-white/70">Layanan bagasi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Tickets */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-6">Tiket Terbaru Saya</h3>
                    <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-white text-lg">Argo Bromo Anggrek</h4>
                                    <p className="text-white/80">Jakarta Gambir → Surabaya Gubeng</p>
                                    <p className="text-sm text-white/60">15 Oktober 2024, 08:00</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-400/30">
                                        Confirmed
                                    </span>
                                    <p className="text-lg font-bold text-white mt-2">Rp 350.000</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-white text-lg">Gajayana</h4>
                                    <p className="text-white/80">Malang → Jakarta Gambir</p>
                                    <p className="text-sm text-white/60">20 Oktober 2024, 14:30</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm border border-yellow-400/30">
                                        Pending
                                    </span>
                                    <p className="text-lg font-bold text-white mt-2">Rp 280.000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <button className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors duration-300">
                            Lihat Semua Tiket →
                        </button>
                    </div>
                </div>

                {/* Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Train Schedule */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                        <h3 className="text-2xl font-semibold text-white mb-6">Jadwal Kereta Hari Ini</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div>
                                    <p className="font-medium text-white">Argo Bromo</p>
                                    <p className="text-sm text-white/70">JKT → SBY</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-white">08:00</p>
                                    <p className="text-sm text-green-300">On Time</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div>
                                    <p className="font-medium text-white">Bima</p>
                                    <p className="text-sm text-white/70">JKT → MLG</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-white">10:30</p>
                                    <p className="text-sm text-yellow-300">Delay 15m</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Porter Services */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                        <h3 className="text-2xl font-semibold text-white mb-6">Layanan Porter</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">🎒</div>
                                    <div>
                                        <p className="font-medium text-white">Bantuan Bagasi</p>
                                        <p className="text-sm text-white/70">Mulai dari Rp 25.000</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">🚶‍♂️</div>
                                    <div>
                                        <p className="font-medium text-white">Antar ke Peron</p>
                                        <p className="text-sm text-white/70">Mulai dari Rp 15.000</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
                                Pesan Porter Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
