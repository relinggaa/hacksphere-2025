# Start Ollama service for KAI Access Chatbot
Write-Host "Starting Ollama service for KAI Access Chatbot..." -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
Write-Host "Checking if Ollama is installed..." -ForegroundColor Yellow
try {
    $ollamaVersion = ollama --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Ollama found: $ollamaVersion" -ForegroundColor Green
    } else {
        throw "Ollama not found"
    }
} catch {
    Write-Host "✗ ERROR: Ollama is not installed!" -ForegroundColor Red
    Write-Host "Please install Ollama from: https://ollama.ai/download" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting Ollama service..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Ollama will run on: http://localhost:11434" -ForegroundColor White
Write-Host ""
Write-Host "To stop Ollama: Press Ctrl+C or close this window" -ForegroundColor White
Write-Host ""

# Start Ollama service
ollama serve
