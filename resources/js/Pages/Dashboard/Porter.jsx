import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PorterDashboard({ user, orders = [], porter }) {
    const { flash } = usePage().props;
    const [isOnline, setIsOnline] = useState(porter?.status === 'ONLINE');
    const [processing, setProcessing] = useState(false);
    const [orderProcessing, setOrderProcessing] = useState({});

    console.log('PorterDashboard props:', { user, orders, porter });
    console.log('Orders count:', orders.length);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [flash]);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            router.post('/logout');
        }
    };

    const toggleStatus = () => {
        setProcessing(true);
        const newStatus = isOnline ? 'OFFLINE' : 'ONLINE';
        
        router.post('/porter/update-status', {
            status: newStatus
        }, {
            onSuccess: () => {
                setIsOnline(!isOnline);
                toast.success(`Status berhasil diubah menjadi ${newStatus}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            },
            onError: (errors) => {
                console.error('Error updating status:', errors);
                toast.error('Gagal mengubah status', {
                    position: "top-right",
                    autoClose: 5000,
                });
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleOrderAction = (orderId, action) => {
        console.log('Order action triggered:', { orderId, action });
        setOrderProcessing(prev => ({ ...prev, [orderId]: true }));
        
        router.post('/porter/order-action', {
            order_id: orderId,
            action: action
        }, {
            onSuccess: (page) => {
                console.log('Order action successful:', page);
                // Flash message will be handled by useEffect
            },
            onError: (errors) => {
                console.error('Error processing order:', errors);
                toast.error('Gagal memproses order', {
                    position: "top-right",
                    autoClose: 5000,
                });
            },
            onFinish: () => {
                setOrderProcessing(prev => ({ ...prev, [orderId]: false }));
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-purple-100 text-purple-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Menunggu';
            case 'accepted': return 'Diterima';
            case 'in_progress': return 'Dalam Proses';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Gojek-style Header */}
            <div className="bg-green-500 px-4 pt-12 pb-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                            <span className="text-2xl">🚂</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">KAI Access</h1>
                            <p className="text-green-100 text-sm">Portal Porter</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <p className="text-sm text-white font-medium">{user.name}</p>
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                <p className="text-xs text-green-100">
                                    {isOnline ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-6">
                {/* Status Toggle Card */}
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Status Porter</h2>
                            <p className="text-gray-600 text-sm">Kelola ketersediaan layanan Anda</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="font-semibold text-gray-900 text-sm">
                                        {isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={toggleStatus}
                                disabled={processing}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                                    isOnline 
                                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                } disabled:opacity-50`}
                            >
                                {processing ? (
                                    <div className="flex items-center space-x-1">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                        <span>...</span>
                                    </div>
                                ) : (
                                    isOnline ? 'Offline' : 'Online'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Mobile Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Pesanan</p>
                                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-xl">📋</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Selesai</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {orders.filter(order => order.status === 'completed').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Menunggu</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {orders.filter(order => order.status === 'pending').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="text-xl">⏳</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pendapatan</p>
                                <p className="text-lg font-bold text-purple-600">
                                    Rp {orders
                                        .filter(order => order.status === 'completed')
                                        .reduce((total, order) => total + (parseFloat(order.price) || 0), 0)
                                        .toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-xl">💰</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Daftar Pesanan</h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{orders.length} pesanan</span>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors"
                            >
                                Refresh
                                        </button>
                                    </div>
                                </div>
                    
                    {orders.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Pesanan</h4>
                            <p className="text-gray-500 text-sm">Pesanan akan muncul di sini ketika ada yang memesan layanan Anda.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50">
                                    <div className="space-y-3">
                                        {/* Order Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">
                                                    {order.service_type === 'baggage' ? '🎒' : 
                                                     order.service_type === 'luggage' ? '🧳' : '👥'}
                                                </span>
                                                <h4 className="font-semibold text-gray-800 text-sm">
                                                    {order.service_type === 'baggage' ? 'Bantuan Bagasi' : 
                                                     order.service_type === 'luggage' ? 'Bantuan Koper' : 'Bantuan Umum'}
                                                </h4>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                        
                                        {/* Order Details */}
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-400">📍</span>
                                                <span className="text-gray-600">{order.pickup_location}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-400">🎯</span>
                                                <span className="text-gray-600">{order.destination}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-400">👤</span>
                                                <span className="text-gray-600">{order.user?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-400">💰</span>
                                                <span className="text-gray-600 font-medium">Rp {parseFloat(order.price || 0).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                        
                                        {order.notes && (
                                            <div className="bg-blue-50 rounded-lg p-3">
                                                <p className="text-xs text-blue-800">
                                                    <span className="font-medium">Catatan:</span> {order.notes}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {order.scheduled_time && (
                                            <div className="bg-yellow-50 rounded-lg p-3">
                                                <p className="text-xs text-yellow-800">
                                                    <span className="font-medium">⏰ Waktu:</span> {new Date(order.scheduled_time).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Action Buttons */}
                                        <div className="pt-3 border-t border-gray-200">
                                            {order.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleOrderAction(order.id, 'accept')}
                                                        disabled={orderProcessing[order.id]}
                                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
                                                    >
                                                        {orderProcessing[order.id] ? (
                                                            <div className="flex items-center justify-center space-x-1">
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                                <span>...</span>
                                                            </div>
                                                        ) : (
                                                            '✅ Terima'
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleOrderAction(order.id, 'reject')}
                                                        disabled={orderProcessing[order.id]}
                                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
                                                    >
                                                        {orderProcessing[order.id] ? (
                                                            <div className="flex items-center justify-center space-x-1">
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                                <span>...</span>
                                                            </div>
                                                        ) : (
                                                            '❌ Tolak'
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {order.status === 'accepted' && (
                                                <button
                                                    onClick={() => handleOrderAction(order.id, 'complete')}
                                                    disabled={orderProcessing[order.id]}
                                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
                                                >
                                                    {orderProcessing[order.id] ? (
                                                        <div className="flex items-center justify-center space-x-1">
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                            <span>...</span>
                                                        </div>
                                                    ) : (
                                                        '🚀 Mulai Kerja'
                                                    )}
                                                </button>
                                            )}
                                            
                                            {order.status === 'in_progress' && (
                                                <button
                                                    onClick={() => handleOrderAction(order.id, 'complete')}
                                                    disabled={orderProcessing[order.id]}
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
                                                >
                                                    {orderProcessing[order.id] ? (
                                                        <div className="flex items-center justify-center space-x-1">
                                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                            <span>...</span>
                                                        </div>
                                                    ) : (
                                                        '✅ Selesai'
                                                    )}
                                                </button>
                                            )}
                                            
                                            {order.status === 'completed' && (
                                                <div className="flex items-center justify-center space-x-2 py-2">
                                                    <span className="text-green-600 text-sm font-medium">
                                                        ✅ Selesai
                                                    </span>
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                </div>
                                            )}
                                            
                                            {order.status === 'cancelled' && (
                                                <div className="flex items-center justify-center space-x-2 py-2">
                                                    <span className="text-red-600 text-sm font-medium">
                                                        ❌ Dibatalkan
                                                    </span>
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions - Mobile */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center">
                            <span className="text-lg mr-2">✅</span>
                            <span className="text-sm font-medium">Tersedia</span>
                        </button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center">
                            <span className="text-lg mr-2">⏸️</span>
                            <span className="text-sm font-medium">Istirahat</span>
                        </button>
                    </div>
                </div>

                {/* Recent Completed Orders - Mobile */}
                {orders.filter(order => order.status === 'completed').length > 0 && (
                    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Pesanan Selesai</h3>
                        <div className="space-y-3">
                            {orders.filter(order => order.status === 'completed').slice(0, 2).map((order) => (
                                <div key={order.id} className="bg-green-50 rounded-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {order.service_type === 'baggage' ? '🎒' : 
                                                 order.service_type === 'luggage' ? '🧳' : '👥'} 
                                                {order.user?.name || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-600">{order.pickup_location} → {order.destination}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-green-600 text-sm">+ Rp {parseFloat(order.price || 0).toLocaleString('id-ID')}</p>
                                            <p className="text-xs text-gray-600">⭐ 5.0</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}
