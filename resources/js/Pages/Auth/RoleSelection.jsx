import React from 'react';

export default function RoleSelection() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-4xl">
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 text-white text-3xl font-bold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                            🚂 KAI Access
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Pilih Role Anda
                    </h2>
                    <p className="text-purple-100 text-lg">Silakan pilih role yang sesuai untuk melanjutkan perjalanan digital Anda</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all duration-500 transform hover:scale-105">
                            <div className="text-center">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">👨‍💼</div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Administrator</h3>
                                <p className="text-red-100 mb-6 leading-relaxed">
                                    Kelola sistem, user, dan operasional KAI Access dengan kontrol penuh
                                </p>
                                <div className="space-y-3">
                                    <a
                                        href="/admin/login"
                                        className="block w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        Login Admin
                                    </a>
                                    <a
                                        href="/admin/register"
                                        className="block w-full bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
                                    >
                                        Daftar Admin
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all duration-500 transform hover:scale-105">
                            <div className="text-center">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">👤</div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Penumpang</h3>
                                <p className="text-blue-100 mb-6 leading-relaxed">
                                    Pesan tiket, lihat jadwal, dan nikmati perjalanan kereta yang nyaman
                                </p>
                                <div className="space-y-3">
                                    <a
                                        href="/user/login"
                                        className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        Login Penumpang
                                    </a>
                                    <a
                                        href="/user/register"
                                        className="block w-full bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
                                    >
                                        Daftar Penumpang
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all duration-500 transform hover:scale-105">
                            <div className="text-center">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🎒</div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Porter</h3>
                                <p className="text-green-100 mb-6 leading-relaxed">
                                    Layani penumpang dengan bantuan bagasi dan dapatkan penghasilan
                                </p>
                                <div className="space-y-3">
                                    <a
                                        href="/porter/login"
                                        className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        Login Porter
                                    </a>
                                    <a
                                        href="/porter/register"
                                        className="block w-full bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
                                    >
                                        Daftar Porter
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <h4 className="font-bold text-white text-xl mb-8 text-center">Fitur Setiap Role</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-6 backdrop-blur-sm border border-red-300/30">
                                <h5 className="font-semibold text-red-200 mb-4 text-lg">👨‍💼 Administrator</h5>
                                <ul className="text-white/80 space-y-2 text-sm">
                                    <li className="flex items-center justify-center"><span className="mr-2">✨</span> Kelola semua user</li>
                                    <li className="flex items-center justify-center"><span className="mr-2">🚂</span> Atur jadwal kereta</li>
                                    <li className="flex items-center justify-center"><span className="mr-2">📊</span> Monitor sistem</li>
                                    <li className="flex items-center justify-center"><span className="mr-2">📈</span> Laporan & analitik</li>
                                </ul>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 backdrop-blur-sm border border-blue-300/30">
                                <h5 className="font-semibold text-blue-200 mb-4 text-lg">👤 Penumpang</h5>
                                <ul className="text-white/80 space-y-2 text-sm">
                                    <li className="flex items-center justify-center"><span className="mr-2">🎫</span> Pesan tiket kereta</li>
                                    <li className="flex items-center justify-center"><span className="mr-2">📅</span> Lihat jadwal</li>
                                    <li className="flex items-center justify-center"><span className="mr-2">📋</span> Riwayat perjalanan</li>
                                    <li className="flex items-center justify-center"><span className="mr-2">🎒</span> Layanan porter</li>
                                </ul>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 backdrop-blur-sm border border-green-300/30">
                                <h5 className="font-semibold text-green-200 mb-4 text-lg">🎒 Porter</h5>
                                <ul className="text-white/80 space-y-2 text-sm">
                                    <li className="flex items-center justify-center"><span className="mr-2">📱</span> Terima pesanan</li>
                                    <li className="flex items-center justify-center"><span className="mr-2">💪</span> Bantuan bagasi</li>
                                    <li className="flex items-center justify-center"><span className="mr-2">🚶‍♂️</span> Antar ke peron</li>
                                    <li className="flex items-center justify-center"><span className="mr-2">💰</span> Kelola pendapatan</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-white/70 text-sm">
                        Belum tahu role mana yang cocok? 
                        <span className="text-purple-300 hover:text-purple-200 cursor-pointer ml-1">
                            Hubungi admin untuk bantuan
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
