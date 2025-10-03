# 🤖 KAI Access AI Chatbot

Chatbot cerdas untuk aplikasi KAI Access yang menggunakan AI open source dengan Ollama.

## 🚀 Quick Start

### 1. Install Ollama
```bash
# Download dari: https://ollama.ai/download
# Install dan restart terminal
```

### 2. Setup AI Model
```bash
# PowerShell (Recommended)
.\setup-ai.ps1

# Atau Command Prompt
setup-ai.bat
```

### 3. Start Services
```bash
# Terminal 1: Start Ollama
.\start-ollama.ps1

# Terminal 2: Start Laravel
php artisan serve
```

### 4. Test Chatbot
- Buka browser: http://localhost:8000
- Login ke dashboard
- Klik tombol "🤖 Bantuan"
- Mulai chatting!

## 🎯 Features

- **AI-Powered**: Menggunakan model Llama 3.2 open source
- **Smart Fallback**: Rule-based responses jika AI tidak tersedia
- **KAI Knowledge**: Pengetahuan khusus tentang layanan KAI
- **Real-time**: Respons cepat dan akurat
- **Mobile-Friendly**: Interface yang responsif

## 🧠 AI Models

### Recommended Models:
- **llama3.2:3b** (1.3GB) - Best balance
- **llama3.2:1b** (1.1GB) - Faster, lighter
- **llama3.2:1b-instruct-q4_0** (0.5GB) - Fastest

### Download Model:
```bash
ollama pull llama3.2:3b
```

## 📱 Usage

### Pertanyaan yang Bisa Ditanyakan:
- "Cara pesan tiket kereta"
- "Jadwal kereta Jakarta-Bandung"
- "Metode pembayaran apa saja?"
- "Cara batal tiket"
- "Apa itu KAI Pay?"
- "Promo apa saja yang ada?"
- "Cara dapat RailPoin?"

### API Endpoints:
```http
POST /api/user/chatbot/chat
GET /api/user/chatbot/health
```

## 🛠️ Troubleshooting

### Ollama tidak start:
```bash
# Check port
netstat -an | findstr :11434

# Kill process
taskkill /f /im ollama.exe

# Restart
ollama serve
```

### Model download gagal:
```bash
# Try smaller model
ollama pull llama3.2:1b
```

### API error:
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log
```

## 📊 Performance

### Untuk Speed:
- Gunakan `llama3.2:1b`
- Reduce `max_tokens` ke 200
- Lower `temperature` ke 0.3

### Untuk Quality:
- Gunakan `llama3.2:3b`
- Increase `max_tokens` ke 500
- Higher `temperature` ke 0.7

## 🔧 Configuration

Edit `app/Http/Controllers/Api/ChatbotController.php`:

```php
// Change model
'model' => 'llama3.2:3b',

// Change settings
'options' => [
    'temperature' => 0.7,
    'max_tokens' => 500
]
```

## 📈 Monitoring

### Health Check:
```http
GET /api/user/chatbot/health
```

### Response:
```json
{
    "status": "healthy",
    "ollama_available": true,
    "timestamp": "2025-10-02T16:58:00.000000Z"
}
```

## 🎉 Success!

Chatbot AI Anda sudah siap! 

**Next Steps:**
1. Test chatbot di aplikasi
2. Monitor performance
3. Add more knowledge
4. Upgrade model jika diperlukan

**Happy Chatting!** 🤖✨

---

## 📚 Documentation

- [Full Setup Guide](AI-SETUP.md)
- [API Documentation](AI-SETUP.md#api-endpoints)
- [Troubleshooting](AI-SETUP.md#troubleshooting)
- [Performance Tuning](AI-SETUP.md#performance-optimization)
