import React, { useState } from 'react';
import TicketBookingModal from './TicketBookingModal';

export default function TrainDetailModal({ 
    isOpen, 
    onClose, 
    trainData 
}) {
    const [bookingModal, setBookingModal] = useState({
        isOpen: false,
        trainData: null
    });

    if (!isOpen || !trainData) return null;

    const formatTime = (time) => {
        return time || '21:29';
    };

    const formatDate = (date) => {
        if (!date) return '03 Okt 2025';
        const dateObj = new Date(date);
        const day = dateObj.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const calculateArrivalDate = (departureDate, departureTime, duration) => {
        if (!departureDate || !departureTime) {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 1);
            return formatDate(defaultDate);
        }
        
        const date = new Date(departureDate);
        const [hours, minutes] = departureTime.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
        
        const durationMatch = duration?.match(/(\d+)j\s*(\d+)?m?/);
        if (durationMatch) {
            const durHours = parseInt(durationMatch[1]);
            const durMinutes = parseInt(durationMatch[2]) || 0;
            
            date.setHours(date.getHours() + durHours, date.getMinutes() + durMinutes, 0, 0);
        } else {
            date.setHours(date.getHours() + 3, date.getMinutes() + 15, 0, 0);
        }
        
        return formatDate(date);
    };

    const calculateArrivalTime = (departureTime, duration) => {
        if (!departureTime) return '01:10';
        
        const [hours, minutes] = departureTime.split(':').map(Number);
        const durationMatch = duration?.match(/(\d+)j\s*(\d+)?m?/);
        
        let durHours = 3;
        let durMinutes = 15;
        
        if (durationMatch) {
            durHours = parseInt(durationMatch[1]);
            durMinutes = parseInt(durationMatch[2]) || 0;
        }
        
        const departure = new Date();
        departure.setHours(hours, minutes, 0, 0);
        
        const arrival = new Date(departure.getTime() + (durHours * 60 + durMinutes) * 60000);
        
        return arrival.toTimeString().slice(0, 5);
    };

    const handleBookingSubclass = () => {
        setBookingModal({
            isOpen: true,
            trainData: trainData
        });
    };

    const closeBookingModal = () => {
        setBookingModal({
            isOpen: false,
            trainData: null
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-blue-600 px-4 pt-12 pb-4">
                    <div className="flex items-center justify-between">
                        <div></div>
                        <h1 className="text-white text-lg font-semibold">Detail Kereta</h1>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    {/* Train Route Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
                        {/* Train Name & Class */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{trainData.nama_kereta || 'PANGANDARAN (127)'}</h2>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    trainData.kelas === 'Ekonomi' ? 'bg-pink-100 text-pink-800' :
                                    trainData.kelas === 'Bisnis' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {trainData.kelas || 'Economy'}
                                </span>
                            </div>
                        </div>

                        {/* Route Details */}
                        <div className="space-y-4">
                            {/* Departure */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <div>
                                        <div className="font-medium text-gray-900">{trainData.stasiun_asal || 'KIARACONDONG (KAC)'}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">{formatTime(trainData.jam)}</div>
                                    <div className="text-xs text-gray-500">{formatDate(trainData.tanggal)}</div>
                                </div>
                            </div>

                            {/* Transit Info */}
                            <div className="flex items-center justify-center">
                                <div className="flex items-center">
                                    <div className="border-l-2 border-dashed border-gray-300 h-8 w-1 mr-3"></div>
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-gray-500 mr-2">8 Stasiun</span>
                                    <span className="text-sm text-gray-600 mr-2">Transit</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Arrival */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <div className="font-medium text-gray-900">{trainData.stasiun_tujuan || 'GAMBIR (GMR)'}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900">{calculateArrivalTime(trainData.jam, trainData.durasi)}</div>
                                    <div className="text-xs text-gray-500">{calculateArrivalDate(trainData.tanggal, trainData.jam, trainData.durasi)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subclass Details */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Detail Subkelas</h3>
                        
                        {/* Subclass Card - Clickable */}
                        <button 
                            onClick={handleBookingSubclass}
                            className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-gray-900">{trainData.kelas || 'Ekonomi'} (CD)</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-green-600 text-sm font-medium mb-1">Available</div>
                                    <div className="font-bold text-gray-900">Rp{parseFloat(trainData.harga_termurah || 165000).toLocaleString('id-ID')}/Pax</div>
                                </div>
                            </div>
                            <div className="mt-2 text-right">
                                <svg className="w-5 h-5 text-blue-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Additional Services */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
                        <h4 className="font-bold text-gray-900 mb-3">Layanan Tambahan</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">WiFi Gratis</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Toilet</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">AC</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Restorasi</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                        Tutup Detail
                    </button>
                </div>
            </div>

            {/* Ticket Booking Modal */}
            <TicketBookingModal
                isOpen={bookingModal.isOpen}
                onClose={closeBookingModal}
                trainData={bookingModal.trainData}
            />
        </div>
    );
}
