@echo off
echo ========================================
echo    KAI Access AI Chatbot Setup
echo ========================================
echo.

echo [1/4] Checking if Ollama is installed...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Ollama not found. Please install Ollama first:
    echo 1. Go to https://ollama.ai/download
    echo 2. Download and install Ollama for Windows
    echo 3. Restart your terminal
    echo 4. Run this script again
    pause
    exit /b 1
) else (
    echo ✓ Ollama is installed
)

echo.
echo [2/4] Starting Ollama service...
start /B ollama serve
timeout /t 3 /nobreak >nul

echo.
echo [3/4] Downloading AI model (llama3.2:3b)...
echo This may take a few minutes depending on your internet connection...
ollama pull llama3.2:3b

if %errorlevel% neq 0 (
    echo ✗ Failed to download model. Trying alternative model...
    ollama pull llama3.2:1b
    if %errorlevel% neq 0 (
        echo ✗ Failed to download any model. Please check your internet connection.
        pause
        exit /b 1
    )
)

echo.
echo [4/4] Testing AI model...
ollama list | findstr llama3.2 >nul
if %errorlevel% equ 0 (
    echo ✓ AI model is ready!
    echo.
    echo ========================================
    echo    Setup Complete!
    echo ========================================
    echo.
    echo Your KAI Access chatbot is now powered by AI!
    echo.
    echo Available models:
    ollama list
    echo.
    echo To test the chatbot:
    echo 1. Start your Laravel application
    echo 2. Go to the dashboard
    echo 3. Click the "🤖 Bantuan" button
    echo.
    echo To stop Ollama service: ollama stop
    echo To start Ollama service: ollama serve
    echo.
) else (
    echo ✗ Model installation failed
    pause
    exit /b 1
)

echo.
echo Press any key to continue...
pause >nul
