import React, { useEffect, useState } from 'react';

export default function Tickets() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/orders/antar-kota', { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
                const data = await res.json();
                if (data.success) setOrders(data.data);
            } catch {}
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <div className="p-4">Memuat...</div>;

    return (
        <div className="px-4 py-6">
            <h1 className="text-xl font-semibold mb-4">Tiket Saya</h1>
            {orders.length === 0 ? (
                <div className="text-gray-600">Belum ada tiket.</div>
            ) : (
                <div className="space-y-3">
                    {orders.map(o => (
                        <a key={o.id} href={`/public/receipt/${o.id}`} className="block border rounded-lg p-3 hover:bg-gray-50">
                            <div className="font-medium">{o.nama_kereta} • {o.kelas}</div>
                            <div className="text-sm text-gray-600">{o.stasiun_asal} → {o.stasiun_tujuan}</div>
                            <div className="text-sm text-gray-600">{o.tanggal} {o.jam}</div>
                            <div className="text-sm">Kode Booking: <span className="font-mono">{o.booking_code}</span></div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}


