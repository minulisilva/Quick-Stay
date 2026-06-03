const { sequelize, connectDB } = require('../config/database');
const Content = require('../models/Content');

const updateCMSImages = async () => {
    try {
        console.log('🔄 Updating CMS content with actual images...');
        
        await connectDB();
        
        // Update hero section with actual image
        await Content.update({
            data: {
                title: 'Welcome to Luxury Hotel',
                subtitle: 'Experience the finest hospitality',
                description: 'Discover unparalleled comfort and elegance in our premium hotel rooms and suites.',
                backgroundImage: 'http://localhost:3000/uploads/1769685264282-alev-takil-lw3Lqe2K7xc-unsplash.jpg',
                videoUrl: '',
                posterUrl: 'http://localhost:3000/uploads/1769685264282-alev-takil-lw3Lqe2K7xc-unsplash.jpg',
                welcomeText: 'Welcome to',
                luxuryText: 'Luxury Hotel',
                ctaText: 'Book Now',
                ctaLink: '/book'
            }
        }, { where: { page: 'home', section: 'hero' } });

        // Update welcome section
        await Content.update({
            data: {
                title: 'Welcome to Our Hotel',
                subtitle: 'Where Luxury Meets Comfort',
                description: 'Our hotel offers world-class amenities and exceptional service to make your stay unforgettable.',
                image: 'http://localhost:3000/uploads/1769663212963-naseem-buras-XHmq_LvACeE-unsplash.jpg',
                features: ['24/7 Room Service', 'Spa & Wellness', 'Fine Dining', 'Business Center']
            }
        }, { where: { page: 'home', section: 'welcome' } });

        // Update about hero
        await Content.update({
            data: {
                title: 'About Our Hotel',
                subtitle: 'A Legacy of Excellence',
                backgroundImage: 'http://localhost:3000/uploads/1769682489242-milin-john-aN8xxs9iSxo-unsplash.jpg'
            }
        }, { where: { page: 'about', section: 'hero' } });

        // Update dining hero
        await Content.update({
            data: {
                title: 'Dining Experience',
                subtitle: 'Culinary Excellence',
                backgroundImage: 'http://localhost:3000/uploads/1769682760208-bo-peng-sZ1TcHpByu8-unsplash.jpg'
            }
        }, { where: { page: 'dining', section: 'hero' } });

        // Update global header
        await Content.update({
            data: {
                logo: 'http://localhost:3000/uploads/1769583507919-Gemini_Generated_Image_ij91mqij91mqij91.png',
                phone: '+1 (555) 123-4567',
                email: 'info@luxuryhotel.com',
                address: '123 Luxury Avenue, New York, NY 10001'
            }
        }, { where: { page: 'global', section: 'header' } });

        console.log('✅ CMS images updated successfully!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ CMS image update failed:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    updateCMSImages();
}

module.exports = { updateCMSImages };