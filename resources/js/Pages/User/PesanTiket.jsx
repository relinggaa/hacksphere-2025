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
        type: '', 
        searchQuery: ''
    });

    const [calendarModal, setCalendarModal] = useState({
        isOpen: false,
        type: '', // 'berangkat' atau 'pulang'
        selectedDate: new Date(2025, 9, 2), // 2 Oktober 2025
        currentMonth: new Date(2025, 9, 1) // Oktober 2025
    });

    const [filterModal, setFilterModal] = useState({
        isOpen: false,
        selectedClasses: [],
        selectedTimes: [],
        selectedTrains: []
    });

    // Data ketersediaan route kereta (simulasi)
    const routeAvailability = {
        '2025-10-01': true,
        '2025-10-02': true,
        '2025-10-03': false,
        '2025-10-04': true,
        '2025-10-05': true,
        '2025-10-06': false,
        '2025-10-07': true,
        '2025-10-08': true,
        '2025-10-09': true,
        '2025-10-10': true,
        '2025-10-11': false,
        '2025-10-12': true,
        '2025-10-13': false,
        '2025-10-14': true,
        '2025-10-15': true,
        '2025-10-16': true,
        '2025-10-17': true,
        '2025-10-18': false,
        '2025-10-19': true,
        '2025-10-20': false,
        '2025-10-21': true,
        '2025-10-22': true,
        '2025-10-23': true,
        '2025-10-24': true,
        '2025-10-25': true,
        '2025-10-26': true,
        '2025-10-27': false,
        '2025-10-28': true,
        '2025-10-29': true,
        '2025-10-30': true,
        '2025-10-31': true
    };
    const stations = [
        { id: 1, name: 'Gambir', code: 'GMR', city: 'Jakarta', isPopular: true },
        { id: 2, name: 'Pasar Senen', code: 'PSE', city: 'Jakarta Pusat', isPopular: true },
        { id: 3, name: 'Bandung', code: 'BD', city: 'Bandung', isPopular: true },
        { id: 4, name: 'Yogyakarta Tugu', code: 'YK', city: 'Yogyakarta', isPopular: false },
        { id: 5, name: 'Solobalapan', code: 'SLO', city: 'Solo', isPopular: true },
        { id: 6, name: 'Surabaya Gubeng', code: 'SGU', city: 'Surabaya', isPopular: true },
        { id: 7, name: 'Surabaya Pasar Turi', code: 'SPT', city: 'Surabaya', isPopular: false },
        { id: 8, name: 'Malang', code: 'MLG', city: 'Malang', isPopular: false },
        { id: 9, name: 'Semarang Tawang', code: 'SMT', city: 'Semarang', isPopular: false },
        { id: 10, name: 'Cirebon', code: 'CN', city: 'Cirebon', isPopular: false },
        { id: 11, name: 'Purwokerto', code: 'PWT', city: 'Purwokerto', isPopular: false },
        { id: 12, name: 'Jember', code: 'JMR', city: 'Jember', isPopular: false },
        { id: 13, name: 'Probolinggo', code: 'PB', city: 'Probolinggo', isPopular: false },
        { id: 14, name: 'Kediri', code: 'KD', city: 'Kediri', isPopular: false },
        { id: 15, name: 'Madiun', code: 'MDN', city: 'Madiun', isPopular: false }
    ];
    const recentSearches = [
        { id: 1, name: 'Pasar Senen', code: 'PSE', city: 'Jakarta Pusat' },
        { id: 2, name: 'Solobalapan', code: 'SLO', city: 'Solo' },
        { id: 3, name: 'Bandung', code: 'BD', city: 'Bandung' }
    ];
    const popularStations = stations.filter(station => station.isPopular);
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

    const handleClearRecentSearches = () => {
        // Implementasi untuk menghapus pencarian terakhir
        console.log('Hapus semua pencarian terakhir');
    };

    // Calendar functions
    const openCalendarModal = (type) => {
        setCalendarModal(prev => ({
            ...prev,
            isOpen: true,
            type: type
        }));
    };

    const closeCalendarModal = () => {
        setCalendarModal(prev => ({
            ...prev,
            isOpen: false,
            type: ''
        }));
    };

    const handleDateSelect = (date) => {
        setCalendarModal(prev => ({
            ...prev,
            selectedDate: date
        }));
        
        // Update form data
        const formattedDate = date.toISOString().split('T')[0];
        setFormData(prev => ({
            ...prev,
            tanggal: formattedDate
        }));
        
        closeCalendarModal();
    };

    const navigateMonth = (direction) => {
        setCalendarModal(prev => {
            const newMonth = new Date(prev.currentMonth);
            newMonth.setMonth(newMonth.getMonth() + direction);
            return {
                ...prev,
                currentMonth: newMonth
            };
        });
    };

    // Helper functions for calendar
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date) => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${dayName}, ${day} ${month} ${year}`;
    };

    const getMonthName = (date) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    // Filter functions
    const openFilterModal = () => {
        setFilterModal(prev => ({ ...prev, isOpen: true }));
    };

    const closeFilterModal = () => {
        setFilterModal(prev => ({ ...prev, isOpen: false }));
    };

    const toggleFilterOption = (category, value) => {
        setFilterModal(prev => {
            const currentSelection = prev[category];
            const newSelection = currentSelection.includes(value)
                ? currentSelection.filter(item => item !== value)
                : [...currentSelection, value];
            
            return {
                ...prev,
                [category]: newSelection
            };
        });
    };

    const resetFilters = () => {
        setFilterModal(prev => ({
            ...prev,
            selectedClasses: [],
            selectedTimes: [],
            selectedTrains: []
        }));
    };

    const applyFilters = () => {
        console.log('Filters applied:', filterModal);
        closeFilterModal();
    };

    // Helper function to check route availability
    const isRouteAvailable = (date) => {
        const dateKey = date.toISOString().split('T')[0];
        return routeAvailability[dateKey] !== undefined ? routeAvailability[dateKey] : true;
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
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 relative">
                        {/* Keberangkatan */}
                        <div className="flex items-center mb-4">
                            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                            </div>
                            <div className="flex-1 pr-12">
                                <span className="text-sm font-medium text-gray-800 block mb-1">Keberangkatan</span>
                                <button
                                    onClick={() => openModal('keberangkatan')}
                                    className="w-full text-left text-gray-800 text-base bg-transparent border-none outline-none hover:text-gray-600 transition-colors font-medium"
                                >
                                    {formData.keberangkatan || 'Pasar Senen'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Switch Button - Positioned at center of divider */}
                        <div className="relative">
                            <hr className="border-gray-200" />
                            <button 
                                onClick={handleSwapStations}
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                            >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex items-center mt-4">
                            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                            </div>
                            <div className="flex-1 pr-12">
                                <span className="text-sm font-medium text-gray-800 block mb-1">Tujuan</span>
                                <button
                                    onClick={() => openModal('tujuan')}
                                    className="w-full text-left text-gray-800 text-base bg-transparent border-none outline-none hover:text-gray-600 transition-colors font-medium"
                                >
                                    {formData.tujuan || 'Bandung'}
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
                                <button
                                    onClick={() => openCalendarModal('berangkat')}
                                    className="text-left hover:text-gray-600 transition-colors"
                                >
                                    <span className="text-sm font-medium text-gray-800 block">Tanggal Berangkat</span>
                                    <span className="text-sm text-gray-800 font-medium">{formatDate(calendarModal.selectedDate)}</span>
                                </button>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
                    <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 flex items-center justify-center"
                            >
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-lg font-semibold text-gray-800">Pilih Stasiun atau Kota</h2>
                            <div className="w-8"></div>
                        </div>

                        {/* Search Box */}
                        <div className="p-4">
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari stasiun atau kota"
                                    value={modalState.searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            {modalState.searchQuery === '' ? (
                                <>
                                    {/* Terakhir dicari */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Terakhir dicari</h3>
                                            <button 
                                                onClick={handleClearRecentSearches}
                                                className="text-blue-600 text-sm font-medium"
                                            >
                                                Hapus Semua
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {recentSearches.map((station) => (
                                                <button
                                                    key={station.id}
                                                    onClick={() => handleStationSelect(station)}
                                                    className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center">
                                                                <span className="font-medium text-gray-800 mr-2">{station.name}</span>
                                                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{station.code}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-500">{station.city}</div>
                                                        </div>
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stasiun Populer */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Stasiun Populer</h3>
                                        <div className="space-y-2">
                                            {popularStations.map((station) => (
                                                <button
                                                    key={station.id}
                                                    onClick={() => handleStationSelect(station)}
                                                    className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center">
                                                                <span className="font-medium text-gray-800 mr-2">{station.name}</span>
                                                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{station.code}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-500">{station.city}</div>
                                                        </div>
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Hasil Pencarian */
                                <div>
                                    {filteredStations.length > 0 ? (
                                        <div className="space-y-2">
                                            {filteredStations.map((station) => (
                                                <button
                                                    key={station.id}
                                                    onClick={() => handleStationSelect(station)}
                                                    className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center">
                                                                <span className="font-medium text-gray-800 mr-2">{station.name}</span>
                                                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{station.code}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-500">{station.city}</div>
                                                        </div>
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
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
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Kalender */}
            {calendarModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
                    <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <button
                                onClick={closeCalendarModal}
                                className="w-8 h-8 flex items-center justify-center"
                            >
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-lg font-semibold text-gray-800">Pilih tanggal</h2>
                            <button
                                onClick={openFilterModal}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            </button>
                        </div>

                        {/* Info Banner */}
                        <div className="bg-orange-500 text-white p-4 flex items-center">
                            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-sm">Pemesanan kereta dapat dilakukan sampai dengan 17 November 2025 (H+45)</span>
                        </div>

                        {/* Date Selection Tabs */}
                        <div className="p-4">
                            <div className="flex space-x-4 mb-6">
                                <div className="flex-1">
                                    <div className="text-center">
                                        <span className="text-sm text-gray-600 block mb-1">Berangkat</span>
                                        <button className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-xl font-medium">
                                            02 Okt 2025
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-center">
                                        <span className="text-sm text-gray-600 block mb-1">Pulang</span>
                                        <button className="w-full py-3 px-4 bg-blue-100 text-blue-600 rounded-xl font-medium flex items-center justify-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Tanggal Pulang
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Navigation */}
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h3 className="text-xl font-semibold text-gray-800">{getMonthName(calendarModal.currentMonth)}</h3>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="mb-6">
                                {/* Day Headers */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div className="grid grid-cols-7 gap-1">
                                    {(() => {
                                        const daysInMonth = getDaysInMonth(calendarModal.currentMonth);
                                        const firstDay = getFirstDayOfMonth(calendarModal.currentMonth);
                                        const days = [];
                                        
                                        // Empty cells for days before month starts
                                        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
                                            days.push(<div key={`empty-${i}`} className="h-12"></div>);
                                        }
                                        
                                        // Days of the month
                                        for (let day = 1; day <= daysInMonth; day++) {
                                            const date = new Date(calendarModal.currentMonth.getFullYear(), calendarModal.currentMonth.getMonth(), day);
                                            const isSelected = date.toDateString() === calendarModal.selectedDate.toDateString();
                                            const isToday = date.toDateString() === new Date().toDateString();
                                            const isWeekend = date.getDay() === 0; // Sunday
                                            const routeAvailable = isRouteAvailable(date);
                                            
                                            days.push(
                                                <button
                                                    key={day}
                                                    onClick={() => handleDateSelect(date)}
                                                    className={`h-12 w-full rounded-full flex flex-col items-center justify-center text-sm font-medium transition-colors relative ${
                                                        isSelected
                                                            ? 'bg-blue-600 text-white'
                                                            : isWeekend
                                                            ? 'text-red-500 hover:bg-red-50'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <span className="mb-1">{day}</span>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                        routeAvailable ? 'bg-green-500' : 'bg-red-500'
                                                    } ${isSelected ? 'bg-white' : ''}`}></div>
                                                </button>
                                            );
                                        }
                                        
                                        return days;
                                    })()}
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={closeCalendarModal}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 text-lg shadow-lg"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Filter */}
            {filterModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
                    <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col">
                        {/* Header Modal Filter */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <button
                                onClick={closeFilterModal}
                                className="w-8 h-8 flex items-center justify-center"
                            >
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-lg font-semibold text-gray-800">Filter Berdasarkan</h2>
                            <div className="w-8"></div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex border-b border-gray-200">
                            <button className="flex-1 py-3 px-4 text-blue-600 border-b-2 border-blue-600 font-medium">
                                Kelas Kereta
                            </button>
                            <button className="flex-1 py-3 px-4 text-gray-500 font-medium">
                                Waktu Perjalanan
                            </button>
                            <button className="flex-1 py-3 px-4 text-gray-500 font-medium">
                                Nama Kereta
                            </button>
                        </div>

                        {/* Filter Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Kelas Kereta</h3>
                                    <button 
                                        onClick={() => setFilterModal(prev => ({ ...prev, selectedClasses: [] }))}
                                        className="text-blue-600 text-sm font-medium flex items-center"
                                    >
                                        Pilih Semua
                                        <input 
                                            type="checkbox" 
                                            className="ml-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            checked={filterModal.selectedClasses.length === 3}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFilterModal(prev => ({ ...prev, selectedClasses: ['Eksekutif', 'Bisnis', 'Ekonomi'] }));
                                                } else {
                                                    setFilterModal(prev => ({ ...prev, selectedClasses: [] }));
                                                }
                                            }}
                                        />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {['Eksekutif', 'Bisnis', 'Ekonomi'].map((trainClass) => (
                                        <div key={trainClass} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                            <span className="text-gray-800 font-medium">{trainClass}</span>
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                                                checked={filterModal.selectedClasses.includes(trainClass)}
                                                onChange={() => toggleFilterOption('selectedClasses', trainClass)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="p-4 border-t border-gray-200 space-y-3">
                            <button
                                onClick={resetFilters}
                                className="w-full py-4 px-6 border-2 border-blue-600 text-blue-600 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-50"
                            >
                                Reset
                            </button>
                            <button
                                onClick={applyFilters}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg"
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
