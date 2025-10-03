<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    private $ollamaBaseUrl = 'http://localhost:11434';
    
    // Knowledge base untuk KAI Access
    private $kaiKnowledge = [
        'pemesanan' => [
            'keywords' => ['pesan', 'beli', 'tiket', 'booking', 'reservasi', 'cara pesan'],
            'response' => 'Untuk memesan tiket kereta, Anda bisa:
1. 📍 Pilih stasiun keberangkatan dan tujuan
2. 📅 Tentukan tanggal perjalanan  
3. 👥 Pilih jumlah penumpang
4. 🔍 Klik "Cari Jadwal"
5. 🚂 Pilih kereta yang sesuai
6. 💳 Lakukan pembayaran

Apakah ada yang bisa saya bantu terkait pemesanan tiket?'
        ],
        'jadwal' => [
            'keywords' => ['jadwal', 'waktu', 'jam', 'keberangkatan', 'kedatangan', 'schedule'],
            'response' => 'Jadwal kereta dapat dilihat setelah Anda memilih rute dan tanggal. Sistem akan menampilkan:
⏰ Waktu keberangkatan dan kedatangan
⏱️ Durasi perjalanan
🚂 Kelas kereta yang tersedia
💰 Harga tiket

Ingin cek jadwal untuk rute tertentu?'
        ],
        'stasiun' => [
            'keywords' => ['stasiun', 'terminal', 'lokasi', 'kota', 'station'],
            'response' => 'KAI Access melayani berbagai stasiun di Indonesia, termasuk:
🏙️ Jakarta: Gambir, Pasar Senen
🏔️ Bandung: Bandung
🏛️ Yogyakarta: Yogyakarta Tugu
🏯 Solo: Solo Balapan
🌊 Surabaya: Surabaya Gubeng

Gunakan fitur pencarian stasiun untuk menemukan stasiun terdekat.'
        ],
        'pembayaran' => [
            'keywords' => ['bayar', 'pembayaran', 'kartu', 'transfer', 'kredit', 'payment'],
            'response' => 'Metode pembayaran yang tersedia:
💳 Kartu Kredit/Debit
🏦 Transfer Bank
📱 E-Wallet (GoPay, OVO, DANA)
💎 KAI Pay
🏧 Virtual Account

⏰ Pembayaran harus dilakukan dalam 15 menit setelah pemesanan.'
        ],
        'pembatalan' => [
            'keywords' => ['batal', 'cancel', 'refund', 'pengembalian'],
            'response' => 'Kebijakan pembatalan tiket:
📅 >24 jam: Biaya 25%
⏰ 2-24 jam: Biaya 50%
🚫 <2 jam: Tidak dapat dibatalkan

Untuk pembatalan, hubungi customer service atau melalui menu "Tiket Saya".'
        ],
        'kaipay' => [
            'keywords' => ['kaipay', 'kai pay', 'dompet', 'saldo', 'wallet'],
            'response' => 'KAI Pay adalah dompet digital KAI yang memudahkan pembayaran tiket kereta.

✨ Fitur KAI Pay:
💰 Top up saldo
📱 Scan QR untuk pembayaran
📊 Riwayat transaksi
🎁 Cashback dan promo

Aktivasi KAI Pay di menu dashboard untuk mendapatkan keuntungan lebih!'
        ],
        'promo' => [
            'keywords' => ['promo', 'diskon', 'cashback', 'voucher', 'hemat', 'discount'],
            'response' => 'Berbagai promo tersedia di KAI Access:
🎯 Diskon early bird
💎 Cashback KAI Pay
🎉 Promo weekend
🎫 Voucher khusus member

Cek menu "Promo" untuk melihat penawaran terbaru!'
        ],
        'railpoin' => [
            'keywords' => ['railpoin', 'poin', 'reward', 'loyalty', 'points'],
            'response' => 'RailPoin adalah program loyalitas KAI yang memberikan poin untuk setiap transaksi:
⭐ 1 poin = Rp 1.000
🎫 Tukar poin dengan tiket gratis
⬆️ Upgrade ke tier yang lebih tinggi
🎁 Akses ke promo eksklusif

Semakin sering naik kereta, semakin banyak poin yang didapat!'
        ]
    ];

    public function chat(Request $request)
    {
        try {
            $message = $request->input('message');
            $userId = $request->input('user_id');
            
            if (!$message) {
                return response()->json([
                    'success' => false,
                    'error' => 'Message is required'
                ], 400);
            }

            // Cek apakah Ollama tersedia
            $ollamaAvailable = $this->checkOllamaAvailability();
            
            if ($ollamaAvailable) {
                // Gunakan AI model untuk respons yang lebih cerdas
                $response = $this->getAIResponse($message);
            } else {
                // Fallback ke rule-based response
                $response = $this->getRuleBasedResponse($message);
            }

            // Log interaksi untuk analytics
            Log::info('Chatbot interaction', [
                'user_id' => $userId,
                'message' => $message,
                'response_category' => $response['category'],
                'ai_available' => $ollamaAvailable
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'response' => $response['response'],
                    'category' => $response['category'],
                    'confidence' => $response['confidence'],
                    'ai_powered' => $ollamaAvailable,
                    'timestamp' => now()->toISOString(),
                    'user_id' => $userId
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Chatbot error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Internal server error',
                'message' => 'Terjadi kesalahan saat memproses pesan Anda'
            ], 500);
        }
    }

    private function checkOllamaAvailability()
    {
        try {
            $response = Http::timeout(3)->get($this->ollamaBaseUrl . '/api/tags');
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    private function getAIResponse($message)
    {
        try {
            // Buat prompt yang spesifik untuk KAI Access
            $systemPrompt = "Anda adalah asisten virtual KAI Access yang membantu pelanggan dengan layanan kereta api. 
            
Informasi tentang KAI Access:
- Layanan pemesanan tiket kereta antar kota
- Stasiun utama: Jakarta (Gambir, Pasar Senen), Bandung, Yogyakarta, Solo, Surabaya
- Metode pembayaran: Kartu kredit/debit, transfer bank, e-wallet, KAI Pay
- Program loyalitas: RailPoin
- Kebijakan pembatalan: >24 jam (25%), 2-24 jam (50%), <2 jam (tidak bisa)

Jawab dengan ramah, informatif, dan dalam bahasa Indonesia. Gunakan emoji yang sesuai. 
Jika tidak yakin, arahkan ke customer service atau fitur yang tersedia di aplikasi.";

            $response = Http::timeout(30)->post($this->ollamaBaseUrl . '/api/generate', [
                'model' => 'llama3.2:3b', // Model yang ringan dan cepat
                'prompt' => $systemPrompt . "\n\nPertanyaan user: " . $message,
                'stream' => false,
                'options' => [
                    'temperature' => 0.7,
                    'max_tokens' => 500
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $aiResponse = $data['response'] ?? '';
                
                return [
                    'response' => $aiResponse,
                    'category' => 'ai_generated',
                    'confidence' => 0.8
                ];
            } else {
                throw new \Exception('Ollama API error');
            }

        } catch (\Exception $e) {
            Log::warning('AI response failed, falling back to rule-based: ' . $e->getMessage());
            return $this->getRuleBasedResponse($message);
        }
    }

    private function getRuleBasedResponse($message)
    {
        $messageLower = strtolower($message);
        
        // Cek untuk greeting
        if (preg_match('/\b(halo|hai|hello|hi)\b/', $messageLower)) {
            return [
                'response' => "Halo! Selamat datang di KAI Access. Saya siap membantu Anda dengan:
🚂 Pemesanan tiket kereta
📅 Informasi jadwal dan stasiun
💳 Pembayaran dan pembatalan
💎 KAI Pay dan RailPoin
🎁 Promo dan diskon

Ada yang bisa saya bantu?",
                'category' => 'greeting',
                'confidence' => 0.9
            ];
        }

        // Cek untuk bantuan
        if (preg_match('/\b(bantuan|help|tolong|menu)\b/', $messageLower)) {
            return [
                'response' => "Saya siap membantu! Berikut topik yang bisa saya bantu:

🚂 **Pemesanan Tiket**
- Cara pesan tiket
- Pilih stasiun dan tanggal
- Kelas kereta

💰 **Pembayaran**
- Metode pembayaran
- KAI Pay
- Refund

🎫 **Tiket & Jadwal**
- Cek jadwal
- Informasi stasiun
- Pembatalan

🎁 **Promo & Reward**
- Promo terbaru
- RailPoin
- Cashback

Tanyakan apa saja yang ingin Anda ketahui!",
                'category' => 'help',
                'confidence' => 0.9
            ];
        }

        // Cek knowledge base
        foreach ($this->kaiKnowledge as $category => $data) {
            foreach ($data['keywords'] as $keyword) {
                if (strpos($messageLower, $keyword) !== false) {
                    return [
                        'response' => $data['response'],
                        'category' => $category,
                        'confidence' => 0.8
                    ];
                }
            }
        }

        // Default response
        return [
            'response' => "Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang:
🚂 Pemesanan tiket kereta
📅 Jadwal dan stasiun
💳 Pembayaran
💎 KAI Pay
🎁 Promo dan RailPoin

Atau ketik 'bantuan' untuk melihat menu lengkap.",
            'category' => 'unknown',
            'confidence' => 0.3
        ];
    }

    public function health()
    {
        $ollamaAvailable = $this->checkOllamaAvailability();
        
        return response()->json([
            'status' => 'healthy',
            'ollama_available' => $ollamaAvailable,
            'timestamp' => now()->toISOString(),
            'uptime' => time() - $_SERVER['REQUEST_TIME_FLOAT']
        ]);
    }
}
