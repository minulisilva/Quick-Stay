# 🏨 Complete Hotel Management System

A full-stack hotel management system with comprehensive client and admin interfaces, complete with a fully populated database.

## 🏗️ System Architecture

- **Backend**: Node.js + Express + MySQL + Sequelize ORM
- **Client**: React + Vite + Tailwind CSS + Framer Motion
- **Admin**: React + Vite + Tailwind CSS + FullCalendar
- **Database**: MySQL with 14+ comprehensive tables

## 🚀 One-Click Setup & Launch

### Quick Start (Recommended)
```bash
# Run the complete setup and launch script
complete-setup-and-run.bat
```

This script will:
- ✅ Check system requirements
- ✅ Install all dependencies
- ✅ Create and populate the database
- ✅ Start all three services automatically

### Manual Setup

#### Prerequisites
- Node.js (v16+)
- MySQL Server (running)
- Git

#### 1. Database Setup
```bash
# Ensure MySQL is running with these credentials:
# Username: root
# Password: 1234
# Or update credentials in server/.env

mysql -u root -p
CREATE DATABASE hotel_management;
exit
```

#### 2. Install Dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install

# Admin
cd ../admin
npm install
```

#### 3. Complete Database Setup
```bash
cd server
npm run complete-setup
```

#### 4. Start Services
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev

# Terminal 3 - Admin
cd admin
npm run dev
```

## 🔐 Default Credentials

**Admin Panel Access:**
- **Email**: admin@hotel.com
- **Password**: admin123
- ⚠️ **Change password after first login!**

**Sample User Accounts:**
- john@example.com / password123
- jane@example.com / password123

## 🌐 Access URLs

- **Client App**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **API Server**: http://localhost:3000

## 📊 Complete Database Schema

### Core Tables (14 Tables)

1. **Users** - Customer and admin accounts
2. **Rooms** - Hotel room inventory
3. **Bookings** - Room reservations
4. **DiningOptions** - Restaurant and dining venues
5. **DiningReservations** - Table bookings
6. **Experiences** - Hotel experiences and packages
7. **Offers** - Promotional offers and deals
8. **OfferReservations** - Offer bookings
9. **Staff** - Hotel staff directory
10. **Jobs** - Career opportunities
11. **Content** - CMS content management
12. **Awards** - Hotel awards and recognition
13. **Feedback** - Guest reviews and ratings
14. **Payments** - Payment processing
15. **Invoices** - Billing and invoicing
16. **Messages** - Guest communications
17. **Notifications** - System notifications
18. **JobApplications** - Career applications

### Sample Data Included

#### 🏨 **4 Room Types**
- Deluxe Ocean View ($299.99)
- Executive Suite ($499.99)
- Standard Room ($149.99)
- Presidential Suite ($999.99)

#### 🍽️ **3 Dining Venues**
- The Grand Restaurant (Fine Dining)
- Poolside Bar & Grill (Casual)
- Rooftop Lounge (Cocktails)

#### 🎯 **3 Experiences**
- Spa & Wellness Package ($199.99)
- City Tour Experience ($89.99)
- Culinary Workshop ($149.99)

#### 🎁 **3 Special Offers**
- Early Bird Special (25% off)
- Weekend Getaway Package
- Extended Stay Discount

#### 👥 **3 Staff Members**
- General Manager
- Head Chef
- Concierge Manager

#### 💼 **3 Job Openings**
- Front Desk Associate
- Housekeeping Supervisor
- Restaurant Server

#### 🏆 **3 Awards**
- Best Luxury Hotel 2023
- Top Restaurant Award
- Sustainable Tourism Award

## 📱 Client-Side Features

### 🏠 **Homepage**
- Hero section with booking widget
- Featured rooms showcase
- Dining preview
- Special offers
- Guest testimonials
- Hotel statistics

### 🏨 **Rooms & Booking**
- Room catalog with filtering
- Detailed room pages
- Real-time availability
- Booking system with payment
- Guest preferences

### 🍽️ **Dining**
- Restaurant listings
- Menu browsing
- Table reservations
- Special dietary options

### 🎯 **Experiences**
- Experience packages
- Detailed descriptions
- Booking system
- Availability calendar

### 🎁 **Offers**
- Current promotions
- Discount calculations
- Terms and conditions
- Booking integration

### 👤 **User Account**
- Profile management
- Booking history
- Preferences
- Loyalty program

### 📞 **Additional Pages**
- About Us
- Contact
- Gallery
- Careers
- Awards
- Privacy Policy
- Terms of Service

## 🔧 Admin Panel Features

### 📊 **Dashboard**
- Revenue analytics
- Booking statistics
- Occupancy rates
- Recent activities
- Quick actions

### 👥 **User Management**
- View all users
- Edit user profiles
- Role management
- Activity tracking

### 🏨 **Room Management**
- Add/edit/delete rooms
- Image gallery management
- Pricing controls
- Availability settings

### 📅 **Booking Management**
- View all bookings
- Booking calendar
- Status updates
- Guest communications
- Invoice generation

### 🍽️ **Dining Management**
- Restaurant management
- Menu editing
- Reservation tracking
- Table management

### 🎯 **Experience Management**
- Package creation
- Pricing management
- Availability control
- Booking tracking

### 🎁 **Offer Management**
- Create promotions
- Discount settings
- Validity periods
- Usage tracking

### 👥 **Staff Management**
- Staff directory
- Role assignments
- Contact information
- Performance tracking

### 💼 **Job Management**
- Job postings
- Application tracking
- Candidate management
- Hiring workflow

### 📝 **Content Management**
- Website content editing
- Image management
- SEO settings
- Page customization

### 🏆 **Awards Management**
- Award listings
- Achievement tracking
- Display settings

### 💬 **Feedback Management**
- Review moderation
- Rating analysis
- Response management
- Public display control

### 💰 **Payment & Invoicing**
- Payment tracking
- Invoice generation
- Financial reports
- Revenue analysis

### 📊 **Reports & Analytics**
- Booking reports
- Revenue reports
- Guest analytics
- Performance metrics

## 🔒 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Role-based access control
- Input validation
- CORS protection
- File upload security
- SQL injection prevention

## 🛠️ Technical Features

### Backend
- RESTful API design
- Sequelize ORM
- File upload handling
- Error handling middleware
- Database relationships
- Data validation
- Automated ID generation

### Frontend
- Responsive design
- Modern React hooks
- Context API for state management
- Framer Motion animations
- Tailwind CSS styling
- React Router navigation
- Form validation

### Admin Panel
- Full CRUD operations
- Data visualization (Recharts)
- Calendar integration (FullCalendar)
- PDF generation (jsPDF)
- Image upload handling
- Real-time updates

## 📁 Project Structure

```
Hotel_management/
├── server/                 # Backend API
│   ├── config/            # Database configuration
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── scripts/           # Database setup scripts
│   ├── uploads/           # File uploads
│   └── server.js          # Main server file
├── client/                # Customer-facing app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── hooks/         # Custom hooks
├── admin/                 # Admin panel
│   ├── src/
│   │   ├── components/    # Admin components
│   │   ├── pages/         # Admin pages
│   │   └── context/       # Admin context
└── complete-setup-and-run.bat  # One-click setup
```

## 🔧 Environment Configuration

The system uses the following environment variables (server/.env):

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
NODE_ENV=development
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=1234
DB_NAME=hotel_management
DB_PORT=3306
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

## 🚦 Development Workflow

1. **Start MySQL Server**
2. **Run Complete Setup**: `complete-setup-and-run.bat`
3. **Access Applications**:
   - Client: http://localhost:5173
   - Admin: http://localhost:5174
   - API: http://localhost:3000

## 📝 API Documentation

### Authentication Endpoints
- `POST /users/login` - User/Admin login
- `POST /users/register` - User registration
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile

### Booking Endpoints
- `GET /bookings` - Get all bookings
- `POST /bookings` - Create booking
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

### Room Endpoints
- `GET /rooms` - Get all rooms
- `POST /rooms` - Create room (Admin)
- `GET /rooms/:id` - Get room details
- `PUT /rooms/:id` - Update room (Admin)
- `DELETE /rooms/:id` - Delete room (Admin)

*[Additional endpoints for all other resources...]*

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure MySQL is running
   - Check credentials in `.env`
   - Verify database exists

2. **Port Already in Use**
   - Server: 3000
   - Client: 5173
   - Admin: 5174
   - Kill processes or change ports

3. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **CORS Errors**
   - Ensure all three services are running
   - Check CORS configuration in server.js

## 🎯 Features Completed

✅ **Database**: Complete schema with sample data  
✅ **Authentication**: JWT-based auth system  
✅ **Client App**: Full customer interface  
✅ **Admin Panel**: Complete management system  
✅ **Booking System**: End-to-end reservations  
✅ **Payment Integration**: Payment processing  
✅ **Content Management**: Dynamic content  
✅ **File Uploads**: Image management  
✅ **Responsive Design**: Mobile-friendly  
✅ **Security**: Role-based access control  

## 🚀 Ready to Use

The system is completely functional and ready for:
- **Development**: Full development environment
- **Testing**: Comprehensive test data
- **Demonstration**: Complete feature showcase
- **Production**: With proper environment setup

---

**🎉 Your complete hotel management system is ready to use!**

For support or questions, refer to the troubleshooting section or check the individual component documentation.