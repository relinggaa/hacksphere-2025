import React, { useState } from 'react';

export default function PassengerSelectionModal({ isOpen, onClose, onPassengerChange, currentPassengers }) {
    const [passengers, setPassengers] = useState({
        dewasa: currentPassengers?.dewasa || 1,
        bayi: currentPassengers?.bayi || 0
    });

    const handlePassengerChange = (type, value) => {
        const newValue = Math.max(0, value);
        
        // Validasi: bayi tidak boleh melebihi jumlah dewasa
        if (type === 'bayi' && newValue > passengers.dewasa) {
            return;
        }
        
        setPassengers(prev => ({
            ...prev,
            [type]: newValue
        }));
    };

    const handleSave = () => {
        onPassengerChange(passengers);
        onClose();
    };

    const formatNumber = (num) => {
        return num.toString().padStart(2, '0');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-w-md animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900">Pilih Penumpang</h2>
                    <div className="w-8"></div> {/* Spacer untuk centering */}
                </div>

                {/* Content */}
                <div className="p-4 space-y-6">
                    {/* Dewasa Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900">Dewasa</h3>
                            <p className="text-sm text-gray-500">3 tahun ke atas</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handlePassengerChange('dewasa', passengers.dewasa - 1)}
                                disabled={passengers.dewasa <= 1}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium transition-colors ${
                                    passengers.dewasa <= 1 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                -
                            </button>
                            <div className="w-12 h-8 flex items-center justify-center border border-gray-300 rounded-lg">
                                <span className="text-base font-medium text-gray-900">
                                    {formatNumber(passengers.dewasa)}
                                </span>
                            </div>
                            <button
                                onClick={() => handlePassengerChange('dewasa', passengers.dewasa + 1)}
                                className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Bayi Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900">Bayi</h3>
                            <p className="text-sm text-gray-500">Bayi dibawah 3 tahun</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handlePassengerChange('bayi', passengers.bayi - 1)}
                                disabled={passengers.bayi <= 0}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium transition-colors ${
                                    passengers.bayi <= 0 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                -
                            </button>
                            <div className="w-12 h-8 flex items-center justify-center border border-gray-300 rounded-lg">
                                <span className="text-base font-medium text-gray-900">
                                    {formatNumber(passengers.bayi)}
                                </span>
                            </div>
                            <button
                                onClick={() => handlePassengerChange('bayi', passengers.bayi + 1)}
                                disabled={passengers.bayi >= passengers.dewasa}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium transition-colors ${
                                    passengers.bayi >= passengers.dewasa
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Ketentuan Penumpang Bayi */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Ketentuan Penumpang Bayi</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li>• Tidak dikenakan biaya tiket.</li>
                                    <li>• Tidak mendapat kursi sendiri.</li>
                                    <li>• Tidak dapat melebihi jumlah penumpang dewasa.</li>
                                </ul>
                                <button className="text-blue-600 text-xs font-medium mt-2 hover:text-blue-700">
                                    Lihat Informasi Selengkapnya
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 text-base"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
