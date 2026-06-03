@echo off
echo ========================================
echo    HOTEL MANAGEMENT SYSTEM SETUP
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if MySQL is running
echo 🔍 Checking MySQL connection...
mysql -u root -p1234 -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL connection failed. Please ensure MySQL is running and credentials are correct.
    echo    Current credentials: root/1234
    echo    You can modify credentials in server/.env file
    pause
    exit /b 1
)

echo ✅ MySQL connection successful

:: Create database if it doesn't exist
echo 📊 Creating database...
mysql -u root -p1234 -e "CREATE DATABASE IF NOT EXISTS hotel_management;" 2>nul
echo ✅ Database created/verified

echo.
echo 🔄 Installing dependencies...
echo.

:: Install server dependencies
echo 📦 Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)
echo ✅ Server dependencies installed

:: Install client dependencies
echo 📦 Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)
echo ✅ Client dependencies installed

:: Install admin dependencies
echo 📦 Installing admin dependencies...
cd ..\admin
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install admin dependencies
    pause
    exit /b 1
)
echo ✅ Admin dependencies installed

:: Setup database with complete data
echo.
echo 🗄️  Setting up database with complete data...
cd ..\server
node scripts/completeSetup.js
if %errorlevel% neq 0 (
    echo ❌ Database setup failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo    SETUP COMPLETED SUCCESSFULLY! 🎉
echo ========================================
echo.
echo 🔐 Admin Credentials:
echo    Email: admin@hotel.com
echo    Password: admin123
echo    ⚠️  Change password after first login!
echo.
echo 🌐 Access URLs:
echo    📊 Admin Panel: http://localhost:5174
echo    🏨 Client App: http://localhost:5173
echo    🔧 API Server: http://localhost:3000
echo.
echo 🚀 Starting all services...
echo.

:: Create start script for all services
cd ..
echo @echo off > start-all.bat
echo echo Starting Hotel Management System... >> start-all.bat
echo echo. >> start-all.bat
echo start "Server" cmd /k "cd server && npm run dev" >> start-all.bat
echo timeout /t 3 /nobreak ^>nul >> start-all.bat
echo start "Client" cmd /k "cd client && npm run dev" >> start-all.bat
echo timeout /t 3 /nobreak ^>nul >> start-all.bat
echo start "Admin" cmd /k "cd admin && npm run dev" >> start-all.bat
echo echo. >> start-all.bat
echo echo ✅ All services started! >> start-all.bat
echo echo 📊 Admin Panel: http://localhost:5174 >> start-all.bat
echo echo 🏨 Client App: http://localhost:5173 >> start-all.bat
echo echo 🔧 API Server: http://localhost:3000 >> start-all.bat

:: Start all services
call start-all.bat

echo.
echo ✅ Hotel Management System is now running!
echo.
pause