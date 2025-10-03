import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GroupSelector({ onGroupSelect, onManageGroups }) {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');

    useEffect(() => {
        loadGroups();
    }, []);

    // Load groups from API
    const loadGroups = async () => {
        try {
            const response = await axios.get('/api/passenger-groups');
            if (response.data.success) {
                setGroups(response.data.data);
            }
        } catch (error) {
            console.error('Error loading groups:', error);
            // Don't show alert here as it might be called frequently
        }
    };

    // Handle group selection
    const handleGroupChange = (e) => {
        const groupId = e.target.value;
        setSelectedGroupId(groupId);
        
        if (groupId) {
            const selectedGroup = groups.find(group => group.id === groupId);
            if (selectedGroup) {
                onGroupSelect(selectedGroup);
            }
        } else {
            onGroupSelect(null);
        }
    };

    // Handle manage groups click
    const handleManageGroups = () => {
        onManageGroups();
    };

    return (
        <div className="space-y-3">
            {/* Group Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Grup Penumpang
                </label>
                <div className="flex space-x-2">
                    <select
                        value={selectedGroupId}
                        onChange={handleGroupChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Pilih grup atau isi manual</option>
                        {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.group_name} ({group.passengers?.length || 0} penumpang)
                            </option>
                        ))}
                    </select>
                    
                    <button
                        onClick={handleManageGroups}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        title="Kelola grup"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
                
                {groups.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                        Belum ada grup. Klik tombol pengaturan untuk membuat grup.
                    </p>
                )}
            </div>

            {/* Selected Group Info */}
            {selectedGroupId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-blue-800">
                                Grup terpilih: {groups.find(g => g.id === selectedGroupId)?.group_name}
                            </p>
                            <p className="text-xs text-blue-600">
                                Data akan otomatis terisi dari grup yang dipilih
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
