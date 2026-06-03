import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import { roomsList } from '../data/rooms'; // Removed static
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { CreditCard, Check, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { cart, clearCart, removeFromCart } = useCart();
    const { user, fetchUserBookings } = useAuth(); // Added fetchUserBookings

    // State to hold valid items to checkout
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [guestDetails, setGuestDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // Pre-fill user details if logged in
    useEffect(() => {
        if (user) {
            const [firstName, ...lastNameParts] = user.name.split(' ');
            setGuestDetails(prev => ({
                ...prev,
                firstName: firstName || '',
                lastName: lastNameParts.join(' ') || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const [step, setStep] = useState(1); // 1 = Form, 2 = Success

    useEffect(() => {
        const fetchCheckoutDetails = async () => {
            if (cart.length > 0) {
                setCheckoutItems(cart);
                setGrandTotal(cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0) * 1.15);
                setLoading(false);
            } else {
                setCheckoutItems([]);
                setGrandTotal(0);
                setLoading(false);
            }
        };

        fetchCheckoutDetails();
    }, [cart]);

    const handleSubmit = async (itemToBook) => {
        if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
            alert("Please fill in all guest details before booking.");
            return;
        }

        const bookingData = {
            guestName: `${guestDetails.firstName} ${guestDetails.lastName}`,
            email: guestDetails.email,
        };

        try {
            let res;
            let bookingId;

            if (itemToBook.type === 'Offer') {
                // Handle Offer Reservation
                res = await fetch('http://localhost:3000/offerReservations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        offer: itemToBook.title,
                        guestName: bookingData.guestName,
                        email: bookingData.email,
                        phone: guestDetails.phone,
                        date: itemToBook.checkIn,
                        amount: itemToBook.totalPrice
                    })
                });
            } else {
                // Handle Room Booking
                res = await fetch('http://localhost:3000/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        guestName: bookingData.guestName,
                        email: bookingData.email,
                        room: itemToBook.name || itemToBook.title,
                        roomId: itemToBook.dbId || itemToBook._id,
                        checkIn: itemToBook.checkIn,
                        checkOut: itemToBook.checkOut,
                        adults: itemToBook.adults || 1,
                        children: itemToBook.children || 0,
                        guests: (itemToBook.adults || 1) + (itemToBook.children || 0),
                        amount: itemToBook.totalPrice
                    })
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Booking failed');
            }

            const newBooking = await res.json();
            bookingId = newBooking.id || newBooking._id;

            // Create a matching payment record
            await fetch('http://localhost:3000/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: bookingId,
                    guest: bookingData.guestName,
                    email: bookingData.email,
                    amount: itemToBook.totalPrice,
                    method: 'Credit Card',
                    status: 'Paid'
                })
            });

            if (fetchUserBookings) {
                await fetchUserBookings();
            }

            // Remove only this item from cart
            removeFromCart(itemToBook.id);

            // If it was the last item, show success screen
            if (cart.length === 1) {
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(`Successfully booked ${itemToBook.name || itemToBook.title}!`);
            }

        } catch (error) {
            console.error("Booking error:", error);
            alert("Failed to create booking. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        setGuestDetails({ ...guestDetails, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="min-h-screen pt-32 text-center">Loading checkout...</div>;

    if (checkoutItems.length === 0 && step === 1) {
        return (
            <div className="bg-gray-50 min-h-screen pt-32 pb-20 text-center">
                <h2 className="text-2xl font-serif text-secondary mb-4">Your Cart is Empty</h2>
                <Button to="/rooms">Browse Rooms</Button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero
                title="Secure Checkout"
                subtitle="Finalize Your Reservation"
                bgImage="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=3870&auto=format&fit=crop"
            />

            <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-10">
                {step === 1 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-1 border-t-4 border-primary bg-white rounded-lg shadow-xl p-6 h-fit sticky top-24">
                            <h3 className="text-xl font-serif text-secondary mb-6">Reservation Summary</h3>

                            <div className="space-y-6 mb-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {checkoutItems.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-4 border-b border-gray-100 pb-6 last:border-0">
                                        <div className="flex gap-4">
                                            <img src={item.image || item.img} className="w-16 h-16 object-cover rounded-md" alt={item.name || item.title} />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-secondary text-sm">{item.name || item.title}</h4>
                                                <div className="text-xs text-gray-500 mt-1 space-y-1">
                                                    {item.checkIn && <div>{item.checkIn} — {item.checkOut}</div>}
                                                    <div className="font-bold text-primary mt-1">${item.totalPrice?.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="primary"
                                            className="w-full py-2 text-sm"
                                            onClick={() => handleSubmit(item)}
                                        >
                                            Complete This Booking
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 py-4 space-y-2 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between font-bold text-secondary">
                                    <span>Total Value in Cart</span>
                                    <span>${grandTotal.toFixed(2)}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center italic">Items are processed individually.</p>
                            </div>

                            <div className="flex items-center gap-2 text-green-600 text-xs bg-green-50 p-2 rounded-md justify-center">
                                <Shield size={14} />
                                Secure SSL Encryption
                            </div>
                        </div>

                        {/* Guest Form */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl font-serif text-secondary">Guest Details</h2>
                                <p className="text-sm text-gray-400 mt-1">Please provide your info before processing items.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={guestDetails.firstName}
                                            className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors bg-white font-serif text-secondary"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={guestDetails.lastName}
                                            className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors bg-white font-serif text-secondary"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={guestDetails.email}
                                            className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors bg-white font-serif text-secondary"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={guestDetails.phone}
                                            required
                                            className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors bg-white font-serif text-secondary"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-lg font-serif text-secondary mt-8 mb-4">Payment Method</h3>
                                <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 bg-gray-50">
                                    <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary"></div>
                                    <CreditCard className="text-secondary" />
                                    <span className="font-medium text-secondary">Credit Card (Pay at Hotel)</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">No payment required today. Card is only for guarantee.</p>

                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mt-8">
                                    <p className="text-xs text-amber-800 leading-relaxed">
                                        <strong>Note:</strong> Items in your cart must be confirmed individually. Scroll to the Summary section and click <strong>"Complete This Booking"</strong> for each item you wish to reserve.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto bg-white p-16 rounded-lg shadow-xl text-center"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                            <Check size={48} />
                        </div>
                        <h2 className="text-5xl font-serif text-secondary mb-6">Confirmed!</h2>
                        <p className="text-gray-500 text-lg mb-10">
                            Your reservation has been successfully placed. We have sent a confirmation email to <strong>{guestDetails.email}</strong> with your booking reference.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button to="/">Return Home</Button>
                            <Button variant="outline" to="/contact">Contact Support</Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
