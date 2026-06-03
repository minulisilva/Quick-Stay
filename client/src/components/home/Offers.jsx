import Button from '../common/Button';
import useContent from '../../hooks/useContent';

const Offers = () => {
    const { content } = useContent('home');
    const data = content?.offers || {
        title: 'Special Offers',
        subtitle: 'Exclusive Deals',
        description: 'Take advantage of our limited-time promotions and packages.',
        deals: [
            {
                title: 'Weekend Getaway',
                description: 'Perfect for a romantic weekend escape',
                discount: '25% OFF',
                image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
            },
            {
                title: 'Business Package',
                description: 'Everything you need for a successful business trip',
                discount: '20% OFF',
                image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'
            },
            {
                title: 'Family Vacation',
                description: 'Create unforgettable memories with your loved ones',
                discount: '30% OFF',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
            }
        ]
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <span className="text-primary text-sm font-bold tracking-widest uppercase block mb-3">{data.subtitle}</span>
                    <h2 className="text-4xl font-serif text-secondary">{data.title}</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{data.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.deals.slice(0, 3).map((offer, idx) => (
                        <div key={idx} className="bg-white group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <div className="overflow-hidden h-64 relative">
                                <img src={offer.image} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt={offer.title} />
                                {offer.discount && (
                                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {offer.discount}
                                    </div>
                                )}
                            </div>
                            <div className="p-8 text-center">
                                <h3 className="text-2xl font-serif text-secondary mb-4">{offer.title}</h3>
                                <p className="text-gray-600 mb-6 font-light">{offer.description}</p>
                                <Button variant="outline" className="text-xs px-4 py-2" to="/offers">View Details</Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button variant="primary" to="/offers">View All Offers</Button>
                </div>
            </div>
        </section>
    );
};

export default Offers;
