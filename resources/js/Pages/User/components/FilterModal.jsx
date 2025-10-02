import React from 'react';

export default function FilterModal({ 
    isOpen, 
    onClose, 
    selectedClasses, 
    onToggleFilter, 
    onReset, 
    onApply 
}) {
    if (!isOpen) return null;

    const trainClasses = ['Eksekutif', 'Bisnis', 'Ekonomi'];

    const handleSelectAll = (checked) => {
        if (checked) {
            trainClasses.forEach(trainClass => {
                if (!selectedClasses.includes(trainClass)) {
                    onToggleFilter('selectedClasses', trainClass);
                }
            });
        } else {
            selectedClasses.forEach(trainClass => {
                onToggleFilter('selectedClasses', trainClass);
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col">
                {/* Header Modal Filter */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button
                        onClick={onClose}
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
                                onClick={() => handleSelectAll(selectedClasses.length !== trainClasses.length)}
                                className="text-blue-600 text-sm font-medium flex items-center"
                            >
                                Pilih Semua
                                <input 
                                    type="checkbox" 
                                    className="ml-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    checked={selectedClasses.length === trainClasses.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {trainClasses.map((trainClass) => (
                                <div key={trainClass} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <span className="text-gray-800 font-medium">{trainClass}</span>
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                                        checked={selectedClasses.includes(trainClass)}
                                        onChange={() => onToggleFilter('selectedClasses', trainClass)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="p-4 border-t border-gray-200 space-y-3">
                    <button
                        onClick={onReset}
                        className="w-full py-4 px-6 border-2 border-blue-600 text-blue-600 font-semibold rounded-2xl transition-all duration-300 hover:bg-blue-50"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onApply}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </div>
    );
}
