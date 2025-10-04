import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GroupSelector({ onManageGroups }) {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const response = await axios.get('/api/passenger-groups');
            if (response.data.success) {
                setGroups(response.data.data);
            }
        } catch (error) {
            console.error('Error loading groups:', error);
        }
    };

    const handleManageGroups = () => {
        onManageGroups();
    };

    return (
        <div className="space-y-4">
            <div className="text-center space-y-3">
                
                <div>
                    <h3 className="text-left font-semibold text-gray-900 mb-2">Grup Penumpang</h3>
                    <p className="text-sm text-gray-600 leading-relaxed text-left">
                        Kelola data penumpang dalam grup untuk memudahkan pemesanan tiket. 
                        Simpan informasi penumpang favorit dan gunakan kembali untuk pemesanan berikutnya.
                    </p>
                </div>
                
                <button
                    onClick={handleManageGroups}
                    className="w-full max-w-xs inline-flex items-center justify-center px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium text-sm"
                    title="Kelola grup penumpang"
                >
                    Kelola Grup
                </button>
            </div>

            {/* Empty State Info */}
            {groups.length === 0 && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-800">
                                Belum ada grup penumpang
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                Klik "Kelola Grup" di atas untuk membuat grup penumpang baru
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
