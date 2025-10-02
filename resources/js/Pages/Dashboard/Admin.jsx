import React from 'react';
import { router } from '@inertiajs/react';

export default function AdminDashboard({ user }) {
    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            router.post('/logout');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-red-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold">🚂 KAI Access</div>
                            <div className="ml-4 px-3 py-1 bg-red-700 rounded-full text-sm">
                                👨‍💼 Admin Panel
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">Selamat datang, <strong>{user.name}</strong></span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md text-sm transition duration-300"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Dashboard Administrator
                    </h1>
                    <p className="text-gray-600">
                        Kelola seluruh sistem KAI Access dari panel admin ini.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="text-3xl text-blue-600">👥</div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
                                <p className="text-2xl font-bold text-blue-600">1,234</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="text-3xl text-green-600">🎒</div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Active Porters</h3>
                                <p className="text-2xl font-bold text-green-600">56</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="text-3xl text-yellow-600">🚂</div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Trains Today</h3>
                                <p className="text-2xl font-bold text-yellow-600">89</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="text-3xl text-purple-600">📊</div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
                                <p className="text-2xl font-bold text-purple-600">Rp 2.5M</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Menu */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="text-center">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Kelola Users</h3>
                            <p className="text-gray-600">Tambah, edit, atau hapus user sistem</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🚂</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Jadwal Kereta</h3>
                            <p className="text-gray-600">Atur jadwal dan rute kereta api</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🎒</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Layanan Porter</h3>
                            <p className="text-gray-600">Monitor dan kelola layanan porter</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Laporan</h3>
                            <p className="text-gray-600">Lihat laporan dan analitik sistem</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="text-center">
                            <div className="text-4xl mb-4">⚙️</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Pengaturan</h3>
                            <p className="text-gray-600">Konfigurasi sistem dan preferensi</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Keamanan</h3>
                            <p className="text-gray-600">Kelola keamanan dan akses sistem</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
                    <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl mr-3">👤</div>
                            <div>
                                <p className="font-medium">User baru terdaftar: John Doe</p>
                                <p className="text-sm text-gray-600">5 menit yang lalu</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl mr-3">🎒</div>
                            <div>
                                <p className="font-medium">Porter menyelesaikan layanan bagasi</p>
                                <p className="text-sm text-gray-600">15 menit yang lalu</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl mr-3">🚂</div>
                            <div>
                                <p className="font-medium">Kereta Argo Bromo tiba di Stasiun Gambir</p>
                                <p className="text-sm text-gray-600">30 menit yang lalu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
