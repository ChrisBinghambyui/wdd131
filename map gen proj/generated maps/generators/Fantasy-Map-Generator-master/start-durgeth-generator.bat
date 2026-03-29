@echo off
setlocal

set "APP_DIR=%~dp0"
pushd "%APP_DIR%" || exit /b 1

start "Durgeth Generator Server" cmd /k "echo Durgeth generator server starting... ^& echo Open this link in your browser: http://localhost:4173 ^& echo. ^& npm run preview -- --host localhost --port 4173"
timeout /t 4 /nobreak >nul
start "Durgeth Generator" "http://localhost:4173"

popd
endlocal
