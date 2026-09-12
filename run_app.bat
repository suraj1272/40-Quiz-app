@echo off
echo ========================================================
echo   Starting Online Assessment Portal (Django + React)
echo ========================================================

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    pause
    exit /b 1
)

:: Start Backend in a new window
echo [1/2] Launching Django Backend Server (http://127.0.0.1:8000)...
start "Quiz Backend (Django)" cmd /k "cd backend && ..\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

:: Start Frontend
echo [2/2] Launching React Vite Frontend (http://localhost:5173)...
cd frontend
start "" http://localhost:5173/
call npm.cmd run dev

pause
