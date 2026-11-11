@echo off
title EventSphere Enterprise Launcher
color 0B
echo =====================================================================
echo        EVENTSPHERE MANAGEMENT - 1-CLICK ENTERPRISE LAUNCHER
echo =====================================================================
echo.

:: Free up port 5000 and 5173 if any old process is still running
echo [1/4] Checking and clearing ports 5000 and 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

:: Start Backend Server
echo [2/4] Starting EventSphere Backend API ^& Socket.io (Port 5000)...
start "EventSphere Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && node server.js"

:: Start Frontend Server
echo [3/4] Starting EventSphere React + Vite Frontend (Port 5173)...
start "EventSphere Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

:: Wait 4 seconds and open browser automatically
echo [4/4] Waiting 4 seconds for servers to initialize, then opening browser...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo =====================================================================
echo   SUCCESS! EventSphere is now live at: http://localhost:5173
echo =====================================================================
echo   Demo Accounts:
echo     - Admin:     admin@eventsphere.com     / Admin123!
echo     - Exhibitor: exhibitor@techcorp.com    / Exhibitor123!
echo     - Attendee:  attendee@eventsphere.com  / Attendee123!
echo =====================================================================
echo.
pause

