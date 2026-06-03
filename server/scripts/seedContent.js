const { sequelize } = require('../config/database');
const Content = require('../models/Content');

const defaultContent = {
    global: {
        header: {
            logo: '/uploads/logo.png',
            phone: '+1 (555) 123-4567',
            email: 'info@hotel.com',
            address: '123 Hotel Street, City, State 12345'
        },
        footer: {
            description: 'Experience luxury and comfort at our premium hotel. We provide exceptional service and unforgettable memories.',
            socialMedia: {
                facebook: 'https://facebook.com/hotel',
                twitter: 'https://twitter.com/hotel',
                instagram: 'https://instagram.com/hotel',
                linkedin: 'https://linkedin.com/company/hotel'
            },
            quickLinks: ['Home', 'About', 'Rooms', 'Dining', 'Contact'],
            copyright: '© 2024 Hotel Management. All rights reserved.'
        }
    },
    home: {
        hero: {
            title: 'Welcome to Luxury',
            subtitle: 'Experience the finest hospitality',
            description: 'Discover unparalleled comfort and elegance in our premium hotel rooms and suites.',
            backgroundImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            videoUrl: '',
            posterUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            welcomeText: 'Welcome to',
            luxuryText: 'Luxury',
            ctaText: 'Book Now',
            ctaLink: '/booking'
        },
        welcome: {
            title: 'Welcome to Our Hotel',
            subtitle: 'Where Luxury Meets Comfort',
            description: 'Our hotel offers world-class amenities and exceptional service to make your stay unforgettable.',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
            features: ['24/7 Room Service', 'Spa & Wellness', 'Fine Dining', 'Business Center']
        },
        rooms: {
            title: 'Our Rooms & Suites',
            subtitle: 'Comfort & Elegance',
            description: 'Choose from our selection of beautifully appointed rooms and suites.',
            featured: [
                {
                    name: 'Deluxe Room',
                    description: 'Spacious room with modern amenities',
                    price: '$199',
                    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
                    features: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar']
                },
                {
                    name: 'Executive Suite',
                    description: 'Luxury suite with separate living area',
                    price: '$399',
                    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
                    features: ['Separate Living Room', 'Ocean View', 'Premium Amenities', 'Butler Service']
                },
                {
                    name: 'Presidential Suite',
                    description: 'Ultimate luxury with panoramic views',
                    price: '$799',
                    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
                    features: ['Private Terrace', 'Jacuzzi', 'Personal Chef', 'Concierge Service']
                }
            ]
        },
        dining: {
            title: 'Dining Excellence',
            subtitle: 'Culinary Journey',
            description: 'Experience world-class cuisine at our signature restaurants.',
            restaurants: [
                {
                    name: 'The Grand Restaurant',
                    cuisine: 'International Fine Dining',
                    description: 'Award-winning restaurant featuring international cuisine',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
                    hours: '6:00 PM - 11:00 PM'
                },
                {
                    name: 'Rooftop Lounge',
                    cuisine: 'Bar & Cocktails',
                    description: 'Sophisticated cocktails with panoramic city views',
                    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187',
                    hours: '5:00 PM - 2:00 AM'
                },
                {
                    name: 'Café Bistro',
                    cuisine: 'Casual Dining',
                    description: 'All-day dining with fresh, local ingredients',
                    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
                    hours: '6:00 AM - 10:00 PM'
                }
            ]
        },
        offers: {
            title: 'Special Offers',
            subtitle: 'Exclusive Deals',
            description: 'Take advantage of our limited-time promotions and packages.',
            deals: [
                {
                    title: 'Weekend Getaway',
                    description: 'Perfect for a romantic weekend escape',
                    discount: '25% OFF',
                    originalPrice: '$299',
                    salePrice: '$224',
                    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
                    validUntil: '2024-12-31',
                    includes: ['Breakfast for Two', 'Late Checkout', 'Welcome Champagne']
                },
                {
                    title: 'Business Package',
                    description: 'Everything you need for a successful business trip',
                    discount: '20% OFF',
                    originalPrice: '$399',
                    salePrice: '$319',
                    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
                    validUntil: '2024-12-31',
                    includes: ['Meeting Room Access', 'Business Center', 'Express Laundry']
                },
                {
                    title: 'Spa Retreat',
                    description: 'Relax and rejuvenate with our spa package',
                    discount: '30% OFF',
                    originalPrice: '$599',
                    salePrice: '$419',
                    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
                    validUntil: '2024-12-31',
                    includes: ['Spa Treatment', 'Healthy Meals', 'Yoga Classes']
                }
            ]
        },
        feedback: {
            title: 'Guest Reviews',
            subtitle: 'What Our Guests Say',
            description: 'Read testimonials from our satisfied guests.',
            testimonials: [
                {
                    name: 'Sarah Johnson',
                    location: 'New York, USA',
                    rating: 5,
                    comment: 'Absolutely amazing experience! The staff was incredibly friendly and the room was spotless. Will definitely return!',
                    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786',
                    date: '2024-01-15'
                },
                {
                    name: 'Michael Chen',
                    location: 'London, UK',
                    rating: 5,
                    comment: 'The dining experience was exceptional. Every meal was a culinary masterpiece. Highly recommended!',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
                    date: '2024-01-10'
                },
                {
                    name: 'Emma Rodriguez',
                    location: 'Madrid, Spain',
                    rating: 5,
                    comment: 'Perfect location, luxurious amenities, and outstanding service. This hotel exceeded all my expectations!',
                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
                    date: '2024-01-08'
                }
            ],
            stats: {
                averageRating: '4.9',
                totalReviews: '2,847',
                recommendationRate: '98%'
            }
        },
        stats: {
            rooms: '150',
            guests: '10000+',
            years: '25',
            awards: '15'
        }
    },
    about: {
        hero: {
            title: 'About Our Hotel',
            subtitle: 'A Legacy of Excellence',
            backgroundImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'
        },
        story: {
            title: 'Our Story',
            description: 'For over 25 years, we have been providing exceptional hospitality services to guests from around the world.',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'
        },
        mission: {
            title: 'Our Mission',
            description: 'To provide unparalleled luxury and comfort while creating memorable experiences for every guest.',
            values: ['Excellence', 'Integrity', 'Innovation', 'Sustainability']
        }
    },
    dining: {
        hero: {
            title: 'Dining Experience',
            subtitle: 'Culinary Excellence',
            backgroundImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
        },
        restaurants: {
            title: 'Our Restaurants',
            description: 'Discover our collection of world-class dining venues.',
            list: [
                {
                    name: 'The Grand Restaurant',
                    cuisine: 'International',
                    description: 'Fine dining with international cuisine',
                    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
                },
                {
                    name: 'Rooftop Bar',
                    cuisine: 'Bar & Lounge',
                    description: 'Cocktails with panoramic city views',
                    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187'
                }
            ]
        }
    },
    experiences: {
        hero: {
            title: 'Hotel Experiences',
            subtitle: 'Unforgettable Moments',
            backgroundImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
        }
    },
    gallery: {
        hero: {
            title: 'Photo Gallery',
            subtitle: 'Explore Our Hotel',
            backgroundImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
        },
        images: {
            title: 'Hotel Gallery',
            categories: ['Rooms', 'Dining', 'Facilities', 'Events'],
            photos: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
            ]
        }
    },
    contact: {
        hero: {
            title: 'Contact Us',
            subtitle: 'Get in Touch',
            backgroundImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'
        },
        info: {
            title: 'Get In Touch',
            location: '48 Janadhipathi Mawatha, Colombo 1, Sri Lanka',
            phone: '+94 112 421 221',
            email: 'info@quickstay.com',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7724181762424!2d79.84589851057514!3d6.917789293052988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259be2c6291d3%3A0xe9d61ae167b8738c!2sCinnamon%20Grand%20Colombo!5e0!3m2!1sen!2slk!4v1770024919739!5m2!1sen!2slk',
            hours: 'Open 24/7'
        },
        form: {
            title: 'Send us a Message',
            fields: ['Name', 'Email', 'Subject', 'Message']
        }
    },
    offers: {
        hero: {
            title: 'Special Offers',
            subtitle: 'Exclusive Deals',
            backgroundImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
        },
        deals: {
            title: 'Current Offers',
            description: 'Take advantage of our special promotions.',
            list: [
                {
                    title: 'Weekend Getaway',
                    description: 'Save 20% on weekend stays',
                    discount: '20%',
                    validUntil: '2024-12-31'
                },
                {
                    title: 'Extended Stay',
                    description: 'Stay 7 nights, pay for 5',
                    discount: '30%',
                    validUntil: '2024-12-31'
                }
            ]
        }
    },
    careers: {
        hero: {
            title: 'Careers',
            subtitle: 'Join Our Team',
            backgroundImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=3869&auto=format&fit=crop'
        },
        intro: {
            title: 'Grow With Us',
            description: 'At The Kingsbury, we believe that our employees are our greatest asset. We are always looking for passionate, dedicated, and talented individuals to join our growing family. Explore our current opportunities and take the next step in your hospitality career.'
        }
    },
    awards: {
        hero: {
            title: 'Awards & Recognition',
            subtitle: 'Excellence Recognized',
            backgroundImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=3870&auto=format&fit=crop'
        }
    }
};

const seedContent = async () => {
    try {
        console.log('🌱 Seeding content data...');
        
        // Clear existing content
        await Content.destroy({ where: {} });
        
        // Insert default content
        for (const [page, sections] of Object.entries(defaultContent)) {
            for (const [section, data] of Object.entries(sections)) {
                await Content.create({
                    page,
                    section,
                    data
                });
            }
        }
        
        console.log('✅ Content seeded successfully!');
        console.log(`📄 Seeded ${Object.keys(defaultContent).length} pages with content`);
        
    } catch (error) {
        console.error('❌ Content seeding failed:', error);
        throw error;
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    const runSeed = async () => {
        try {
            await sequelize.authenticate();
            await seedContent();
            process.exit(0);
        } catch (error) {
            console.error('Seeding failed:', error);
            process.exit(1);
        }
    };
    runSeed();
}

module.exports = { seedContent, defaultContent };