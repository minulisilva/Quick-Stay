import { useState, useEffect } from 'react';
import { Users, CreditCard, CalendarCheck, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
    // Production-safe color mapping for Tailwind
    const colors = {
        blue: 'bg-blue-50 text-blue-500',
        purple: 'bg-purple-50 text-purple-500',
        orange: 'bg-orange-50 text-orange-500',
        green: 'bg-green-50 text-green-500'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                    <span className={`text-xs font-medium ${change ? (change.startsWith('+') ? 'text-green-500' : 'text-red-500') : 'text-gray-400'}`}>
                        {change} {change && "since last month"}
                    </span>
                </div>
                <div className={`p-3 rounded-lg ${colors[color] || 'bg-gray-50 text-gray-500'}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        bookings: 0,
        guests: 0,
        occupancy: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('quickstay_admin_token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [bookingsRes, roomsRes, usersRes] = await Promise.all([
                    fetch('http://localhost:3000/bookings', { headers }),
                    fetch('http://localhost:3000/rooms', { headers }),
                    fetch('http://localhost:3000/users', { headers })
                ]);

                // Handle session expiry
                if (bookingsRes.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                const bookings = await bookingsRes.json();
                const rooms = await roomsRes.json();
                const users = await usersRes.json();

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Calculate Stats
                const totalRevenue = bookings.reduce((acc, curr) => acc + (parseFloat(curr.amount || curr.totalPrice || 0) || 0), 0);

                // Real occupancy logic: currently staying guests
                const guestStayingToday = bookings.filter(b => {
                    if (b.status !== 'Confirmed') return false;
                    const cin = new Date(b.checkIn);
                    const cout = new Date(b.checkOut);
                    return cin <= today && cout >= today;
                }).length;

                const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
                const totalGuests = users.length;
                const occupancyRate = rooms.length > 0 ? Math.round((guestStayingToday / rooms.length) * 100) : 0;

                setStats({
                    revenue: totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                    bookings: activeBookings,
                    guests: totalGuests,
                    occupancy: `${Math.min(occupancyRate, 100)}%`
                });

                // Prepare Chart Data (Revenue by Room Type)
                const revenueByRoom = {};
                bookings.forEach(b => {
                    const roomName = b.room || "Unknown";
                    revenueByRoom[roomName] = (revenueByRoom[roomName] || 0) + (parseFloat(b.amount) || 0);
                });

                const data = Object.keys(revenueByRoom).map(key => ({
                    name: key.split(' ').slice(0, 2).join(' '), // Shorten name
                    revenue: revenueByRoom[key]
                }));
                setChartData(data);

                // Recent Bookings (Last 5)
                setRecentBookings(bookings.slice(-5).reverse());

                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={stats.revenue} change="+12%" icon={CreditCard} color="blue" />
                <StatCard title="Active Bookings" value={stats.bookings} change="+5%" icon={CalendarCheck} color="purple" />
                <StatCard title="Total Guests" value={stats.guests} change="+8%" icon={Users} color="orange" />
                <StatCard title="Occupancy Rate" value={stats.occupancy} change="+2%" icon={TrendingUp} color="green" />
            </div>

            {/* Charts & Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue by Room</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="revenue" fill="#696cff" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px] overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Bookings</h3>
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white">
                                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                    <th className="pb-3 font-medium">ID</th>
                                    <th className="pb-3 font-medium">Guest</th>
                                    <th className="pb-3 font-medium">Room</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentBookings.map((booking) => (
                                    <tr key={booking._id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-3 text-xs text-gray-400 font-mono">#{booking.id || booking._id}</td>
                                        <td className="py-3 text-sm font-medium text-gray-800">{booking.guestName || (booking.guest?.name || booking.guest || "Guest")}</td>
                                        <td className="py-3 text-sm text-gray-500">{booking.room}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm text-gray-800 text-right font-medium">${booking.amount || booking.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
