import { useState } from 'react';
import { Calendar, User } from 'lucide-react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const BookingWidget = () => {
    const navigate = useNavigate();
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    const handleSearch = () => {
        const params = new URLSearchParams({
            checkIn,
            checkOut,
            adults,
            children
        });
        navigate(`/book?${params.toString()}`);
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-6 shadow-2xl rounded-sm">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Check In */}
                <div className="bg-white/90 p-3 hover:bg-white transition-colors cursor-pointer group relative">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Check In</label>
                    <div className="flex items-center justify-between text-secondary relative h-8">
                        <input
                            type="date"
                            className="bg-transparent border-none outline-none text-lg font-serif w-full h-full z-10 cursor-pointer text-secondary placeholder-transparent pr-8"
                            onChange={(e) => setCheckIn(e.target.value)}
                            value={checkIn}
                        />
                        <Calendar size={16} className="text-primary absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Check Out */}
                <div className="bg-white/90 p-3 hover:bg-white transition-colors cursor-pointer group relative">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Check Out</label>
                    <div className="flex items-center justify-between text-secondary relative h-8">
                        <input
                            type="date"
                            className="bg-transparent border-none outline-none text-lg font-serif w-full h-full z-10 cursor-pointer text-secondary placeholder-transparent pr-8"
                            onChange={(e) => setCheckOut(e.target.value)}
                            value={checkOut}
                            min={checkIn}
                        />
                        <Calendar size={16} className="text-primary absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Adults */}
                <div className="bg-white/90 p-3 hover:bg-white transition-colors cursor-pointer group relative">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Adults</label>
                    <div className="flex items-center justify-between text-secondary relative h-8">
                        <select
                            className="bg-transparent border-none outline-none text-lg font-serif w-full h-full appearance-none z-10 cursor-pointer pr-8"
                            value={adults}
                            onChange={(e) => setAdults(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <User size={16} className="text-primary absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Children */}
                <div className="bg-white/90 p-3 hover:bg-white transition-colors cursor-pointer group relative">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Children</label>
                    <div className="flex items-center justify-between text-secondary relative h-8">
                        <select
                            className="bg-transparent border-none outline-none text-lg font-serif w-full h-full appearance-none z-10 cursor-pointer pr-8"
                            value={children}
                            onChange={(e) => setChildren(parseInt(e.target.value))}
                        >
                            {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <User size={16} className="text-primary absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Button */}
                <Button
                    className="h-full w-full py-4 bg-primary hover:bg-white hover:text-primary border-primary text-white text-xs tracking-[0.2em] font-bold"
                    onClick={handleSearch}
                >
                    CHECK AVAILABILITY
                </Button>
            </div>
        </div>
    );
};

export default BookingWidget;
