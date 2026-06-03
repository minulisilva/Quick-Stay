import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import useContent from '../../hooks/useContent';
import { useState, useEffect } from 'react';

const Testimonials = () => {
    const { content } = useContent('home');
    const [activeIndex, setActiveIndex] = useState(0);
    const [feedbacks, setFeedbacks] = useState([]);
    
    const data = content?.feedback || {
        title: 'Guest Reviews',
        subtitle: 'What Our Guests Say',
        description: 'Read testimonials from our satisfied guests.'
    };

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await fetch('http://localhost:3000/feedback');
                if (response.ok) {
                    const data = await response.json();
                    const mappedFeedbacks = data.map(feedback => ({
                        name: feedback.guest,
                        location: feedback.location || 'Guest',
                        rating: feedback.rating,
                        comment: feedback.comment
                    }));
                    setFeedbacks(mappedFeedbacks.length > 0 ? mappedFeedbacks : getDefaultFeedbacks());
                } else {
                    setFeedbacks(getDefaultFeedbacks());
                }
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
                setFeedbacks(getDefaultFeedbacks());
            }
        };
        fetchFeedbacks();
    }, []);

    const getDefaultFeedbacks = () => [
        {
            name: 'Sarah Johnson',
            location: 'New York, USA',
            rating: 5,
            comment: 'Absolutely amazing experience! The staff was incredibly friendly and the room was spotless.'
        },
        {
            name: 'Michael Chen',
            location: 'London, UK',
            rating: 5,
            comment: 'The dining experience was exceptional. Every meal was a culinary masterpiece.'
        },
        {
            name: 'Emma Rodriguez',
            location: 'Madrid, Spain',
            rating: 5,
            comment: 'Perfect location, luxurious amenities, and outstanding service. Exceeded all expectations!'
        }
    ];

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % feedbacks.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
    };

    // Get the 3 visible feedbacks based on activeIndex
    const getVisibleFeedbacks = () => {
        if (feedbacks.length === 0) return [];
        const visible = [];
        for (let i = 0; i < 3; i++) {
            visible.push(feedbacks[(activeIndex + i) % feedbacks.length]);
        }
        return visible;
    };

    if (feedbacks.length === 0) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <span className="text-secondary text-sm font-bold tracking-widest uppercase block mb-3">{data.subtitle}</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-secondary">{data.title}</h2>
                        <p className="text-gray-600 mt-4">Loading testimonials...</p>
                    </div>
                </div>
            </section>
        );
    }

    const visibleItems = getVisibleFeedbacks();

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-secondary text-sm font-bold tracking-widest uppercase block mb-3">{data.subtitle}</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-secondary">{data.title}</h2>
                    {data.description && (
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{data.description}</p>
                    )}
                </div>

                <div className="max-w-7xl mx-auto relative">
                    {/* Navigation Buttons (Desktop: Absolute Sides, Mobile: Bottom) */}
                    <div className="hidden md:block absolute top-1/2 -left-12 -translate-y-1/2 z-10">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-white border border-gray-200 text-secondary hover:bg-primary hover:text-white transition-all shadow-lg"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </div>
                    <div className="hidden md:block absolute top-1/2 -right-12 -translate-y-1/2 z-10">
                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-white border border-gray-200 text-secondary hover:bg-primary hover:text-white transition-all shadow-lg"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {visibleItems.map((item, index) => (
                            <div key={`${item.name}-${index}`} className="bg-white p-8 rounded-2xl shadow-md flex flex-col h-full relative group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute top-6 right-6 text-primary/10">
                                    <Quote size={40} />
                                </div>

                                <div className="flex gap-1 text-yellow-500 mb-6">
                                    {[...Array(item.rating || 5)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>

                                <p className="text-gray-600 italic mb-6 flex-grow leading-relaxed">
                                    "{item.comment}"
                                </p>

                                <div className="border-t border-gray-100 pt-6 mt-auto">
                                    <h4 className="font-bold text-secondary text-lg">{item.name}</h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{item.location || 'Guest'}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex md:hidden justify-center gap-4 mt-8">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-white border border-gray-200 text-secondary hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-white border border-gray-200 text-secondary hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
