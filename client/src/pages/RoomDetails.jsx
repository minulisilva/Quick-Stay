import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRooms } from '../hooks/useRooms'; // Updated import
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { Wifi, Tv, Coffee, Shield, User, Users, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const AvailabilityCalendar = ({ checkIn, checkOut, onDateSelect, bookedDates = [] }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentMonth);

    const isBooked = (day) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return bookedDates.includes(dateStr);
    };

    const isSelected = (day) => {
        if (!checkIn) return false;

        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const current = new Date(dateStr);
        const start = new Date(checkIn);

        if (checkOut) {
            const end = new Date(checkOut);
            return current >= start && current <= end;
        }
        return current.getTime() === start.getTime();
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const isPast = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDayClick = (day) => {
        if (isBooked(day) || isPast(day)) return;
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onDateSelect(dateStr);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="text-secondary hover:text-primary">&lt;</button>
                <h4 className="font-serif font-bold text-secondary">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h4>
                <button onClick={nextMonth} className="text-secondary hover:text-primary">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const booked = isBooked(day);
                    const past = isPast(day);
                    const selected = isSelected(day);
                    const disabled = booked || past;

                    return (
                        <button
                            key={day}
                            onClick={() => handleDayClick(day)}
                            disabled={disabled}
                            className={`
                                aspect-square rounded-md flex items-center justify-center text-sm transition-colors
                                ${disabled ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'hover:bg-primary/10 hover:text-primary'}
                                ${booked ? 'bg-red-50 text-red-300 decoration-slice' : ''}
                                ${selected ? 'bg-primary text-white hover:bg-primary hover:text-white' : ''}
                                ${!disabled && !selected ? 'text-secondary' : ''}
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded-sm"></div> Selected</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-50 text-red-300 border border-red-100 rounded-sm"></div> Booked</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 border border-gray-200 rounded-sm"></div> Available</div>
            </div>
        </div>
    );
};

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { rooms, loading } = useRooms();
    // Support both _id and legacy id
    const room = rooms.find(r => r._id === id || r.id === id || r.id === parseInt(id));
    const { addToCart } = useCart();

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [activeSlide, setActiveSlide] = useState(0);

    const [bookedDates, setBookedDates] = useState([]);

    // Fetch room bookings
    useEffect(() => {
        if (!room) return;
        const fetchBookings = async () => {
            try {
                // Fetch busy dates for this specific room (public endpoint)
                const response = await fetch(`http://localhost:3000/bookings/availability?room=${encodeURIComponent(room.name)}`);
                if (response.ok) {
                    const bookings = await response.json();

                    // Convert booking ranges to array of disabled dates
                    const allBookedDates = [];
                    bookings.forEach(booking => {
                        // Only consider confirmed or pending bookings (ignore cancelled)
                        if (booking.status !== 'Cancelled') {
                            const start = new Date(booking.checkIn);
                            const end = new Date(booking.checkOut);

                            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                                allBookedDates.push(d.toISOString().split('T')[0]);
                            }
                        }
                    });
                    setBookedDates(allBookedDates);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();

        // Auto-advance slider logic
        if (!room.gallery) return;
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % room.gallery.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [room]);

    const handleDateSelect = (date) => {
        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(date);
            setCheckOut('');
        } else {
            // Basic validation: Check-out must be after check-in
            if (new Date(date) > new Date(checkIn)) {
                setCheckOut(date);
            } else {
                setCheckIn(date);
                setCheckOut('');
            }
        }
    };

    const handleBookNow = () => {
        const numericPrice = parseFloat(room.price) || 0;
        const days = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));

        addToCart({
            ...room,
            dbId: room.id || room._id,
            type: room.name || 'Room',
            checkIn,
            checkOut,
            adults,
            children,
            days,
            totalPrice: numericPrice * days
        });

        navigate('/checkout');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading room details...</div>;
    if (!room) return <div className="min-h-screen flex items-center justify-center pt-20">Room not found</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero
                title={room.name}
                subtitle="Accommodation"
                bgImage={room.image}
            />

            <div className="container mx-auto px-4 md:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Room Gallery Slider */}
                        {room.gallery && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative h-[400px] rounded-lg overflow-hidden group"
                            >
                                {room.gallery.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${room.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-20 pointer-events-none"></div>

                                {/* Dots Navigation */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                                    {room.gallery.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveSlide(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-lg shadow-sm"
                        >
                            <h2 className="text-3xl font-serif text-secondary mb-6">Room Overview</h2>
                            <p className="text-gray-600 leading-relaxed text-lg font-light mb-8">
                                {room.description}
                            </p>

                            <h3 className="text-xl font-serif text-secondary mb-6">Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {room.amenities.map(item => (
                                    <div key={item} className="flex items-center gap-3 text-gray-500 text-sm">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Calendar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-serif text-secondary mb-6">Availability</h3>
                            <AvailabilityCalendar
                                checkIn={checkIn}
                                checkOut={checkOut}
                                onDateSelect={handleDateSelect}
                                bookedDates={bookedDates}
                            />
                        </motion.div>


                    </div>

                    {/* Right: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-lg shadow-xl sticky top-24 border-t-4 border-primary">
                            <div className="flex justify-between items-baseline mb-6">
                                <span className="text-3xl font-bold text-secondary">${room.price}</span>
                                <span className="text-gray-400">/ night</span>
                            </div>

                            <div className="space-y-6">
                                {/* Dates Display */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-gray-200 p-3 rounded-md">
                                        <label className="text-xs text-gray-400 uppercase block mb-1">Check-In</label>
                                        <div className="font-serif text-secondary">{checkIn || "Select Date"}</div>
                                    </div>
                                    <div className="border border-gray-200 p-3 rounded-md">
                                        <label className="text-xs text-gray-400 uppercase block mb-1">Check-Out</label>
                                        <div className="font-serif text-secondary">{checkOut || "Select Date"}</div>
                                    </div>
                                </div>

                                {/* Guests */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase block mb-2">Adults</label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-gray-200 p-3 rounded-md outline-none focus:border-primary appearance-none bg-white font-serif text-secondary"
                                                value={adults}
                                                onChange={(e) => setAdults(parseInt(e.target.value))}
                                            >
                                                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase block mb-2">Children</label>
                                        <div className="relative">
                                            <select
                                                className="w-full border border-gray-200 p-3 rounded-md outline-none focus:border-primary appearance-none bg-white font-serif text-secondary"
                                                value={children}
                                                onChange={(e) => setChildren(parseInt(e.target.value))}
                                            >
                                                {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary if dates selected */}
                                {checkIn && checkOut && (
                                    <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Duration</span>
                                            <span className="font-medium">{Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))} Nights</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-secondary pt-2 border-t border-gray-200">
                                            <span>Total</span>
                                            <span>${room.price * Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 py-4 text-sm"
                                        onClick={() => {
                                            const days = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
                                            addToCart({
                                                ...room,
                                                dbId: room.id || room._id,
                                                checkIn,
                                                checkOut,
                                                adults,
                                                children,
                                                totalPrice: room.price * days
                                            });
                                        }}
                                        disabled={!checkIn || !checkOut}
                                    >
                                        Add to Cart
                                    </Button>

                                    <Button
                                        variant="primary"
                                        className="flex-1 py-4 text-sm"
                                        onClick={handleBookNow}
                                        disabled={!checkIn || !checkOut}
                                    >
                                        Book Now
                                    </Button>
                                </div>

                                <div className="text-center text-xs text-gray-400 mt-4">
                                    <span className="flex items-center justify-center gap-1"><CheckCircle size={12} /> Best Price Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
