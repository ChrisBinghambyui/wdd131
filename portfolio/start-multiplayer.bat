@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-multiplayer.ps1"
set EXITCODE=%ERRORLEVEL%
if not "%EXITCODE%"=="0" (
  echo.
  echo Launcher exited with code %EXITCODE%.
  pause
)
exit /b %EXITCODE%
