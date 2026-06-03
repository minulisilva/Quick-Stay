import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { Calendar, Clock, User, MessageSquare, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TableReservation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryParams = new URLSearchParams(location.search);
    const initialRestaurant = queryParams.get('restaurant') || 'Harbour Court';

    const [formData, setFormData] = useState({
        restaurant: initialRestaurant,
        date: '',
        time: '19:00',
        guests: 2,
        name: '',
        email: '',
        phone: '',
        requests: ''
    });
    const [diningOptions, setDiningOptions] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Fetch restaurants from backend
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch('http://localhost:3000/diningOptions');
                if (res.ok) {
                    const data = await res.json();
                    setDiningOptions(data);

                    // If initialRestaurant (from URL) exists in fetched data, keep it.
                    // Otherwise, default to first available restaurant.
                    if (data.length > 0 && !data.find(d => d.name === initialRestaurant)) {
                        setFormData(prev => ({ ...prev, restaurant: data[0].name }));
                    }
                }
            } catch (error) {
                console.error("Error fetching dining options:", error);
            }
        };
        fetchOptions();
    }, [initialRestaurant]);

    // Auto-fill user details when logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Find the correct diningOptionId from our fetched list
            const selectedOption = diningOptions.find(opt => opt.name === formData.restaurant);

            if (!selectedOption) {
                alert("Please select a valid restaurant.");
                return;
            }

            const reservationData = {
                guestName: formData.name,
                email: formData.email,
                phone: formData.phone,
                date: formData.date,
                time: formData.time,
                guests: formData.guests,
                specialRequests: formData.requests,
                restaurant: formData.restaurant,
                diningOptionId: selectedOption.id || selectedOption._id,
            };

            const response = await fetch('http://localhost:3000/diningReservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                setIsSubmitted(true);
                window.scrollTo(0, 0);
            } else {
                const errorData = await response.json();
                console.error('Reservation failed:', errorData);
                alert(`Failed to submit reservation: ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error submitting reservation:', error);
            alert('Error submitting reservation. Please check your connection.');
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-gray-50 min-h-screen pb-20">
                <PageHero title="Reservation Confirmed" subtitle="Dining" bgImage="https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=3870&auto=format&fit=crop" />
                <div className="container mx-auto px-4 -mt-20 relative z-10 flex justify-center">
                    <div className="bg-white p-12 rounded-lg shadow-xl max-w-2xl w-full text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-3xl font-serif text-secondary mb-4">Table Reserved!</h2>
                        <p className="text-gray-600 mb-8">
                            Your table at <strong className="text-secondary">{formData.restaurant}</strong> has been reserved for <strong>{formData.guests} guests</strong> on <strong>{formData.date} at {formData.time}</strong>.
                            A confirmation email has been sent to {formData.email}.
                        </p>
                        <Button to="/dining" variant="outline">Back to Dining</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero title="Reserve a Table" subtitle="Culinary Delights Await" bgImage="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=3774&auto=format&fit=crop" />

            <div className="container mx-auto px-4 -mt-20 relative z-10 flex justify-center">
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-4xl w-full">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif text-secondary mb-2">Book Your Dining Experience</h2>
                        <p className="text-gray-500">Please fill out the form below to secure your table.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Restaurant & Date/Time */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Restaurant</label>
                                <div className="relative">
                                    <select
                                        name="restaurant"
                                        className="w-full p-4 border border-gray-200 rounded-md outline-none focus:border-primary appearance-none bg-white font-serif text-secondary"
                                        value={formData.restaurant}
                                        onChange={handleChange}
                                    >
                                        {diningOptions.length > 0 ? (
                                            diningOptions.map(opt => <option key={opt.id || opt._id} value={opt.name}>{opt.name}</option>)
                                        ) : (
                                            <option>Loading restaurants...</option>
                                        )}
                                    </select>
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            name="date"
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary"
                                            value={formData.date}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="time"
                                            name="time"
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary"
                                            value={formData.time}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Guests</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        name="guests"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary appearance-none bg-white font-serif text-secondary"
                                        value={formData.guests}
                                        onChange={handleChange}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(n => <option key={n} value={n}>{n} Guests</option>)}
                                    </select>
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="John Doe"
                                    className="w-full p-4 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="john@example.com"
                                        className="w-full p-4 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="+1 234 567 890"
                                        className="w-full p-4 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Special Requests</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-4 text-gray-400" size={18} />
                                    <textarea
                                        name="requests"
                                        rows="3"
                                        placeholder="Any dietary restrictions or special occasions?"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary resize-none"
                                        value={formData.requests}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-4 text-sm font-bold tracking-widest"
                            >
                                CONFIRM RESERVATION
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TableReservation;
