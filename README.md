# Hotel Management System

A full-stack hotel management system with separate client and admin interfaces.

## 🏗️ Architecture

- **Backend**: Node.js + Express + MySQL + Sequelize
- **Client**: React + Vite + Tailwind CSS
- **Admin**: React + Vite + Tailwind CSS

## 🚀 Quick Setup

### Prerequisites
- Node.js (v16+)
- MySQL Server
- Git

### 1. Database Setup
```bash
# Start MySQL service
# Create database
mysql -u root -p
CREATE DATABASE hotel_management;
exit
```

### 2. Backend Setup
```bash
cd server
npm install
npm run setup  # Creates database tables and admin user
npm run dev    # Start development server
```

### 3. Client Setup
```bash
cd client
npm install
npm run dev    # Runs on http://localhost:5173
```

### 4. Admin Setup
```bash
cd admin
npm install
npm run dev    # Runs on http://localhost:5174
```

## 🔐 Default Admin Credentials
- **Email**: admin@hotel.com
- **Password**: admin123
- ⚠️ **Change password after first login!**

## 🛠️ Environment Variables

Update `server/.env`:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
NODE_ENV=development
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=hotel_management
DB_PORT=3306
```

## 📱 Features

### Client Side
- User registration/login
- Room browsing and booking
- Dining reservations
- Offer bookings
- Profile management

### Admin Side
- Full control over client data
- User management
- Room management
- Booking management
- Content management
- Reports and analytics

## 🔧 Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Check credentials in `.env`
3. Run `npm run setup` to initialize database

### Port Conflicts
- Server: 3000
- Client: 5173
- Admin: 5174

### CORS Issues
- Ensure all three services are running
- Check CORS configuration in server.js

## 🚦 Development Workflow

1. Start MySQL
2. Run `cd server && npm run dev`
3. Run `cd client && npm run dev`
4. Run `cd admin && npm run dev`
5. Access:
   - Client: http://localhost:5173
   - Admin: http://localhost:5174
   - API: http://localhost:3000

## 📝 API Endpoints

### Authentication
- POST `/users/login` - User/Admin login
- POST `/users/register` - User registration
- GET `/users/profile` - Get profile
- PUT `/users/profile` - Update profile

### Admin Protected Routes
- All room management (POST, PUT, DELETE)
- User management
- System settings

## 🔒 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting on login
- Admin role verification
- Input validation
- CORS protection

## 📊 Database Models

- Users (Admin/User roles)
- Rooms
- Bookings
- Dining Options/Reservations
- Offers/Reservations
- Payments
- Feedback
- Staff
- Jobs
- Content

## 🎯 Admin Control Features

The admin panel provides complete control over the client side:

- **User Management**: View, edit, delete users
- **Content Control**: Manage all displayed content
- **Booking Management**: View, modify, cancel bookings
- **System Settings**: Configure application settings
- **Reports**: Generate business reports
- **Staff Management**: Manage hotel staff
- **Job Postings**: Manage career opportunities
