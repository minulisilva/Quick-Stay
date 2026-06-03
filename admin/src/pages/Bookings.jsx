import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import BookingExportSection from '../components/BookingExportSection';

const Bookings = () => {
    // API Integration
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('quickstay_admin_token');
                const response = await fetch('http://localhost:3000/bookings', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setBookings(data);
                } else {
                    console.error("Expected array for bookings, got:", data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch(`http://localhost:3000/bookings/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
            if (selectedBooking && selectedBooking._id === id) {
                setSelectedBooking({ ...selectedBooking, status: newStatus });
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Helper: Normalize Guest Name
    const getGuestName = (booking) => {
        if (!booking) return "Guest";
        if (booking.guestName) return booking.guestName;
        const guest = booking.guest;
        if (!guest) return "Guest";
        if (typeof guest === 'string') return guest;
        if (guest.firstName || guest.lastName) {
            return `${guest.firstName || ''} ${guest.lastName || ''}`.trim();
        }
        return guest.name || "Guest";
    };

    // Helper: Format Date consistently
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    };

    // Filter & Export State
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
        const name = getGuestName(booking).toLowerCase();
        const email = (booking.email || booking.guest?.email || "").toLowerCase();
        const room = (booking.room || "").toLowerCase();
        const id = (booking.id || booking._id || "").toLowerCase();
        const search = searchTerm.toLowerCase();

        return matchesStatus && (
            name.includes(search) ||
            email.includes(search) ||
            room.includes(search) ||
            id.includes(search)
        );
    });

    const handleExport = () => {
        const headers = ["Booking ID", "Guest Name", "Room", "Adults", "Children", "Check In", "Check Out", "Amount", "Status"];
        const csvContent = [
            headers.join(","),
            ...filteredBookings.map(b => [
                b._id,
                getGuestName(b),
                b.room || "-",
                b.adults || 1,
                b.children || 0,
                b.checkIn,
                b.checkOut,
                b.amount || b.totalPrice || 0,
                b.status
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "bookings_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Bookings Management</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Search by name, email, room..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#696cff]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <Eye size={16} />
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 ${showFilters ? 'bg-gray-100' : 'bg-white'}`}
                        >
                            Filter
                        </button>
                        {showFilters && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                {['All', 'Confirmed', 'Pending', 'Cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => { setFilterStatus(status); setShowFilters(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterStatus === status ? 'text-[#696cff] font-medium' : 'text-gray-700'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={handleExport} className="px-4 py-2 bg-[#696cff] text-white rounded-lg text-sm font-medium hover:bg-[#5f62e6]">Export</button>
                </div>
            </div>

            <BookingExportSection bookings={bookings} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600 text-sm">Booking ID</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Guest</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Room</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Guests</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Dates</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Amount</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800 text-sm">#{booking.id || booking._id}</td>
                                    <td className="p-4 text-gray-600 text-sm">
                                        <div className="font-medium text-gray-800">{getGuestName(booking)}</div>
                                        <div className="text-[11px] text-gray-400">{booking.email || booking.guest?.email}</div>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">{booking.room || "-"}</td>
                                    <td className="p-4 text-gray-600 text-sm">
                                        <div className="text-xs">
                                            <div>Adults: {booking.adults || 1}</div>
                                            <div>Children: {booking.children || 0}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">
                                        <div>{formatDate(booking.checkIn)}</div>
                                        <div className="text-xs text-gray-400 italic">to {formatDate(booking.checkOut)}</div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800 text-sm">${booking.amount || booking.totalPrice || 0}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex w-fit items-center gap-1 ${getStatusColor(booking.status)}`}>
                                            {booking.status === 'Confirmed' ? <CheckCircle size={12} /> : null}
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="p-1 text-gray-400 hover:text-[#696cff] hover:bg-gray-100 rounded"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-gray-400 italic">No bookings found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">Booking Details</h3>
                            <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking ID</label>
                                    <div className="text-gray-800 font-mono text-sm leading-tight">#{selectedBooking.id || selectedBooking._id}</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                                    <div className={`text-sm font-bold ${selectedBooking.status === 'Confirmed' ? 'text-green-600' : selectedBooking.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {selectedBooking.status}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Guest Info</label>
                                <div className="text-gray-800 font-bold">{getGuestName(selectedBooking)}</div>
                                <div className="text-gray-500 text-sm mt-1">{selectedBooking.email || selectedBooking.guest?.email || "No email provided"}</div>
                                <div className="text-gray-500 text-sm">{selectedBooking.phone || selectedBooking.guest?.phone || "No phone provided"}</div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Stay Details</label>
                                <div className="text-gray-800 font-bold">{selectedBooking.room || "Room not assigned"}</div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="text-xs">
                                        <span className="text-gray-400 block uppercase font-medium">Check-In</span>
                                        <strong className="text-gray-700">{formatDate(selectedBooking.checkIn)}</strong>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-gray-400 block uppercase font-medium">Check-Out</span>
                                        <strong className="text-gray-700">{formatDate(selectedBooking.checkOut)}</strong>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div className="text-xs">
                                        <span className="text-gray-400 block uppercase font-medium">Adults</span>
                                        <strong className="text-gray-700">{selectedBooking.adults || 1}</strong>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-gray-400 block uppercase font-medium">Children</span>
                                        <strong className="text-gray-700">{selectedBooking.children || 0}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-[#696cff] to-[#60a5fa] p-5 rounded-xl shadow-lg shadow-[#696cff]/20 flex justify-between items-center text-white">
                                <span className="font-medium">Total Amount</span>
                                <span className="text-2xl font-black">${selectedBooking.amount || selectedBooking.totalPrice || 0}</span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-500 rounded-xl font-medium hover:bg-gray-50 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
