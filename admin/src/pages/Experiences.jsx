import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Sparkles } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const Experiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: '',
        inclusions: '', // Comma separated
        image: ''
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch('http://localhost:3000/experiences', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }

            const data = await res.json();
            setExperiences(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching experiences:", err);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const inclusions = formData.inclusions.split(',').map(f => f.trim()).filter(f => f !== "");

        const dataToSend = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            inclusions
        };

        const currentId = editingId;
        const url = currentId
            ? `http://localhost:3000/experiences/${currentId}`
            : 'http://localhost:3000/experiences';

        const method = currentId ? 'PUT' : 'POST';

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

            if (!res.ok) throw new Error('Save failed');

            const saved = await res.json();

            // Sync state robustly using both _id and id fallbacks
            if (currentId) {
                setExperiences(prev => prev.map(ex => (ex._id === currentId || ex.id === currentId) ? saved : ex));
            } else {
                setExperiences(prev => [...prev, saved]);
            }
            closeModal();
        } catch (error) {
            console.error("Error saving experience:", error);
            alert("Failed to save experience. Please ensure you are logged in.");
        }
    };

    const handleDelete = async (idToDelete) => {
        if (!window.confirm("Are you sure you want to delete this experience?")) return;
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`http://localhost:3000/experiences/${idToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setExperiences(prev => prev.filter(ex => ex._id !== idToDelete && ex.id !== idToDelete));
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', price: '', duration: '', category: '', inclusions: '', image: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (exp) => {
        setEditingId(exp._id || exp.id);
        setFormData({
            name: exp.name || '',
            description: exp.description || '',
            price: exp.price || '',
            duration: exp.duration || '',
            category: exp.category || '',
            inclusions: Array.isArray(exp.inclusions) ? exp.inclusions.join(', ') : (exp.inclusions || ''),
            image: exp.image || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading experiences...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Experiences CMS</h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-[#696cff] text-white px-4 py-2 rounded-lg hover:bg-[#5f62e6] transition-all"
                >
                    <Plus size={20} /> Add Experience
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((exp) => (
                    <div key={exp._id || exp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 relative bg-gray-100">
                            {exp.image ? (
                                <img src={exp.image} alt={exp.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400?text=Experience+Image"; }} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Sparkles size={48} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => openEditModal(exp)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-gray-600 hover:text-[#696cff]">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(exp._id || exp.id)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-gray-600 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{exp.name}</h3>
                                <p className="text-xs font-bold text-[#696cff] uppercase tracking-wider">${exp.price} • {exp.duration}</p>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{exp.description}</p>
                            <div className="pt-2 flex flex-wrap gap-2">
                                {(exp.inclusions || []).map((f, i) => (
                                    <span key={i} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                        <Sparkles size={8} /> {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Experience' : 'Add New Experience'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><Clock className="rotate-45" size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" placeholder="e.g. Scuba Diving" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" placeholder="150" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                                    <input required type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" placeholder="2 hours" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]">
                                    <option value="">Select Category</option>
                                    <option value="Wellness">Wellness</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Culinary">Culinary</option>
                                    <option value="Nature">Nature</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" rows="4" placeholder="Description..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inclusions (comma separated)</label>
                                <input type="text" value={formData.inclusions} onChange={e => setFormData({ ...formData, inclusions: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" placeholder="e.g. Equipment, Guide, Refreshments" />
                            </div>
                            <div>
                                <ImageUpload
                                    label="Experience Image"
                                    currentImage={formData.image}
                                    onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                                />
                                <input
                                    type="text"
                                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1 text-[10px] text-gray-400 outline-none"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="Or paste URL here..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeModal} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-[#696cff] text-white rounded-lg font-medium hover:bg-[#5f62e6]">Save Experience</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Experiences;
