import { useState, useEffect } from 'react';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import useContent from '../hooks/useContent';

const OffersPage = () => {
    const { content } = useContent('offers');
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    const hero = content?.hero || {
        title: "Special Offers",
        subtitle: "Exclusive Privileges",
        backgroundImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=3870&auto=format&fit=crop"
    };

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('http://localhost:3000/offers', {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                const data = await res.json();
                const apiOffers = Array.isArray(data) ? data : [];
                
                if (apiOffers.length > 0) {
                    const normalized = apiOffers.map(item => ({
                        id: item._id || item.id,
                        title: item.title || item.offer,
                        desc: item.desc || item.description,
                        img: item.img || item.image
                    }));
                    setOffers(normalized);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching offers:", err);
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    if (loading) {
        return (
            <div>
                <PageHero
                    title={hero.title}
                    subtitle={hero.subtitle}
                    bgImage={hero.backgroundImage}
                />
                <div className="container mx-auto px-6 md:px-12 py-24 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white shadow-lg animate-pulse">
                                <div className="h-72 bg-gray-200"></div>
                                <div className="p-8">
                                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHero
                title={hero.title}
                subtitle={hero.subtitle}
                bgImage={hero.backgroundImage}
            />
            <div className="container mx-auto px-6 md:px-12 py-24 bg-gray-50">
                {offers.length === 0 ? (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-serif text-gray-600 mb-4">No offers available at the moment</h3>
                        <p className="text-gray-500">Please check back later for exciting deals and packages.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {offers.map((offer, idx) => (
                            <div key={offer.id || idx} className="bg-white group hover:-translate-y-2 transition-transform duration-500 shadow-lg hover:shadow-2xl">
                                <div className="h-72 overflow-hidden relative">
                                    <img
                                        src={offer.img}
                                        alt={offer.title}
                                        className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s]"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=3870&auto=format&fit=crop';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/20 transition-colors duration-500"></div>
                                </div>
                                <div className="p-8 md:p-10 flex flex-col h-[320px] justify-between relative">
                                    {/* Decorative line */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                                    <div>
                                        <h3 className="text-2xl font-serif text-secondary mb-4 group-hover:text-primary transition-colors">{offer.title}</h3>
                                        <p className="text-gray-500 font-light leading-relaxed mb-6 text-sm">{offer.desc}</p>
                                    </div>
                                    <Button variant="outline" className="w-full border-gray-200 hover:border-primary group-hover:bg-primary group-hover:text-white" to={`/offer/${offer.id}`}>
                                        Book This Offer
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersPage;
