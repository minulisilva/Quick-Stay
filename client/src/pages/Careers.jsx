import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import useContent from '../hooks/useContent';

const Careers = () => {
    const { content } = useContent('careers');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const hero = content?.hero || {
        title: 'Careers',
        subtitle: 'Join Our Team',
        backgroundImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=3869&auto=format&fit=crop'
    };

    const intro = content?.intro || {
        title: 'Grow With Us',
        description: 'At The Kingsbury, we believe that our employees are our greatest asset. We are always looking for passionate, dedicated, and talented individuals to join our growing family. Explore our current opportunities and take the next step in your hospitality career.'
    };

    useEffect(() => {
        fetch('http://localhost:3000/jobs')
            .then(res => res.json())
            .then(data => {
                const jobsArray = Array.isArray(data) ? data : (data.jobs || []);
                setJobs(jobsArray);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching jobs:', err);
                setJobs([]);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <PageHero 
                title={hero.title} 
                subtitle={hero.subtitle} 
                bgImage={hero.backgroundImage} 
            />
            <div className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-secondary mb-6">{intro.title}</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                        {intro.description}
                    </p>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center text-gray-400">Loading careers...</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 border border-dashed border-gray-200 rounded-lg">
                            No open positions at the moment. Please check back later.
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job._id} className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-all">
                                <div className="mb-4 md:mb-0">
                                    <h3 className="text-xl font-serif text-secondary">{job.title}</h3>
                                    <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                                        <span>{job.department}</span>
                                        <span>•</span>
                                        <span>{job.type}</span>
                                        <span>•</span>
                                        <span>{job.location}</span>
                                    </div>
                                </div>
                                <Button to={`/careers/${job._id}`} variant="outline" className="text-sm px-6">Apply Now</Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Careers;
