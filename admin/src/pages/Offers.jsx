import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Clock, Tag, Percent, Eye, Calendar, Layout } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const Offers = () => {
    const [activeTab, setActiveTab] = useState('reservations');
    const [offers, setOffers] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', desc: '', img: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [offersRes, resRes] = await Promise.all([
                fetch('http://localhost:3000/offers', { headers }),
                fetch('http://localhost:3000/offerReservations', { headers })
            ]);
            const offersData = await offersRes.json();
            const resData = await resRes.json();

            setOffers(offersData);
            setReservations(resData.reverse());
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setLoading(false);
        }
    };

    // Reservation Actions
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch(`http://localhost:3000/offerReservations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            setReservations(reservations.map(r => r._id === id ? { ...r, status: newStatus } : r));
            if (selectedReservation && selectedReservation._id === id) {
                setSelectedReservation({ ...selectedReservation, status: newStatus });
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Offer Actions
    const handleSave = async (e) => {
        e.preventDefault();
        const url = editingId
            ? `http://localhost:3000/offers/${editingId}`
            : 'http://localhost:3000/offers';
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
            const saved = await res.json();

            if (editingId) {
                setOffers(offers.map(o => o._id === editingId ? saved : o));
            } else {
                setOffers([...offers, saved]);
            }
            closeModal();
        } catch (error) {
            console.error("Error saving offer:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this offer?")) return;
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch(`http://localhost:3000/offers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOffers(offers.filter(o => o._id !== id));
        } catch (error) {
            console.error("Error deleting offer:", error);
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ title: '', desc: '', img: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (offer) => {
        setEditingId(offer._id);
        setFormData({ title: offer.title, desc: offer.desc, img: offer.img });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Special Offers</h1>
                {activeTab === 'offers' && (
                    <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-[#696cff] text-white rounded-lg hover:bg-[#5f62e6]">
                        <Plus size={20} /> Add Offer
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'reservations' ? 'text-[#696cff]' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('reservations')}
                >
                    Reservations
                    {activeTab === 'reservations' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#696cff]"></div>}
                </button>
                <button
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'offers' ? 'text-[#696cff]' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('offers')}
                >
                    Manage Offers
                    {activeTab === 'offers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#696cff]"></div>}
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {activeTab === 'reservations' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-semibold text-gray-600 text-sm">ID</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Guest</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Offer</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reservations.map((res) => (
                                    <tr key={res._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-xs text-gray-500 font-mono">#{res.id || res._id}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800 text-sm">{res.guestName}</div>
                                            <div className="text-xs text-gray-500">{res.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-2">
                                                <Tag size={14} className="text-[#696cff]" /> {res.offer}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{res.date}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex w-fit items-center gap-1 
                                                ${res.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                    res.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {res.status === 'Pending' && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(res._id, 'Confirmed')} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Confirm">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(res._id, 'Cancelled')} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Cancel">
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        console.log("View clicked for:", res);
                                                        setSelectedReservation(res);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-[#696cff] hover:bg-gray-100 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {reservations.length === 0 && !loading && <tr><td colSpan="6" className="p-8 text-center text-gray-500">No reservations found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'offers' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offers.map(offer => (
                            <div key={offer._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
                                <div className="h-40 overflow-hidden relative group shrink-0">
                                    <img src={offer.img} alt={offer.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button onClick={() => setSelectedOffer(offer)} className="p-2 bg-white/90 text-[#696cff] rounded-full shadow hover:bg-gray-50" title="View"><Eye size={14} /></button>
                                        <button onClick={() => openEditModal(offer)} className="p-2 bg-white/90 text-gray-700 rounded-full shadow hover:text-[#696cff]" title="Edit"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(offer._id)} className="p-2 bg-white/90 text-red-500 rounded-full shadow hover:text-red-700" title="Delete"><Trash2 size={14} /></button>
                                    </div>

                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">{offer.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{offer.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Offer' : 'Add New Offer'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><Clock className="rotate-45" size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea required value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" rows="4" />
                            </div>
                            <div>
                                <ImageUpload
                                    label="Offer Image"
                                    currentImage={formData.img}
                                    onUploadSuccess={(url) => setFormData({ ...formData, img: url })}
                                />
                                <input
                                    type="text"
                                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1 text-[10px] text-gray-400 outline-none"
                                    value={formData.img}
                                    onChange={e => setFormData({ ...formData, img: e.target.value })}
                                    placeholder="Or paste URL here..."
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeModal} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-[#696cff] text-white rounded-lg font-medium hover:bg-[#5f62e6]">Save Offer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Reservation Modal */}
            {/* View Reservation Modal */}
            {selectedReservation && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Reservation Details</h3>
                            <button onClick={() => setSelectedReservation(null)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="rotate-45" size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Reservation ID</label>
                                    <div className="text-gray-800 font-medium font-mono">#{selectedReservation.id || selectedReservation._id}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                                    <div className={`text-sm font-bold 
                                        ${selectedReservation.status === 'Confirmed' ? 'text-green-600' :
                                            selectedReservation.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {selectedReservation.status}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Guest Information</label>
                                <div className="text-gray-800 font-medium text-lg">{selectedReservation.guestName}</div>
                                <div className="text-gray-500">{selectedReservation.email}</div>
                                <div className="text-gray-500">{selectedReservation.phone}</div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <label className="text-xs font-bold text-gray-400 uppercase">Offer Details</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Tag size={16} className="text-[#696cff]" />
                                    <span className="font-bold text-gray-800">{selectedReservation.offer}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-gray-600">
                                    <Calendar size={16} />
                                    <span>{selectedReservation.date}</span>
                                </div>
                                {selectedReservation.amount > 0 && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        Amount: <strong>${selectedReservation.amount}</strong>
                                    </div>
                                )}
                            </div>

                            {selectedReservation.status === 'Pending' && (
                                <div className="pt-4 flex gap-3 border-t border-gray-100 mt-2">
                                    <button
                                        onClick={() => { handleStatusUpdate(selectedReservation._id, 'Confirmed'); setSelectedReservation(null); }}
                                        className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => { handleStatusUpdate(selectedReservation._id, 'Cancelled'); setSelectedReservation(null); }}
                                        className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* View Offer Modal */}
            {selectedOffer && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="relative h-64 overflow-hidden">
                            <img src={selectedOffer.img} alt={selectedOffer.title} className="w-full h-full object-cover" />
                            <button
                                onClick={() => setSelectedOffer(null)}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-2xl font-bold text-white">{selectedOffer.title}</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Description</label>
                                <p className="text-gray-600 leading-relaxed">{selectedOffer.desc}</p>
                            </div>



                            <div className="pt-2">
                                <button
                                    onClick={() => {
                                        const offer = selectedOffer;
                                        setSelectedOffer(null);
                                        openEditModal(offer);
                                    }}
                                    className="w-full py-3 bg-[#696cff] text-white rounded-lg font-bold hover:bg-[#5f62e6] transition-all shadow-lg shadow-[#696cff]/20 flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={18} /> Edit Offer Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Offers;
