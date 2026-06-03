import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from '../../pages/Home';
import Rooms from '../../pages/Rooms';
import Dining from '../../pages/Dining';
import Contact from '../../pages/Contact';
import Experiences from '../../pages/Experiences';
import Offers from '../../pages/Offers';
import Gallery from '../../pages/Gallery';
import About from '../../pages/About';
import Careers from '../../pages/Careers';
import JobDetails from '../../pages/JobDetails';
import Terms from '../../pages/Terms';
import Privacy from '../../pages/Privacy';
import Booking from '../../pages/Booking';
import RoomDetails from '../../pages/RoomDetails';
import Checkout from '../../pages/Checkout';
import Account from '../../pages/Account';
import Cart from '../../pages/Cart';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import ForgotPassword from '../../pages/ForgotPassword';
import TableReservation from '../../pages/TableReservation';
import OfferDetails from '../../pages/OfferDetails';
import ExperienceDetails from '../../pages/ExperienceDetails';
import Awards from '../../pages/Awards';
import Feedback from '../../pages/Feedback';

const PageTransition = ({ children }) => {
    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }} // Slight zoom out on exit to feel consistent
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/rooms" element={<PageTransition><Rooms /></PageTransition>} />
                <Route path="/dining" element={<PageTransition><Dining /></PageTransition>} />
                <Route path="/experiences" element={<PageTransition><Experiences /></PageTransition>} />
                <Route path="/offers" element={<PageTransition><Offers /></PageTransition>} />
                <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
                <Route path="/careers/:id" element={<PageTransition><JobDetails /></PageTransition>} />
                <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
                <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/book" element={<PageTransition><Booking /></PageTransition>} />
                <Route path="/room/:id" element={<PageTransition><RoomDetails /></PageTransition>} />
                <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
                <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
                <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
                <Route path="/table-reservation" element={<PageTransition><TableReservation /></PageTransition>} />
                <Route path="/offer/:id" element={<PageTransition><OfferDetails /></PageTransition>} />
                <Route path="/experience/:id" element={<PageTransition><ExperienceDetails /></PageTransition>} />
                <Route path="/awards" element={<PageTransition><Awards /></PageTransition>} />
                <Route path="/feedback" element={<PageTransition><Feedback /></PageTransition>} />
                <Route path="*" element={<PageTransition><Home /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
