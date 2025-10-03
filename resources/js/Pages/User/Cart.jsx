import React, { useEffect, useState } from 'react';
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

    return (
        <div className="px-4 py-6">
            <h1 className="text-xl font-semibold mb-4">Keranjang</h1>
            {items.length === 0 ? (
                <div className="text-gray-600">Keranjang kosong.</div>
            ) : (
                <div className="space-y-3">
                    {items.map(item => (
                        <div key={item._cartId} className="border rounded-lg p-3 flex justify-between items-start">
                            <div>
                                <div className="font-medium">{item.namaKereta} • {item.kelas}</div>
                                <div className="text-sm text-gray-600">{item.asal} → {item.tujuan}</div>
                                <div className="text-sm text-gray-600">{item.tanggal} {item.jam}</div>
                                <div className="text-sm text-gray-600">Penumpang: {item.passenger?.name || '-'} ({item.passenger?.nik})</div>
                                <div className="text-sm font-semibold mt-1">Rp {Number(item.harga || 0).toLocaleString('id-ID')}</div>
                            </div>
                            <button onClick={() => handleRemove(item._cartId)} className="text-red-600 hover:underline">Hapus</button>
                        </div>
                    ))}
                    <button onClick={handleClear} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg">Kosongkan Keranjang</button>
                </div>
            )}
        </div>
    );
}

