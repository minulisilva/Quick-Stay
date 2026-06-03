import Button from '../common/Button';
import RevealOnScroll from '../common/RevealOnScroll';
import useContent from '../../hooks/useContent';

const FeaturedRooms = () => {
    const { content } = useContent('home');
    const data = content?.rooms || {
        title: 'Our Rooms & Suites',
        subtitle: 'Comfort & Elegance',
        description: 'Choose from our selection of beautifully appointed rooms and suites.',
        featured: [
            {
                name: "Superior Room",
                description: "Elegant comfort with city or ocean views.",
                price: "From $150",
                image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3870&auto=format&fit=crop"
            },
            {
                name: "Deluxe Ocean",
                description: "Spacious interiors with panoramic ocean vistas.",
                price: "From $220",
                image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=3774&auto=format&fit=crop"
            },
            {
                name: "Executive Suite",
                description: "The ultimate luxury with separate living areas.",
                price: "From $350",
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=3870&auto=format&fit=crop"
            }
        ]
    };

    return (
        <section className="py-32 bg-[#F9F9F9]">
            <div className="container mx-auto px-6 md:px-12">

                {/* Header */}
                <RevealOnScroll className="flex flex-col md:flex-row justify-between items-end mb-20">
                    <div className="max-w-xl">
                        <span className="block text-primary uppercase tracking-[0.2em] text-xs font-bold mb-4">{data.subtitle}</span>
                        <h2 className="text-5xl md:text-6xl font-serif text-secondary leading-tight">
                            {data.title}
                        </h2>
                    </div>
                    <div className="hidden md:block mb-2">
                        <Button variant="outline" className="text-xs px-8 py-3 border-gray-300 hover:border-secondary" to="/rooms">
                            View All Suites
                        </Button>
                    </div>
                </RevealOnScroll>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {data.featured.map((room, index) => (
                        <RevealOnScroll key={index} delay={index * 0.15} className={`group cursor-pointer ${index === 1 ? 'md:-mt-16' : ''}`}>
                            <div className="relative overflow-hidden mb-8 h-[300px] w-full bg-gray-200">
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-in-out"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                            </div>

                            <div className="flex justify-between items-baseline border-b border-gray-200 pb-4 mb-4">
                                <h3 className="text-3xl font-serif text-secondary group-hover:text-primary transition-colors">{room.name}</h3>
                                <span className="text-sm font-sans text-gray-400">{room.price}</span>
                            </div>
                            <p className="text-gray-500 font-light text-sm tracking-wide leading-relaxed mb-6 max-w-xs">{room.description}</p>
                        </RevealOnScroll>
                    ))}
                </div>

                <div className="mt-16 text-center md:hidden">
                    <Button variant="outline" to="/rooms">View All Suites</Button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedRooms;
