import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function PesanTiket() {
    const [formData, setFormData] = useState({
        keberangkatan: '',
        tujuan: '',
        tanggal: '2025-10-02',
        dewasa: 1,
        bayi: 0,
        pulangPergi: false
    });

    const handleBack = () => {
        router.get('/user/dashboard');
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSwapStations = () => {
        setFormData(prev => ({
            ...prev,
            keberangkatan: prev.tujuan,
            tujuan: prev.keberangkatan
        }));
    };

    const handleCariJadwal = () => {
        console.log('Mencari jadwal dengan data:', formData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
            <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 px-4 pt-12 pb-6">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={handleBack}
                        className="mr-4 text-white hover:text-white/80"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold text-white">Kereta Antar Kota</h1>
                </div>
            </div>

            <div className="bg-white rounded-t-3xl px-6 py-6 min-h-[80vh]">
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">Keberangkatan</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pilih stasiun keberangkatan"
                                    value={formData.keberangkatan}
                                    onChange={(e) => handleInputChange('keberangkatan', e.target.value)}
                                    className="w-full text-gray-600 text-sm bg-transparent border-none outline-none placeholder-gray-400"
                                />
                            </div>
                            <button 
                                onClick={handleSwapStations}
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center ml-4"
                            >
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                            </button>
                        </div>
                        
                        <hr className="border-gray-200 my-4" />
                        
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-800 block mb-1">Tujuan</span>
                                <input
                                    type="text"
                                    placeholder="Pilih stasiun tujuan"
                                    value={formData.tujuan}
                                    onChange={(e) => handleInputChange('tujuan', e.target.value)}
                                    className="w-full text-gray-600 text-sm bg-transparent border-none outline-none placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-800 block">Tanggal Berangkat</span>
                                    <span className="text-sm text-gray-800 font-medium">Kam, 02 Okt 2025</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-3">Pulang Pergi?</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.pulangPergi}
                                        onChange={(e) => handleInputChange('pulangPergi', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-800 block mb-1">Pilih Penumpang</span>
                                <span className="text-sm text-gray-800 font-medium">01 Dewasa, 00 Bayi</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCariJadwal}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 text-lg shadow-lg mt-6"
                    >
                        Cari Jadwal
                    </button>
                </div>

                <div className="mt-8">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg mb-2">Access to Our Exclusive Benefits</h3>
                                    <p className="text-white/90 text-sm">Nikmati berbagai keuntungan dengan bergabung dalam program loyalty di Access by KAI</p>
                                </div>
                                <button className="bg-white/20 border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium ml-4">
                                    Iklan
                                </button>
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 w-32 h-full opacity-20">
                            <div className="w-full h-full bg-gradient-to-l from-yellow-400 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
