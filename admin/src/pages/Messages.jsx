import { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, Search, Calendar, User, CornerUpLeft } from 'lucide-react';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch('http://localhost:3000/messages?page=1&limit=100', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            // Handle paginated response
            setMessages(data.messages || data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching messages:", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message permanently?")) return;
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch(`http://localhost:3000/messages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(messages.filter(m => m._id !== id));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const handleMarkAsReplied = async (id) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch(`http://localhost:3000/messages/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'Replied' })
            });
            setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'Replied' } : m));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredMessages = messages.filter(msg => {
        const name = (msg?.name || "").toLowerCase();
        const email = (msg?.email || "").toLowerCase();
        const content = (msg?.message || "").toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch = name.includes(search) || email.includes(search) || content.includes(search);
        const matchesStatus = filterStatus === 'All' || msg?.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Messages & Inquiries</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage contact form submissions</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff] text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#696cff]"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading messages...</div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">No messages found</h3>
                        <p className="text-gray-500 text-sm mt-1">Your inbox is empty</p>
                    </div>
                ) : (
                    filteredMessages.map((msg) => (
                        <div key={msg._id} className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${msg.status === 'New' ? 'border-[#696cff] shadow-md relative' : 'border-gray-100'}`}>
                            {msg.status === 'New' && (
                                <span className="absolute top-4 right-4 w-2 h-2 bg-[#696cff] rounded-full"></span>
                            )}

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Sender Info */}
                                <div className="md:w-1/4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#696cff]/10 text-[#696cff] flex items-center justify-center font-bold">
                                            {msg.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-gray-800 ${msg.status === 'New' ? 'text-lg' : 'text-base'}`}>{msg.name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar size={12} /> {formatDate(msg.date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded break-all">
                                        {msg.email}
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className="flex-1 border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                                    <div className="mt-6 flex flex-wrap gap-2 justify-end">
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: Your Inquiry - Quick Stay Hotel`}
                                            onClick={() => handleMarkAsReplied(msg._id)}
                                            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                        >
                                            <CornerUpLeft size={16} /> Reply via Email
                                        </a>

                                        {(msg.status === 'New' || msg.status === 'Read') && (
                                            <button
                                                onClick={() => handleMarkAsReplied(msg._id)}
                                                className="px-4 py-2 bg-[#696cff]/10 text-[#696cff] rounded-lg text-sm font-medium hover:bg-[#696cff]/20 flex items-center gap-2 transition-colors"
                                            >
                                                <CheckCircle size={16} /> Mark as Replied
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(msg._id)}
                                            className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Messages;
