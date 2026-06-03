import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, Mail } from 'lucide-react';

const Invoice = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoice();
    }, [userId]);

    const fetchInvoice = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const response = await fetch(`http://localhost:3000/invoice/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setInvoice(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Generating Invoice for User ID: {userId}...</div>;
    if (!invoice) return (
        <div className="p-12 text-center">
            <div className="text-red-500 font-bold mb-4 text-xl">Invoice record not found</div>
            <p className="text-gray-500 mb-6">User ID: {userId} might have no billable history or the ID is invalid.</p>
            <button onClick={() => navigate(-1)} className="bg-gray-100 px-6 py-2 rounded-lg hover:bg-gray-200 transition-all font-medium">Return to Dashboard</button>
        </div>
    );

    // Dynamic tax rate (fallback to 10% if not provided by backend)
    const taxRate = invoice.summary?.taxRate || 0.10;
    const subtotal = invoice.summary?.totalAmount || 0;
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg my-8 rounded-lg print:shadow-none print:m-0 print:w-full min-h-[1000px] flex flex-col">
            {/* Header / Actions - Hidden on Print */}
            <div className="flex justify-between items-center mb-8 print:hidden">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={() => alert('Secure Email Service: This will send the PDF version of this invoice to ' + invoice.customer.email + '. (Service Integration Pending)')}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <Mail size={18} />
                        Email to Guest
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-[#696cff] text-white rounded-lg hover:bg-[#5f62e6] transition-colors"
                    >
                        <Printer size={18} />
                        Print/Save as PDF
                    </button>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="border border-gray-100 p-8 rounded-lg print:border-none print:p-0 flex-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b border-gray-50 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">QUICK<span className="text-[#696cff]">STAY</span></h1>
                        <p className="text-gray-500 mt-2 text-sm">Luxury Hotel & Resort</p>
                        <p className="text-gray-500 text-sm">123 Ocean Drive, Colombo</p>
                        <p className="text-gray-500 text-sm">Sri Lanka</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
                        <p className="text-gray-500 text-sm">Date: {new Date().toLocaleDateString()}</p>
                        <p className="text-gray-500 text-sm font-mono">Invoice #: INV-{userId?.slice(-6).toUpperCase()}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-12">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Bill To</h3>
                    <div className="text-gray-800 font-bold text-lg">{invoice.customer.name}</div>
                    <div className="text-gray-600">{invoice.customer.email}</div>
                    <div className="text-gray-600 font-mono text-sm">{invoice.customer.phone}</div>
                </div>

                {/* Line Items */}
                <table className="w-full mb-12">
                    <thead>
                        <tr className="border-b-2 border-gray-100 bg-gray-50/50 print:bg-gray-100">
                            <th className="text-left py-4 px-2 font-bold text-gray-600 text-sm">Description</th>
                            <th className="text-left py-4 px-2 font-bold text-gray-600 text-sm">Type</th>
                            <th className="text-left py-4 px-2 font-bold text-gray-600 text-sm">Date</th>
                            <th className="text-right py-4 px-2 font-bold text-gray-600 text-sm">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {(!invoice.items || invoice.items.length === 0) && (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-gray-400 italic">No billable items found for this customer.</td>
                            </tr>
                        )}
                        {(invoice.items || []).map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/30">
                                <td className="py-4 px-2 text-gray-800 font-medium">
                                    {item.description}
                                    <div className="text-[10px] text-gray-400 mt-1 font-mono uppercase">Ref: {item.ref}</div>
                                </td>
                                <td className="py-4 px-2 text-gray-600 text-xs">
                                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">{item.type}</span>
                                </td>
                                <td className="py-4 px-2 text-gray-600 text-sm">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="py-4 px-2 text-right text-gray-800 font-bold">
                                    ${parseFloat(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary */}
                <div className="flex justify-end">
                    <div className="w-72 bg-gray-50 p-6 rounded-lg print:bg-transparent print:border print:border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-800 font-bold font-mono">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 text-sm">
                            <span className="text-gray-600">Tax ({Math.round(taxRate * 100)}%)</span>
                            <span className="text-gray-800 font-medium font-mono">+ ${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-[#696cff]">Total Due</span>
                            <span className="text-2xl font-bold text-[#696cff] font-mono">${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-12 border-t border-gray-100 text-center text-gray-500 text-sm print:mt-16">
                    <p className="font-medium text-gray-700">Thank you for choosing Quick Stay Hotel & Resort.</p>
                    <p className="mt-2">Payment is due within 30 days. For any questions regarding this invoice, please contact support@quickstay.com or call +94 11 123 4567.</p>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 1cm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:bg-transparent { background-color: transparent !important; }
                    .print\\:border { border: 1px solid #e5e7eb !important; }
                }
            `}</style>
        </div>
    );
};

export default Invoice;
