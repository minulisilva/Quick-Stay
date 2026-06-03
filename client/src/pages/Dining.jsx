import { useState, useEffect } from 'react';
import PageHero from '../components/common/PageHero';
import AlternatingSection from '../components/common/AlternatingSection';
import useContent from '../hooks/useContent';

const Dining = () => {
    const { content } = useContent('dining');
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    const hero = content?.hero || {
        title: "Dining",
        subtitle: "A Feast for the Senses",
        backgroundImage: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=3870&auto=format&fit=crop"
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            const response = await fetch('http://localhost:3000/diningOptions');
            const data = await response.json();
            setVenues(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching dining venues:', error);
            setVenues([]);
        } finally {
            setLoading(false);
        }
    };

    const fallbackRestaurants = [
        {
            id: 1,
            name: "Harbour Court",
            cuisine: "Global Gastronomy",
            description: "A culinary theatre where the world's finest flavors take center stage.",
            features: ["International Buffet", "Live Cooking", "Ocean Views", "All-Day Dining"],
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=3774&auto=format&fit=crop"
        }
    ];

    const restaurantArray = venues.length > 0 ? venues : fallbackRestaurants;

    return (
        <div>
            <PageHero
                title={hero.title}
                subtitle={hero.subtitle}
                bgImage={hero.backgroundImage || hero.bgImage}
            />

            <div className="bg-white">
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="text-gray-500">Loading dining venues...</div>
                    </div>
                ) : (
                    restaurantArray.map((rest, index) => (
                        <AlternatingSection
                            key={rest.id}
                            title={rest.name}
                            subtitle={rest.cuisine}
                            description={rest.description}
                            image={rest.image}
                            features={Array.isArray(rest.features) ? rest.features : []}
                            reverse={index % 2 !== 0}
                            actionText="Reserve A Table"
                            linkTo={`/table-reservation?restaurant=${encodeURIComponent(rest.name)}`}
                            imageAspect="aspect-[4/3] md:aspect-[16/9]"
                            className="py-10 md:py-20"
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Dining;
