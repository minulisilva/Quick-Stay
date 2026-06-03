import { useParams, useNavigate } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { CheckCircle, Calendar, User, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const OfferDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('2');

    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`http://localhost:3000/offers/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Offer not found');
                return res.json();
            })
            .then(data => {
                setOffer({
                    id: data.id,
                    title: data.offer || data.title,
                    desc: data.description || data.desc,
                    img: data.image || data.img,
                    price: data.price ? (typeof data.price === 'number' ? `From $${data.price}` : data.price) : "Contact for Rates",
                    rawPrice: data.price // Keep raw price for logic
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching offer:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-20 text-center">Loading offer details...</div>;
    if (!offer) return <div className="p-20 text-center">Offer not found</div>;

    const handleBook = () => {
        // Parse "From $X" to get a numeric price estimate for cart
        const numericPrice = parseInt(offer.price.replace(/\D/g, '')) || 0;

        // Calculate days if dates are present
        let days = 1;
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        }

        addToCart({
            ...offer,
            dbId: offer.id,
            type: 'Offer',
            checkIn,
            checkOut,
            guests,
            days,
            totalPrice: numericPrice * days
        });

        // Redirect to checkout
        navigate('/checkout');
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero
                title={offer.title}
                subtitle="Exclusive Offer"
                bgImage={offer.img}
            />

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Details */}
                    <div>
                        <h2 className="text-3xl font-serif text-secondary mb-6">{offer.title}</h2>
                        <p className="text-gray-600 leading-relaxed text-lg font-light mb-8">
                            {offer.desc}
                        </p>

                        <div className="space-y-4 mb-8">
                            <h3 className="font-bold text-secondary uppercase tracking-widest text-xs">Inclusions</h3>
                            <ul className="space-y-3">
                                {["Luxury Accommodation", "Daily Breakfast", "Free Wi-Fi", "Access to Pool & Gym"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-500 text-sm">
                                        <CheckCircle size={16} className="text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-3xl font-serif text-primary">
                            {offer.price} <span className="text-base text-gray-400 font-sans font-normal">/ night</span>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 h-fit">
                        <h3 className="text-xl font-serif text-secondary mb-6">Book This Offer</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Check In</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary bg-white"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Check Out</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary bg-white"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Guests</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary bg-white appearance-none"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                    >
                                        <option value="1">1 Adult</option>
                                        <option value="2">2 Adults</option>
                                        <option value="3">2 Adults + 1 Child</option>
                                        <option value="4">FAMILY</option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                className="w-full py-4 mt-4"
                                variant="primary"
                                onClick={handleBook}
                            >
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferDetails;
