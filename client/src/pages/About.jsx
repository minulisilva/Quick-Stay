import PageHero from '../components/common/PageHero';
import AlternatingSection from '../components/common/AlternatingSection';
import LeadershipTeam from '../components/common/LeadershipTeam';
import { Shield, Star, Users, Globe } from 'lucide-react';
import useContent from '../hooks/useContent';

const About = () => {
    const { content } = useContent('about');

    const hero = content?.hero || {
        title: "Our Story",
        subtitle: "A Legacy of Hospitality",
        backgroundImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3870&auto=format&fit=crop"
    };

    const story = content?.story || {
        title: "Timeless Elegance in Colombo",
        subtitle: "Since 1973",
        description: "Standing majestically by the Indian Ocean, Quick Stay Hotel is a testament to timeless elegance and modern luxury. Since our inception, we have been the preferred choice for discerning travelers seeking an unforgettable experience in Colombo. Our commitment to excellence is reflected in every detail, from our opulent accommodations to our world-class dining venues.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3870&auto=format&fit=crop",
        features: ["50+ Years of Service", "Award Winning", "Sustainable Luxury"],
        actionText: "View Our Awards"
    };

    return (
        <div>
            <PageHero
                title={hero.title}
                subtitle={hero.subtitle}
                bgImage={hero.backgroundImage}
            />

            {/* The Story - Using AlternatingSection */}
            <AlternatingSection
                title={story.title}
                subtitle={story.subtitle}
                description={story.description}
                image={story.image}
                features={story.features}
                actionText={story.actionText}
                linkTo="/awards"
                imageAspect="aspect-[4/3] md:aspect-[16/9]"
                className="py-10 md:py-20"
            />


            {/* Values Grid */}
            <section className="py-24 bg-secondary text-white relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-primary blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        {(content?.values?.values || [
                            { title: 'Excellence', description: 'We strive for perfection in every detail, setting new benchmarks in luxury hospitality.', icon: 'Star' },
                            { title: 'Service', description: 'Genuine care and anticipation of guest needs are at the heart of everything we do.', icon: 'Users' },
                            { title: 'Integrity', description: 'We operate with honesty, transparency, and high ethical standards in all our interactions.', icon: 'Shield' },
                            { title: 'Sustainability', description: 'Committed to protecting our environment and supporting the local communities we serve.', icon: 'Globe' }
                        ]).map((value, index) => {
                            // Icon mapping
                            const iconMap = { Star, Users, Shield, Globe };
                            const IconComponent = iconMap[value.icon] || Star;

                            return (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 text-primary">
                                        <IconComponent size={32} />
                                    </div>
                                    <h3 className="text-xl font-serif mb-4">{value.title}</h3>
                                    <p className="font-light text-white/60 leading-relaxed">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Leadership Team */}
            <LeadershipTeam />

        </div>
    );
};

export default About;
