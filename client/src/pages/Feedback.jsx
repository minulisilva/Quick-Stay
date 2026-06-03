import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import { Star, MessageSquare, User, Mail, CheckCircle } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import { useAuth } from '../context/AuthContext';

const Feedback = () => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        department: 'General'
    });

    // Auto-fill user details when logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            guest: formData.name,
            email: formData.email,
            rating: rating,
            department: formData.department,
            comment: formData.message,
            date: new Date().toISOString().split('T')[0]
        };

        try {
            const response = await fetch('http://localhost:3000/feedbacks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSubmitted(true);
                window.scrollTo(0, 0);
            } else {
                console.error('Feedback submission failed');
                alert('Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback. Please check your connection.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (submitted) {
        return (
            <div className="bg-gray-50 min-h-screen pb-20">
                <PageHero title="Thank You" subtitle="Feedback Received" bgImage="https://images.unsplash.com/photo-1565516724069-2374249df9c7?q=80&w=3870&auto=format&fit=crop" />
                <div className="container mx-auto px-4 -mt-20 relative z-10 flex justify-center">
                    <div className="bg-white p-12 rounded-lg shadow-xl max-w-2xl w-full text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-3xl font-serif text-secondary mb-4">We Value Your Voice!</h2>
                        <p className="text-gray-600 mb-8">
                            Thank you for taking the time to share your experience with us. Your feedback helps us continue to improve and serve you better.
                        </p>
                        <Button to="/" variant="outline">Return Home</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center py-20">
            {/* Full Screen Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3870&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div> {/* Overlay for readability */}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-white/95 backdrop-blur-sm p-8 md:p-16 rounded-lg shadow-2xl max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-4">Guest Feedback</h1>
                        <p className="text-xl text-gray-500 font-light mb-8">Share Your Experience</p>
                        <hr className="w-24 mx-auto border-primary mb-8" />
                        <h2 className="text-2xl font-serif text-secondary mb-4">How was your stay?</h2>
                        <p className="text-gray-600 font-light">
                            We are committed to providing exceptional service. Please let us know what we did well or where we can improve.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Rating Section */}
                        <div className="flex flex-col items-center justify-center mb-10">
                            <label className="block text-sm uppercase tracking-wider text-gray-500 mb-4">Rate Your Experience</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110 duration-200"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            size={40}
                                            className={`${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors duration-200`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2 h-5 font-medium">
                                {rating === 5 ? "Exceptional" : rating === 4 ? "Very Good" : rating === 3 ? "Average" : rating === 2 ? "Below Average" : rating === 1 ? "Poor" : ""}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Your Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary bg-white"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary bg-white"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Department</label>
                            <select
                                name="department"
                                className="w-full px-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary bg-white"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="General">General Experience</option>
                                <option value="Front Desk">Front Desk & Reception</option>
                                <option value="Housekeeping">Housekeeping</option>
                                <option value="Dining">Dining & Restaurants</option>
                                <option value="Facilities">Pool, Spa & Gym</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Your Feedback</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-4 text-gray-400" size={18} />
                                <textarea
                                    name="message"
                                    required
                                    rows="5"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary resize-none bg-white"
                                    placeholder="Tell us about your stay..."
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" variant="primary" className="px-10 py-4 w-full md:w-auto">
                                Submit Feedback
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
