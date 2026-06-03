import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { MapPin, Briefcase, Clock, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', coverLetter: '', experience: '', resumeLink: ''
    });

    // Auto-fill user details when logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        fetch(`http://localhost:3000/jobs/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.message) throw new Error(data.message);
                setJob(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching job:", err);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3000/jobs/${id}/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error applying:", error);
            alert("Failed to submit application.");
        }
    };

    if (loading) return <div className="pt-32 text-center">Loading job details...</div>;
    if (!job) return <div className="pt-32 text-center">Job not found.</div>;

    return (
        <div>
            <PageHero title={job.title} subtitle={job.department} bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3870&auto=format&fit=crop" />

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Job Info */}
                <div className="lg:col-span-2 space-y-10">
                    <div>
                        <h2 className="text-3xl font-serif text-secondary mb-6">Position Overview</h2>
                        <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Briefcase size={18} className="text-primary" /> {job.type}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-primary" /> {job.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-primary" /> Posted {new Date(job.postedDate).toLocaleDateString()}
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-serif text-secondary mb-4">Requirements</h3>
                        <ul className="space-y-3">
                            {job.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-600">
                                    <CheckCircle size={18} className="text-primary shrink-0 mt-1" />
                                    <span>{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Application Form */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 sticky top-24">
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Application Sent!</h3>
                                <p className="text-gray-500 text-sm">Thank you for applying. We will review your application and get back to you soon.</p>
                                <Button to="/careers" variant="outline" className="mt-6 w-full">Back to Careers</Button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-serif text-secondary mb-6">Apply for this Role</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                                        <input type="text" required className="w-full border border-gray-200 rounded p-2 outline-none focus:border-primary"
                                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email</label>
                                        <input type="email" required className="w-full border border-gray-200 rounded p-2 outline-none focus:border-primary"
                                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Phone</label>
                                        <input type="tel" required className="w-full border border-gray-200 rounded p-2 outline-none focus:border-primary"
                                            value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Years of Experience</label>
                                        <input type="text" placeholder="e.g. 5 Years" className="w-full border border-gray-200 rounded p-2 outline-none focus:border-primary"
                                            value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Resume / Portfolio Link</label>
                                        <input type="url" placeholder="https://" className="w-full border border-gray-200 rounded p-2 outline-none focus:border-primary"
                                            value={formData.resumeLink} onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Cover Letter</label>
                                        <textarea rows="4" className="w-full border border-gray-200 rounded p-2 outline-none focus:border-primary"
                                            value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}></textarea>
                                    </div>
                                    <Button type="submit" variant="primary" className="w-full mt-2">Submit Application</Button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
