import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Clock, Trash2, MessageSquare, CornerDownRight, Send } from 'lucide-react';

const ReplyForm = ({ itemId, onSubmit }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(itemId, replyText);
        setIsExpanded(false);
    };

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="text-xs font-medium text-[#696cff] hover:text-[#5f62e6] flex items-center gap-1 mb-4"
            >
                <CornerDownRight size={14} /> Reply to this review
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your response..."
                className="w-full p-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#696cff] focus:ring-1 focus:ring-[#696cff] min-h-[80px] mb-2"
                autoFocus
            />
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium text-white bg-[#696cff] hover:bg-[#5f62e6] rounded-md flex items-center gap-1"
                >
                    <Send size={12} /> Send Reply
                </button>
            </div>
        </form>
    );
}

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDept, setFilterDept] = useState('All');

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch('http://localhost:3000/feedbacks?page=1&limit=100', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            // Handle paginated response
            const feedbacksArray = data.feedbacks || data;
            if (Array.isArray(feedbacksArray)) {
                setFeedbacks(feedbacksArray);
            } else {
                console.error("Expected array for feedbacks, got:", data);
                setFeedbacks([]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching feedback:", err);
            setLoading(false);
        }
    };

    const getFilteredFeedbacks = () => {
        return feedbacks.filter(item => {
            const statusMatch = filterStatus === 'All' || item.status === filterStatus;
            const deptMatch = filterDept === 'All' || item.department === filterDept;
            return statusMatch && deptMatch;
        });
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch(`http://localhost:3000/feedbacks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status: newStatus } : f));
        } catch (error) {
            console.error("Error updating feedback status:", error);
        }
    };

    const handleReplySubmit = async (id, replyText) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`http://localhost:3000/feedbacks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Update both reply AND status to Replied
                body: JSON.stringify({ reply: replyText, status: 'Replied' })
            });
            if (res.ok) {
                setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, reply: replyText, status: 'Replied' } : f));
            }
        } catch (error) {
            console.error("Error submitting reply:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review? This action is permanent.")) return;
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`http://localhost:3000/feedbacks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setFeedbacks(prev => prev.filter(f => f._id !== id));
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };

    const renderStars = (rating) => {
        const safeRating = Math.max(0, Math.min(5, parseInt(rating) || 0));
        return [...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < safeRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Guest Feedback</h1>
                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#696cff]"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Hidden">Hidden</option>
                    </select>
                    <select
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#696cff]"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                    >
                        <option value="All">All Departments</option>
                        <option value="General">General</option>
                        <option value="Front Desk">Front Desk</option>
                        <option value="Housekeeping">Housekeeping</option>
                        <option value="Dining">Dining</option>
                        <option value="Facilities">Facilities</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {getFilteredFeedbacks().map((item) => (
                    <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar / Initials */}
                        <div className="w-12 h-12 rounded-full bg-[#696cff]/10 flex items-center justify-center text-[#696cff] font-bold text-lg shrink-0">
                            {(item.guest?.name || item.guest || "G").charAt(0)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2 w-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800">{item.guest?.name || item.guest}</h3>
                                    <div className="text-sm text-gray-500">{item.guest?.email || item.email}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 mb-1">{item.date}</div>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {item.department || 'General'}
                                    </span>
                                    <div className="text-[10px] text-gray-400 mt-1">ID: #{item.id || item._id}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 my-1">
                                {renderStars(item.rating)}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg text-gray-600 text-sm relative mb-4">
                                <MessageSquare size={16} className="absolute top-4 left-4 text-gray-300 -z-0 opacity-20 transform scale-150" />
                                <p className="relative z-10 italic">"{item.comment}"</p>
                            </div>

                            {/* Reply Section */}
                            {item.reply ? (
                                <div className="bg-[#696cff]/5 p-4 rounded-lg border border-[#696cff]/10 mb-4 transition-all">
                                    <p className="text-xs font-bold text-[#696cff] mb-1">Response from Hotel:</p>
                                    <p className="text-sm text-gray-700">{item.reply}</p>
                                </div>
                            ) : (
                                <ReplyForm itemId={item._id} onSubmit={handleReplySubmit} />
                            )}

                            {/* Actions Footer */}
                            <div className="flex justify-between items-center pt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1 
                                    ${item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {item.status}
                                </span>

                                <div className="flex gap-2">
                                    {item.status === 'Pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(item._id, 'Approved')}
                                            className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                    )}
                                    {item.status === 'Approved' && (
                                        <button
                                            onClick={() => handleStatusUpdate(item._id, 'Hidden')}
                                            className="px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <XCircle size={14} /> Hide
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete Review"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {getFilteredFeedbacks().length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                        <p>No feedback received yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;
