@echo off
echo Starting Ollama service for KAI Access Chatbot...
echo.

echo Checking if Ollama is installed...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ollama is not installed!
    echo Please install Ollama from: https://ollama.ai/download
    pause
    exit /b 1
)

echo Ollama found. Starting service...
echo.
echo Ollama will run on: http://localhost:11434
echo.
echo To stop Ollama: Press Ctrl+C or close this window
echo.

ollama serve
