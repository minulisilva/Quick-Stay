import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MoreVertical, FileText, Trash2, Eye, MapPin, Calendar, Utensils, XCircle } from 'lucide-react';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userStats, setUserStats] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            fetchUserStats();
        }
    }, [users]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch('http://localhost:3000/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const [bookingsRes, diningRes, offersRes] = await Promise.all([
                fetch('http://localhost:3000/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3000/diningReservations', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3000/offerReservations', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            
            const [bookings, dining, offers] = await Promise.all([
                bookingsRes.json(),
                diningRes.json(), 
                offersRes.json()
            ]);

            const stats = {};
            
            // Calculate stats for each user
            users.forEach(user => {
                const userBookings = bookings.filter(b => b.email === user.email);
                const userDining = dining.filter(d => d.email === user.email);
                const userOffers = offers.filter(o => o.email === user.email);
                
                const totalStays = userBookings.length;
                const totalSpent = userBookings.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0) +
                                 userOffers.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
                
                stats[user._id] = { totalStays, totalSpent };
            });
            
            setUserStats(stats);
        } catch (err) {
            console.error("Error fetching user stats:", err);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600 text-sm py-4">User</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm py-4">Contact</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm py-4">About</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm py-4">Preferences</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm py-4 text-center">History</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#696cff]/10 text-[#696cff] flex items-center justify-center font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">{user.name}</div>
                                                <div className="text-[10px] text-gray-400 font-mono">ID: {String(user._id || '').substring(0, 8)}...</div>
                                                <span className={`mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                            <Mail size={12} className="text-gray-400" /> {user.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <Phone size={12} className="text-gray-400" /> {user.phone || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs text-gray-600 space-y-1">
                                            {user.dob && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} className="text-gray-400" />
                                                    {new Date(user.dob).toLocaleDateString()}
                                                </div>
                                            )}
                                            {(user.city || user.country) && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} className="text-gray-400" />
                                                    {user.city}{user.city && user.country ? ', ' : ''}{user.country}
                                                </div>
                                            )}
                                            {!user.dob && !user.city && !user.country && <span className="text-gray-300 italic">No details</span>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="max-w-[150px] space-y-1">
                                            {user.dietaryPreferences && (
                                                <div className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full truncate" title={user.dietaryPreferences}>
                                                    🥗 {user.dietaryPreferences}
                                                </div>
                                            )}
                                            {user.specialRequests && (
                                                <div className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full truncate" title={user.specialRequests}>
                                                    ✨ {user.specialRequests}
                                                </div>
                                            )}
                                            {!user.dietaryPreferences && !user.specialRequests && <span className="text-gray-300 italic text-xs">Standard</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="text-xs font-bold text-gray-800">{userStats[user._id]?.totalStays || 0} Stays</div>
                                        <div className="text-xs text-[#696cff] font-medium mt-0.5">${(userStats[user._id]?.totalSpent || 0).toFixed(2)}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-1.5 text-gray-400 hover:text-[#696cff] hover:bg-gray-100 rounded transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/invoice/${user._id}`)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="View Invoice"
                                            >
                                                <FileText size={16} />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
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

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">User Profile Details</h3>
                            <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            {/* Header / Basic Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[#696cff] text-white flex items-center justify-center text-2xl font-bold">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800">{selectedUser.name}</h4>
                                    <p className="text-gray-500">{selectedUser.email}</p>
                                    <span className={`mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedUser.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone Number</label>
                                    <div className="text-sm font-medium text-gray-800">{selectedUser.phone || 'Not provided'}</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Date of Birth</label>
                                    <div className="text-sm font-medium text-gray-800">{selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'Not provided'}</div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Location Information</label>
                                <div className="space-y-2">
                                    <div>
                                        <div className="text-[10px] text-gray-400 italic">Address</div>
                                        <div className="text-sm text-gray-800">{selectedUser.address || 'Not provided'}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[10px] text-gray-400 italic">City</div>
                                            <div className="text-sm text-gray-800">{selectedUser.city || 'Not provided'}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-gray-400 italic">Country</div>
                                            <div className="text-sm text-gray-800">{selectedUser.country || 'Not provided'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Service Preferences</label>
                                <div className="space-y-3">
                                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                        <div className="text-[10px] text-green-600 font-bold uppercase mb-1 flex items-center gap-1">
                                            <Utensils size={10} /> Dietary Preferences
                                        </div>
                                        <div className="text-sm text-green-800">{selectedUser.dietaryPreferences || 'No specific dietary requirements recorded.'}</div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <div className="text-[10px] text-blue-600 font-bold uppercase mb-1 flex items-center gap-1">
                                            ✨ Special Requests
                                        </div>
                                        <div className="text-sm text-blue-800">{selectedUser.specialRequests || 'No special requests recorded for this user.'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Stays</div>
                                    <div className="text-xl font-bold text-gray-800">{userStats[selectedUser._id]?.totalStays || 0}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Spent</div>
                                    <div className="text-xl font-bold text-[#696cff]">${(userStats[selectedUser._id]?.totalSpent || 0).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                            >
                                Close Detail View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
