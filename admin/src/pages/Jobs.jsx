import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Users, Plus, Trash2, Edit, ChevronDown, CheckCircle, XCircle, Search } from 'lucide-react';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [selectedJobApplications, setSelectedJobApplications] = useState(null);
    const [applications, setApplications] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        department: '',
        type: 'Full-time',
        location: 'Colombo, Sri Lanka',
        description: '',
        requirements: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch('http://localhost:3000/jobs?admin=true&page=1&limit=100', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const data = await res.json();
            // Handle paginated response
            const jobsArray = data.jobs || data;
            setJobs(Array.isArray(jobsArray) ? jobsArray : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setLoading(false);
        }
    };

    const fetchApplications = async (jobId) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`http://localhost:3000/jobs/${jobId}/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const data = await res.json();
            setApplications(Array.isArray(data) ? data : []);
            setSelectedJobApplications(jobId);
            setSelectedJob(jobs.find(job => job._id === jobId)); // Set selected job for application panel
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const handleUpdateStatus = async (jobId, newStatus) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`http://localhost:3000/jobs/${jobId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setJobs(prev => prev.map(job => (job._id === jobId || job.id === jobId) ? { ...job, status: newStatus } : job));
                if (selectedJob && (selectedJob._id === jobId || selectedJob.id === jobId)) {
                    setSelectedJob(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (error) {
            console.error("Error updating job status:", error);
        }
    };

    const handleApplicationStatus = async (jobId, applicantId, status) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`http://localhost:3000/jobs/${jobId}/applications/${applicantId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Refresh local state to show updated applicant status
                setApplications(prev => prev.map(app => (app._id === applicantId || app.id === applicantId) ? { ...app, status } : app));
                setJobs(prev => prev.map(job => {
                    if (job._id === jobId || job.id === jobId) {
                        return {
                            ...job,
                            applications: job.applications.map(app => (app._id === applicantId || app.id === applicantId) ? { ...app, status } : app)
                        };
                    }
                    return job;
                }));

                // If this job is the one in the side panel, update that too
                if (selectedJob && (selectedJob._id === jobId || selectedJob.id === jobId)) {
                    setSelectedJob(prev => ({
                        ...prev,
                        applications: prev.applications.map(app => (app._id === applicantId || app.id === applicantId) ? { ...app, status } : app)
                    }));
                }
            }
        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };

    const handleSaveJob = async (e) => {
        e.preventDefault();
        // Robust requirements parsing
        const requirements = formData.requirements
            .split('\n')
            .map(r => r.trim())
            .filter(r => r.length > 0);

        const dataToSend = { ...formData, requirements };
        const jobId = editingJob?._id;
        const url = jobId ? `http://localhost:3000/jobs/${jobId}` : 'http://localhost:3000/jobs';
        const method = jobId ? 'PUT' : 'POST';

        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                const saved = await res.json();
                if (jobId) {
                    setJobs(prev => prev.map(j => (j._id === jobId || j.id === jobId) ? saved : j));
                } else {
                    setJobs(prev => [...prev, saved]);
                }
                setShowModal(false);
                setEditingJob(null);
                setFormData({
                    title: '', department: '', type: 'Full-time', location: 'Colombo, Sri Lanka', description: '', requirements: ''
                });
            }
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this job post?")) return;
        try {
            await fetch(`http://localhost:3000/jobs/${id}`, { method: 'DELETE' });
            fetchJobs();
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setFormData({
            title: job.title,
            department: job.department,
            type: job.type,
            location: job.location,
            description: job.description,
            requirements: job.requirements.join('\n')
        });
        setShowModal(true);
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await fetch(`http://localhost:3000/jobs/applications/${appId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            // Update local state
            setApplications(applications.map(app => app._id === appId ? { ...app, status: newStatus } : app));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Careers Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage job postings and applications</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setEditingJob(null); }}
                    className="bg-[#696cff] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5f62e6] transition-colors"
                >
                    <Plus size={18} /> Post New Job
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Jobs List */}
                <div className={`space-y-4 ${selectedJobApplications ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
                    {jobs.map((job) => (
                        <div key={job._id} className={`bg-white p-6 rounded-xl shadow-sm border ${selectedJobApplications === job._id ? 'border-[#696cff] ring-1 ring-[#696cff]' : 'border-gray-100'} cursor-pointer hover:shadow-md transition-all`}
                            onClick={() => fetchApplications(job._id)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.department} • {job.type}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(job); }} className="p-2 text-gray-400 hover:text-[#696cff] hover:bg-[#696cff]/10 rounded-lg">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(job._id); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded font-medium ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {job.status}
                                </span>
                                <span className="text-xs text-[#696cff] font-medium flex items-center gap-1 group">
                                    View Applications <Users size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Applications Panel */}
                {selectedJobApplications && (
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h3 className="font-bold text-gray-800">Applications</h3>
                            <button onClick={() => setSelectedJobApplications(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {applications.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">No applications yet.</div>
                            ) : (
                                applications.map((app) => (
                                    <div key={app._id} className="border border-gray-100 rounded-lg p-4 bg-white hover:border-[#696cff]/30 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{app.name}</h4>
                                                <p className="text-sm text-gray-500">{app.email} • {app.phone}</p>
                                            </div>
                                            <div className="relative group">
                                                <button className={`px-3 py-1 rounded text-xs font-medium ${app.status === 'Hired' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {app.status}
                                                </button>
                                                {/* Status Dropdown */}
                                                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block z-10">
                                                    {['Pending', 'Reviewed', 'Interview', 'Hired', 'Rejected'].map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleStatusUpdate(app._id, status)}
                                                            className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700"
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-2">
                                            <span className="block text-xs uppercase text-gray-400 font-bold mb-1">Cover Letter</span>
                                            {app.coverLetter}
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>Experience: {app.resume || 'Not specified'}</span>
                                            <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {app.portfolio && (
                                            <div className="mt-2">
                                                <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="text-xs text-[#696cff] hover:underline">
                                                    View Resume/Portfolio →
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveJob} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#696cff]"
                                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#696cff]"
                                        value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                                        <option value="">Select Department</option>
                                        <option value="Front Office">Front Office</option>
                                        <option value="Housekeeping">Housekeeping</option>
                                        <option value="Food & Beverage">Food & Beverage</option>
                                        <option value="Kitchen">Kitchen</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Security">Security</option>
                                        <option value="Spa & Wellness">Spa & Wellness</option>
                                        <option value="Recreation">Recreation</option>
                                        <option value="Administration">Administration</option>
                                        <option value="Human Resources">Human Resources</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="IT">IT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#696cff]"
                                        value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Internship</option>
                                        <option>Contract</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#696cff]"
                                    value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required rows="4" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#696cff]"
                                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                                <textarea rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#696cff]"
                                    value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}></textarea>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-[#696cff] text-white rounded-lg hover:bg-[#5f62e6]">Save Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;
