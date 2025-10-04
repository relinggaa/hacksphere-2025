import React from 'react';

export default function OCRResultModal({ isOpen, onClose, ocrData, onConfirm }) {
    if (!isOpen || !ocrData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-70 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 m-4 max-w-md w-full">
                <div className="text-center">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Hasil Scan KTP</h3>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Success Icon */}
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">Data berhasil diekstrak dari KTP</p>

                    {/* Extracted Data */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left space-y-3">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Nama Lengkap</label>
                            <div className={`text-sm font-medium bg-white px-3 py-2 rounded border ${
                                ocrData.name ? 'text-gray-900' : 'text-red-500'
                            }`}>
                                {ocrData.name || 'Tidak ditemukan'}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1">NIK</label>
                            <div className={`text-sm font-medium bg-white px-3 py-2 rounded border ${
                                ocrData.nik ? 'text-gray-900' : 'text-red-500'
                            }`}>
                                {ocrData.nik  || 'Tidak ditemukan'}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Tanggal Lahir</label>
                            <div className={`text-sm font-medium bg-white px-3 py-2 rounded border ${
                                ocrData.birthDate ? 'text-gray-900' : 'text-red-500'
                            }`}>
                                {ocrData.birthDate || 'Tidak ditemukan'}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Jenis Kelamin</label>
                            <div className={`text-sm font-medium bg-white px-3 py-2 rounded border ${
                                ocrData.gender ? 'text-gray-900' : 'text-red-500'
                            }`}>
                                {ocrData.gender || 'Tidak ditemukan'}
                            </div>
                        </div>

                        {ocrData.address && (
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Alamat</label>
                                <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                                    {ocrData.address}
                                </div>
                            </div>
                        )}

                        {ocrData.religion && (
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Agama</label>
                                <div className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded border">
                                    {ocrData.religion}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Data Quality Warning */}
                    {(!ocrData.name || !ocrData.birthDate || !ocrData.gender) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-yellow-800">Data Tidak Lengkap</h4>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        Beberapa data tidak berhasil diekstrak. Anda dapat mengisi manual atau scan ulang dengan pencahayaan yang lebih baik.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Scan Ulang
                        </button>
                        <button
                            onClick={() => onConfirm(ocrData)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Gunakan Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
