@echo off
title Smart Home Automation Simulator - Launcher
color 0b

echo ======================================================================
echo    Starting Smart Home Automation Simulator - Live Demo Servers
echo ======================================================================
echo.

echo [1/2] Launching Spring Boot Backend on Port 8080...
start "Spring Boot Backend (Port 8080)" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

timeout /t 3 /nobreak >nul

echo [2/2] Launching React Web Dashboard on Port 5173...
start "React Dashboard (Port 5173)" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ======================================================================
echo    Both servers have launched in separate windows!
echo    - Backend:  http://localhost:8080
echo    - Frontend: http://localhost:5173
echo.
echo    Next steps:
echo    1. Plug your ESP32 into USB.
echo    2. Open http://localhost:5173 in Chrome or Edge.
echo ======================================================================
echo.
pause
