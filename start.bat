@echo off
echo 🏨 Hotel Management System Startup
echo ===================================

echo.
echo 🔍 Checking prerequisites...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if MySQL is running (basic check)
echo 🔄 Checking MySQL connection...

cd server
echo.
echo 📦 Installing server dependencies...
call npm install

echo.
echo 🗄️ Setting up database...
call npm run setup

if %errorlevel% neq 0 (
    echo ❌ Database setup failed. Please check your MySQL configuration.
    echo Make sure MySQL is running and credentials in .env are correct.
    pause
    exit /b 1
)

echo.
echo 🚀 Starting services...

:: Start server in background
echo Starting backend server...
start "Hotel Server" cmd /k "npm run dev"

:: Wait a moment for server to start
timeout /t 3 /nobreak >nul

:: Start client
cd ..\client
echo Installing client dependencies...
call npm install
echo Starting client application...
start "Hotel Client" cmd /k "npm run dev"

:: Start admin
cd ..\admin
echo Installing admin dependencies...
call npm install
echo Starting admin panel...
start "Hotel Admin" cmd /k "npm run dev"

echo.
echo ✅ All services started successfully!
echo.
echo 🌐 Access your applications:
echo    Client:  http://localhost:5173
echo    Admin:   http://localhost:5174
echo    API:     http://localhost:3000
echo.
echo 🔐 Default Admin Login:
echo    Email:    admin@hotel.com
echo    Password: admin123
echo.
echo ⚠️  Remember to change the admin password after first login!
echo.
echo Press any key to exit...
pause >nul