import { useState, useEffect } from 'react';
import { DollarSign, Search, Calendar, CreditCard, AlertCircle, CheckCircle, Clock, Eye, XCircle } from 'lucide-react';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchTerm, filterStatus, payments]);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch('http://localhost:3000/payments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setPayments(data);
            } else {
                console.error("Expected array for payments, got:", data);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching payments:", err);
            setLoading(false);
        }
    };

    const filterData = () => {
        let result = payments;

        if (filterStatus !== 'All') {
            result = result.filter(p => p.status === filterStatus);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.guest?.toLowerCase().includes(term) ||
                p.email?.toLowerCase().includes(term) ||
                p.id?.toLowerCase().includes(term) ||
                p._id?.toLowerCase().includes(term) ||
                p.bookingId?.toLowerCase().includes(term)
            );
        }

        setFilteredPayments(result);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Failed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getMethodIcon = (method) => {
        if (method === 'Credit Card') return <CreditCard size={14} />;
        if (method === 'Cash') return <DollarSign size={14} />;
        return <AlertCircle size={14} />;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Payments & Transactions</h1>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by ID, Guest, or Email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#696cff] focus:ring-1 focus:ring-[#696cff]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 text-sm overflow-x-auto pb-2 md:pb-0">
                    {['All', 'Paid', 'Pending', 'Failed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filterStatus === status ? 'bg-[#696cff] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600 text-sm">Transaction ID</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Guest</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Booking Ref</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Amount</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Method</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPayments.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-xs text-gray-500 font-mono font-medium">{p.id || p._id}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800 text-sm">{p.guest}</div>
                                        <div className="text-xs text-gray-500">{p.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-[#696cff] font-medium">{p.bookingId}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(p.date).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-400 pl-6">{new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">${p.amount}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            {getMethodIcon(p.method)}
                                            {p.method}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1 ${getStatusColor(p.status)}`}>
                                            {p.status === 'Paid' && <CheckCircle size={10} />}
                                            {p.status === 'Pending' && <Clock size={10} />}
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedPayment(p)}
                                            className="p-1 text-gray-400 hover:text-[#696cff] hover:bg-gray-100 rounded"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredPayments.length === 0 && !loading && (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No transactions found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >

            {/* Payment Details Modal */}
            {
                selectedPayment && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Transaction Details</h3>
                                <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-gray-600">
                                    <XCircle className="rotate-45" size={24} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Transaction ID</label>
                                        <div className="text-gray-800 font-medium font-mono">#{selectedPayment.id || selectedPayment._id}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                                        <div className={`text-sm font-bold flex items-center gap-1
                                        ${selectedPayment.status === 'Paid' ? 'text-green-600' :
                                                selectedPayment.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {selectedPayment.status}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Guest Information</label>
                                    <div className="text-gray-800 font-medium text-lg">{selectedPayment.guest}</div>
                                    <div className="text-gray-500">{selectedPayment.email}</div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Payment Summary</label>
                                    <div className="flex justify-between items-center mt-2 group p-2 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <div className="p-2 bg-blue-50 text-[#696cff] rounded-lg">
                                                {getMethodIcon(selectedPayment.method)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{selectedPayment.method}</span>
                                                <span className="text-xs text-gray-500">Booking Ref: {selectedPayment.bookingId}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-800 text-lg">${selectedPayment.amount}</div>
                                            <div className="text-xs text-gray-400">{new Date(selectedPayment.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Payments;
