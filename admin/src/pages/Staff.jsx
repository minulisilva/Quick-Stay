import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Link as LinkIcon, Linkedin, Twitter, Instagram, Save } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        image: '',
        socials: {
            linkedin: '',
            twitter: '',
            instagram: ''
        },
        order: 0,
        displayOnAbout: false
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await fetch('http://localhost:3000/staff');
            const data = await response.json();
            setStaff(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching staff:', error);
            setLoading(false);
        }
    };

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                role: member.role,
                bio: member.bio || '',
                image: member.image,
                socials: {
                    linkedin: member.socials?.linkedin || '',
                    twitter: member.socials?.twitter || '',
                    instagram: member.socials?.instagram || ''
                },
                order: member.order || 0,
                displayOnAbout: member.displayOnAbout || false
            });
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                role: '',
                bio: '',
                image: '',
                socials: { linkedin: '', twitter: '', instagram: '' },
                order: 0,
                displayOnAbout: false
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('quickstay_admin_token');
        const url = editingMember
            ? `http://localhost:3000/staff/${editingMember._id}`
            : 'http://localhost:3000/staff';
        const method = editingMember ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchStaff();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error saving staff member:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this staff member?')) return;

        const token = localStorage.getItem('quickstay_admin_token');
        try {
            const response = await fetch(`http://localhost:3000/staff/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchStaff();
            }
        } catch (error) {
            console.error('Error deleting staff member:', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Staff...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#696cff] text-white px-4 py-2 rounded-lg hover:bg-[#5f62e6] transition-colors font-medium"
                >
                    <Plus size={18} />
                    Add Staff Member
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600 text-sm">Member</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Role</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Bio</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Visibility</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Socials</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {staff.map((member) => (
                                <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">{member.name}</div>
                                                <div className="text-xs text-gray-400">Order: {member.order}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 font-medium">{member.role}</td>
                                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{member.bio}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${member.displayOnAbout ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {member.displayOnAbout ? 'Public' : 'Private'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 text-gray-400">
                                            {member.socials?.linkedin && <Linkedin size={16} />}
                                            {member.socials?.twitter && <Twitter size={16} />}
                                            {member.socials?.instagram && <Instagram size={16} />}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(member)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member._id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingMember ? 'Edit Staff Member' : 'Add New Staff Member'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff]"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff]"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="General Manager"
                                    />
                                </div>
                            </div>

                            <div>
                                <ImageUpload
                                    label="Staff Image"
                                    currentImage={formData.image}
                                    onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                                />
                                <input
                                    type="text"
                                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1 text-[10px] text-gray-400 outline-none"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="Or paste URL here..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Biography</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff] h-24 resize-none"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Brief background of the staff member..."
                                />
                            </div>

                            <div className="border-t border-gray-50 pt-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700">Display on About Us Page</label>
                                        <p className="text-xs text-gray-500 mt-1">Show this member in the "Meet Our Leadership" section</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, displayOnAbout: !formData.displayOnAbout })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.displayOnAbout ? 'bg-[#696cff]' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.displayOnAbout ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-50 pt-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Linkedin size={14} className="text-[#0077b5]" /> LinkedIn
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff]"
                                        value={formData.socials.linkedin}
                                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })}
                                        placeholder="Username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Twitter size={14} className="text-[#1da1f2]" /> Twitter
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff]"
                                        value={formData.socials.twitter}
                                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })}
                                        placeholder="Username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Instagram size={14} className="text-[#e1306c]" /> Instagram
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff]"
                                        value={formData.socials.instagram}
                                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                                        placeholder="Username"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-8 py-2.5 bg-[#696cff] text-white rounded-lg hover:bg-[#5f62e6] transition-colors font-bold shadow-lg shadow-[#696cff]/20"
                                >
                                    <Save size={18} />
                                    {editingMember ? 'Update Member' : 'Save Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
