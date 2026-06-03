import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { CheckCircle, Clock, MapPin, DollarSign } from 'lucide-react';

const ExperienceDetails = () => {
    const { id } = useParams();
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExperience();
    }, [id]);

    const fetchExperience = async () => {
        try {
            const response = await fetch(`http://localhost:3000/experiences/${id}`);
            if (response.ok) {
                const data = await response.json();
                setExperience(data);
            } else {
                setExperience(null);
            }
        } catch (error) {
            console.error('Error fetching experience:', error);
            setExperience(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading experience...</div>
            </div>
        );
    }

    if (!experience) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Experience not found</h2>
                    <Button to="/experiences">Back to Experiences</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero
                title={experience.name}
                subtitle={`$${experience.price} • ${experience.duration}`}
                bgImage={experience.image}
            />

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white p-8 md:p-16 rounded-lg shadow-xl max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 mb-16">
                        <div className="md:w-2/3">
                            <h2 className="text-3xl font-serif text-secondary mb-6">{experience.name}</h2>
                            <p className="text-gray-600 leading-relaxed text-lg font-light mb-8">
                                {experience.description}
                            </p>

                            {experience.inclusions && experience.inclusions.length > 0 && (
                                <>
                                    <h3 className="font-bold text-secondary uppercase tracking-widest text-xs mb-4">What's Included</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                                        {experience.inclusions.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-500 text-sm">
                                                <CheckCircle size={16} className="text-primary" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {experience.features && experience.features.length > 0 && (
                                <>
                                    <h3 className="font-bold text-secondary uppercase tracking-widest text-xs mb-4">Features</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                                        {experience.features.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-500 text-sm">
                                                <CheckCircle size={16} className="text-primary" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        <div className="md:w-1/3 space-y-6">
                            <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
                                <h4 className="font-serif text-secondary text-lg mb-4">Experience Details</h4>
                                <ul className="space-y-4 text-sm text-gray-600">
                                    <li className="flex items-center gap-3">
                                        <DollarSign size={18} className="text-primary" />
                                        <span>${experience.price} per person</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Clock size={18} className="text-primary" />
                                        <span>Duration: {experience.duration}</span>
                                    </li>
                                    {experience.category && (
                                        <li className="flex items-center gap-3">
                                            <MapPin size={18} className="text-primary" />
                                            <span>Category: {experience.category}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <Button to="/contact" className="w-full">
                                Book This Experience
                            </Button>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    {experience.images && experience.images.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-serif text-secondary mb-8 text-center">Gallery</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {experience.images.map((img, index) => (
                                    <div key={index} className="h-64 overflow-hidden rounded-lg group">
                                        <img
                                            src={img}
                                            alt={`${experience.name} ${index + 1}`}
                                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperienceDetails;
