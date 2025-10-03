# KAI Access AI Chatbot Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    KAI Access AI Chatbot Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
Write-Host "[1/4] Checking if Ollama is installed..." -ForegroundColor Yellow
try {
    $ollamaVersion = ollama --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Ollama is installed: $ollamaVersion" -ForegroundColor Green
    } else {
        throw "Ollama not found"
    }
} catch {
    Write-Host "✗ Ollama not found. Please install Ollama first:" -ForegroundColor Red
    Write-Host "1. Go to https://ollama.ai/download" -ForegroundColor White
    Write-Host "2. Download and install Ollama for Windows" -ForegroundColor White
    Write-Host "3. Restart your terminal" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/4] Starting Ollama service..." -ForegroundColor Yellow
try {
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "✓ Ollama service started" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to start Ollama service" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[3/4] Downloading AI model (llama3.2:3b)..." -ForegroundColor Yellow
Write-Host "This may take a few minutes depending on your internet connection..." -ForegroundColor White

try {
    ollama pull llama3.2:3b
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Model llama3.2:3b downloaded successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to download llama3.2:3b. Trying alternative model..." -ForegroundColor Yellow
        ollama pull llama3.2:1b
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Model llama3.2:1b downloaded successfully" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to download any model. Please check your internet connection." -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
} catch {
    Write-Host "✗ Error downloading model" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[4/4] Testing AI model..." -ForegroundColor Yellow

try {
    $models = ollama list
    if ($models -match "llama3.2") {
        Write-Host "✓ AI model is ready!" -ForegroundColor Green
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "    Setup Complete!" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Your KAI Access chatbot is now powered by AI!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Available models:" -ForegroundColor White
        ollama list
        Write-Host ""
        Write-Host "To test the chatbot:" -ForegroundColor White
        Write-Host "1. Start your Laravel application" -ForegroundColor White
        Write-Host "2. Go to the dashboard" -ForegroundColor White
        Write-Host "3. Click the '🤖 Bantuan' button" -ForegroundColor White
        Write-Host ""
        Write-Host "To stop Ollama service: ollama stop" -ForegroundColor White
        Write-Host "To start Ollama service: ollama serve" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "✗ Model installation verification failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} catch {
    Write-Host "✗ Error testing model" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Read-Host "Press Enter to continue"
