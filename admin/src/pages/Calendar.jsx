import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar as CalendarIcon, Filter, Info, XCircle } from 'lucide-react';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filter, setFilter] = useState('all'); // all, rooms, dining, offers

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch with individual error handling to prevent one failure from breaking the whole calendar
            const safeFetch = async (url) => {
                try {
                    const res = await fetch(url, { headers });
                    if (!res.ok) throw new Error(`Fetch failed: ${url}`);
                    return await res.json();
                } catch (e) {
                    console.error(e);
                    return []; // Return empty array on failure
                }
            };

            const [bookings, dining, offers] = await Promise.all([
                safeFetch('http://localhost:3000/bookings'),
                safeFetch('http://localhost:3000/diningReservations/admin'),
                safeFetch('http://localhost:3000/offerReservations')
            ]);

            const allEvents = [
                ...transformBookings(bookings),
                ...transformDining(dining),
                ...transformOffers(offers)
            ];

            setEvents(allEvents);
        } catch (error) {
            console.error("Critical error fetching calendar data:", error);
        } finally {
            setLoading(false);
        }
    };

    const addDays = (dateStr, days) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    const transformBookings = (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(b => ({
            id: `room-${b._id || b.id}`,
            title: `🏨 [Room] ${b.guestName || 'Guest'} - ${b.room}`,
            start: b.checkIn,
            end: addDays(b.checkOut, 1), // FullCalendar end is exclusive for all-day events
            backgroundColor: '#696cff',
            borderColor: '#696cff',
            allDay: true, // Bookings are typically all-day
            extendedProps: {
                type: 'Room Booking',
                guest: b.guestName || 'Guest',
                detail: b.room || 'Not assigned',
                status: b.status || 'Pending',
                contact: b.email || b.phone || 'No contact info'
            }
        }));
    };

    const transformDining = (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(d => {
            try {
                // Convert date to YYYY-MM-DD format
                const dateObj = new Date(d.date);
                const dateStr = dateObj.toISOString().split('T')[0];

                // Robust time fallback
                const timeStr = d.time ? (d.time.includes(':') ? d.time : `${d.time}:00`) : '12:00:00';
                const isoDateTime = `${dateStr}T${timeStr.length === 5 ? `${timeStr}:00` : timeStr}`;

                return {
                    id: `dining-${d._id || d.id}`,
                    title: `🍽️ [Dining] ${d.guestName || 'Guest'} @ ${d.restaurant || 'Venue'}`,
                    start: isoDateTime,
                    backgroundColor: '#71dd37',
                    borderColor: '#71dd37',
                    allDay: false,
                    extendedProps: {
                        type: 'Dining Reservation',
                        guest: d.guestName || 'Guest',
                        detail: `${d.restaurant || 'Venue'} (${d.guests || 1} ppl)`,
                        status: d.status || 'Pending',
                        contact: d.phone || 'No phone'
                    }
                };
            } catch (error) {
                console.error('Error transforming dining reservation:', d, error);
                return null;
            }
        }).filter(Boolean); // Remove any null entries from errors
    };

    const transformOffers = (data) => {
        if (!Array.isArray(data)) return [];
        return data.map(o => ({
            id: `offer-${o._id || o.id}`,
            title: `🏷️ [Offer] ${o.guestName || 'Guest'} - ${o.offer || 'Special Offer'}`,
            start: o.date,
            backgroundColor: '#ffab00',
            borderColor: '#ffab00',
            allDay: true,
            extendedProps: {
                type: 'Offer Reservation',
                guest: o.guestName || 'Guest',
                detail: o.offer || 'Offer Details',
                status: o.status || 'Pending',
                contact: o.phone || 'No phone'
            }
        }));
    };

    const handleEventClick = (info) => {
        setSelectedEvent(info.event);
    };

    const filteredEvents = filter === 'all'
        ? events
        : events.filter(e => {
            if (filter === 'rooms') return e.id.startsWith('room-');
            if (filter === 'dining') return e.id.startsWith('dining-');
            if (filter === 'offers') return e.id.startsWith('offer-');
            return true;
        });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Booking Calendar</h1>
                    <p className="text-gray-500 mt-1">Unified view of all hotel activities and guest stays.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filter === 'all' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('rooms')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filter === 'rooms' ? 'bg-[#696cff] text-white' : 'text-[#696cff] hover:bg-[#696cff]/10'}`}
                    >
                        Rooms
                    </button>
                    <button
                        onClick={() => setFilter('dining')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filter === 'dining' ? 'bg-[#71dd37] text-white' : 'text-[#71dd37] hover:bg-[#71dd37]/10'}`}
                    >
                        Dining
                    </button>
                    <button
                        onClick={() => setFilter('offers')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filter === 'offers' ? 'bg-[#ffab00] text-white' : 'text-[#ffab00] hover:bg-[#ffab00]/10'}`}
                    >
                        Offers
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                {loading ? (
                    <div className="h-[600px] flex items-center justify-center text-gray-400 animate-pulse">
                        Loading unified calendar...
                    </div>
                ) : (
                    <div className="admin-calendar-wrapper">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={filteredEvents}
                            eventClick={handleEventClick}
                            height="700px"
                            eventDisplay="block"
                            dayMaxEvents={true}
                            nowIndicator={true}
                        />
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg text-white" style={{ backgroundColor: selectedEvent.backgroundColor }}>
                                    <CalendarIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{selectedEvent.extendedProps.type}</h3>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Details</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guest Name</label>
                                <div className="text-lg font-bold text-gray-800">{selectedEvent.extendedProps.guest}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                    <div className="text-sm text-gray-600 font-medium">{selectedEvent.extendedProps.detail}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                                    <div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedEvent.extendedProps.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            selectedEvent.extendedProps.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {selectedEvent.extendedProps.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 pt-2 border-t border-gray-50">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Information</label>
                                <div className="text-sm text-gray-600 font-medium">{selectedEvent.extendedProps.contact || 'No contact info'}</div>
                            </div>

                            {selectedEvent.start && (
                                <div className="space-y-1 pb-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date / Time</label>
                                    <div className="text-sm text-gray-600 font-medium">
                                        {selectedEvent.start.toLocaleDateString()}
                                        {selectedEvent.allDay ? '' : ` at ${selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                        {selectedEvent.end && ` - ${selectedEvent.end.toLocaleDateString()}`}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .admin-calendar-wrapper .fc {
                    --fc-border-color: #f3f4f6;
                    --fc-button-bg-color: #696cff;
                    --fc-button-border-color: #696cff;
                    --fc-button-hover-bg-color: #5f62e6;
                    --fc-button-active-bg-color: #5f62e6;
                    --fc-event-resizer-thickness: 8px;
                    font-family: inherit;
                }
                .admin-calendar-wrapper .fc-toolbar-title {
                    font-size: 1.25rem !important;
                    font-weight: 700 !important;
                    color: #1f2937;
                }
                .admin-calendar-wrapper .fc-col-header-cell {
                    padding: 12px 0 !important;
                    background: #f9fafb;
                    font-weight: 700 !important;
                    text-transform: uppercase;
                    font-size: 10px;
                    letter-spacing: 0.1em;
                    color: #6b7280;
                }
                .admin-calendar-wrapper .fc-event {
                    cursor: pointer;
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .admin-calendar-wrapper .fc-day-today {
                    background: #696cff08 !important;
                }
            `}</style>
        </div>
    );
};

export default Calendar;
