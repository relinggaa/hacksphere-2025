import React, { useState, useRef, useEffect } from 'react';

export default function FilterModal({ 
    isOpen, 
    onClose, 
    selectedClasses,
    selectedPrices,
    onToggleFilter, 
    onReset, 
    onApply 
}) {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState('kelas');
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const scrollContainerRef = useRef(null);

    const trainClasses = ['Eksekutif', 'Bisnis', 'Ekonomi'];
    const priceRanges = [
        { id: 'termahal', label: 'Harga Termahal', type: 'sort' },
        { id: 'termurah', label: 'Harga Termurah', type: 'sort' },
        { id: '0-100', label: 'Rp 0 - 100rb', type: 'range' },
        { id: '100-300', label: 'Rp 100rb - 300rb', type: 'range' },
        { id: '300-500', label: 'Rp 300rb - 500rb', type: 'range' },
        { id: '500+', label: 'Rp 500rb+', type: 'range' }
    ];

    const tabs = ['kelas', 'waktu', 'nama', 'harga'];

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

    // Check scroll position and update arrow states
    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    // Scroll to next tab
    const scrollToNextTab = () => {
        if (scrollContainerRef.current && canScrollRight) {
            const currentIndex = tabs.indexOf(activeTab);
            const nextIndex = Math.min(currentIndex + 1, tabs.length - 1);
            const nextTab = tabs[nextIndex];
            
            // Set active tab
            setActiveTab(nextTab);
            
            // Scroll to show the next tab
            const tabWidth = 130; // Average tab width
            const scrollAmount = tabWidth;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Scroll to previous tab
    const scrollToPrevTab = () => {
        if (scrollContainerRef.current && canScrollLeft) {
            const currentIndex = tabs.indexOf(activeTab);
            const prevIndex = Math.max(currentIndex - 1, 0);
            const prevTab = tabs[prevIndex];
            
            // Set active tab
            setActiveTab(prevTab);
            
            // Scroll to show the previous tab
            const tabWidth = 130; // Average tab width
            const scrollAmount = -tabWidth;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Effect to check scroll position on mount and scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScrollPosition();
            container.addEventListener('scroll', checkScrollPosition);
            return () => container.removeEventListener('scroll', checkScrollPosition);
        }
    }, [isOpen]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[85vh] flex flex-col" style={{ minWidth: '320px' }}>
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
                <div className="relative">
                    <div 
                        ref={scrollContainerRef}
                        className="border-b border-gray-200 mobile-scroll-tabs"
                    >
                        <div className="flex w-max px-4" style={{ minWidth: '500px' }}>
                        <button 
                            onClick={() => setActiveTab('kelas')}
                            className={`flex-shrink-0 py-3 px-3 font-medium whitespace-nowrap text-sm border-b-2 ${
                                activeTab === 'kelas' 
                                    ? 'text-blue-600 border-blue-600' 
                                    : 'text-gray-500 border-transparent'
                            }`}
                            style={{ minWidth: '110px' }}
                        >
                            Kelas Kereta
                        </button>
                        <button 
                            onClick={() => setActiveTab('waktu')}
                            className={`flex-shrink-0 py-3 px-3 font-medium whitespace-nowrap text-sm border-b-2 ${
                                activeTab === 'waktu' 
                                    ? 'text-blue-600 border-blue-600' 
                                    : 'text-gray-500 border-transparent'
                            }`}
                            style={{ minWidth: '130px' }}
                        >
                            Waktu Perjalanan
                        </button>
                        <button 
                            onClick={() => setActiveTab('nama')}
                            className={`flex-shrink-0 py-3 px-3 font-medium whitespace-nowrap text-sm border-b-2 ${
                                activeTab === 'nama' 
                                    ? 'text-blue-600 border-blue-600' 
                                    : 'text-gray-500 border-transparent'
                            }`}
                            style={{ minWidth: '110px' }}
                        >
                            Nama Kereta
                        </button>
                        <button 
                            onClick={() => setActiveTab('harga')}
                            className={`flex-shrink-0 py-3 px-3 font-medium whitespace-nowrap text-sm border-b-2 ${
                                activeTab === 'harga' 
                                    ? 'text-blue-600 border-blue-600' 
                                    : 'text-gray-500 border-transparent'
                            }`}
                            style={{ minWidth: '80px' }}
                        >
                            Harga
                        </button>
                        </div>
                    </div>
                    
                    {/* Scroll indicators */}
                    {canScrollLeft && (
                        <button
                            onClick={scrollToPrevTab}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 bg-white rounded-full p-1 shadow-md z-10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    
                    {canScrollRight && (
                        <button
                            onClick={scrollToNextTab}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 bg-white rounded-full p-1 shadow-md z-10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'kelas' && (
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
                    )}

                    {activeTab === 'harga' && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Filter Harga</h3>
                            </div>

                            <div className="space-y-4">
                                {priceRanges.map((price) => (
                                    <div key={price.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="flex items-center">
                                            <span className="text-gray-800 font-medium">{price.label}</span>
                                            {price.type === 'sort' && (
                                                <div className="ml-2 flex items-center">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type={price.type === 'sort' ? 'radio' : 'checkbox'}
                                            name={price.type === 'sort' ? 'priceSort' : 'priceRange'}
                                            className={`w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 ${
                                                price.type === 'sort' ? 'rounded-full' : 'rounded'
                                            }`}
                                            checked={selectedPrices?.includes(price.id) || false}
                                            onChange={() => onToggleFilter('selectedPrices', price.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'waktu' && (
                        <div className="mb-6">
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">Filter waktu perjalanan</p>
                                    <p className="text-gray-400 text-xs mt-1">Segera hadir</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'nama' && (
                        <div className="mb-6">
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">Filter nama kereta</p>
                                    <p className="text-gray-400 text-xs mt-1">Segera hadir</p>
                                </div>
                            </div>
                        </div>
                    )}
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
