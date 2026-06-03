import { useState, useEffect } from 'react';
import PageHero from '../components/common/PageHero';
import AlternatingSection from '../components/common/AlternatingSection';
import useContent from '../hooks/useContent';

const Experiences = () => {
    const { content } = useContent('experiences');
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    const hero = content?.hero || {
        title: "Experiences",
        subtitle: "Beyond Accommodation",
        backgroundImage: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=3870&auto=format&fit=crop"
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await fetch('http://localhost:3000/experiences');
            const data = await response.json();
            setExperiences(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            setExperiences([]);
        } finally {
            setLoading(false);
        }
    };

    const fallbackExperiences = [
        {
            id: 1,
            name: "Infinity Pool",
            description: "Suspended between the sky and the sea, our edge-less infinity pool offers a swimming experience like no other.",
            features: ["Ocean Edge View", "Poolside Bar", "Private Cabanas"],
            image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=3870&auto=format&fit=crop",
            price: 50,
            duration: "All Day"
        }
    ];

    const experiencesList = experiences.length > 0 ? experiences : fallbackExperiences;

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
                        <div className="text-gray-500">Loading experiences...</div>
                    </div>
                ) : (
                    experiencesList.map((exp, idx) => (
                        <AlternatingSection
                            key={exp.id}
                            title={exp.name}
                            subtitle={`$${exp.price} • ${exp.duration}`}
                            description={exp.description}
                            image={exp.image}
                            features={Array.isArray(exp.features) ? exp.features : exp.inclusions || []}
                            reverse={idx % 2 !== 0}
                            actionText="Book Experience"
                            linkTo={`/experience/${exp.id}`}
                            imageAspect="aspect-[4/3] md:aspect-[16/9]"
                            className="py-10 md:py-20"
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Experiences;
