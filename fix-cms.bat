@echo off
echo 🔧 Fixing Website CMS...
echo ========================

cd server

echo 📦 Seeding content data...
call npm run seed-content

if %errorlevel% neq 0 (
    echo ❌ Content seeding failed. Please check your database connection.
    pause
    exit /b 1
)

echo ✅ Website CMS fixed successfully!
echo.
echo 🌐 Your admin panel should now show content in the Website CMS section.
echo    Access: http://localhost:5174/admin/content
echo.
echo Press any key to exit...
pause >nul