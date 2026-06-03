import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, Users, Award } from 'lucide-react';

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        revenueData: [],
        statusData: [],
        ratingData: [],
        roomRevenueData: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [bookingsRes, feedbacksRes] = await Promise.all([
                fetch('http://localhost:3000/bookings', { headers }),
                fetch('http://localhost:3000/feedbacks', { headers })
            ]);

            const bookings = await bookingsRes.json();
            const feedbacks = await feedbacksRes.json();

            if (!Array.isArray(bookings) || !Array.isArray(feedbacks)) {
                console.error("Data received is not an array", { bookings, feedbacks });
                setLoading(false);
                return;
            }

            // 1. Revenue Trends
            const revenueMap = {};
            bookings.forEach(b => {
                if (b.checkIn && b.status !== 'Cancelled') {
                    const date = new Date(b.checkIn).toISOString().split('T')[0];
                    const amount = (b.amount || b.totalPrice || 0);
                    revenueMap[date] = (revenueMap[date] || 0) + amount;
                }
            });
            const revenueData = Object.keys(revenueMap).map(date => ({
                date,
                amount: revenueMap[date]
            })).sort((a, b) => new Date(a.date) - new Date(b.date));

            // 2. Booking Status Distribution
            const statusCounts = bookings.reduce((acc, curr) => {
                acc[curr.status || 'Unknown'] = (acc[curr.status || 'Unknown'] || 0) + 1;
                return acc;
            }, {});
            const statusData = Object.keys(statusCounts).map(status => ({
                name: status,
                value: statusCounts[status]
            }));

            // 3. Feedback Ratings
            const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            feedbacks.forEach(f => {
                if (starCounts[f.rating] !== undefined) starCounts[f.rating]++;
            });
            const ratingData = Object.keys(starCounts).map(star => ({
                stars: `${star} Star`,
                count: starCounts[star]
            }));

            // 4. Revenue by Room Type
            const roomMap = {};
            bookings.forEach(b => {
                const roomName = b.room || 'Unknown';
                const amount = (b.amount || b.totalPrice || 0);
                roomMap[roomName] = (roomMap[roomName] || 0) + amount;
            });
            const roomRevenueData = Object.keys(roomMap).map(room => ({
                name: room.split(' ').slice(0, 2).join(' '),
                revenue: roomMap[room]
            }));

            setAnalytics({ revenueData, statusData, ratingData, roomRevenueData });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setLoading(false);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Reports...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Revenue Trend Line Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp size={20} className="text-[#696cff]" />
                            Revenue Trend
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={analytics.revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`$${value}`, 'Revenue']}
                            />
                            <Line type="monotone" dataKey="amount" stroke="#696cff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Booking Status Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Calendar size={20} className="text-[#696cff]" />
                            Booking Status
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={analytics.statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {analytics.statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Feedback Ratings Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Award size={20} className="text-[#696cff]" />
                            Guest Satisfaction
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={analytics.ratingData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="stars" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" fill="#ffc107" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Rooms Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <DollarSign size={20} className="text-[#696cff]" />
                            Top Generating Rooms
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart layout="vertical" data={analytics.roomRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                            <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`$${value}`, 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="#32bca3" radius={[0, 4, 4, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default Reports;
