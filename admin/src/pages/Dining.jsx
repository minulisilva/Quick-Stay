import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Clock, Utensils, Calendar, Eye } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { useAdminAuth } from '../context/AdminAuthContext';

const Dining = () => {
    const { admin } = useAdminAuth();
    const [activeTab, setActiveTab] = useState('reservations'); // 'reservations' or 'venues'

    // State for Reservations
    const [reservations, setReservations] = useState([]);
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    // State for Dining Venues
    const [venues, setVenues] = useState([]);
    const [loadingVenues, setLoadingVenues] = useState(true);

    // Modal State for Venues
    const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
    const [editingVenueId, setEditingVenueId] = useState(null);
    const [venueFormData, setVenueFormData] = useState({
        name: '',
        cuisine: '',
        description: '',
        features: '', // Comma separated string for input
        image: ''
    });

    // Fetch Data
    useEffect(() => {
        fetchReservations();
        fetchVenues();
    }, []);

    const fetchReservations = async () => {
        setFetchError(null);
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch('http://localhost:3000/diningReservations/admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (Array.isArray(data)) {
                setReservations([...data].reverse());
            } else {
                console.error("Failed to fetch reservations - not an array:", data);
                setFetchError(data.message || "Failed to load reservations data.");
                setReservations([]);
            }
            setLoadingReservations(false);
        } catch (err) {
            console.error("Error fetching reservations:", err);
            setFetchError("Network error. Please check if the server is running.");
            setLoadingReservations(false);
        }
    };

    const fetchVenues = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch('http://localhost:3000/diningOptions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setVenues(Array.isArray(data) ? data : []);
            setLoadingVenues(false);
        } catch (err) {
            console.error("Error fetching venues:", err);
            setLoadingVenues(false);
        }
    };

    // Reservation Handlers
    const handleStatusUpdate = async (reservationId, newStatus) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`http://localhost:3000/diningReservations/${reservationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');

            // Sync both table list and currently selected item
            setReservations(prev => prev.map(r => (r._id === reservationId || r.id === reservationId) ? { ...r, status: newStatus } : r));

            if (selectedReservation && (selectedReservation._id === reservationId || selectedReservation.id === reservationId)) {
                setSelectedReservation(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error("Error updating reservation status:", error);
        }
    };

    // Venue Handlers
    const handleSaveVenue = async (e) => {
        e.preventDefault();
        console.log('Saving venue:', venueFormData, 'ID:', editingVenueId);
        
        const venueData = {
            ...venueFormData,
            features: venueFormData.features ? venueFormData.features.split(',').map(f => f.trim()) : []
        };

        const url = editingVenueId
            ? `http://localhost:3000/diningOptions/${editingVenueId}`
            : 'http://localhost:3000/diningOptions';

        const method = editingVenueId ? 'PUT' : 'POST';

        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(venueData)
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const saved = await res.json();
            console.log('Saved venue:', saved);

            if (editingVenueId) {
                setVenues(venues.map(v => (v._id || v.id) === editingVenueId ? saved : v));
            } else {
                setVenues([...venues, saved]);
            }
            closeVenueModal();
        } catch (error) {
            console.error("Error saving venue:", error);
            alert('Failed to save venue: ' + error.message);
        }
    };

    const handleDeleteVenue = async (id) => {
        if (!window.confirm("Are you sure you want to delete this dining venue?")) return;
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch(`http://localhost:3000/diningOptions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setVenues(venues.filter(v => v._id !== id));
        } catch (error) {
            console.error("Error deleting venue:", error);
        }
    };

    const openAddVenueModal = () => {
        setEditingVenueId(null);
        setVenueFormData({ name: '', cuisine: '', description: '', features: '', image: '' });
        setIsVenueModalOpen(true);
    };

    const openEditVenueModal = (venue) => {
        console.log('Editing venue:', venue);
        setEditingVenueId(venue._id || venue.id);
        setVenueFormData({
            name: venue.name || '',
            cuisine: venue.cuisine || '',
            description: venue.description || '',
            features: Array.isArray(venue.features) ? venue.features.join(', ') : (venue.features || ''),
            image: venue.image || ''
        });
        setIsVenueModalOpen(true);
    };

    const closeVenueModal = () => {
        setIsVenueModalOpen(false);
        setEditingVenueId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dining Management</h1>
                {activeTab === 'venues' && (
                    <button
                        onClick={openAddVenueModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#696cff] text-white rounded-lg hover:bg-[#5f62e6] transition-colors"
                    >
                        <Plus size={20} />
                        Add New Venue
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
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'venues' ? 'text-[#696cff]' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('venues')}
                >
                    Dining Venues
                    {activeTab === 'venues' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#696cff]"></div>}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">

                {/* Reservations Tab */}
                {activeTab === 'reservations' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-semibold text-gray-600 text-sm">ID</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Guest</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Restaurant</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Date & Time</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Guests</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-xs text-gray-500 font-mono">#{res.id}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800 text-sm">{res.guestName}</div>
                                            <div className="text-xs text-gray-500">{res.phone}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{res.restaurant}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div>{res.date}</div>
                                            <div className="text-xs text-gray-400">{res.time}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{res.guests} ppl</td>
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
                                                        <button onClick={() => handleStatusUpdate(res.id, 'Confirmed')} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Confirm">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(res.id, 'Cancelled')} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Cancel">
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setSelectedReservation(res)}
                                                    className="p-1 text-gray-400 hover:text-[#696cff] hover:bg-gray-100 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {fetchError && (
                                    <tr><td colSpan="7" className="p-8 text-center text-red-500 font-medium">Error: {fetchError}</td></tr>
                                )}
                                {reservations.length === 0 && !loadingReservations && !fetchError && (
                                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">No reservations found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Venues Tab */}
                {activeTab === 'venues' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues && Array.isArray(venues) ? venues.map(venue => (
                            <div key={venue._id || venue.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
                                <div className="h-40 overflow-hidden relative group">
                                    <img src={venue.image} alt={venue.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button onClick={() => openEditVenueModal(venue)} className="p-2 bg-white/90 text-gray-700 rounded-full shadow hover:text-[#696cff]"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDeleteVenue(venue._id || venue.id)} className="p-2 bg-white/90 text-red-500 rounded-full shadow hover:text-red-700"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-gray-800">{venue.name}</h3>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{venue.cuisine}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2">{venue.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {(venue.features && Array.isArray(venue.features) ? venue.features : []).slice(0, 3).map((f, i) => (
                                            <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                {loadingVenues ? 'Loading venues...' : 'No dining venues found.'}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Venue Modal */}
            {isVenueModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">{editingVenueId ? 'Edit Dining Venue' : 'Add New Dining Venue'}</h3>
                            <button onClick={closeVenueModal} className="text-gray-400 hover:text-gray-600"><Clock className="rotate-45" size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveVenue} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Venue Name</label>
                                <input required type="text" value={venueFormData.name} onChange={e => setVenueFormData({ ...venueFormData, name: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" placeholder="e.g. Ocean Grill" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cuisine</label>
                                <input required type="text" value={venueFormData.cuisine} onChange={e => setVenueFormData({ ...venueFormData, cuisine: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" placeholder="e.g. Seafood" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea required value={venueFormData.description} onChange={e => setVenueFormData({ ...venueFormData, description: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" rows="3" placeholder="Description..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Features (comma separated)</label>
                                <input type="text" value={venueFormData.features} onChange={e => setVenueFormData({ ...venueFormData, features: e.target.value })} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff]" placeholder="e.g. Ocean View, Live Music, Vegan Options" />
                            </div>
                            <div>
                                <ImageUpload
                                    label="Venue Image"
                                    currentImage={venueFormData.image}
                                    onUploadSuccess={(url) => setVenueFormData({ ...venueFormData, image: url })}
                                />
                                <input
                                    type="text"
                                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1 text-[10px] text-gray-400 outline-none"
                                    value={venueFormData.image}
                                    onChange={e => setVenueFormData({ ...venueFormData, image: e.target.value })}
                                    placeholder="Or paste URL here..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeVenueModal} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-[#696cff] text-white rounded-lg font-medium hover:bg-[#5f62e6]">Save Venue</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Reservation Modal */}
            {selectedReservation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
                                    <div className="text-gray-800 font-medium font-mono">#{selectedReservation.id}</div>
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
                                <label className="text-xs font-bold text-gray-400 uppercase">Dining Details</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Utensils size={16} className="text-[#696cff]" />
                                    <span className="font-bold text-gray-800">{selectedReservation.restaurant}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-gray-600">
                                    <Calendar size={16} />
                                    <span>{selectedReservation.date} at {selectedReservation.time}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Party Size: <strong>{selectedReservation.guests} People</strong>
                                </div>
                            </div>

                            {selectedReservation.status === 'Pending' && (
                                <div className="pt-4 flex gap-3 border-t border-gray-100 mt-2">
                                    <button
                                        onClick={() => { handleStatusUpdate(selectedReservation.id, 'Confirmed'); setSelectedReservation(null); }}
                                        className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => { handleStatusUpdate(selectedReservation.id, 'Cancelled'); setSelectedReservation(null); }}
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
        </div>
    );
};

export default Dining;
