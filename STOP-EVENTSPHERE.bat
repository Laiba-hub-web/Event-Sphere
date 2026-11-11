@echo off
title Stop EventSphere Servers
color 0C
echo =====================================================================
echo        STOPPING EVENTSPHERE BACKEND (5000) ^& FRONTEND (5173)
echo =====================================================================
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 " ^| findstr "LISTENING"') do (
    echo Stopping Backend Server (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    echo Stopping Frontend Server (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All EventSphere servers have been stopped cleanly.
echo.
pause

