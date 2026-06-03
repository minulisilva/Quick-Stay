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
