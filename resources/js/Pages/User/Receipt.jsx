import React, { useEffect, useState } from 'react';

export default function Receipt({ id }) {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const oid = id || window.location.pathname.split('/').pop();
        const load = async () => {
            try {
                const res = await fetch(`/api/orders/antar-kota/${oid}`, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
                const data = await res.json();
                if (data.success) setOrder(data.data);
            } catch {}
        };
        load();
    }, [id]);

    if (!order) return <div className="p-4">Memuat...</div>;

    return (
        <div className="px-4 py-6">
            <h1 className="text-xl font-semibold mb-4">Kwitansi</h1>
            <div className="border rounded-xl p-4 bg-white">
                <div className="flex justify-between mb-3">
                    <div>
                        <div className="font-semibold">{order.nama_kereta} • {order.kelas}</div>
                        <div className="text-sm text-gray-600">{order.stasiun_asal} → {order.stasiun_tujuan}</div>
                        <div className="text-sm text-gray-600">{order.tanggal} {order.jam}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm">Kode Booking</div>
                        <div className="font-mono text-lg">{order.booking_code}</div>
                    </div>
                </div>
                <div className="text-sm mb-2">Penumpang: {order.passenger_name || '-'} ({order.passenger_nik})</div>
                <div className="text-lg font-semibold">Total: Rp {Number(order.harga).toLocaleString('id-ID')}</div>
            </div>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg" onClick={() => window.print()}>Cetak / Simpan PDF</button>
        </div>
    );
}


