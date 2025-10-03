import React, { useState } from 'react';
import { addToCart } from '../../../utils/cart';
import DocumentUploadModal from './DocumentUploadModal';
import GroupSelector from './GroupSelector';
import GroupManagementModal from './GroupManagementModal';

export default function TicketBookingModal({ 
    isOpen, 
    onClose, 
    trainData,
    passengerData
}) {
    const [orderDetails, setOrderDetails] = useState({
        name: passengerData?.name || 'RELINGGA ADITYA',
        nik: passengerData?.nik || '',
        addAsPassenger: false
    });

        const [showUploadModal, setShowUploadModal] = useState(false);
        const [showGroupManagement, setShowGroupManagement] = useState(false);

    const [showJourneyDetails, setShowJourneyDetails] = useState(false);

    if (!isOpen || !trainData) return null;

    // Helper functions
    const formatDate = (date) => {
        if (!date) return 'Fri, 03 Oct 2025';
        const dateObj = new Date(date);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = days[dateObj.getDay()];
        const day = dateObj.getDate();
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        
        return `${dayName}, ${day} ${month} ${year}`;
    };

    const formatTime = (time) => {
        return time || '21.29';
    };

    const calculateArrivalTime = (departureTime, duration) => {
        if (!departureTime) return '01.10';
        
        const [hours, minutes] = (departureTime || '21:29').split(':').map(Number);
        const durationMatch = duration?.match(/(\d+)j\s*(\d+)?m?/);
        
        let durHours = 3;
        let durMinutes = 45; // Default duration
        
        if (durationMatch) {
            durHours = parseInt(durationMatch[1]);
            durMinutes = parseInt(durationMatch[2]) || 0;
        }
        
        const departure = new Date();
        departure.setHours(hours, minutes, 0, 0);
        
        const arrival = new Date(departure.getTime() + (durHours * 60 + durMinutes) * 60000);
        
        return arrival.toTimeString().slice(0, 5);
    };

    const handleInputChange = (field, value) => {
        setOrderDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleKTPScan = () => {
        setShowUploadModal(true);
    };

    const handleScanComplete = (scannedData) => {
        setOrderDetails(prev => ({
            ...prev,
            name: scannedData.name || '',
            nik: scannedData.nik || ''
        }));
        setShowUploadModal(false);
    };

    const handleUploadClose = () => {
        setShowUploadModal(false);
    };

    // Handle group selection
    const handleGroupSelect = (group) => {
        if (group && group.passengers && group.passengers.length > 0) {
            // Use the first passenger as default
            const firstPassenger = group.passengers[0];
            setOrderDetails(prev => ({
                ...prev,
                name: firstPassenger.name,
                nik: firstPassenger.nik
            }));
        }
    };

    // Handle manage groups
    const handleManageGroups = () => {
        setShowGroupManagement(true);
    };

    // Handle group management close
    const handleGroupManagementClose = () => {
        setShowGroupManagement(false);
    };

    const handleContinue = () => {
        // Validate required fields
        if (!orderDetails.nik || orderDetails.nik.length !== 16) {
            alert('NIK harus diisi dengan 16 digit angka. Silakan scan KTP atau isi manual.');
            return;
        }
        
        if (!orderDetails.name || orderDetails.name.trim().length < 3) {
            alert('Nama lengkap harus diisi minimal 3 karakter.');
            return;
        }
        // Simpan pesanan ke backend
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        fetch('/api/orders/antar-kota', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
            credentials: 'same-origin',
            body: JSON.stringify({
                train_id: trainData?.id,
                nama_kereta: trainData?.nama_kereta,
                kelas: trainData?.kelas,
                tanggal: trainData?.tanggal,
                jam: trainData?.jam,
                stasiun_asal: trainData?.stasiun_asal,
                stasiun_tujuan: trainData?.stasiun_tujuan,
                harga: trainData?.harga_termurah || 0,
                passenger_name: orderDetails.name,
                passenger_nik: orderDetails.nik
            })
        }).then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
                const msg = data?.errors ? Object.values(data.errors).flat().join('\n') : (data?.error || 'Gagal menyimpan pesanan');
                alert(msg);
                return;
            }
            // Redirect ke tiket saya
            window.location.href = '/public/tickets';
        }).catch(() => alert('Gagal menyimpan pesanan'));
    };

    const handleAddToCart = () => {
        if (!orderDetails.nik || orderDetails.nik.length !== 16) {
            alert('Isi NIK 16 digit terlebih dahulu sebelum menambah ke keranjang.');
            return;
        }
        const cartItem = {
            trainId: trainData?.id,
            namaKereta: trainData?.nama_kereta,
            kelas: trainData?.kelas,
            tanggal: trainData?.tanggal,
            jam: trainData?.jam,
            asal: trainData?.stasiun_asal,
            tujuan: trainData?.stasiun_tujuan,
            harga: trainData?.harga_termurah,
            passenger: { name: orderDetails.name, nik: orderDetails.nik }
        };
        addToCart(cartItem);
        alert('Ditambahkan ke keranjang.');
    };

    const getPassengerCount = () => {
        const adultCount = trainData?.penumpang || 1;
        const babyCount = 0; // For now, not handling babies
        return `${adultCount} Adult${babyCount > 0 ? `, ${babyCount} Child` : ''}`;
    };

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            {/* Header */}
            <div className="bg-blue-600 px-4 pt-12 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={onClose}
                            className="mr-4 text-white hover:text-white/80"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-white text-lg font-semibold">Ticket Booking</h1>
                    </div>
                </div>
                
                {/* Progress Steps */}
                <div className="flex items-center mt-4 space-x-3">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <span className="ml-2 text-white text-sm font-medium">Passengers Data</span>
                    </div>
                    <div className="w-8 h-px bg-white/30"></div>
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <span className="ml-2 text-white/70 text-sm">Seat</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6 space-y-4">
                {/* Journey Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <button
                        onClick={() => setShowJourneyDetails(!showJourneyDetails)}
                        className="w-full flex items-center justify-between"
                    >
                        <div className="flex-1 text-left">
                            {/* Date and Time */}
                            <div className="flex items-center mb-2">
                                <span className="text-sm font-medium text-gray-900">{formatDate(trainData.tanggal)}</span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-sm text-gray-600">{formatTime(trainData.jam)}</span>
                                <span className="mx-2 text-gray-400">-</span>
                                <span className="text-sm text-gray-600">{calculateArrivalTime(trainData.jam, trainData.durasi)}</span>
                                <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">+1 hari</span>
                            </div>
                            
                            {/* Route */}
                            <div className="text-lg font-semibold text-gray-900 mb-2">
                                {trainData.stasiun_asal || 'KIARACONDONG'} → {trainData.stasiun_tujuan || 'GAMBIR'}
                            </div>
                            
                            {/* Train and Class */}
                            <div className="text-sm text-gray-600 mb-2">
                                {trainData.nama_kereta || 'PANGANDARAN (127)'} • {trainData.kelas || 'EKONOMI'} (CD)
                            </div>
                            
                            {/* Passenger Count */}
                            <div className="text-sm text-gray-500">{getPassengerCount()}</div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                    
                    {/* Group Selector */}
                    <div className="mb-6">
                        <GroupSelector 
                            onGroupSelect={handleGroupSelect}
                            onManageGroups={handleManageGroups}
                        />
                    </div>
                    
                    {/* Passenger Information */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                value={orderDetails.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>

                        {/* NIK */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={orderDetails.nik}
                                    onChange={(e) => handleInputChange('nik', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan NIK"
                                    maxLength="16"
                                />
                                <button
                                    onClick={handleKTPScan}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm">Scan KTP</span>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Klik "Scan KTP" untuk mengisi otomatis dengan kamera</p>
                        </div>

                        {/* Add as passenger toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Add as passenger</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={orderDetails.addAsPassenger}
                                    onChange={(e) => handleInputChange('addAsPassenger', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Information Notice */}
                    <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg mt-4 text-sm">
                        Ticket information and confirmation will be sent to the contact details listed.
                    </div>
                </div>
            </div>

            {/* Bottom Action Button */}
            <div className="px-4 pb-6">
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                    >
                        Tambah ke Keranjang
                    </button>
                    <button
                        onClick={handleContinue}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                    >
                        CONTINUE
                    </button>
                </div>
            </div>

            {/* TSReact KTP Scanner */}
            <DocumentUploadModal
                isOpen={showUploadModal}
                onScanComplete={handleScanComplete}
                onClose={handleUploadClose}
            />

            {/* Group Management Modal */}
            <GroupManagementModal
                isOpen={showGroupManagement}
                onClose={handleGroupManagementClose}
            />
        </div>
    );
}
