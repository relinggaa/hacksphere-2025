import React, { useState, useEffect } from 'react';
import PassengerForm from './PassengerForm';

export default function GroupManagementModal({ isOpen, onClose }) {
    const [groups, setGroups] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [formData, setFormData] = useState({
        groupName: '',
        passengers: [{ name: '', nik: '' }]
    });

    useEffect(() => {
        if (isOpen) {
            loadGroups();
        }
    }, [isOpen]);

    const fetchJson = async (url, options = {}) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                ...(options.headers || {})
            },
            credentials: 'same-origin',
            ...options
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const error = new Error(data?.error || 'Request failed');
            error.status = res.status;
            error.data = data;
            throw error;
        }
        return data;
    };

    const loadGroups = async () => {
        try {
            const data = await fetchJson('/api/passenger-groups', { method: 'GET' });
            if (data.success) setGroups(data.data);
        } catch (error) {
            console.error('Error loading groups:', error);
            if (error.status === 401) {
                alert('Anda harus login untuk mengakses grup penumpang');
            } else {
                alert('Gagal memuat grup penumpang');
            }
        }
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle passenger input change
    const handlePassengerChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            passengers: prev.passengers.map((passenger, i) => 
                i === index ? { ...passenger, [field]: value } : passenger
            )
        }));
    };

    // Add new passenger
    const handleAddPassenger = () => {
        setFormData(prev => ({
            ...prev,
            passengers: [...prev.passengers, { name: '', nik: '' }]
        }));
    };

    // Remove passenger
    const handleRemovePassenger = (index) => {
        if (formData.passengers.length > 1) {
            setFormData(prev => ({
                ...prev,
                passengers: prev.passengers.filter((_, i) => i !== index)
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        if (!formData.groupName.trim()) {
            alert('Nama grup harus diisi');
            return false;
        }
        
        for (let i = 0; i < formData.passengers.length; i++) {
            const passenger = formData.passengers[i];
            if (!passenger.name.trim()) {
                alert(`Nama penumpang ${i + 1} harus diisi`);
                return false;
            }
            if (!passenger.nik.trim()) {
                alert(`NIK penumpang ${i + 1} harus diisi`);
                return false;
            }
            if (passenger.nik.length !== 16) {
                alert(`NIK penumpang ${i + 1} harus 16 digit`);
                return false;
            }
            if (!/^\d{16}$/.test(passenger.nik)) {
                alert(`NIK penumpang ${i + 1} harus berupa angka`);
                return false;
            }
        }
        return true;
    };

    // Add new group
    const handleAddGroup = async () => {
        if (!validateForm()) return;

        try {
            const data = await fetchJson('/api/passenger-groups', {
                method: 'POST',
                body: JSON.stringify({
                    group_name: formData.groupName.trim(),
                    passengers: formData.passengers.map(p => ({
                        name: p.name?.trim() || null,
                        nik: p.nik.trim()
                    }))
                })
            });

            if (data.success) {
                // Reload groups after successful creation
                await loadGroups();
                
                // Reset form
                setFormData({ groupName: '', passengers: [{ name: '', nik: '' }] });
                setShowAddForm(false);
                alert('Grup berhasil dibuat');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            if (error.status === 401) {
                alert('Anda harus login untuk membuat grup penumpang');
            } else if (error.data?.error) {
                alert(error.data.error);
            } else if (error.data?.errors) {
                const errors = Object.values(error.data.errors).flat();
                alert(errors.join('\n'));
            } else {
                alert('Gagal membuat grup');
            }
        }
    };

    // Edit group
    const handleEditGroup = (group) => {
        setEditingGroup(group);
        setFormData({
            groupName: group.group_name,
            passengers: group.passengers?.map(p => ({
                name: p.name,
                nik: p.nik
            })) || [{ name: '', nik: '' }]
        });
        setShowAddForm(true);
    };

    // Update group
    const handleUpdateGroup = async () => {
        if (!validateForm()) return;

        try {
            const data = await fetchJson(`/api/passenger-groups/${editingGroup.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    group_name: formData.groupName.trim(),
                    passengers: formData.passengers.map(p => ({
                        name: p.name?.trim() || null,
                        nik: p.nik.trim()
                    }))
                })
                
            });

            if (data.success) {
                // Reload groups after successful update
                await loadGroups();
                
                // Reset form
                setFormData({ groupName: '', passengers: [{ name: '', nik: '' }] });
                setShowAddForm(false);
                setEditingGroup(null);
                alert('Grup berhasil diupdate');
            }
        } catch (error) {
            console.error('Error updating group:', error);
            if (error.status === 401) {
                alert('Anda harus login untuk mengupdate grup penumpang');
            } else if (error.data?.error) {
                alert(error.data.error);
            } else if (error.data?.errors) {
                const errors = Object.values(error.data.errors).flat();
                alert(errors.join('\n'));
            } else {
                alert('Gagal mengupdate grup');
            }
        }
    };

    // Delete group
    const handleDeleteGroup = async (groupId) => {
        if (confirm('Apakah Anda yakin ingin menghapus grup ini?')) {
            try {
                const data = await fetchJson(`/api/passenger-groups/${groupId}`, { method: 'DELETE' });
                
                if (data.success) {
                    // Reload groups after successful deletion
                    await loadGroups();
                    alert('Grup berhasil dihapus');
                }
            } catch (error) {
                console.error('Error deleting group:', error);
                if (error.status === 401) {
                    alert('Anda harus login untuk menghapus grup penumpang');
                } else if (error.data?.error) {
                    alert(error.data.error);
                } else {
                    alert('Gagal menghapus grup');
                }
            }
        }
    };

    // Cancel form
    const handleCancelForm = () => {
        setFormData({ groupName: '', nik: '', name: '' });
        setShowAddForm(false);
        setEditingGroup(null);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="text-center">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Kelola Grup Penumpang</h3>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Add Group Button */}
                    {!showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full mb-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tambah Grup Baru
                        </button>
                    )}

                    {/* Add/Edit Form */}
                    {showAddForm && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-lg font-medium text-gray-800 mb-4">
                                {editingGroup ? 'Edit Grup' : 'Tambah Grup Baru'}
                            </h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Grup
                                    </label>
                                    <input
                                        type="text"
                                        name="groupName"
                                        value={formData.groupName}
                                        onChange={handleInputChange}
                                        placeholder="Contoh: Keluarga, Teman Kerja, dll"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Passengers List */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Daftar Penumpang
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddPassenger}
                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Tambah Penumpang
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {formData.passengers.map((passenger, index) => (
                                            <PassengerForm
                                                key={index}
                                                passenger={passenger}
                                                index={index}
                                                onChange={handlePassengerChange}
                                                onRemove={handleRemovePassenger}
                                                canRemove={formData.passengers.length > 1}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-4">
                                <button
                                    onClick={handleCancelForm}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={editingGroup ? handleUpdateGroup : handleAddGroup}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingGroup ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Groups List */}
                    <div className="text-left">
                        <h4 className="text-lg font-medium text-gray-800 mb-4">Daftar Grup</h4>
                        
                        {groups.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p>Belum ada grup penumpang</p>
                                <p className="text-sm">Klik "Tambah Grup Baru" untuk membuat grup pertama</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {groups.map((group) => (
                                    <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-900 mb-1">{group.group_name}</h5>
                                            <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-medium">Penumpang:</span> {group.passengers?.length || 0} orang
                                            </p>
                                            <div className="space-y-1 mb-2">
                                                {group.passengers?.map((passenger, index) => (
                                                    <div key={index} className="text-xs text-gray-500">
                                                        • {passenger.name} - {passenger.nik}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                Dibuat: {formatDate(group.created_at)}
                                                {group.updated_at && group.updated_at !== group.created_at && (
                                                    <span> • Diupdate: {formatDate(group.updated_at)}</span>
                                                )}
                                            </p>
                                        </div>
                                            
                                            <div className="flex space-x-2 ml-4">
                                                <button
                                                    onClick={() => handleEditGroup(group)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit grup"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGroup(group.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus grup"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <div className="mt-6">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
