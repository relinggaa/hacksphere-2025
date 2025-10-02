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

    const [modalState, setModalState] = useState({
        isOpen: false,
        type: '', // 'keberangkatan' atau 'tujuan'
        searchQuery: ''
    });

    // Data stasiun
    const stations = [
        { id: 1, name: 'Jakarta Gambir', city: 'Jakarta' },
        { id: 2, name: 'Jakarta Pasar Senen', city: 'Jakarta' },
        { id: 3, name: 'Bandung', city: 'Bandung' },
        { id: 4, name: 'Yogyakarta Tugu', city: 'Yogyakarta' },
        { id: 5, name: 'Solo Balapan', city: 'Solo' },
        { id: 6, name: 'Surabaya Gubeng', city: 'Surabaya' },
        { id: 7, name: 'Surabaya Pasar Turi', city: 'Surabaya' },
        { id: 8, name: 'Malang', city: 'Malang' },
        { id: 9, name: 'Semarang Tawang', city: 'Semarang' },
        { id: 10, name: 'Cirebon', city: 'Cirebon' },
        { id: 11, name: 'Purwokerto', city: 'Purwokerto' },
        { id: 12, name: 'Jember', city: 'Jember' },
        { id: 13, name: 'Probolinggo', city: 'Probolinggo' },
        { id: 14, name: 'Kediri', city: 'Kediri' },
        { id: 15, name: 'Madiun', city: 'Madiun' }
    ];

    // Filter stasiun berdasarkan search query
    const filteredStations = stations.filter(station =>
        station.name.toLowerCase().includes(modalState.searchQuery.toLowerCase()) ||
        station.city.toLowerCase().includes(modalState.searchQuery.toLowerCase())
    );

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

    const openModal = (type) => {
        setModalState({
            isOpen: true,
            type: type,
            searchQuery: ''
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            type: '',
            searchQuery: ''
        });
    };

    const handleStationSelect = (station) => {
        if (modalState.type === 'keberangkatan') {
            setFormData(prev => ({ ...prev, keberangkatan: station.name }));
        } else if (modalState.type === 'tujuan') {
            setFormData(prev => ({ ...prev, tujuan: station.name }));
        }
        closeModal();
    };

    const handleSearchChange = (e) => {
        setModalState(prev => ({ ...prev, searchQuery: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-blue-600">
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
                                <button
                                    onClick={() => openModal('keberangkatan')}
                                    className="w-full text-left text-gray-600 text-sm bg-transparent border-none outline-none hover:text-gray-800 transition-colors"
                                >
                                    {formData.keberangkatan || 'Pilih stasiun keberangkatan'}
                                </button>
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
                                <button
                                    onClick={() => openModal('tujuan')}
                                    className="w-full text-left text-gray-600 text-sm bg-transparent border-none outline-none hover:text-gray-800 transition-colors"
                                >
                                    {formData.tujuan || 'Pilih stasiun tujuan'}
                                </button>
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

            {/* Modal Pilih Stasiun */}
            {modalState.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-lg font-semibold text-gray-800">Pilih Stasiun atau Kota</h2>
                            <div className="w-8"></div>
                        </div>

                        {/* Search Box */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari stasiun atau kota..."
                                    value={modalState.searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* List Stasiun */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredStations.length > 0 ? (
                                <div className="p-2">
                                    {filteredStations.map((station) => (
                                        <button
                                            key={station.id}
                                            onClick={() => handleStationSelect(station)}
                                            className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center"
                                        >
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">{station.name}</div>
                                                <div className="text-sm text-gray-500">{station.city}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">Stasiun tidak ditemukan</p>
                                    <p className="text-gray-400 text-xs mt-1">Coba kata kunci lain</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
