import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BedDouble, Users, Wifi, X, Save } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRoomId, setEditingRoomId] = useState(null);

    // Initial Room State Template
    const initialRoomState = {
        name: '',
        price: '',
        description: '',
        shortDescription: '',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3870&auto=format&fit=crop',
        size: '',
        occupancy: {
            adults: 2,
            children: 1
        },
        amenities: '', // Will be stored as comma-separated string in form
        gallery: '',   // Will be stored as comma-separated string in form
        isAvailable: true
    };

    const [newRoom, setNewRoom] = useState(initialRoomState);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const response = await fetch('http://localhost:3000/rooms', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setRooms(data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setEditingRoomId(null);
        setNewRoom(initialRoomState);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (room) => {
        setIsEditing(true);
        setEditingRoomId(room.id || room._id);
        setNewRoom({
            ...room,
            amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
            gallery: Array.isArray(room.gallery) ? room.gallery.join(', ') : '',
            occupancy: {
                adults: room.occupancy?.adults || 2,
                children: room.occupancy?.children || 0
            }
        });
        setIsModalOpen(true);
    };

    const handleSaveRoom = async (e) => {
        e.preventDefault();
        try {
            const roomData = {
                ...newRoom,
                price: Number(newRoom.price),
                amenities: newRoom.amenities.split(',').map(item => item.trim()).filter(Boolean),
                gallery: newRoom.gallery.split(',').map(item => item.trim()).filter(Boolean),
                occupancy: {
                    adults: Number(newRoom.occupancy.adults),
                    children: Number(newRoom.occupancy.children)
                }
            };

            const token = localStorage.getItem('quickstay_admin_token');
            const url = isEditing
                ? `http://localhost:3000/rooms/${editingRoomId}`
                : 'http://localhost:3000/rooms';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(roomData)
            });

            if (response.ok) {
                const savedData = await response.json();
                if (isEditing) {
                    setRooms(rooms.map(r => r._id === editingRoomId ? savedData : r));
                } else {
                    setRooms([...rooms, savedData]);
                }
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error saving room:", error);
        }
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch(`http://localhost:3000/rooms/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRooms(rooms.filter(r => r._id !== id));
        } catch (error) {
            console.error("Error deleting room:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-[#696cff] text-white rounded-lg text-sm font-medium hover:bg-[#5f62e6] transition-colors"
                >
                    <Plus size={18} />
                    Add Room
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading rooms...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="relative h-48 overflow-hidden">
                                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${room.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {room.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{room.name}</h3>
                                <div className="text-[#696cff] font-bold text-xl mb-3">${room.price} <span className="text-gray-400 text-sm font-normal">/ night</span></div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{room.shortDescription || room.description}</p>

                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 border-t border-gray-50 pt-4">
                                    <div className="flex items-center gap-1"><Users size={14} /> {room.occupancy?.adults + room.occupancy?.children || room.capacity} Pers.</div>
                                    <div className="flex items-center gap-1"><BedDouble size={14} /> {room.size}</div>
                                    <div className="flex items-center gap-1"><Wifi size={14} /> WiFi</div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenEditModal(room)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#696cff] transition-colors"
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRoom(room._id)}
                                        className="flex items-center justify-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Room Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                            <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Room' : 'Add New Room'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveRoom} className="p-6 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Room Name</label>
                                    <input
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff] outline-none text-sm"
                                        value={newRoom.name}
                                        onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
                                        placeholder="e.g. Deluxe Suite"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price ($)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff] outline-none text-sm"
                                            value={newRoom.price}
                                            onChange={e => setNewRoom({ ...newRoom, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Size</label>
                                        <input
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff] outline-none text-sm"
                                            value={newRoom.size}
                                            onChange={e => setNewRoom({ ...newRoom, size: e.target.value })}
                                            placeholder="e.g. 45 SQM"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Adults</label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff] outline-none text-sm"
                                            value={newRoom.occupancy.adults}
                                            onChange={e => setNewRoom({ ...newRoom, occupancy: { ...newRoom.occupancy, adults: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Children</label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff] outline-none text-sm"
                                            value={newRoom.occupancy.children}
                                            onChange={e => setNewRoom({ ...newRoom, occupancy: { ...newRoom.occupancy, children: e.target.value } })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Availability</label>
                                    <button
                                        type="button"
                                        onClick={() => setNewRoom({ ...newRoom, isAvailable: !newRoom.isAvailable })}
                                        className={`w-full py-2 rounded-lg text-sm font-bold border transition-colors ${newRoom.isAvailable ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'}`}
                                    >
                                        {newRoom.isAvailable ? 'Currently Available' : 'Marked Unavailable'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <ImageUpload
                                    label="Main Image"
                                    currentImage={newRoom.image}
                                    onUploadSuccess={(url) => setNewRoom({ ...newRoom, image: url })}
                                />
                                <input
                                    type="text"
                                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1 text-[10px] text-gray-400 outline-none"
                                    value={newRoom.image}
                                    onChange={e => setNewRoom({ ...newRoom, image: e.target.value })}
                                    placeholder="Or paste URL here..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Short Description (Summary)</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff] outline-none text-sm"
                                    value={newRoom.shortDescription}
                                    onChange={e => setNewRoom({ ...newRoom, shortDescription: e.target.value })}
                                    placeholder="Quick 1-sentence summary"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Description</label>
                                <textarea
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff] outline-none text-sm"
                                    rows="3"
                                    value={newRoom.description}
                                    onChange={e => setNewRoom({ ...newRoom, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amenities (comma separated)</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#696cff]/20 focus:border-[#696cff] outline-none text-sm"
                                        rows="2"
                                        value={newRoom.amenities}
                                        onChange={e => setNewRoom({ ...newRoom, amenities: e.target.value })}
                                        placeholder="Free Wi-Fi, Smart TV, Mini Bar..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gallery Images</label>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(newRoom.gallery ? (typeof newRoom.gallery === 'string' ? newRoom.gallery.split(',') : newRoom.gallery) : []).map((url, index) => (
                                            url.trim() && (
                                                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100 group">
                                                    <img src={url.trim()} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const currentGallery = typeof newRoom.gallery === 'string' ? newRoom.gallery.split(',') : newRoom.gallery;
                                                            const filtered = currentGallery.filter((_, i) => i !== index);
                                                            setNewRoom({ ...newRoom, gallery: filtered.join(', ') });
                                                        }}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                    <ImageUpload
                                        label="Add Gallery Image"
                                        onUploadSuccess={(url) => {
                                            if (!url) return;
                                            const currentGallery = typeof newRoom.gallery === 'string' ? newRoom.gallery.split(',').map(s => s.trim()).filter(Boolean) : (newRoom.gallery || []);
                                            setNewRoom({ ...newRoom, gallery: [...currentGallery, url].join(', ') });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2 bg-[#696cff] text-white rounded-lg font-bold hover:bg-[#5f62e6] flex items-center gap-2 shadow-lg shadow-[#696cff]/20 transition-all"
                                >
                                    <Save size={18} />
                                    {isEditing ? 'Update Room' : 'Add Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
