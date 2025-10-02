import React from 'react';
import { router } from '@inertiajs/react';

export default function PorterDashboard({ user }) {
    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            router.post('/logout');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-green-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold">🚂 KAI Access</div>
                            <div className="ml-4 px-3 py-1 bg-green-700 rounded-full text-sm">
                                🎒 Portal Porter
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm">Selamat datang, <strong>{user.name}</strong></p>
                                <p className="text-xs text-green-200">Status: Online</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-md text-sm transition duration-300"
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
                        Dashboard Porter
                    </h1>
                    <p className="text-gray-600">
                        Kelola layanan bagasi dan bantu penumpang dengan profesional.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="text-3xl text-blue-600">📋</div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Pesanan Hari Ini</h3>
                                <p className="text-2xl font-bold text-blue-600">12</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="text-3xl text-green-600">✅</div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Selesai</h3>
                                <p className="text-2xl font-bold text-green-600">8</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="text-3xl text-yellow-600">⏳</div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Dalam Proses</h3>
                                <p className="text-2xl font-bold text-yellow-600">4</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="text-3xl text-purple-600">💰</div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Pendapatan</h3>
                                <p className="text-2xl font-bold text-purple-600">Rp 480K</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Orders */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Pesanan Aktif</h3>
                    <div className="space-y-4">
                        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-800">Bantuan Bagasi - Peron 3</h4>
                                    <p className="text-gray-600">Penumpang: Budi Santoso</p>
                                    <p className="text-sm text-gray-500">Kereta: Argo Bromo (08:15)</p>
                                    <p className="text-sm text-gray-500">2 koper besar, 1 tas ransel</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                        Dalam Proses
                                    </span>
                                    <p className="text-lg font-bold text-gray-800 mt-1">Rp 50.000</p>
                                    <div className="mt-2 space-x-2">
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                                            Selesai
                                        </button>
                                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm">
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-800">Antar ke Peron - Peron 1</h4>
                                    <p className="text-gray-600">Penumpang: Siti Aminah</p>
                                    <p className="text-sm text-gray-500">Kereta: Gajayana (10:30)</p>
                                    <p className="text-sm text-gray-500">Kursi roda, 1 tas kecil</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                        Baru
                                    </span>
                                    <p className="text-lg font-bold text-gray-800 mt-1">Rp 25.000</p>
                                    <div className="mt-2 space-x-2">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                                            Terima
                                        </button>
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                                            Tolak
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
                        <div className="space-y-3">
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition duration-300 flex items-center">
                                <span className="text-xl mr-3">✅</span>
                                <div className="text-left">
                                    <p className="font-medium">Tandai Tersedia</p>
                                    <p className="text-sm text-green-100">Siap menerima pesanan baru</p>
                                </div>
                            </button>

                            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg transition duration-300 flex items-center">
                                <span className="text-xl mr-3">⏸️</span>
                                <div className="text-left">
                                    <p className="font-medium">Istirahat</p>
                                    <p className="text-sm text-yellow-100">Pause penerimaan pesanan</p>
                                </div>
                            </button>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-300 flex items-center">
                                <span className="text-xl mr-3">📊</span>
                                <div className="text-left">
                                    <p className="font-medium">Lihat Statistik</p>
                                    <p className="text-sm text-blue-100">Performa dan pendapatan</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Train Schedule */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Jadwal Kereta</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Argo Bromo</p>
                                    <p className="text-sm text-gray-600">Peron 3 → Surabaya</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">08:15</p>
                                    <p className="text-sm text-green-600">Boarding</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Gajayana</p>
                                    <p className="text-sm text-gray-600">Peron 1 → Malang</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">10:30</p>
                                    <p className="text-sm text-blue-600">Arriving</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Bima</p>
                                    <p className="text-sm text-gray-600">Peron 2 → Yogyakarta</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">12:45</p>
                                    <p className="text-sm text-gray-600">Scheduled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Completed Orders */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Pesanan Selesai Hari Ini</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div>
                                <p className="font-medium">Bantuan Bagasi - Ahmad Rizki</p>
                                <p className="text-sm text-gray-600">Kereta Argo Parahyangan (06:00)</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-green-600">+ Rp 40.000</p>
                                <p className="text-sm text-gray-600">⭐ 5.0</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div>
                                <p className="font-medium">Antar ke Peron - Maria Sari</p>
                                <p className="text-sm text-gray-600">Kereta Lodaya (07:30)</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-green-600">+ Rp 20.000</p>
                                <p className="text-sm text-gray-600">⭐ 4.8</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
