@echo off
REM ============================================================
REM LOADED BONES MULTIPLAYER SERVER LAUNCHER
REM This script starts a public tunnel and the Node.js server
REM ============================================================

setlocal enabledelayedexpansion

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
set TUNNEL_TOOL=
where cloudflared >nul 2>nul
if %errorlevel% equ 0 (
    set TUNNEL_TOOL=cloudflared
) else (
    where ngrok >nul 2>nul
    if %errorlevel% equ 0 (
        set TUNNEL_TOOL=ngrok
    )
)

if "%TUNNEL_TOOL%"=="" (
    echo [ERROR] No tunnel tool found.
    echo Install Cloudflare Tunnel (recommended):
    echo   winget install --id Cloudflare.cloudflared -e
    echo Or install ngrok from https://ngrok.com/download
    echo.
    pause
    exit /b 1
)

if "%TUNNEL_TOOL%"=="cloudflared" (
    echo Starting Cloudflare quick tunnel on port 3000...
    echo.

    tasklist /FI "IMAGENAME eq cloudflared.exe" 2>nul | find /I "cloudflared.exe" >nul
    if %errorlevel% equ 0 (
        echo cloudflared is already running. Reusing the existing tunnel.
        echo Check the cloudflared window for the current trycloudflare URL.
    ) else (
        start "Cloudflare Tunnel" cmd /k cloudflared tunnel --url http://localhost:3000
        timeout /t 3 /nobreak >nul
    )

    echo IMPORTANT: Copy the https://...trycloudflare.com URL from the Cloudflare window.
    echo Update loaded_bones.html multiplayer server URL if it changed.
) else (
    echo Starting ngrok tunnel on port 3000...
    echo.

    tasklist /FI "IMAGENAME eq ngrok.exe" 2>nul | find /I "ngrok.exe" >nul
    if %errorlevel% equ 0 (
        echo ngrok is already running. Reusing the existing tunnel.
        echo If needed, open http://127.0.0.1:4040 to view the active public URL.
    ) else (
        start "NGrok Tunnel" cmd /k ngrok http 3000
        timeout /t 3 /nobreak >nul
    )

    for /f "usebackq delims=" %%U in (`powershell -NoProfile -Command "try { $t=(Invoke-RestMethod -Uri 'http://127.0.0.1:4040/api/tunnels' -TimeoutSec 2).tunnels | Where-Object { $_.public_url -like 'https://*' } | Select-Object -First 1 -ExpandProperty public_url; if ($t) { $t } } catch {}"`) do set ACTIVE_NGROK_URL=%%U

    if defined ACTIVE_NGROK_URL (
        echo Active ngrok URL: %ACTIVE_NGROK_URL%
    ) else (
        echo Could not read ngrok URL from local API yet. Check the ngrok window for the Forwarding URL.
    )
)

echo.
echo Starting Node.js multiplayer server...
echo.

REM Start npm server
npm.cmd start

REM Keep window open if server crashes
pause
