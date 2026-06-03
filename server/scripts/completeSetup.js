const { sequelize, connectDB } = require('../config/database');
const User = require('../models/User');
const Room = require('../models/Room');
const DiningOption = require('../models/DiningOption');
const Experience = require('../models/Experience');
const Offer = require('../models/Offer');
const Staff = require('../models/Staff');
const Job = require('../models/Job');
const Content = require('../models/Content');
const Award = require('../models/Award');
const Booking = require('../models/Booking');
const DiningReservation = require('../models/DiningReservation');
const OfferReservation = require('../models/OfferReservation');
const Feedback = require('../models/Feedback');
const { generateId } = require('../utils/idGenerator');

const completeSetup = async () => {
    try {
        console.log('🔄 Starting complete database setup...');
        
        // Connect to database
        await connectDB();
        
        // Disable foreign key checks temporarily
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Sync all models (force: true will drop and recreate tables)
        await sequelize.sync({ force: true });
        
        // Re-enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('✅ Database models synced successfully');
        
        // 1. Create Admin User
        const adminUser = await User.create({
            name: 'Hotel Administrator',
            email: 'admin@hotel.com',
            password: 'admin123',
            role: 'Admin',
            phone: '+1234567890',
            address: '123 Hotel Street',
            city: 'New York',
            country: 'USA'
        });
        console.log('✅ Admin user created');

        // 2. Create Sample Users
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const users = await User.bulkCreate([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                role: 'User',
                phone: '+1234567891',
                address: '456 Main St',
                city: 'Los Angeles',
                country: 'USA'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword,
                role: 'User',
                phone: '+1234567892',
                address: '789 Oak Ave',
                city: 'Chicago',
                country: 'USA'
            }
        ]);
        console.log('✅ Sample users created');

        // 3. Create Rooms
        const rooms = await Room.bulkCreate([
            {
                name: 'Deluxe Ocean View',
                description: 'Spacious room with stunning ocean views, featuring modern amenities and elegant decor.',
                shortDescription: 'Luxury room with ocean view',
                price: 299.99,
                size: 45,
                occupancy: { adults: 2, children: 1 },
                bedType: 'King Size',
                view: 'Ocean View',
                image: 'http://localhost:3000/uploads/deluxe-ocean.jpg',
                gallery: [
                    'http://localhost:3000/uploads/deluxe-ocean-1.jpg',
                    'http://localhost:3000/uploads/deluxe-ocean-2.jpg'
                ],
                amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Balcony'],
                featured: true,
                isAvailable: true
            },
            {
                name: 'Executive Suite',
                description: 'Premium suite with separate living area, perfect for business travelers.',
                shortDescription: 'Premium suite with living area',
                price: 499.99,
                size: 75,
                occupancy: { adults: 3, children: 2 },
                bedType: 'King Size + Sofa Bed',
                view: 'City View',
                image: 'http://localhost:3000/uploads/executive-suite.jpg',
                gallery: [
                    'http://localhost:3000/uploads/executive-suite-1.jpg',
                    'http://localhost:3000/uploads/executive-suite-2.jpg'
                ],
                amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Work Desk', 'Living Area'],
                featured: true,
                isAvailable: true
            },
            {
                name: 'Standard Room',
                description: 'Comfortable and affordable room with all essential amenities.',
                shortDescription: 'Comfortable standard room',
                price: 149.99,
                size: 30,
                occupancy: { adults: 2, children: 0 },
                bedType: 'Queen Size',
                view: 'Garden View',
                image: 'http://localhost:3000/uploads/standard-room.jpg',
                gallery: [
                    'http://localhost:3000/uploads/standard-room-1.jpg'
                ],
                amenities: ['WiFi', 'Air Conditioning', 'TV'],
                featured: false,
                isAvailable: true
            },
            {
                name: 'Presidential Suite',
                description: 'The ultimate luxury experience with panoramic views and premium services.',
                shortDescription: 'Ultimate luxury suite',
                price: 999.99,
                size: 120,
                occupancy: { adults: 4, children: 2 },
                bedType: 'King Size + Queen Size',
                view: 'Panoramic View',
                image: 'http://localhost:3000/uploads/presidential-suite.jpg',
                gallery: [
                    'http://localhost:3000/uploads/presidential-suite-1.jpg',
                    'http://localhost:3000/uploads/presidential-suite-2.jpg',
                    'http://localhost:3000/uploads/presidential-suite-3.jpg'
                ],
                amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Butler Service', 'Jacuzzi', 'Private Terrace'],
                featured: true,
                isAvailable: true
            }
        ]);
        console.log('✅ Rooms created');

        // 4. Create Dining Options
        const diningOptions = await DiningOption.bulkCreate([
            {
                name: 'The Grand Restaurant',
                description: 'Fine dining experience with international cuisine',
                cuisine: 'International',
                priceRange: '$$$',
                openingHours: '6:00 AM - 11:00 PM',
                image: 'http://localhost:3000/uploads/grand-restaurant.jpg',
                gallery: [
                    'http://localhost:3000/uploads/grand-restaurant-1.jpg',
                    'http://localhost:3000/uploads/grand-restaurant-2.jpg'
                ],
                menu: [
                    { name: 'Grilled Salmon', price: 28.99, description: 'Fresh Atlantic salmon with herbs' },
                    { name: 'Beef Tenderloin', price: 35.99, description: 'Premium beef with seasonal vegetables' },
                    { name: 'Vegetarian Pasta', price: 18.99, description: 'Fresh pasta with garden vegetables' }
                ],
                featured: true
            },
            {
                name: 'Poolside Bar & Grill',
                description: 'Casual dining by the pool with refreshing drinks',
                cuisine: 'American',
                priceRange: '$$',
                openingHours: '11:00 AM - 10:00 PM',
                image: 'http://localhost:3000/uploads/poolside-bar.jpg',
                gallery: [
                    'http://localhost:3000/uploads/poolside-bar-1.jpg'
                ],
                menu: [
                    { name: 'Club Sandwich', price: 14.99, description: 'Classic club with fries' },
                    { name: 'Caesar Salad', price: 12.99, description: 'Fresh romaine with parmesan' },
                    { name: 'Tropical Smoothie', price: 8.99, description: 'Fresh fruit blend' }
                ],
                featured: false
            },
            {
                name: 'Rooftop Lounge',
                description: 'Elegant cocktail lounge with city views',
                cuisine: 'Cocktails & Light Bites',
                priceRange: '$$$',
                openingHours: '5:00 PM - 2:00 AM',
                image: 'http://localhost:3000/uploads/rooftop-lounge.jpg',
                gallery: [
                    'http://localhost:3000/uploads/rooftop-lounge-1.jpg'
                ],
                menu: [
                    { name: 'Signature Martini', price: 16.99, description: 'House special martini' },
                    { name: 'Artisan Cheese Board', price: 24.99, description: 'Selection of fine cheeses' },
                    { name: 'Chocolate Fondue', price: 19.99, description: 'Rich chocolate with fresh fruits' }
                ],
                featured: true
            }
        ]);
        console.log('✅ Dining options created');

        // 5. Create Experiences
        const experiences = await Experience.bulkCreate([
            {
                name: 'Spa & Wellness Package',
                description: 'Rejuvenate your body and mind with our comprehensive spa treatments',
                price: 199.99,
                duration: '4 hours',
                image: 'http://localhost:3000/uploads/spa-wellness.jpg',
                gallery: [
                    'http://localhost:3000/uploads/spa-wellness-1.jpg',
                    'http://localhost:3000/uploads/spa-wellness-2.jpg'
                ],
                includes: ['Full body massage', 'Facial treatment', 'Sauna access', 'Healthy lunch'],
                featured: true,
                isAvailable: true
            },
            {
                name: 'City Tour Experience',
                description: 'Explore the city\'s highlights with our guided tour',
                price: 89.99,
                duration: '6 hours',
                image: 'http://localhost:3000/uploads/city-tour.jpg',
                gallery: [
                    'http://localhost:3000/uploads/city-tour-1.jpg'
                ],
                includes: ['Professional guide', 'Transportation', 'Lunch', 'Entry tickets'],
                featured: false,
                isAvailable: true
            },
            {
                name: 'Culinary Workshop',
                description: 'Learn to cook signature dishes with our executive chef',
                price: 149.99,
                duration: '3 hours',
                image: 'http://localhost:3000/uploads/culinary-workshop.jpg',
                gallery: [
                    'http://localhost:3000/uploads/culinary-workshop-1.jpg'
                ],
                includes: ['Chef instruction', 'All ingredients', 'Recipe cards', 'Wine pairing'],
                featured: true,
                isAvailable: true
            }
        ]);
        console.log('✅ Experiences created');

        // 6. Create Offers
        const offers = await Offer.bulkCreate([
            {
                title: 'Early Bird Special',
                description: 'Book 30 days in advance and save 25% on your stay',
                discount: 25,
                discountType: 'percentage',
                validFrom: new Date(),
                validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
                image: 'http://localhost:3000/uploads/early-bird-offer.jpg',
                terms: ['Must book 30 days in advance', 'Non-refundable', 'Subject to availability'],
                featured: true,
                isActive: true
            },
            {
                title: 'Weekend Getaway',
                description: 'Perfect weekend package with dining and spa credits',
                discount: 150,
                discountType: 'fixed',
                validFrom: new Date(),
                validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
                image: 'http://localhost:3000/uploads/weekend-getaway.jpg',
                terms: ['Valid for weekend stays only', 'Includes $100 dining credit', 'Includes $50 spa credit'],
                featured: true,
                isActive: true
            },
            {
                title: 'Extended Stay Discount',
                description: 'Stay 7 nights or more and get the 7th night free',
                discount: 0,
                discountType: 'special',
                validFrom: new Date(),
                validTo: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
                image: 'http://localhost:3000/uploads/extended-stay.jpg',
                terms: ['Minimum 7 nights stay', '7th night free', 'Cannot be combined with other offers'],
                featured: false,
                isActive: true
            }
        ]);
        console.log('✅ Offers created');

        // 7. Create Staff
        const staff = await Staff.bulkCreate([
            {
                name: 'Michael Johnson',
                position: 'General Manager',
                department: 'Management',
                email: 'michael.johnson@hotel.com',
                phone: '+1234567893',
                image: 'http://localhost:3000/uploads/staff-michael.jpg',
                bio: 'Michael has over 15 years of experience in luxury hospitality management.',
                isActive: true
            },
            {
                name: 'Sarah Williams',
                position: 'Head Chef',
                department: 'Culinary',
                email: 'sarah.williams@hotel.com',
                phone: '+1234567894',
                image: 'http://localhost:3000/uploads/staff-sarah.jpg',
                bio: 'Sarah brings innovative culinary expertise with international training.',
                isActive: true
            },
            {
                name: 'David Brown',
                position: 'Concierge Manager',
                department: 'Guest Services',
                email: 'david.brown@hotel.com',
                phone: '+1234567895',
                image: 'http://localhost:3000/uploads/staff-david.jpg',
                bio: 'David ensures every guest receives personalized and exceptional service.',
                isActive: true
            }
        ]);
        console.log('✅ Staff created');

        // 8. Create Jobs
        const jobs = await Job.bulkCreate([
            {
                title: 'Front Desk Associate',
                department: 'Guest Services',
                location: 'New York, NY',
                type: 'Full-time',
                description: 'We are seeking a friendly and professional Front Desk Associate to join our team.',
                requirements: [
                    'High school diploma or equivalent',
                    'Previous hotel experience preferred',
                    'Excellent communication skills',
                    'Proficiency in hotel management software'
                ],
                responsibilities: [
                    'Check guests in and out',
                    'Handle guest inquiries and requests',
                    'Process payments and reservations',
                    'Maintain accurate guest records'
                ],
                salary: '$35,000 - $40,000',
                benefits: ['Health insurance', 'Paid time off', 'Employee discounts', '401k matching'],
                isActive: true
            },
            {
                title: 'Housekeeping Supervisor',
                department: 'Housekeeping',
                location: 'New York, NY',
                type: 'Full-time',
                description: 'Join our housekeeping team as a supervisor to ensure the highest standards of cleanliness.',
                requirements: [
                    '2+ years housekeeping experience',
                    'Leadership experience preferred',
                    'Attention to detail',
                    'Physical ability to perform cleaning tasks'
                ],
                responsibilities: [
                    'Supervise housekeeping staff',
                    'Ensure room cleanliness standards',
                    'Manage cleaning schedules',
                    'Train new housekeeping staff'
                ],
                salary: '$40,000 - $45,000',
                benefits: ['Health insurance', 'Paid time off', 'Employee discounts', 'Training opportunities'],
                isActive: true
            },
            {
                title: 'Restaurant Server',
                department: 'Food & Beverage',
                location: 'New York, NY',
                type: 'Part-time',
                description: 'Provide exceptional dining service in our award-winning restaurant.',
                requirements: [
                    'Previous serving experience',
                    'Knowledge of food and wine',
                    'Excellent customer service skills',
                    'Ability to work flexible hours'
                ],
                responsibilities: [
                    'Take food and beverage orders',
                    'Serve meals and drinks',
                    'Provide menu recommendations',
                    'Ensure guest satisfaction'
                ],
                salary: '$15/hour + tips',
                benefits: ['Flexible schedule', 'Employee meals', 'Training provided'],
                isActive: true
            }
        ]);
        console.log('✅ Jobs created');

        // 9. Create Content (CMS)
        const content = await Content.bulkCreate([
            {
                page: 'homepage',
                section: 'hero',
                data: {
                    title: 'Welcome to Luxury Hotel',
                    subtitle: 'Experience unparalleled luxury and comfort in the heart of the city',
                    image: 'http://localhost:3000/uploads/hero-image.jpg'
                }
            },
            {
                page: 'about',
                section: 'main',
                data: {
                    title: 'About Our Hotel',
                    description: 'Our luxury hotel has been providing exceptional hospitality for over 50 years. Located in the heart of the city, we offer world-class amenities and personalized service.'
                }
            },
            {
                page: 'contact',
                section: 'info',
                data: {
                    phone: '+1 (555) 123-4567',
                    email: 'info@luxuryhotel.com',
                    address: '123 Luxury Avenue, New York, NY 10001'
                }
            }
        ]);
        console.log('✅ Content created');

        // 10. Create Awards
        const awards = await Award.bulkCreate([
            {
                title: 'Best Luxury Hotel 2023',
                organization: 'Travel Excellence Awards',
                year: 2023,
                description: 'Recognized for outstanding luxury accommodations and service excellence.',
                image: 'http://localhost:3000/uploads/award-luxury-2023.jpg',
                category: 'Luxury',
                isActive: true
            },
            {
                title: 'Top Restaurant Award',
                organization: 'Culinary Institute',
                year: 2023,
                description: 'Our signature restaurant received top honors for innovative cuisine.',
                image: 'http://localhost:3000/uploads/award-restaurant-2023.jpg',
                category: 'Dining',
                isActive: true
            },
            {
                title: 'Sustainable Tourism Award',
                organization: 'Green Hotels Association',
                year: 2022,
                description: 'Awarded for our commitment to environmental sustainability.',
                image: 'http://localhost:3000/uploads/award-sustainability-2022.jpg',
                category: 'Sustainability',
                isActive: true
            }
        ]);
        console.log('✅ Awards created');

        // 11. Create Sample Bookings
        const bookings = await Booking.bulkCreate([
            {
                id: generateId('BK'),
                bookingNumber: generateId('BK'),
                guestName: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567891',
                room: 'Deluxe Ocean View',
                checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                guests: 2,
                amount: 899.97,
                status: 'Confirmed',
                specialRequests: 'Late check-in requested'
            },
            {
                id: generateId('BK'),
                bookingNumber: generateId('BK'),
                guestName: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+1234567892',
                room: 'Executive Suite',
                checkIn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                checkOut: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
                guests: 3,
                amount: 1499.97,
                status: 'Confirmed',
                specialRequests: 'High floor room preferred'
            }
        ]);
        console.log('✅ Sample bookings created');

        // 12. Create Sample Dining Reservations
        const diningReservations = await DiningReservation.bulkCreate([
            {
                id: generateId('DR'),
                guestName: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567891',
                diningOptionId: diningOptions[0].id,
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                time: '19:00',
                guests: 2,
                status: 'Confirmed',
                specialRequests: 'Window table preferred'
            },
            {
                id: generateId('DR'),
                guestName: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+1234567892',
                diningOptionId: diningOptions[2].id,
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                time: '20:30',
                guests: 4,
                status: 'Confirmed',
                specialRequests: 'Celebrating anniversary'
            }
        ]);
        console.log('✅ Sample dining reservations created');

        // 13. Create Sample Offer Reservations
        const offerReservations = await OfferReservation.bulkCreate([
            {
                guestName: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567891',
                offer: offers[0].title,
                date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                amount: 674.98, // 25% discount applied
                status: 'Confirmed'
            }
        ]);
        console.log('✅ Sample offer reservations created');

        // 14. Create Sample Feedback
        const feedback = await Feedback.bulkCreate([
            {
                id: generateId('FB'),
                guest: 'Alice Johnson',
                email: 'alice@example.com',
                rating: 5,
                comment: 'Absolutely wonderful stay! The staff was incredibly helpful and the room was beautiful.',
                status: 'Approved',
                department: 'General'
            },
            {
                id: generateId('FB'),
                guest: 'Bob Wilson',
                email: 'bob@example.com',
                rating: 4,
                comment: 'Great hotel with excellent amenities. The restaurant food was outstanding.',
                status: 'Approved',
                department: 'Dining'
            },
            {
                id: generateId('FB'),
                guest: 'Carol Davis',
                email: 'carol@example.com',
                rating: 5,
                comment: 'The spa experience was rejuvenating. Will definitely come back!',
                status: 'Approved',
                department: 'Spa'
            }
        ]);
        console.log('✅ Sample feedback created');

        console.log('\n🎉 Complete database setup finished successfully!');
        console.log('\n📋 Summary:');
        console.log(`   👤 Users: ${users.length + 1} (including admin)`);
        console.log(`   🏨 Rooms: ${rooms.length}`);
        console.log(`   🍽️  Dining Options: ${diningOptions.length}`);
        console.log(`   🎯 Experiences: ${experiences.length}`);
        console.log(`   🎁 Offers: ${offers.length}`);
        console.log(`   👥 Staff: ${staff.length}`);
        console.log(`   💼 Jobs: ${jobs.length}`);
        console.log(`   📝 Content: ${content.length}`);
        console.log(`   🏆 Awards: ${awards.length}`);
        console.log(`   📅 Bookings: ${bookings.length}`);
        console.log(`   🍽️  Dining Reservations: ${diningReservations.length}`);
        console.log(`   🎁 Offer Reservations: ${offerReservations.length}`);
        console.log(`   💬 Feedback: ${feedback.length}`);
        
        console.log('\n🔐 Admin Credentials:');
        console.log('   Email: admin@hotel.com');
        console.log('   Password: admin123');
        console.log('   ⚠️  Please change the password after first login!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Complete database setup failed:', error);
        process.exit(1);
    }
};

// Run setup if this file is executed directly
if (require.main === module) {
    completeSetup();
}

module.exports = { completeSetup };