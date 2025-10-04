import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function BookingPorter({ auth = {}, success, error, data, count, all_porters }) {
    const { flash } = usePage().props;
    const [porters, setPorters] = useState(data || []);
    const [loading, setLoading] = useState(false);
    const [selectedPorter, setSelectedPorter] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        pickup_location: '',
        destination: '',
        service_type: 'baggage',
        notes: '',
        scheduled_time: '',
        price: ''
    });
    const [bookingProcessing, setBookingProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        console.log('Auth data received:', auth);
        console.log('Auth user:', auth.user);
        console.log('Auth user ID:', auth.user?.id);
        console.log('Auth user name:', auth.user?.name);
        
        if (data && data.length > 0) {
            setPorters(data);
        } else {
            fetchOnlinePorters();
        }
    }, [data, auth]);

    useEffect(() => {
        if (flash?.success) {
            alert(flash.success);
        }
        if (flash?.error) {
            alert(flash.error);
        }
    }, [flash]);

    const fetchOnlinePorters = () => {
        setLoading(true);
        router.get('/api/porters/online', {}, {
            onSuccess: (page) => {
                console.log('Full API response:', page);
                if (page.success) {
                    setPorters(page.data);
                    console.log('Online porters:', page.data);
                    console.log('Porters count:', page.count);
                    console.log('All porters (debug):', page.all_porters);
                }
            },
            onError: (errors) => {
                console.error('Error fetching porters:', errors);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    const handleBack = () => {
        router.visit('/user/dashboard');
    };

    const handleSelectPorter = (porter) => {
        setSelectedPorter(porter);
        setShowBookingModal(true);
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        setBookingProcessing(true);
        setErrors({});

        // Debug auth data
        console.log('Auth data in handleBookingSubmit:', auth);
        console.log('Auth user:', auth.user);
        console.log('Auth user ID:', auth.user?.id);

        const requestData = {
            porter_id: selectedPorter.id,
            user_id: auth.user?.id || null,
            pickup_location: bookingData.pickup_location,
            destination: bookingData.destination,
            service_type: bookingData.service_type,
            notes: bookingData.notes,
            scheduled_time: bookingData.scheduled_time,
            price: bookingData.price
        };
        
        console.log('Sending booking request:', requestData);
        console.log('Selected porter:', selectedPorter);
        console.log('Auth user:', auth.user);
        
        router.post('/api/porter-orders', requestData, {
            onSuccess: () => {
                setShowBookingModal(false);
                setSelectedPorter(null);
                setBookingData({
                    pickup_location: '',
                    destination: '',
                    service_type: 'baggage',
                    notes: '',
                    scheduled_time: '',
                    price: ''
                });
                router.visit('/user/dashboard');
            },
            onError: (errors) => {
                console.error('Error booking porter:', errors);
                setErrors(errors);
            },
            onFinish: () => {
                setBookingProcessing(false);
            }
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const date = new Date(timeString);
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Gojek-style Header */}
            <div className="bg-green-500 px-4 pt-12 pb-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <button 
                            onClick={handleBack}
                            className="mr-4 text-white hover:text-white/80 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">E-Porter</h1>
                            <p className="text-green-100 text-sm">Porter Online Terdekat</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                {/* Location Bar */}
                <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600">Lokasi Anda</p>
                            <p className="font-medium text-gray-900">Stasiun Kereta Api</p>
                        </div>
                        <button className="text-green-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6">
                {/* Gojek-style Service Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm">Bantuan Bagasi</h3>
                                <p className="text-xs text-gray-500">Angkut barang</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm">Panduan</h3>
                                <p className="text-xs text-gray-500">Bantuan umum</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Porter Tersedia</h3>
                                <p className="text-sm text-gray-500">{porters.length} porter online</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchOnlinePorters}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Memuat...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            <p className="text-gray-600 font-medium">Mencari porter terdekat...</p>
                        </div>
                    </div>
                )}

                {/* Porter List - Gojek Style */}
                {!loading && (
                    <div className="space-y-3">
                        {porters.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Porter Online</h3>
                                <p className="text-gray-500 mb-6">Belum ada porter yang tersedia saat ini. Silakan coba lagi nanti.</p>
                                
                                <button
                                    onClick={fetchOnlinePorters}
                                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        ) : (
                            porters.map((porter) => (
                                <div key={porter.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {/* Porter Avatar */}
                                                <div className="relative">
                                                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                                                        {porter.photo_url ? (
                                                            <img 
                                                                src={porter.photo_url} 
                                                                alt={porter.name}
                                                                className="w-14 h-14 rounded-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'block';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <svg 
                                                            className={`w-7 h-7 text-green-600 ${porter.photo_url ? 'hidden' : 'block'}`} 
                                                            fill="currentColor" 
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    {/* Online Status */}
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                </div>
                                                
                                                {/* Porter Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-semibold text-gray-900">{porter.name}</h3>
                                                        <div className="flex items-center space-x-1">
                                                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            <span className="text-sm font-medium text-gray-700">4.8</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{porter.email}</p>
                                                    {porter.no_telepon && (
                                                        <p className="text-xs text-gray-400">{porter.no_telepon}</p>
                                                    )}
                                                    <div className="flex items-center mt-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                                        <span className="text-xs text-green-600 font-medium">Online</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Book Button */}
                                            <button
                                                onClick={() => handleSelectPorter(porter)}
                                                className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors shadow-sm"
                                            >
                                                Pilih Porter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Booking Modal - Gojek Style */}
            {showBookingModal && selectedPorter && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl sm:rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Booking Porter</h3>
                                    <p className="text-sm text-gray-500">Isi detail pemesanan Anda</p>
                                </div>
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Selected Porter Info */}
                        <div className="px-6 py-4 bg-green-50 border-b border-green-100">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                                        {selectedPorter.photo_url ? (
                                            <img 
                                                src={selectedPorter.photo_url} 
                                                alt={selectedPorter.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : null}
                                        <svg 
                                            className={`w-6 h-6 text-green-600 ${selectedPorter.photo_url ? 'hidden' : 'block'}`} 
                                            fill="currentColor" 
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-semibold text-gray-900">{selectedPorter.name}</h4>
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700">4.8</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{selectedPorter.email}</p>
                                    <div className="flex items-center mt-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                        <span className="text-xs text-green-600 font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="px-6 py-4">
                            <form onSubmit={handleBookingSubmit} className="space-y-6">
                                {/* Pickup Location */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Lokasi Penjemputan <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="pickup_location"
                                            value={bookingData.pickup_location}
                                            onChange={handleBookingChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.pickup_location ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Contoh: Stasiun Gambir"
                                            required
                                        />
                                    </div>
                                    {errors.pickup_location && (
                                        <p className="text-red-500 text-xs mt-1">{errors.pickup_location}</p>
                                    )}
                                </div>

                                {/* Destination */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Tujuan <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="destination"
                                            value={bookingData.destination}
                                            onChange={handleBookingChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.destination ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Contoh: Hotel dekat stasiun"
                                            required
                                        />
                                    </div>
                                    {errors.destination && (
                                        <p className="text-red-500 text-xs mt-1">{errors.destination}</p>
                                    )}
                                </div>

                                {/* Service Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Jenis Layanan
                                    </label>
                                    <select
                                        name="service_type"
                                        value={bookingData.service_type}
                                        onChange={handleBookingChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="baggage">🎒 Bantuan Bagasi</option>
                                        <option value="luggage">🧳 Bantuan Koper</option>
                                        <option value="assistance">👥 Bantuan Umum</option>
                                    </select>
                                </div>

                                {/* Scheduled Time */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Waktu Jemput
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="datetime-local"
                                            name="scheduled_time"
                                            value={bookingData.scheduled_time}
                                            onChange={handleBookingChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Harga Sewa Porter (Rp)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-medium">Rp</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="price"
                                            value={bookingData.price}
                                            onChange={handleBookingChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="50000"
                                            min="0"
                                            step="1000"
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        💡 Masukkan harga yang Anda inginkan untuk layanan porter
                                    </p>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Catatan Tambahan
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={bookingData.notes}
                                        onChange={handleBookingChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                        placeholder="Contoh: Ada 2 koper besar dan 1 tas ransel"
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex space-x-3 pt-6 pb-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingModal(false)}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={bookingProcessing}
                                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 shadow-lg"
                                    >
                                        {bookingProcessing ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Memproses...</span>
                                            </div>
                                        ) : (
                                            'Booking Porter'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
