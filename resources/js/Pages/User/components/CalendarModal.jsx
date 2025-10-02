import React from 'react';

export default function CalendarModal({ 
    isOpen, 
    onClose, 
    selectedDate, 
    currentMonth, 
    onDateSelect, 
    onNavigateMonth, 
    onOpenFilter, 
    routeAvailability 
}) {
    if (!isOpen) return null;

    // Helper functions
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getMonthName = (date) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const isRouteAvailable = (date) => {
        const dateKey = date.toISOString().split('T')[0];
        return routeAvailability[dateKey] !== undefined ? routeAvailability[dateKey] : true;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col">
                {/* Header Modal */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center"
                    >
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800">Pilih tanggal</h2>
                    <button
                        onClick={onOpenFilter}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </button>
                </div>

                {/* Info Banner */}
                <div className="bg-orange-500 text-white p-4 flex items-center">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-sm">Pemesanan kereta dapat dilakukan sampai dengan 17 November 2025 (H+45)</span>
                </div>

                {/* Date Selection Tabs */}
                <div className="p-4">
                    <div className="flex space-x-4 mb-6">
                        <div className="flex-1">
                            <div className="text-center">
                                <span className="text-sm text-gray-600 block mb-1">Berangkat</span>
                                <button className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-xl font-medium">
                                    02 Okt 2025
                                </button>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-center">
                                <span className="text-sm text-gray-600 block mb-1">Pulang</span>
                                <button className="w-full py-3 px-4 bg-blue-100 text-blue-600 rounded-xl font-medium flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Tanggal Pulang
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => onNavigateMonth(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h3 className="text-xl font-semibold text-gray-800">{getMonthName(currentMonth)}</h3>
                        <button
                            onClick={() => onNavigateMonth(1)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="mb-6">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-1">
                            {(() => {
                                const daysInMonth = getDaysInMonth(currentMonth);
                                const firstDay = getFirstDayOfMonth(currentMonth);
                                const days = [];
                                
                                // Empty cells for days before month starts
                                for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
                                    days.push(<div key={`empty-${i}`} className="h-12"></div>);
                                }
                                
                                // Days of the month
                                for (let day = 1; day <= daysInMonth; day++) {
                                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                    const isSelected = date.toDateString() === selectedDate.toDateString();
                                    const isToday = date.toDateString() === new Date().toDateString();
                                    const isWeekend = date.getDay() === 0; // Sunday
                                    const routeAvailable = isRouteAvailable(date);
                                    
                                    days.push(
                                        <button
                                            key={day}
                                            onClick={() => onDateSelect(date)}
                                            className={`h-12 w-full rounded-full flex flex-col items-center justify-center text-sm font-medium transition-colors relative ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white'
                                                    : isWeekend
                                                    ? 'text-red-500 hover:bg-red-50'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="mb-1">{day}</span>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                routeAvailable ? 'bg-green-500' : 'bg-red-500'
                                            } ${isSelected ? 'bg-white' : ''}`}></div>
                                        </button>
                                    );
                                }
                                
                                return days;
                            })()}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 text-lg shadow-lg"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
