import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { getCartItems, removeFromCart, clearCart } from '../../utils/cart';

export default function Cart() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(getCartItems());
    }, []);

    const handleRemove = (id) => {
        removeFromCart(id);
        setItems(getCartItems());
    };

    const handleClear = () => {
        if (confirm('Kosongkan keranjang?')) {
            clearCart();
            setItems([]);
        }
    };

    const handleBack = () => {
        router.visit('/user/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="px-4 py-4">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleBack}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">Keranjang</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6">
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M7 22a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Keranjang Kosong</h3>
                        <p className="text-gray-600 mb-6">Belum ada item di keranjang Anda</p>
                        <button 
                            onClick={() => router.visit('/user/dashboard')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Mulai Berbelanja
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item._cartId} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800 mb-2">{item.namaKereta} • {item.kelas}</div>
                                        <div className="text-sm text-gray-600 mb-1">{item.asal} → {item.tujuan}</div>
                                        <div className="text-sm text-gray-600 mb-1">{item.tanggal} {item.jam}</div>
                                        <div className="text-sm text-gray-600 mb-3">Penumpang: {item.passenger?.name || '-'} ({item.passenger?.nik})</div>
                                        <div className="text-lg font-bold text-blue-600">Rp {Number(item.harga || 0).toLocaleString('id-ID')}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleRemove(item._cartId)} 
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-800">Total</span>
                                <span className="text-xl font-bold text-blue-600">
                                    Rp {items.reduce((total, item) => total + Number(item.harga || 0), 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="flex space-x-3">
                                <button 
                                    onClick={handleClear} 
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg transition-colors"
                                >
                                    Kosongkan Keranjang
                                </button>
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                                    Lanjutkan Pembayaran
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

