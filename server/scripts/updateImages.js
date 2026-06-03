const { sequelize, connectDB } = require('../config/database');
const { Room, DiningOption, Experience, Offer, Staff, Award, Content } = require('../models');

const updateImages = async () => {
    try {
        console.log('🔄 Updating database with actual image URLs...');
        
        await connectDB();
        
        // Update Rooms with existing images
        await Room.update({
            image: 'http://localhost:3000/uploads/1769663212963-naseem-buras-XHmq_LvACeE-unsplash.jpg',
            gallery: [
                'http://localhost:3000/uploads/1769663212963-naseem-buras-XHmq_LvACeE-unsplash.jpg',
                'http://localhost:3000/uploads/1769663533966-uscanyin-Xkf5zhvBwfY-unsplash.jpg'
            ]
        }, { where: { name: 'Deluxe Ocean View' } });

        await Room.update({
            image: 'http://localhost:3000/uploads/1769665186335-ciudad-maderas-MXbM1NrRqtI-unsplash.jpg',
            gallery: [
                'http://localhost:3000/uploads/1769665186335-ciudad-maderas-MXbM1NrRqtI-unsplash.jpg',
                'http://localhost:3000/uploads/1769665278276-rc-cf-FMh5o5m5N9E-unsplash.jpg'
            ]
        }, { where: { name: 'Executive Suite' } });

        await Room.update({
            image: 'http://localhost:3000/uploads/1769663670441-bo-peng-sZ1TcHpByu8-unsplash.jpg',
            gallery: ['http://localhost:3000/uploads/1769663670441-bo-peng-sZ1TcHpByu8-unsplash.jpg']
        }, { where: { name: 'Standard Room' } });

        await Room.update({
            image: 'http://localhost:3000/uploads/1769682489242-milin-john-aN8xxs9iSxo-unsplash.jpg',
            gallery: [
                'http://localhost:3000/uploads/1769682489242-milin-john-aN8xxs9iSxo-unsplash.jpg',
                'http://localhost:3000/uploads/1769682637660-ciudad-maderas-MXbM1NrRqtI-unsplash.jpg',
                'http://localhost:3000/uploads/1769682719173-datingscout-KFDuhyW5H5w-unsplash.jpg'
            ]
        }, { where: { name: 'Presidential Suite' } });

        // Update Dining Options
        await DiningOption.update({
            image: 'http://localhost:3000/uploads/1769682760208-bo-peng-sZ1TcHpByu8-unsplash.jpg'
        }, { where: { name: 'The Grand Restaurant' } });

        await DiningOption.update({
            image: 'http://localhost:3000/uploads/1769682770814-meklay-yotkhamsay-AAZaK31x6FM-unsplash.jpg'
        }, { where: { name: 'Poolside Bar & Grill' } });

        await DiningOption.update({
            image: 'http://localhost:3000/uploads/1769684818978-sasha-kaunas-Fk9d0cxYqC4-unsplash.jpg'
        }, { where: { name: 'Rooftop Lounge' } });

        // Update Experiences
        await Experience.update({
            image: 'http://localhost:3000/uploads/1769681378906-visualsofdana-pP4RHq87C-k-unsplash.jpg'
        }, { where: { name: 'Spa & Wellness Package' } });

        await Experience.update({
            image: 'http://localhost:3000/uploads/1769663029257-anthony-delanoix-vmrCxMRdq58-unsplash.jpg'
        }, { where: { name: 'City Tour Experience' } });

        await Experience.update({
            image: 'http://localhost:3000/uploads/1769682831263-bo-peng-sZ1TcHpByu8-unsplash.jpg'
        }, { where: { name: 'Culinary Workshop' } });

        // Update Offers
        await Offer.update({
            image: 'http://localhost:3000/uploads/1769660911923-alena-torgonskaya-3PjP-h3BEsc-unsplash.jpg'
        }, { where: { title: 'Early Bird Special' } });

        await Offer.update({
            image: 'http://localhost:3000/uploads/1769664656786-alena-torgonskaya-3PjP-h3BEsc-unsplash.jpg'
        }, { where: { title: 'Weekend Getaway' } });

        await Offer.update({
            image: 'http://localhost:3000/uploads/1769685128974-naseem-buras-XHmq_LvACeE-unsplash.jpg'
        }, { where: { title: 'Extended Stay Discount' } });

        // Update Staff
        await Staff.update({
            image: 'http://localhost:3000/uploads/1769583075361-pngtree-flat-user-pattern-round-avatar-pattern-image_1200096.jpg'
        }, { where: { name: 'Michael Johnson' } });

        await Staff.update({
            image: 'http://localhost:3000/uploads/1769583461855-pngtree-flat-user-pattern-round-avatar-pattern-image_1200096.jpg'
        }, { where: { name: 'Sarah Williams' } });

        await Staff.update({
            image: 'http://localhost:3000/uploads/1769583482895-pngtree-flat-user-pattern-round-avatar-pattern-image_1200096.jpg'
        }, { where: { name: 'David Brown' } });

        // Update Awards
        await Award.update({
            image: 'http://localhost:3000/uploads/1769583507919-Gemini_Generated_Image_ij91mqij91mqij91.png'
        }, { where: { title: 'Best Luxury Hotel 2023' } });

        await Award.update({
            image: 'http://localhost:3000/uploads/1769583681291-Gemini_Generated_Image_ij91mqij91mqij91.png'
        }, { where: { title: 'Top Restaurant Award' } });

        await Award.update({
            image: 'http://localhost:3000/uploads/1769583701482-Gemini_Generated_Image_ij91mqij91mqij91.png'
        }, { where: { title: 'Sustainable Tourism Award' } });

        // Update Content
        await Content.update({
            data: {
                title: 'Welcome to Luxury Hotel',
                subtitle: 'Experience unparalleled luxury and comfort in the heart of the city',
                image: 'http://localhost:3000/uploads/1769685264282-alev-takil-lw3Lqe2K7xc-unsplash.jpg'
            }
        }, { where: { page: 'homepage', section: 'hero' } });

        console.log('✅ All images updated successfully!');
        console.log('🖼️  Database now contains working image URLs');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Image update failed:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    updateImages();
}

module.exports = { updateImages };