import useContent from '../../hooks/useContent';

const Welcome = () => {
    const { content } = useContent('home');
    const welcome = content?.welcome || {
        badge: 'Timeless Elegance',
        title: 'Welcome to The Quick Stay',
        subtitle: 'Where Luxury Meets Comfort',
        description: 'Located in the heart of Colombo, The Quick Stay offers an unparalleled experience of luxury and sophistication. With breathtaking views of the Indian Ocean and the city skyline, our hotel is a sanctuary for both business and leisure travelers.',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
        buttonText: 'Discover More',
        features: ['24/7 Room Service', 'Spa & Wellness', 'Fine Dining', 'Business Center']
    };

    return (
        <section className="py-24 md:py-32 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-left">
                        <span className="block text-primary uppercase tracking-widest text-sm font-medium mb-4">{welcome.badge}</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-4">
                            {welcome.title}
                        </h2>
                        {welcome.subtitle && (
                            <h3 className="text-xl md:text-2xl text-gray-600 mb-6">
                                {welcome.subtitle}
                            </h3>
                        )}
                        <p className="text-gray-600 font-light text-lg leading-relaxed mb-8">
                            {welcome.description}
                        </p>
                        {welcome.features && Array.isArray(welcome.features) && (
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {welcome.features.map((feature, idx) => (
                                    <div key={idx} className="text-center lg:text-left p-3 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-center lg:justify-start">
                            <a 
                                href="/about" 
                                className="inline-flex items-center justify-center px-6 py-3 uppercase tracking-widest text-sm font-medium transition-all duration-300 ease-in-out border bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
                            >
                                {welcome.buttonText || 'Discover More'}
                            </a>
                        </div>
                    </div>
                    
                    {/* Image */}
                    <div className="relative">
                        <img 
                            src={welcome.image} 
                            alt="Welcome" 
                            className="w-full h-[400px] object-cover rounded-2xl shadow-lg transform transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Welcome;
