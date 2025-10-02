import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import StationSelectionModal from './components/StationSelectionModal';
import CalendarModal from './components/CalendarModal';
import FilterModal from './components/FilterModal';

export default function PesanTiket() {
    const [formData, setFormData] = useState({
        keberangkatan: '',
        tujuan: '',
        tanggal: '2025-10-02',
        tanggalPulang: '',
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
        selectedReturnDate: null, // Tanggal pulang
        currentMonth: new Date(2025, 9, 1) // Oktober 2025
    });

    const [filterModal, setFilterModal] = useState({
        isOpen: false,
        selectedClasses: [],
        selectedPrices: [],
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

    // Data harga kereta per tanggal (simulasi dalam ribuan)
    const priceData = {
        '2025-10-01': { min: 150, max: 450 },
        '2025-10-02': { min: 180, max: 520 },
        '2025-10-04': { min: 160, max: 480 },
        '2025-10-05': { min: 140, max: 420 },
        '2025-10-07': { min: 170, max: 500 },
        '2025-10-08': { min: 155, max: 465 },
        '2025-10-09': { min: 165, max: 485 },
        '2025-10-10': { min: 175, max: 525 },
        '2025-10-12': { min: 145, max: 435 },
        '2025-10-14': { min: 185, max: 545 },
        '2025-10-15': { min: 160, max: 480 },
        '2025-10-16': { min: 150, max: 450 },
        '2025-10-17': { min: 170, max: 510 },
        '2025-10-19': { min: 190, max: 560 },
        '2025-10-21': { min: 155, max: 455 },
        '2025-10-22': { min: 165, max: 495 },
        '2025-10-23': { min: 175, max: 515 },
        '2025-10-24': { min: 180, max: 530 },
        '2025-10-25': { min: 160, max: 470 },
        '2025-10-26': { min: 170, max: 500 },
        '2025-10-28': { min: 185, max: 545 },
        '2025-10-29': { min: 175, max: 525 },
        '2025-10-30': { min: 165, max: 485 },
        '2025-10-31': { min: 195, max: 575 }
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
        const formattedDate = date.toISOString().split('T')[0];
        
        if (calendarModal.type === 'pulang') {
            setCalendarModal(prev => ({
                ...prev,
                selectedReturnDate: date
            }));
            setFormData(prev => ({
                ...prev,
                tanggalPulang: formattedDate
            }));
        } else {
            setCalendarModal(prev => ({
                ...prev,
                selectedDate: date
            }));
            setFormData(prev => ({
                ...prev,
                tanggal: formattedDate
            }));
        }
        
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

    // Helper function for date formatting (still needed for main component)
    const formatDate = (date) => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${dayName}, ${day} ${month} ${year}`;
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
            let newSelection;

            if (category === 'selectedPrices') {
                // Handle price filters with special logic for radio buttons
                if (value === 'termahal' || value === 'termurah') {
                    // For sorting options (radio behavior), remove other sort options
                    const filteredSelection = currentSelection.filter(item => 
                        item !== 'termahal' && item !== 'termurah'
                    );
                    newSelection = currentSelection.includes(value)
                        ? filteredSelection
                        : [...filteredSelection, value];
                } else {
                    // For range options (checkbox behavior)
                    newSelection = currentSelection.includes(value)
                        ? currentSelection.filter(item => item !== value)
                        : [...currentSelection, value];
                }
            } else {
                // Default checkbox behavior for other categories
                newSelection = currentSelection.includes(value)
                    ? currentSelection.filter(item => item !== value)
                    : [...currentSelection, value];
            }
            
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
            selectedPrices: [],
            selectedTimes: [],
            selectedTrains: []
        }));
    };

    const applyFilters = () => {
        console.log('Filters applied:', filterModal);
        closeFilterModal();
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

                    {/* Field Tanggal Pulang - Muncul jika Pulang Pergi aktif */}
                    {formData.pulangPergi && (
                        <div className="bg-white border border-gray-200 rounded-2xl p-4">
                            <div className="flex items-center">
                                <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <button
                                    onClick={() => openCalendarModal('pulang')}
                                    className="text-left hover:text-gray-600 transition-colors flex-1"
                                >
                                    <span className="text-sm font-medium text-gray-800 block">Tanggal Pulang</span>
                                    <span className="text-sm text-gray-800 font-medium">
                                        {formData.tanggalPulang ? formatDate(calendarModal.selectedReturnDate || new Date(formData.tanggalPulang)) : 'Pilih tanggal pulang'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

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
            <StationSelectionModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                onStationSelect={handleStationSelect}
                searchQuery={modalState.searchQuery}
                onSearchChange={handleSearchChange}
                stations={stations}
                recentSearches={recentSearches}
                popularStations={popularStations}
                onClearRecentSearches={handleClearRecentSearches}
            />

            {/* Modal Kalender */}
            <CalendarModal
                isOpen={calendarModal.isOpen}
                onClose={closeCalendarModal}
                selectedDate={calendarModal.selectedDate}
                selectedReturnDate={calendarModal.selectedReturnDate}
                currentMonth={calendarModal.currentMonth}
                calendarType={calendarModal.type}
                onDateSelect={handleDateSelect}
                onNavigateMonth={navigateMonth}
                onOpenFilter={openFilterModal}
                routeAvailability={routeAvailability}
                priceData={priceData}
                selectedPrices={filterModal.selectedPrices}
            />

            {/* Modal Filter */}
            <FilterModal
                isOpen={filterModal.isOpen}
                onClose={closeFilterModal}
                selectedClasses={filterModal.selectedClasses}
                selectedPrices={filterModal.selectedPrices}
                onToggleFilter={toggleFilterOption}
                onReset={resetFilters}
                onApply={applyFilters}
            />
        </div>
    );
}
