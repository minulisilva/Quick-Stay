import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Award as AwardIcon, Trophy, Medal, Star } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const Awards = () => {
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        organization: '',
        year: new Date().getFullYear(),
        category: '',
        description: '',
        image: '',
        displayOrder: 0,
        visible: true
    });

    useEffect(() => {
        fetchAwards();
    }, []);

    const fetchAwards = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            if (!token) {
                setLoading(false);
                return;
            }

            const res = await fetch('http://localhost:3000/awards?all=true', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) {
                localStorage.removeItem('quickstay_admin_token');
                window.location.href = '/login';
                return;
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                // Ensure sorting is applied on fetch
                const sortedData = [...data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
                setAwards(sortedData);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching awards:", err);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const url = editingId
            ? `http://localhost:3000/awards/${editingId}`
            : 'http://localhost:3000/awards';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to save award');

            const saved = await res.json();

            // Re-fetch to ensure database logic and ordering are perfectly synced
            await fetchAwards();
            closeModal();
        } catch (error) {
            console.error("Error saving award:", error);
            alert("Failed to save award. Please check your connection and try again.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this award? This action cannot be undone.")) return;
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`http://localhost:3000/awards/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setAwards(prev => prev.filter(a => a._id !== id));
            }
        } catch (error) {
            console.error("Error deleting award:", error);
        }
    };

    const toggleVisibility = async (id, currentVisibility) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`http://localhost:3000/awards/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ visible: !currentVisibility })
            });
            if (res.ok) {
                setAwards(prev => prev.map(a => a._id === id ? { ...a, visible: !currentVisibility } : a));
            }
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({
            title: '',
            organization: '',
            year: new Date().getFullYear(),
            category: '',
            description: '',
            image: '',
            displayOrder: awards.length > 0 ? Math.max(...awards.map(a => a.displayOrder || 0)) + 1 : 0,
            visible: true
        });
        setIsModalOpen(true);
    };

    const openEditModal = (award) => {
        setEditingId(award._id);
        setFormData({
            title: award.title || '',
            organization: award.organization || '',
            year: award.year || new Date().getFullYear(),
            category: award.category || '',
            description: award.description || '',
            image: award.image || '',
            displayOrder: typeof award.displayOrder === 'number' ? award.displayOrder : 0,
            visible: award.visible !== false
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Awards & Recognition</h1>
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-[#696cff] text-white rounded-lg hover:bg-[#5f62e6]">
                    <Plus size={20} /> Add Award
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600 text-sm">Image</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Title</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Organization</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Year</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Category</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Order</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Visible</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {awards.map((award) => (
                                <tr key={award._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        {award.image ? (
                                            <img src={award.image} alt={award.title} className="w-12 h-12 object-cover rounded-lg" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Trophy size={20} className="text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800 text-sm">{award.title}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{award.organization}</td>
                                    <td className="p-4 text-sm text-gray-600 font-mono">{award.year}</td>
                                    <td className="p-4 text-sm text-gray-500">{award.category || '-'}</td>
                                    <td className="p-4 text-sm text-gray-600 font-mono">{award.displayOrder}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleVisibility(award._id, award.visible)}
                                            className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${award.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {award.visible ? 'Visible' : 'Hidden'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(award)} className="p-1 text-gray-400 hover:text-[#696cff] hover:bg-gray-100 rounded" title="Edit">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(award._id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {awards.length === 0 && !loading && <tr><td colSpan="8" className="p-8 text-center text-gray-500">No awards found. Add your first award!</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Award' : 'Add New Award'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title *</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Organization *</label>
                                    <input required type="text" value={formData.organization} onChange={e => setFormData({ ...formData, organization: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year *</label>
                                    <input required type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                    <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" placeholder="e.g., Hospitality" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Display Order</label>
                                    <input type="number" value={formData.displayOrder} onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" rows="3" placeholder="Brief description of the award..." />
                            </div>
                            <div>
                                <ImageUpload
                                    label="Award Image"
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
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="visible"
                                    checked={formData.visible}
                                    onChange={e => setFormData({ ...formData, visible: e.target.checked })}
                                    className="w-4 h-4 text-[#696cff] border-gray-300 rounded focus:ring-[#696cff]"
                                />
                                <label htmlFor="visible" className="text-sm text-gray-700 font-medium">Display on public Awards page</label>
                            </div>
                            <div className="pt-4 flex gap-3 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-[#696cff] text-white rounded-lg font-medium hover:bg-[#5f62e6]">Save Award</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Awards;
