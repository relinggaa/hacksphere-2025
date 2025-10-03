# 🤖 KAI Access AI Chatbot Setup

Panduan lengkap untuk setup chatbot AI menggunakan model open source dengan Ollama.

## 📋 Prerequisites

- Windows 10/11
- Node.js (sudah terinstall)
- Laravel (sudah terinstall)
- Internet connection untuk download model

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

1. **Download Ollama**
   ```
   Go to: https://ollama.ai/download
   Download and install Ollama for Windows
   ```

2. **Run Setup Script**
   ```bash
   # PowerShell (Recommended)
   .\setup-ai.ps1
   
   # Or Command Prompt
   setup-ai.bat
   ```

3. **Start Laravel Application**
   ```bash
   php artisan serve
   ```

4. **Test Chatbot**
   - Go to dashboard
   - Click "🤖 Bantuan" button
   - Start chatting!

### Option 2: Manual Setup

1. **Install Ollama**
   ```bash
   # Download from https://ollama.ai/download
   # Install and restart terminal
   ```

2. **Start Ollama Service**
   ```bash
   ollama serve
   ```

3. **Download AI Model**
   ```bash
   # Model ringan (1.3GB)
   ollama pull llama3.2:3b
   
   # Atau model lebih ringan (1.1GB)
   ollama pull llama3.2:1b
   
   # Atau model paling ringan (0.5GB)
   ollama pull llama3.2:1b-instruct-q4_0
   ```

4. **Verify Installation**
   ```bash
   ollama list
   ```

## 🧠 Available AI Models

### Recommended Models (by size):

1. **llama3.2:3b** (1.3GB) - Best balance
   ```bash
   ollama pull llama3.2:3b
   ```

2. **llama3.2:1b** (1.1GB) - Faster, lighter
   ```bash
   ollama pull llama3.2:1b
   ```

3. **llama3.2:1b-instruct-q4_0** (0.5GB) - Fastest
   ```bash
   ollama pull llama3.2:1b-instruct-q4_0
   ```

### Alternative Models:

- **phi3:mini** (2.3GB) - Microsoft's model
- **gemma2:2b** (1.6GB) - Google's model
- **qwen2:1.5b** (1.0GB) - Alibaba's model

## 🔧 Configuration

### Laravel Configuration

The chatbot is configured in `app/Http/Controllers/Api/ChatbotController.php`:

```php
private $ollamaBaseUrl = 'http://localhost:11434';
```

### Model Configuration

To change the AI model, edit the controller:

```php
'model' => 'llama3.2:3b', // Change this to your preferred model
```

## 🎯 Features

### AI-Powered Responses
- Natural language understanding
- Context-aware responses
- KAI Access specific knowledge
- Fallback to rule-based responses

### Smart Fallback System
1. **Primary**: AI model (Ollama)
2. **Fallback**: Rule-based responses
3. **Offline**: Local knowledge base

### Knowledge Base Topics
- 🚂 Pemesanan Tiket
- 📅 Jadwal & Stasiun
- 💳 Pembayaran
- 🎫 Pembatalan
- 💎 KAI Pay
- 🎁 Promo & Diskon
- ⭐ RailPoin
- 🆘 Bantuan Umum

## 🛠️ Troubleshooting

### Common Issues

1. **Ollama not starting**
   ```bash
   # Check if port 11434 is available
   netstat -an | findstr :11434
   
   # Kill existing process
   taskkill /f /im ollama.exe
   
   # Restart
   ollama serve
   ```

2. **Model download failed**
   ```bash
   # Check internet connection
   # Try smaller model
   ollama pull llama3.2:1b
   ```

3. **API connection failed**
   ```bash
   # Check Laravel logs
   tail -f storage/logs/laravel.log
   
   # Test Ollama directly
   curl http://localhost:11434/api/tags
   ```

4. **Slow responses**
   ```bash
   # Use smaller model
   ollama pull llama3.2:1b
   
   # Or optimize settings in controller
   'options' => [
       'temperature' => 0.3,  // Lower = more focused
       'max_tokens' => 300    // Shorter responses
   ]
   ```

### Performance Optimization

1. **For Better Speed**:
   - Use `llama3.2:1b` model
   - Reduce `max_tokens` to 200
   - Lower `temperature` to 0.3

2. **For Better Quality**:
   - Use `llama3.2:3b` model
   - Increase `max_tokens` to 500
   - Higher `temperature` to 0.7

## 📊 API Endpoints

### Chat Endpoint
```http
POST /api/user/chatbot/chat
Content-Type: application/json

{
    "message": "Cara pesan tiket kereta",
    "user_id": "user_123"
}
```

### Health Check
```http
GET /api/user/chatbot/health
```

Response:
```json
{
    "status": "healthy",
    "ollama_available": true,
    "timestamp": "2025-10-02T16:58:00.000000Z",
    "uptime": 123.45
}
```

## 🔄 Development

### Adding New Knowledge

Edit `app/Http/Controllers/Api/ChatbotController.php`:

```php
private $kaiKnowledge = [
    'new_topic' => [
        'keywords' => ['keyword1', 'keyword2'],
        'response' => 'Your response here...'
    ]
];
```

### Customizing AI Prompts

Modify the `systemPrompt` in the controller:

```php
$systemPrompt = "Your custom system prompt here...";
```

## 🚀 Production Deployment

### For Production:

1. **Use Docker**:
   ```dockerfile
   FROM ollama/ollama:latest
   RUN ollama pull llama3.2:3b
   ```

2. **Environment Variables**:
   ```env
   OLLAMA_BASE_URL=http://your-ollama-server:11434
   OLLAMA_MODEL=llama3.2:3b
   ```

3. **Load Balancing**:
   - Multiple Ollama instances
   - Redis for session management
   - Queue for async processing

## 📈 Monitoring

### Health Monitoring
- API health endpoint
- Ollama service status
- Model availability
- Response times

### Analytics
- User interactions
- Response categories
- AI vs rule-based usage
- Performance metrics

## 🎉 Success!

Your KAI Access chatbot is now powered by AI! 

**Next Steps:**
1. Test the chatbot in your application
2. Monitor performance and adjust settings
3. Add more knowledge base entries
4. Consider upgrading to larger models for better responses

**Happy Chatting!** 🤖✨
