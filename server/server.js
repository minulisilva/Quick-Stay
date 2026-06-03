const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/database');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:5173', // Client dev server
        'http://localhost:5174', // Admin dev server
        'http://localhost:3000'  // Server
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});

const upload = multer({ storage });

const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const diningOptionRoutes = require('./routes/diningOptionRoutes');
const diningReservationRoutes = require('./routes/diningReservationRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const offerRoutes = require('./routes/offerRoutes');
const offerReservationRoutes = require('./routes/offerReservationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const messageRoutes = require('./routes/messageRoutes');
const staffRoutes = require('./routes/staffRoutes');
const jobRoutes = require('./routes/jobRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contentRoutes = require('./routes/contentRoutes');
const awardRoutes = require('./routes/awardRoutes');

// Routes
app.use('/bookings', bookingRoutes);
app.use('/rooms', roomRoutes);
app.use('/users', userRoutes);
app.use('/diningOptions', diningOptionRoutes);
app.use('/diningReservations', diningReservationRoutes);
app.use('/experiences', experienceRoutes);
app.use('/offers', offerRoutes);
app.use('/offerReservations', offerReservationRoutes);
app.use('/payments', paymentRoutes);
app.use('/feedbacks', feedbackRoutes);
app.use('/messages', messageRoutes);
app.use('/staff', staffRoutes);
app.use('/jobs', jobRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/notifications', notificationRoutes);
app.use('/content', contentRoutes);
app.use('/awards', awardRoutes);
app.use('/auth', userRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running with MySQL/Sequelize...');
});

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Database Connection & Server Start
const startServer = async () => {
    try {
        // Connect to database first
        await connectDB();
        
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database synced successfully (Development Mode)');
        } else {
            console.log('Skipping sync in production mode.');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Admin Panel: http://localhost:5174`);
            console.log(`🏨 Client App: http://localhost:5173`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
