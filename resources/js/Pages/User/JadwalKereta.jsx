import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function JadwalKereta({ searchData = {} }) {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(searchData.tanggal || '');
    
    // Debug: Log the search data and selected date
    console.log('JadwalKereta - searchData:', searchData);
    console.log('JadwalKereta - selectedDate:', selectedDate);
    const [showExpired, setShowExpired] = useState(false);

    // Generate date options (selected date + 7 days)
    const generateDateOptions = () => {
        const dates = [];
        const startDate = searchData.tanggal ? new Date(searchData.tanggal) : new Date();
        
        console.log('Generating date options from:', startDate);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const dateOptions = generateDateOptions();

    // Format date for display
    const formatDate = (date) => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        
        return `${dayName}, ${day} ${month}`;
    };

    // Format full date for display
    const formatFullDate = (date) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${dayName}, ${day} ${month} ${year}`;
    };

    // Calculate arrival time
    const calculateArrivalTime = (departureTime, duration) => {
        const [hours, minutes] = departureTime.split(':').map(Number);
        const [durHours, durMinutes] = duration.split('j ')[0].split('j')[0].split('j ')[1] ? 
            [parseInt(duration.split('j ')[0]), parseInt(duration.split('j ')[1].split('m')[0])] : 
            [parseInt(duration.split('j')[0]), 0];
        
        const departure = new Date();
        departure.setHours(hours, minutes, 0, 0);
        
        const arrival = new Date(departure.getTime() + (durHours * 60 + durMinutes) * 60000);
        
        return arrival.toTimeString().slice(0, 5);
    };

    // Fetch schedules based on search criteria
    useEffect(() => {
        fetchSchedules();
    }, [selectedDate]);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            
            // Debug: Log the search data
            console.log('Search data:', searchData);
            console.log('Selected date:', selectedDate);
            
            const params = {
                stasiun_asal: searchData?.keberangkatan || 'Pasar Senen',
                stasiun_tujuan: searchData?.tujuan || 'Bandung',
                tanggal: selectedDate || searchData?.tanggal,
                penumpang: (searchData?.dewasa || 1) + (searchData?.bayi || 0)
            };
            
            console.log('API params:', params);
            
            const response = await axios.get(`${window.location.origin}/api/public/schedules`, { params });
            
            console.log('API response:', response.data);
            
            if (response.data.success) {
                setSchedules(response.data.data);
                console.log('Schedules found:', response.data.data.length);
            } else {
                console.log('No schedules found or API error');
                setSchedules([]);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.visit('/public/pesan-tiket');
    };

    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        console.log('Date changed to:', formattedDate);
        setSelectedDate(formattedDate);
    };

    const handleSort = () => {
        // Implement sorting logic
        console.log('Sort clicked');
    };

    const handleFilter = () => {
        // Implement filter logic
        console.log('Filter clicked');
    };

    const handleTrainDetail = (schedule) => {
        // Navigate to train detail page
        console.log('Train detail:', schedule);
    };

    const handleViewSubclass = (schedule) => {
        // Show subclass options
        console.log('View subclass:', schedule);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-blue-600 px-4 pt-12 pb-4">
                <div className="flex items-center mb-4">
                    <button 
                        onClick={handleBack}
                        className="mr-4 text-white hover:text-white/80"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1">
                        <div className="text-white text-sm font-medium">
                            {searchData.keberangkatan && searchData.tujuan 
                                ? `${searchData.keberangkatan.toUpperCase()} → ${searchData.tujuan.toUpperCase()}`
                                : 'Pilih rute perjalanan'
                            }
                        </div>
                        <div className="text-white/90 text-xs">
                            {selectedDate 
                                ? `${formatFullDate(new Date(selectedDate))} • ${searchData.dewasa || 1} Dewasa ${searchData.bayi || 0} Bayi`
                                : searchData.tanggal 
                                    ? `${formatFullDate(new Date(searchData.tanggal))} • ${searchData.dewasa || 1} Dewasa ${searchData.bayi || 0} Bayi`
                                    : 'Pilih tanggal dan jumlah penumpang'
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Selection Tabs */}
            <div className="bg-white px-4 py-3 border-b border-gray-200">
                <div className="flex space-x-4 overflow-x-auto">
                    {dateOptions.map((date, index) => {
                        const isSelected = date.toISOString().split('T')[0] === selectedDate;
                        return (
                            <button
                                key={index}
                                onClick={() => handleDateChange(date)}
                                className={`flex-shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    isSelected 
                                        ? 'text-blue-600 border-blue-600' 
                                        : 'text-gray-500 border-transparent hover:text-gray-700'
                                }`}
                            >
                                {formatDate(date)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Kereta Keberangkatan</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-500 mb-4">Tidak ada jadwal tersedia untuk tanggal ini</div>
                        <button 
                            onClick={() => router.get('/user/pesan-tiket')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                        >
                            Ubah Pencarian
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {schedules.map((schedule, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            schedule.kelas === 'Ekonomi' ? 'bg-pink-100 text-pink-800' :
                                            schedule.kelas === 'Bisnis' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {schedule.kelas}
                                        </span>
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                            Tersedia
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {schedule.nama_kereta}
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                                            <div>
                                                <div className="font-medium text-gray-900">{schedule.jam} {schedule.stasiun_asal}</div>
                                                <div className="text-sm text-gray-500">({schedule.stasiun_asal})</div>
                                            </div>
                                        </div>
                                        
                                        <div className="ml-6 text-sm text-gray-500">
                                            {schedule.durasi || '08j 10m'} perjalanan
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {schedule.jam_tiba || calculateArrivalTime(schedule.jam, schedule.durasi || '08j 10m')} {schedule.stasiun_tujuan}
                                                </div>
                                                <div className="text-sm text-gray-500">({schedule.stasiun_tujuan})</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <button 
                                            onClick={() => handleViewSubclass(schedule)}
                                            className="text-blue-600 text-sm font-medium flex items-center"
                                        >
                                            Lihat Subkelas
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Harga Mulai Dari</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            Rp{schedule.harga_termurah.toLocaleString('id-ID')} / Pax
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button 
                                        onClick={() => handleTrainDetail(schedule)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        Detail Kereta
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Connecting Train Suggestion */}
                <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">Connecting Train</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Jadwal tidak tersedia? Mau sekalian mampir ke kota lain? Yuk, Coba Connecting Train
                            </p>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
                                Lihat Jadwal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
                <div className="flex justify-between items-center mb-3">
                    <button 
                        onClick={handleSort}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        Urutkan
                    </button>
                    <button 
                        onClick={handleFilter}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter
                    </button>
                </div>
                
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tampilkan jadwal yang telah habis</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showExpired}
                            onChange={(e) => setShowExpired(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
}
