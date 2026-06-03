import { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BookingExportSection = ({ bookings }) => {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [statusFilter, setStatusFilter] = useState('All');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleExportPDF = () => {
        setIsGenerating(true);

        // Filter bookings based on user selection
        const toExport = bookings.filter(b => {
            const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

            let matchesDate = true;
            if (dateRange.start && dateRange.end) {
                const checkInDate = new Date(b.checkIn);
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);
                matchesDate = checkInDate >= startDate && checkInDate <= endDate;
            }

            return matchesStatus && matchesDate;
        });

        if (toExport.length === 0) {
            alert("No bookings found for the selected criteria.");
            setIsGenerating(false);
            return;
        }

        const doc = new jsPDF();

        // Add Title & Branding
        doc.setFontSize(22);
        doc.setTextColor(105, 108, 255); // #696cff (LuxAdmin Primary)
        doc.text("THE QUICK STAY", 14, 22);

        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text("Bookings Activity Report", 14, 32);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);
        doc.text(`Filter: Status: ${statusFilter} | Range: ${dateRange.start || 'Start'} to ${dateRange.end || 'End'}`, 14, 45);

        const tableColumn = ["ID", "Guest Name", "Room", "Check-In", "Check-Out", "Amount", "Status"];
        const tableRows = toExport.map(b => [
            b.id || b._id.substring(0, 8),
            b.guestName || (b.guest?.name || "Guest"),
            b.room,
            b.checkIn ? new Date(b.checkIn).toISOString().split('T')[0] : '-',
            b.checkOut ? new Date(b.checkOut).toISOString().split('T')[0] : '-',
            `$${b.amount || b.totalPrice}`,
            b.status
        ]);

        // Generate Table
        doc.autoTable({
            startY: 55,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [105, 108, 255], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [245, 245, 255] },
            margin: { top: 55 },
        });

        // Add Summary Section
        const finalY = doc.lastAutoTable.finalY + 15;
        const totalRevenue = toExport.reduce((sum, b) => sum + (Number(b.amount) || Number(b.totalPrice) || 0), 0);

        doc.setFontSize(14);
        doc.setTextColor(40, 40, 40);
        doc.text("Report Summary", 14, finalY);

        doc.setFontSize(11);
        doc.text(`Total Bookings: ${toExport.length}`, 14, finalY + 10);
        doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 14, finalY + 17);

        doc.save(`LuxAdmin_Bookings_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        setIsGenerating(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 mt-2 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-6 text-[#696cff]">
                <FileText size={20} />
                <h2 className="text-lg font-bold text-gray-800">Export Report (PDF)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                {/* Date Range */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                        <Calendar size={14} /> Start Date
                    </label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#696cff] outline-none text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                        <Calendar size={14} /> End Date
                    </label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#696cff] outline-none text-sm"
                    />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                        <Filter size={14} /> Status
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#696cff] outline-none text-sm appearance-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Confirmed">Confirmed Only</option>
                        <option value="Pending">Pending Only</option>
                        <option value="Cancelled">Cancelled Only</option>
                    </select>
                </div>

                {/* Export Button */}
                <button
                    onClick={handleExportPDF}
                    disabled={isGenerating}
                    className="flex justify-center items-center gap-2 px-6 py-2.5 bg-[#696cff] text-white rounded-xl font-bold hover:bg-[#5f62e6] transition-all shadow-lg shadow-[#696cff]/20 disabled:opacity-50"
                >
                    {isGenerating ? (
                        <>Generating...</>
                    ) : (
                        <>
                            <Download size={18} />
                            Generate Report
                        </>
                    )}
                </button>
            </div>
            <p className="mt-4 text-xs text-gray-400 italic">
                * PDF report will include guest names, room types, stay periods, and total revenue summaries based on your filters.
            </p>
        </div>
    );
};

export default BookingExportSection;
