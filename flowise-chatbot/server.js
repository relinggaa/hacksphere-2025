const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// KAI Access Chatbot Knowledge Base
const kaiKnowledge = {
    "pemesanan": {
        "keywords": ["pesan", "beli", "tiket", "booking", "reservasi"],
        "response": "Untuk memesan tiket kereta, Anda bisa:\n1. Pilih stasiun keberangkatan dan tujuan\n2. Tentukan tanggal perjalanan\n3. Pilih jumlah penumpang\n4. Klik 'Cari Jadwal'\n\nApakah ada yang bisa saya bantu terkait pemesanan tiket?"
    },
    "jadwal": {
        "keywords": ["jadwal", "waktu", "jam", "keberangkatan", "kedatangan"],
        "response": "Jadwal kereta dapat dilihat setelah Anda memilih rute dan tanggal. Sistem akan menampilkan:\n- Waktu keberangkatan dan kedatangan\n- Durasi perjalanan\n- Kelas kereta yang tersedia\n- Harga tiket\n\nIngin cek jadwal untuk rute tertentu?"
    },
    "stasiun": {
        "keywords": ["stasiun", "terminal", "lokasi", "kota"],
        "response": "KAI Access melayani berbagai stasiun di Indonesia, termasuk:\n- Jakarta: Gambir, Pasar Senen\n- Bandung: Bandung\n- Yogyakarta: Yogyakarta Tugu\n- Solo: Solo Balapan\n- Surabaya: Surabaya Gubeng\n\nGunakan fitur pencarian stasiun untuk menemukan stasiun terdekat."
    },
    "pembayaran": {
        "keywords": ["bayar", "pembayaran", "kartu", "transfer", "kredit"],
        "response": "Metode pembayaran yang tersedia:\n- Kartu Kredit/Debit\n- Transfer Bank\n- E-Wallet (GoPay, OVO, DANA)\n- KAI Pay\n- Virtual Account\n\nPembayaran harus dilakukan dalam 15 menit setelah pemesanan."
    },
    "pembatalan": {
        "keywords": ["batal", "cancel", "refund", "pengembalian"],
        "response": "Kebijakan pembatalan tiket:\n- Pembatalan >24 jam: Biaya 25%\n- Pembatalan 2-24 jam: Biaya 50%\n- Pembatalan <2 jam: Tidak dapat dibatalkan\n\nUntuk pembatalan, hubungi customer service atau melalui menu 'Tiket Saya'."
    },
    "kaipay": {
        "keywords": ["kaipay", "kai pay", "dompet", "saldo"],
        "response": "KAI Pay adalah dompet digital KAI yang memudahkan pembayaran tiket kereta. Fitur:\n- Top up saldo\n- Scan QR untuk pembayaran\n- Riwayat transaksi\n- Cashback dan promo\n\nAktivasi KAI Pay di menu dashboard untuk mendapatkan keuntungan lebih."
    },
    "promo": {
        "keywords": ["promo", "diskon", "cashback", "voucher", "hemat"],
        "response": "Berbagai promo tersedia di KAI Access:\n- Diskon early bird\n- Cashback KAI Pay\n- Promo weekend\n- Voucher khusus member\n\nCek menu 'Promo' untuk melihat penawaran terbaru."
    },
    "railpoin": {
        "keywords": ["railpoin", "poin", "reward", "loyalty"],
        "response": "RailPoin adalah program loyalitas KAI yang memberikan poin untuk setiap transaksi:\n- 1 poin = Rp 1.000\n- Tukar poin dengan tiket gratis\n- Upgrade ke tier yang lebih tinggi\n- Akses ke promo eksklusif\n\nSemakin sering naik kereta, semakin banyak poin yang didapat!"
    }
};

// Simple AI Response Function
function getChatbotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for exact matches first
    for (const [category, data] of Object.entries(kaiKnowledge)) {
        for (const keyword of data.keywords) {
            if (message.includes(keyword)) {
                return {
                    response: data.response,
                    category: category,
                    confidence: 0.9
                };
            }
        }
    }
    
    // Check for common greetings
    if (message.includes('halo') || message.includes('hai') || message.includes('hello')) {
        return {
            response: "Halo! Selamat datang di KAI Access. Saya siap membantu Anda dengan:\n- Pemesanan tiket kereta\n- Informasi jadwal dan stasiun\n- Pembayaran dan pembatalan\n- KAI Pay dan RailPoin\n- Promo dan diskon\n\nAda yang bisa saya bantu?",
            category: "greeting",
            confidence: 0.8
        };
    }
    
    // Check for help requests
    if (message.includes('bantuan') || message.includes('help') || message.includes('tolong')) {
        return {
            response: "Saya siap membantu! Berikut topik yang bisa saya bantu:\n\n🚂 **Pemesanan Tiket**\n- Cara pesan tiket\n- Pilih stasiun dan tanggal\n- Kelas kereta\n\n💰 **Pembayaran**\n- Metode pembayaran\n- KAI Pay\n- Refund\n\n🎫 **Tiket & Jadwal**\n- Cek jadwal\n- Informasi stasiun\n- Pembatalan\n\n🎁 **Promo & Reward**\n- Promo terbaru\n- RailPoin\n- Cashback\n\nTanyakan apa saja yang ingin Anda ketahui!",
            category: "help",
            confidence: 0.8
        };
    }
    
    // Default response
    return {
        response: "Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang:\n- Pemesanan tiket kereta\n- Jadwal dan stasiun\n- Pembayaran\n- KAI Pay\n- Promo dan RailPoin\n\nAtau ketik 'bantuan' untuk melihat menu lengkap.",
        category: "unknown",
        confidence: 0.3
    };
}

// API Routes
app.get('/', (req, res) => {
    res.json({
        message: "KAI Access Chatbot API",
        version: "1.0.0",
        endpoints: {
            chat: "POST /api/chat",
            health: "GET /api/health"
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.post('/api/chat', (req, res) => {
    try {
        const { message, userId } = req.body;
        
        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }
        
        const response = getChatbotResponse(message);
        
        res.json({
            success: true,
            data: {
                response: response.response,
                category: response.category,
                confidence: response.confidence,
                timestamp: new Date().toISOString(),
                userId: userId || null
            }
        });
        
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: "Internal server error",
            message: "Terjadi kesalahan saat memproses pesan Anda"
        });
    }
});

// Webhook untuk integrasi dengan Laravel
app.post('/api/webhook/laravel', (req, res) => {
    try {
        const { message, user_id, session_id } = req.body;
        
        const response = getChatbotResponse(message);
        
        // Log interaction untuk analytics
        console.log(`User ${user_id} asked: ${message}`);
        console.log(`Bot responded with category: ${response.category}`);
        
        res.json({
            success: true,
            data: {
                response: response.response,
                category: response.category,
                confidence: response.confidence,
                session_id: session_id,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({
            error: "Webhook processing failed"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🤖 KAI Access Chatbot running on port ${PORT}`);
    console.log(`📡 API available at: http://localhost:${PORT}`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
    console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/api/webhook/laravel`);
    console.log(`\n🚀 Ready to help with KAI Access questions!`);
});

module.exports = app;
