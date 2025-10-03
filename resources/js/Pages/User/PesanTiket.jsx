import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import StationSelectionModal from './components/StationSelectionModal';
import CalendarModal from './components/CalendarModal';
import FilterModal from './components/FilterModal';
import PassengerSelectionModal from './components/PassengerSelectionModal';

export default function PesanTiket() {
    const [formData, setFormData] = useState({
        keberangkatan: '',
        tujuan: '',
        tanggal: '',
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
        selectedDate: new Date(), // Today's date
        selectedReturnDate: null, // Tanggal pulang
        currentMonth: new Date() // Current month
    });

    const [filterModal, setFilterModal] = useState({
        isOpen: false,
        selectedClasses: [],
        selectedPrices: [],
        selectedTimes: [],
        selectedTrains: []
    });

    const [passengerModal, setPassengerModal] = useState({
        isOpen: false
    });

    // State untuk data stasiun dari API
    const [stations, setStations] = useState([]);
    const [allStations, setAllStations] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [routeAvailability, setRouteAvailability] = useState({});
    const [savedStations, setSavedStations] = useState({
        keberangkatan: '',
        tujuan: ''
    });

    // Function to save selected stations
    const saveSelectedStations = (keberangkatan, tujuan) => {
        setSavedStations({
            keberangkatan: keberangkatan,
            tujuan: tujuan
        });
    };

    // Function to fetch route availability
    const fetchRouteAvailability = async (departureStation = null, destinationStation = null) => {
        const fromStation = departureStation || savedStations.keberangkatan || formData.keberangkatan;
        const toStation = destinationStation || savedStations.tujuan || formData.tujuan;
        
        if (!fromStation || !toStation) return;
        
        try {
            const startDate = new Date(2025, 9, 1); // October 1, 2025
            const endDate = new Date(2025, 10, 30); // November 30, 2025
            
            console.log('Fetching route availability for:', fromStation, '→', toStation);
            const response = await axios.get(`/api/public/availability`, {
                params: {
                    stasiun_asal: fromStation,
                    stasiun_tujuan: toStation,
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                    penumpang: formData.dewasa + formData.bayi
                }
            });
            
            if (response.data.success) {
                setRouteAvailability(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching route availability:', error);
            // Set default availability (all true) if API fails
            const defaultAvailability = {};
            const currentDate = new Date(2025, 9, 1);
            const endDate = new Date(2025, 10, 30);
            while (currentDate <= endDate) {
                const dateStr = currentDate.toISOString().split('T')[0];
                defaultAvailability[dateStr] = true;
                currentDate.setDate(currentDate.getDate() + 1);
            }
            setRouteAvailability(defaultAvailability);
        }
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

    // Fetch data stasiun dari API
    useEffect(() => {
        fetchStations();
        fetchAllStations();
        loadRecentSearches();
        
        // Initialize saved stations from form data
        if (formData.keberangkatan && formData.tujuan) {
            saveSelectedStations(formData.keberangkatan, formData.tujuan);
        }
    }, []);

    // Fetch route availability when saved stations change
    useEffect(() => {
        if (savedStations.keberangkatan && savedStations.tujuan) {
            fetchRouteAvailability();
        }
    }, [savedStations.keberangkatan, savedStations.tujuan, formData.dewasa, formData.bayi]);

    const fetchStations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/user/stations`);
            if (response.data.success) {
                setStations(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching stations:', error);
            // Fallback ke data kosong jika API gagal
            setStations([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllStations = async () => {
        try {
            const response = await axios.get(`/api/user/stations/all`);
            if (response.data.success) {
                setAllStations(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching all stations:', error);
            setAllStations([]);
        }
    };

    const loadRecentSearches = () => {
        // Load dari localStorage
        const saved = localStorage.getItem('recentStationSearches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Error parsing recent searches:', error);
                setRecentSearches([]);
            }
        }
    };

    const saveToRecentSearches = (station) => {
        const newRecentSearches = [
            station,
            ...recentSearches.filter(item => item.id !== station.id)
        ].slice(0, 5); // Simpan maksimal 5 pencarian terakhir
        
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentStationSearches', JSON.stringify(newRecentSearches));
    };
    const filteredStations = stations.filter(station =>
        station.name.toLowerCase().includes(modalState.searchQuery.toLowerCase()) ||
        station.city.toLowerCase().includes(modalState.searchQuery.toLowerCase())
    );

    const handleBack = () => {
        router.visit('/public/dashboard');
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
        
        // Also swap saved stations
        setSavedStations(prev => ({
            keberangkatan: prev.tujuan,
            tujuan: prev.keberangkatan
        }));
    };

    const handleCariJadwal = () => {
        console.log('Mencari jadwal dengan data:', formData);
        console.log('Saved stations:', savedStations);
        console.log('Selected date from calendar:', calendarModal.selectedDate);
        
        // Use saved stations if available, otherwise use form data
        const searchData = {
            keberangkatan: savedStations.keberangkatan || formData.keberangkatan,
            tujuan: savedStations.tujuan || formData.tujuan,
            tanggal: formData.tanggal || calendarModal.selectedDate.toISOString().split('T')[0],
            dewasa: formData.dewasa,
            bayi: formData.bayi,
            pulangPergi: formData.pulangPergi,
            tanggalPulang: formData.tanggalPulang
        };
        
        console.log('Final search data:', searchData);
        
        // Navigate to schedule results page with search data
        router.visit('/public/jadwal-kereta', {
            method: 'get',
            data: searchData,
            preserveState: false
        });
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
            // Save departure station
            saveSelectedStations(station.name, savedStations.tujuan);
        } else if (modalState.type === 'tujuan') {
            setFormData(prev => ({ ...prev, tujuan: station.name }));
            // Save destination station
            saveSelectedStations(savedStations.keberangkatan, station.name);
        }
        
        // Simpan ke recent searches
        saveToRecentSearches(station);
        
        closeModal();
    };

    const handleSearchChange = (e) => {
        setModalState(prev => ({ ...prev, searchQuery: e.target.value }));
    };

    const handleClearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentStationSearches');
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
        
        console.log('Date selected:', date);
        console.log('Formatted date:', formattedDate);
        
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

    // Passenger modal functions
    const openPassengerModal = () => {
        setPassengerModal({ isOpen: true });
    };

    const closePassengerModal = () => {
        setPassengerModal({ isOpen: false });
    };

    const handlePassengerChange = (passengers) => {
        setFormData(prev => ({
            ...prev,
            dewasa: passengers.dewasa,
            bayi: passengers.bayi
        }));
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
                                    className="w-full text-left text-base bg-transparent border-none outline-none transition-colors font-medium"
                                >
                                    <span className={formData.keberangkatan ? 'text-gray-800' : 'text-gray-400'}>
                                        {formData.keberangkatan || 'Pilih stasiun keberangkatan'}
                                    </span>
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
                                    className="w-full text-left text-base bg-transparent border-none outline-none transition-colors font-medium"
                                >
                                    <span className={formData.tujuan ? 'text-gray-800' : 'text-gray-400'}>
                                        {formData.tujuan || 'Pilih stasiun tujuan'}
                                    </span>
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
                                    className="text-left transition-colors"
                                >
                                    <span className="text-sm font-medium text-gray-800 block">Tanggal Berangkat</span>
                                    <span className={`text-sm font-medium ${formData.tanggal ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {formData.tanggal ? formatDate(calendarModal.selectedDate) : 'Pilih tanggal berangkat'}
                                    </span>
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
                                    className="text-left transition-colors flex-1"
                                >
                                    <span className="text-sm font-medium text-gray-800 block">Tanggal Pulang</span>
                                    <span className={`text-sm font-medium ${formData.tanggalPulang ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {formData.tanggalPulang ? formatDate(calendarModal.selectedReturnDate || new Date(formData.tanggalPulang)) : 'Pilih tanggal pulang'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-2xl p-4">
                        <button 
                            onClick={openPassengerModal}
                            className="w-full flex items-center hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-left">
                                <span className="text-sm font-medium text-gray-800 block mb-1">Pilih Penumpang</span>
                                <span className="text-sm text-gray-800 font-medium">
                                    {formData.dewasa} Dewasa{formData.bayi > 0 ? `, ${formData.bayi} Bayi` : ''}
                                </span>
                            </div>
                            <div className="ml-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    <button
                        onClick={handleCariJadwal}
                        disabled={!formData.keberangkatan || !formData.tujuan || !formData.tanggal}
                        className={`w-full font-semibold py-4 px-6 rounded-2xl transition-all duration-300 text-lg shadow-lg mt-6 ${
                            !formData.keberangkatan || !formData.tujuan || !formData.tanggal
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
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
                stations={filteredStations}
                allStations={allStations}
                recentSearches={recentSearches}
                onClearRecentSearches={handleClearRecentSearches}
                loading={loading}
            />

            {/* Modal Kalender */}
            <CalendarModal
                isOpen={calendarModal.isOpen}
                onClose={closeCalendarModal}
                selectedDate={calendarModal.selectedDate}
                selectedReturnDate={calendarModal.selectedReturnDate}
                currentMonth={calendarModal.currentMonth}
                calendarType={calendarModal.type}
                isRoundTrip={formData.pulangPergi}
                onDateSelect={handleDateSelect}
                onNavigateMonth={navigateMonth}
                onOpenFilter={openFilterModal}
                onSwitchCalendarType={(type) => setCalendarModal(prev => ({ ...prev, type }))}
                routeAvailability={routeAvailability}
                priceData={priceData}
                selectedPrices={filterModal.selectedPrices}
                savedStations={savedStations}
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

            {/* Modal Pilih Penumpang */}
            <PassengerSelectionModal
                isOpen={passengerModal.isOpen}
                onClose={closePassengerModal}
                onPassengerChange={handlePassengerChange}
                currentPassengers={{
                    dewasa: formData.dewasa,
                    bayi: formData.bayi
                }}
            />
        </div>
    );
}
