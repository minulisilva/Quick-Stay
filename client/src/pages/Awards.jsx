import { useState, useEffect } from 'react';
import PageHero from '../components/common/PageHero';
import { Award, Star, Trophy, Medal } from 'lucide-react';
import useContent from '../hooks/useContent';

const iconMap = {
    'Trophy': Trophy,
    'Star': Star,
    'Award': Award,
    'Medal': Medal
};

const Awards = () => {
    const { content } = useContent('awards');
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);

    const hero = content?.hero || {
        title: "Our Awards",
        subtitle: "Recognition of Excellence",
        backgroundImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=3898&auto=format&fit=crop"
    };

    useEffect(() => {
        fetchAwards();
    }, []);

    const fetchAwards = async () => {
        try {
            const res = await fetch('http://localhost:3000/awards');
            const data = await res.json();
            setAwards(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching awards:", err);
            setLoading(false);
        }
    };

    const getIcon = (index) => {
        const icons = [Trophy, Star, Award, Medal];
        return icons[index % icons.length];
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero
                title={hero.title}
                subtitle={hero.subtitle}
                bgImage={hero.backgroundImage}
            />

            <div className="container mx-auto px-6 md:px-12 -mt-20 relative z-10">
                <div className="bg-white p-8 md:p-16 rounded-lg shadow-xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-6">A Legacy of Distinction</h2>
                        <p className="text-gray-600 font-light leading-relaxed">
                            We are honored to be recognized by leading travel and hospitality organizations worldwide. These accolades are a testament to our team's unwavering dedication to excellence and our passion for creating memorable moments for our guests.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {awards.map((award, index) => {
                                const IconComponent = getIcon(index);
                                return (
                                    <div key={award._id} className="bg-gray-50 p-8 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                            <IconComponent size={32} className="text-primary" />
                                        </div>
                                        <span className="block text-primary font-bold text-sm tracking-widest mb-2">{award.year}</span>
                                        <h3 className="text-xl font-serif text-secondary mb-2">{award.title}</h3>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">{award.organization}</p>
                                        {award.description && (
                                            <p className="text-gray-600 text-sm font-light leading-relaxed">
                                                {award.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {!loading && awards.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No awards to display at this time.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Awards;
