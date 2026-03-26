@echo off
REM ============================================================
REM LOADED BONES MULTIPLAYER SERVER LAUNCHER
REM This script starts ngrok and the Node.js server
REM ============================================================

setlocal enabledelayedexpansion

REM Check if ngrok exists
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] ngrok not found in PATH
    echo.
    echo Please install ngrok from https://ngrok.com/download
    echo Then add it to your system PATH or place ngrok.exe in this folder.
    echo.
    pause
    exit /b 1
)

REM Check if npm exists
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] npm not found. Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo LOADED BONES MULTIPLAYER SERVER LAUNCHER
echo ============================================================
echo.
echo Starting ngrok tunnel on port 3000...
echo.

REM Reuse existing ngrok process if one is already running
tasklist /FI "IMAGENAME eq ngrok.exe" 2>nul | find /I "ngrok.exe" >nul
if %errorlevel% equ 0 (
    echo ngrok is already running. Reusing the existing tunnel.
    echo If needed, open http://127.0.0.1:4040 to view the active public URL.
) else (
    REM Start ngrok in a new window
    start "NGrok Tunnel" cmd /k ngrok http 3000

    REM Wait for ngrok to initialize
    timeout /t 3 /nobreak >nul
)

REM Display currently active tunnel URL (if local API is available)
for /f "usebackq delims=" %%U in (`powershell -NoProfile -Command "try { $t=(Invoke-RestMethod -Uri 'http://127.0.0.1:4040/api/tunnels' -TimeoutSec 2).tunnels | Where-Object { $_.public_url -like 'https://*' } | Select-Object -First 1 -ExpandProperty public_url; if ($t) { $t } } catch {}"`) do set ACTIVE_NGROK_URL=%%U

if defined ACTIVE_NGROK_URL (
    echo Active ngrok URL: %ACTIVE_NGROK_URL%
) else (
    echo Could not read ngrok URL from local API yet. Check the ngrok window for the Forwarding URL.
)

echo.
echo Starting Node.js multiplayer server...
echo.

REM Start npm server
npm.cmd start

REM Keep window open if server crashes
pause
