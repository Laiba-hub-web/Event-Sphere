@echo off
title EventSphere Launcher
color 0B
echo =====================================================================
echo            EVENTSPHERE MANAGEMENT - 1-CLICK LAUNCHER
echo =====================================================================
echo.

:: Free up port 5000 and 5173 (both IPv4 and IPv6) if any old process is still running
echo [1/4] Checking and clearing ports 5000 and 5173...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 5000,5173 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1

:: Start Backend Server
echo [2/4] Starting EventSphere Backend Server (Port 5000)...
start "EventSphere Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && node server.js"

:: Start Frontend Server
echo [3/4] Starting EventSphere Frontend Server (Port 5173)...
start "EventSphere Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev -- --port 5173"

:: Wait 4 seconds and open browser automatically
echo [4/4] Opening EventSphere in your browser...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo =====================================================================
echo   SUCCESS! EventSphere is now live at: http://localhost:5173
echo =====================================================================
echo   Demo Accounts:
echo     - Organizer: admin@eventsphere.com     / Admin123!
echo     - Exhibitor: exhibitor@techcorp.com    / Exhibitor123!
echo     - Attendee:  attendee@eventsphere.com  / Attendee123!
echo =====================================================================
echo.
pause
