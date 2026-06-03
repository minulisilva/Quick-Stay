@echo off
echo ========================================
echo    HOTEL MANAGEMENT SYSTEM STATUS
echo ========================================
echo.

echo 🔍 Checking system status...
echo.

:: Check if services are running
echo 📊 Checking if services are running...

:: Check server (port 3000)
netstat -an | find "3000" >nul
if %errorlevel% equ 0 (
    echo ✅ Server is running on port 3000
) else (
    echo ❌ Server is not running on port 3000
)

:: Check client (port 5173)
netstat -an | find "5173" >nul
if %errorlevel% equ 0 (
    echo ✅ Client is running on port 5173
) else (
    echo ❌ Client is not running on port 5173
)

:: Check admin (port 5174)
netstat -an | find "5174" >nul
if %errorlevel% equ 0 (
    echo ✅ Admin is running on port 5174
) else (
    echo ❌ Admin is not running on port 5174
)

echo.
echo 🗄️  Verifying database...
cd server
node scripts/verifySystem.js

pause