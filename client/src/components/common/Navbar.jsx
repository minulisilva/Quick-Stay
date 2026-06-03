import { useState, useEffect, useContext } from 'react';
import { Menu, X, Phone, User, ShoppingBag, MapPin, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { twMerge } from 'tailwind-merge';
import { useCart } from '../../context/CartContext';
import AuthContext from '../../context/AuthContext';
import useContent from '../../hooks/useContent';

const headerNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Accommodation', href: '/rooms' },
    { name: 'Dining', href: '/dining' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Offers', href: '/offers' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
    const { content } = useContent('global');
    const settings = content?.settings || {
        hotelName: 'Quick Stay',
        logoUrl: '/src/assets/logo.png',
        phone: '+94 112 421 221'
    };

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { cart } = useCart();
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <>
            {/* Top Navbar */}
            <nav
                className={twMerge(
                    "fixed w-full z-50 transition-all duration-500",
                    isScrolled || isMenuOpen ? "bg-white text-secondary py-3 shadow-sm border-b border-gray-100" : "bg-gradient-to-b from-black/60 to-transparent text-white py-6"
                )}
            >
                <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">

                    {/* Logo */}
                    <Link to="/" className="z-50 relative">
                        <img
                            src={settings.logoUrl}
                            alt={settings.hotelName}
                            className="h-10 md:h-12 w-auto object-contain"
                        />
                    </Link>

                    {/* Right: Actions & Menu Trigger */}
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6">

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/account" className={twMerge("transition-colors hover:text-primary", (isScrolled || isMenuOpen) ? "text-secondary" : "text-white")}>
                                        <User size={20} />
                                    </Link>
                                    <span className={twMerge("text-sm font-medium", (isScrolled || isMenuOpen) ? "text-secondary" : "text-white")}>
                                        Hi, {user.name.split(' ')[0]}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className={twMerge("transition-colors hover:text-primary", (isScrolled || isMenuOpen) ? "text-secondary" : "text-white")}
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className={twMerge("transition-colors hover:text-primary", (isScrolled || isMenuOpen) ? "text-secondary" : "text-white")}>
                                    <User size={20} />
                                </Link>
                            )}

                            <Link to="/cart" className={twMerge("relative transition-colors hover:text-primary", (isScrolled || isMenuOpen) ? "text-secondary" : "text-white")}>
                                <ShoppingBag size={20} />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>

                            <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className={twMerge("text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors", (isScrolled || isMenuOpen) ? "text-secondary" : "text-white")}>
                                {settings.phone}
                            </a>
                            <Button
                                variant={(isScrolled || isMenuOpen) ? 'primary' : 'secondary'}
                                className="px-6 py-2 text-[10px]"
                                to="/book"
                            >
                                Book Now
                            </Button>
                        </div>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={twMerge("group flex items-center gap-3 focus:outline-none transition-colors relative z-50", (isScrolled || isMenuOpen) ? "text-secondary hover:text-primary" : "text-white hover:text-primary")}
                        >
                            <span className="hidden md:inline uppercase text-[11px] font-bold tracking-[0.2em]">{isMenuOpen ? 'Close' : 'Menu'}</span>
                            <div className="relative w-8 h-8 flex items-center justify-center">
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Side Drawer Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-40 shadow-2xl flex flex-col pt-24 pb-10 px-10 md:px-14 border-l border-gray-100"
                        >
                            <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 text-[400px] font-serif text-gray-50 opacity-50 pointer-events-none select-none overflow-hidden">
                                Q
                            </div>

                            {/* Info Header */}
                            <div className="mb-12 relative z-10">
                                <p className="text-secondary font-serif text-lg italic">"The essence of luxury."</p>
                            </div>

                            {/* Navigation Links */}
                            <ul className="space-y-6 relative z-10">
                                {headerNavLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="group flex items-center justify-between text-xl md:text-2xl font-serif text-secondary hover:text-primary transition-colors"
                                        >
                                            <span>{link.name}</span>
                                            <span className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-primary">→</span>
                                        </Link>
                                    </li>
                                ))}
                                <li className="pt-4 border-t border-gray-100 flex gap-4">
                                    {user ? (
                                        <div className="flex gap-4">
                                            <Link to="/account" className="text-secondary hover:text-primary flex items-center gap-2">
                                                <User size={20} /> <span className="text-sm uppercase tracking-widest">Account</span>
                                            </Link>
                                            <button onClick={logout} className="text-secondary hover:text-primary flex items-center gap-2">
                                                <LogOut size={20} /> <span className="text-sm uppercase tracking-widest">Logout</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <Link to="/login" className="text-secondary hover:text-primary flex items-center gap-2">
                                            <User size={20} /> <span className="text-sm uppercase tracking-widest">Sign In</span>
                                        </Link>
                                    )}
                                    <Link to="/cart" className="text-secondary hover:text-primary flex items-center gap-2">
                                        <ShoppingBag size={20} /> <span className="text-sm uppercase tracking-widest">Cart ({cart.length})</span>
                                    </Link>
                                </li>
                            </ul>

                            {/* Footer Info */}
                            <div className="mt-auto relative z-10 pt-10 border-t border-gray-100">
                                <div className="space-y-4 text-sm text-gray-500">
                                    <div className="flex items-start gap-4">
                                        <MapPin size={16} className="text-primary mt-1 shrink-0" />
                                        <span>{settings.address}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Phone size={16} className="text-primary shrink-0" />
                                        <span>{settings.phone}</span>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Button className="w-full" to="/contact">Reservations</Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
