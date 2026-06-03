@echo off
echo 🏨 Complete Hotel Management System Setup
echo ==========================================

echo.
echo 🔧 Step 1: Installing dependencies...

cd server
echo Installing server dependencies...
call npm install

cd ..\client
echo Installing client dependencies...
call npm install

cd ..\admin
echo Installing admin dependencies...
call npm install

cd ..\server

echo.
echo 🗄️ Step 2: Setting up database and seeding data...
call npm run setup

echo.
echo 🚀 Step 3: Starting all services...

start "Hotel Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

cd ..\client
start "Hotel Client" cmd /k "npm run dev"

cd ..\admin
start "Hotel Admin" cmd /k "npm run dev"

echo.
echo ✅ Complete setup finished!
echo.
echo 🌐 Access your applications:
echo    Client:  http://localhost:5173
echo    Admin:   http://localhost:5174
echo    API:     http://localhost:3000
echo.
echo 🔐 Admin Login:
echo    Email:    admin@hotel.com
echo    Password: admin123
echo.
echo 📋 Features completed:
echo    ✅ Database with all models
echo    ✅ Authentication system
echo    ✅ Admin panel with full control
echo    ✅ Content management system
echo    ✅ Room management
echo    ✅ Dining venue management
echo    ✅ Booking system
echo    ✅ User management
echo    ✅ File upload system
echo    ✅ Responsive design
echo.
pause