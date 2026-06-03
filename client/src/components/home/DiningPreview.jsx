import Button from '../common/Button';
import RevealOnScroll from '../common/RevealOnScroll';
import useContent from '../../hooks/useContent';

const DiningPreview = () => {
    const { content } = useContent('home');
    const data = content?.dining || {
        title: 'Dining Excellence',
        subtitle: 'Culinary Journey',
        description: 'Experience world-class cuisine at our signature restaurants.',
        restaurants: [
            {
                name: 'The Grand Restaurant',
                image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=3774&auto=format&fit=crop'
            },
            {
                name: 'Rooftop Lounge',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=3870&auto=format&fit=crop'
            }
        ]
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <RevealOnScroll className="w-full" delay={0.1}>
                            <img src={data.restaurants[0]?.image} className="w-full h-64 object-cover mt-8 shadow-lg" alt="Dining 1" />
                        </RevealOnScroll>
                        <RevealOnScroll className="w-full" delay={0.3}>
                            <img src={data.restaurants[1]?.image} className="w-full h-64 object-cover shadow-lg" alt="Dining 2" />
                        </RevealOnScroll>
                    </div>

                    {/* Content */}
                    <RevealOnScroll delay={0.4}>
                        <span className="block text-primary uppercase tracking-widest text-sm font-medium mb-4">{data.subtitle}</span>
                        <h2 className="text-4xl font-serif text-secondary mb-6">{data.title}</h2>
                        <p className="text-gray-600 font-light text-lg leading-relaxed mb-8">
                            {data.description}
                        </p>
                        <Button variant="primary" to="/dining">Explore Dining</Button>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
};

export default DiningPreview;
