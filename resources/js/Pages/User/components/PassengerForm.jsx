import React, { useState } from 'react';
import DocumentUploadModal from './DocumentUploadModal';

export default function PassengerForm({ 
    passenger, 
    index, 
    onChange, 
    onRemove, 
    canRemove = false 
}) {
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleInputChange = (field, value) => {
        onChange(index, field, value);
    };

    const handleKTPScan = () => {
        setShowUploadModal(true);
    };

    const handleScanComplete = (scannedData) => {
        onChange(index, 'name', scannedData.name || '');
        onChange(index, 'nik', scannedData.nik || '');
        setShowUploadModal(false);
    };

    const handleUploadClose = () => {
        setShowUploadModal(false);
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-800">
                    Penumpang {index + 1}
                </h4>
                {canRemove && (
                    <button
                        onClick={() => onRemove(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus penumpang"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {/* Nama Lengkap (manual) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap (opsional)
                    </label>
                    <input
                        type="text"
                        value={passenger.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nama lengkap (boleh dikosongkan)"
                    />
                </div>
                {/* NIK */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIK
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={passenger.nik}
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
            </div>

            {/* Document Upload Modal */}
            <DocumentUploadModal
                isOpen={showUploadModal}
                onScanComplete={handleScanComplete}
                onClose={handleUploadClose}
            />
        </div>
    );
}
