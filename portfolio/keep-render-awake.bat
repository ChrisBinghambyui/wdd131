@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Usage:
REM   keep-render-awake.bat
REM   keep-render-awake.bat https://your-service.onrender.com/health

set "SCRIPT_DIR=%~dp0"
set "LOCAL_BASE_URL=http://localhost:3000"
set "ADMIN_URL=%LOCAL_BASE_URL%/admin"
set "XLSX_URL=%LOCAL_BASE_URL%/api/analytics/excel.xlsx"
set "CSV_URL=%LOCAL_BASE_URL%/api/analytics/excel.csv"

set "PING_URL=https://your-service.onrender.com/health"
set "INTERVAL_SECONDS=600"
set "REQUEST_TIMEOUT_SECONDS=20"

if not "%~1"=="" set "PING_URL=%~1"

echo ============================================================
echo Loaded Bones Local Links
echo Admin Dashboard: %ADMIN_URL%
echo XLSX Download:   %XLSX_URL%
echo CSV Download:    %CSV_URL%
echo ============================================================
echo.

echo Starting local server in a separate terminal window...
start "Loaded Bones Server" cmd /k "cd /d ""%SCRIPT_DIR%"" && npm start"
echo.

echo ============================================================
echo Render Keep-Alive Pinger
echo URL: %PING_URL%
echo Interval: %INTERVAL_SECONDS% seconds
echo Timeout: %REQUEST_TIMEOUT_SECONDS% seconds
echo Press Ctrl+C to stop.
echo ============================================================
echo.

:ping_loop
set "STAMP=%date% %time%"

where curl >nul 2>&1
if !errorlevel! EQU 0 (
    for /f "usebackq delims=" %%H in (`curl --silent --show-error --max-time %REQUEST_TIMEOUT_SECONDS% --output nul --write-out "%%{http_code}" "%PING_URL%"`) do set "HTTP_CODE=%%H"
    if !errorlevel! EQU 0 (
        echo [!STAMP!] Ping OK - HTTP !HTTP_CODE!
    ) else (
        echo [!STAMP!] Ping FAILED - curl returned error !errorlevel!
    )
) else (
    powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri '%PING_URL%' -UseBasicParsing -TimeoutSec %REQUEST_TIMEOUT_SECONDS%; Write-Output ('HTTP ' + [int]$r.StatusCode); exit 0 } catch { Write-Output ('ERROR ' + $_.Exception.Message); exit 1 }"
    if !errorlevel! EQU 0 (
        echo [!STAMP!] Ping OK
    ) else (
        echo [!STAMP!] Ping FAILED - PowerShell request error
    )
)

echo Waiting %INTERVAL_SECONDS% seconds...
timeout /t %INTERVAL_SECONDS% /nobreak >nul
goto ping_loop
