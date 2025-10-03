import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function ChatbotModal({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Halo! Selamat datang di KAI Access. Saya siap membantu Anda dengan pemesanan tiket kereta, informasi jadwal, dan layanan lainnya. Ada yang bisa saya bantu?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // KAI Access Chatbot Knowledge Base
    const kaiKnowledge = {
        "pemesanan": {
            "keywords": ["pesan", "beli", "tiket", "booking", "reservasi", "cara pesan"],
            "response": "Untuk memesan tiket kereta, Anda bisa:\n\n1. 📍 Pilih stasiun keberangkatan dan tujuan\n2. 📅 Tentukan tanggal perjalanan\n3. 👥 Pilih jumlah penumpang\n4. 🔍 Klik 'Cari Jadwal'\n5. 🚂 Pilih kereta yang sesuai\n6. 💳 Lakukan pembayaran\n\nApakah ada yang bisa saya bantu terkait pemesanan tiket?"
        },
        "jadwal": {
            "keywords": ["jadwal", "waktu", "jam", "keberangkatan", "kedatangan", "schedule"],
            "response": "Jadwal kereta dapat dilihat setelah Anda memilih rute dan tanggal. Sistem akan menampilkan:\n\n⏰ Waktu keberangkatan dan kedatangan\n⏱️ Durasi perjalanan\n🚂 Kelas kereta yang tersedia\n💰 Harga tiket\n\nIngin cek jadwal untuk rute tertentu?"
        },
        "stasiun": {
            "keywords": ["stasiun", "terminal", "lokasi", "kota", "station"],
            "response": "KAI Access melayani berbagai stasiun di Indonesia, termasuk:\n\n🏙️ **Jakarta**: Gambir, Pasar Senen\n🏔️ **Bandung**: Bandung\n🏛️ **Yogyakarta**: Yogyakarta Tugu\n🏯 **Solo**: Solo Balapan\n🌊 **Surabaya**: Surabaya Gubeng\n\nGunakan fitur pencarian stasiun untuk menemukan stasiun terdekat."
        },
        "pembayaran": {
            "keywords": ["bayar", "pembayaran", "kartu", "transfer", "kredit", "payment"],
            "response": "Metode pembayaran yang tersedia:\n\n💳 Kartu Kredit/Debit\n🏦 Transfer Bank\n📱 E-Wallet (GoPay, OVO, DANA)\n💎 KAI Pay\n🏧 Virtual Account\n\n⏰ Pembayaran harus dilakukan dalam 15 menit setelah pemesanan."
        },
        "pembatalan": {
            "keywords": ["batal", "cancel", "refund", "pengembalian", "cancel"],
            "response": "Kebijakan pembatalan tiket:\n\n📅 **>24 jam**: Biaya 25%\n⏰ **2-24 jam**: Biaya 50%\n🚫 **<2 jam**: Tidak dapat dibatalkan\n\nUntuk pembatalan, hubungi customer service atau melalui menu 'Tiket Saya'."
        },
        "kaipay": {
            "keywords": ["kaipay", "kai pay", "dompet", "saldo", "wallet"],
            "response": "KAI Pay adalah dompet digital KAI yang memudahkan pembayaran tiket kereta.\n\n✨ **Fitur KAI Pay**:\n💰 Top up saldo\n📱 Scan QR untuk pembayaran\n📊 Riwayat transaksi\n🎁 Cashback dan promo\n\nAktivasi KAI Pay di menu dashboard untuk mendapatkan keuntungan lebih!"
        },
        "promo": {
            "keywords": ["promo", "diskon", "cashback", "voucher", "hemat", "discount"],
            "response": "Berbagai promo tersedia di KAI Access:\n\n🎯 Diskon early bird\n💎 Cashback KAI Pay\n🎉 Promo weekend\n🎫 Voucher khusus member\n\nCek menu 'Promo' untuk melihat penawaran terbaru!"
        },
        "railpoin": {
            "keywords": ["railpoin", "poin", "reward", "loyalty", "points"],
            "response": "RailPoin adalah program loyalitas KAI yang memberikan poin untuk setiap transaksi:\n\n⭐ 1 poin = Rp 1.000\n🎫 Tukar poin dengan tiket gratis\n⬆️ Upgrade ke tier yang lebih tinggi\n🎁 Akses ke promo eksklusif\n\nSemakin sering naik kereta, semakin banyak poin yang didapat!"
        }
    };

    const getChatbotResponse = (userMessage) => {
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
        if (message.includes('halo') || message.includes('hai') || message.includes('hello') || message.includes('hi')) {
            return {
                response: "Halo! Selamat datang di KAI Access. Saya siap membantu Anda dengan:\n\n🚂 Pemesanan tiket kereta\n📅 Informasi jadwal dan stasiun\n💳 Pembayaran dan pembatalan\n💎 KAI Pay dan RailPoin\n🎁 Promo dan diskon\n\nAda yang bisa saya bantu?",
                category: "greeting",
                confidence: 0.8
            };
        }
        
        // Check for help requests
        if (message.includes('bantuan') || message.includes('help') || message.includes('tolong') || message.includes('menu')) {
            return {
                response: "Saya siap membantu! Berikut topik yang bisa saya bantu:\n\n🚂 **Pemesanan Tiket**\n- Cara pesan tiket\n- Pilih stasiun dan tanggal\n- Kelas kereta\n\n💰 **Pembayaran**\n- Metode pembayaran\n- KAI Pay\n- Refund\n\n🎫 **Tiket & Jadwal**\n- Cek jadwal\n- Informasi stasiun\n- Pembatalan\n\n🎁 **Promo & Reward**\n- Promo terbaru\n- RailPoin\n- Cashback\n\nTanyakan apa saja yang ingin Anda ketahui!",
                category: "help",
                confidence: 0.8
            };
        }
        
        // Check for thank you
        if (message.includes('terima kasih') || message.includes('thanks') || message.includes('makasih')) {
            return {
                response: "Sama-sama! 😊\n\nJika ada pertanyaan lain tentang KAI Access, jangan ragu untuk bertanya. Saya selalu siap membantu!",
                category: "thanks",
                confidence: 0.9
            };
        }
        
        // Default response
        return {
            response: "Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang:\n\n🚂 Pemesanan tiket kereta\n📅 Jadwal dan stasiun\n💳 Pembayaran\n💎 KAI Pay\n🎁 Promo dan RailPoin\n\nAtau ketik 'bantuan' untuk melihat menu lengkap.",
            category: "unknown",
            confidence: 0.3
        };
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentMessage = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        try {
            // Kirim ke API Laravel
            const response = await axios.post('/api/user/chatbot/chat', {
                message: currentMessage,
                user_id: 'user_' + Date.now() // Simple user ID
            });

            if (response.data.success) {
                const botMessage = {
                    id: Date.now() + 1,
                    text: response.data.data.response,
                    sender: 'bot',
                    timestamp: new Date(),
                    category: response.data.data.category,
                    aiPowered: response.data.data.ai_powered
                };

                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error('API response failed');
            }
        } catch (error) {
            console.error('Chatbot API error:', error);
            
            // Fallback ke rule-based response
            const botResponse = getChatbotResponse(currentMessage);
            const botMessage = {
                id: Date.now() + 1,
                text: botResponse.response,
                sender: 'bot',
                timestamp: new Date(),
                category: botResponse.category,
                aiPowered: false
            };

            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">KAI Access Assistant</h2>
                                <p className="text-blue-100 text-sm">Online • Siap membantu</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                    message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                <div className="whitespace-pre-line text-sm">
                                    {message.text}
                                </div>
                                <div className={`text-xs mt-1 ${
                                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Tulis pesan Anda..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="1"
                                style={{ minHeight: '48px', maxHeight: '120px' }}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim()}
                            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
