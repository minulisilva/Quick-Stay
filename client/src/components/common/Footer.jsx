import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import useContent from '../../hooks/useContent';

const Footer = () => {
    const { content } = useContent('global');
    const settings = content?.settings || {
        hotelName: 'QUICK STAY',
        logoUrl: '/src/assets/logo.png',
        phone: '+94 112 421 221',
        email: 'info@quickstay.com',
        address: '48 Janadhipathi Mawatha, Colombo 1, Sri Lanka',
        socialLinks: {
            facebook: '#',
            instagram: '#',
            twitter: '#',
            linkedin: '#'
        },
        footerDescription: 'Experience the epitome of luxury in the heart of Colombo. Quick Stay offers timeless elegance and world-class hospitality.'
    };

    return (
        <footer className="bg-secondary text-white pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Address */}
                    <div>
                        <h3 className="text-2xl font-serif mb-6 text-primary">{settings.hotelName}</h3>
                        <p className="text-gray-400 mb-6 font-light leading-relaxed">
                            {settings.footerDescription}
                        </p>
                        <div className="flex items-start space-x-3 text-gray-400 mb-2">
                            <MapPin size={18} className="mt-1 flex-shrink-0" />
                            <span>{settings.address}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-400 mb-2">
                            <Phone size={18} />
                            <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">{settings.phone}</a>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-400">
                            <Mail size={18} />
                            <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">{settings.email}</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg uppercase tracking-widest mb-6 font-medium">Explore</h4>
                        <ul className="space-y-3 text-gray-400 font-light">
                            <li><Link to="/rooms" className="hover:text-primary transition-colors">Accommodation</Link></li>
                            <li><Link to="/dining" className="hover:text-primary transition-colors">Dining</Link></li>
                            <li><Link to="/experiences" className="hover:text-primary transition-colors">Experiences</Link></li>
                            <li><Link to="/offers" className="hover:text-primary transition-colors">Offers</Link></li>
                            <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h4 className="text-lg uppercase tracking-widest mb-6 font-medium">Company</h4>
                        <ul className="space-y-3 text-gray-400 font-light">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/feedback" className="hover:text-primary transition-colors">Feedback</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / Socials */}
                    <div>
                        <h4 className="text-lg uppercase tracking-widest mb-6 font-medium">Connect</h4>
                        <p className="text-gray-400 font-light mb-4">Stay updated with our latest offers and news.</p>
                        <div className="flex space-x-4 mb-8">
                            <a href={settings.socialLinks.facebook} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all"><Facebook size={18} /></a>
                            <a href={settings.socialLinks.instagram} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all"><Instagram size={18} /></a>
                            <a href={settings.socialLinks.twitter} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all"><Twitter size={18} /></a>
                            <a href={settings.socialLinks.linkedin} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all"><Linkedin size={18} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} {settings.hotelName} Hotel. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
