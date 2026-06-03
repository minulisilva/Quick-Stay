import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarRange, BedDouble, Users, LogOut, Settings as SettingsIcon, Bell, Utensils, Sparkles, Tag, DollarSign, MessageSquare, BarChart3, Mail, Briefcase, Layout, ChevronDown } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLayout = () => {
    const { admin, logout } = useAdminAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (admin) {
            fetchNotifications();
            // Optional: Poll for new notifications every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [admin]);

    const fetchNotifications = async () => {
        try {
            console.log('Fetching notifications...');
            const token = localStorage.getItem('quickstay_admin_token');
            if (!token) {
                console.warn('No admin token found in localStorage');
                return;
            }
            const response = await fetch('http://localhost:3000/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Notification response status:', response.status);
            const data = await response.json();
            console.log('Notification data received:', data);
            if (Array.isArray(data)) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch(`http://localhost:3000/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('quickstay_admin_token');
            await fetch('http://localhost:3000/notifications/read-all', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarLink = ({ to, icon, label }) => (
        <NavLink
            to={to}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-[#2b2b40] text-[#696cff]' : 'text-gray-400 hover:text-white hover:bg-[#2b2b40]'}`}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </NavLink>
    );

    return (
        <div className="flex h-screen bg-[#f5f5f9]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e1e2d] text-white flex flex-col shadow-xl z-20">
                <div className="p-6">
                    <h1 className="text-2xl font-bold tracking-wider text-white">QUICK<span className="text-[#696cff]">STAY</span></h1>
                </div>

                <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto scrollbar-thin">
                    <SidebarLink to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                    <SidebarLink to="/admin/calendar" icon={<CalendarRange size={18} />} label="Calendar" />
                    <SidebarLink to="/admin/bookings" icon={<CalendarRange size={18} />} label="Bookings" />
                    <SidebarLink to="/admin/rooms" icon={<BedDouble size={18} />} label="Rooms" />
                    <SidebarLink to="/admin/users" icon={<Users size={18} />} label="Guests" />
                    <SidebarLink to="/admin/dining" icon={<Utensils size={18} />} label="Dining" />
                    <SidebarLink to="/admin/experiences" icon={<Sparkles size={18} />} label="Experiences" />
                    <SidebarLink to="/admin/offers" icon={<Tag size={18} />} label="Offers" />
                    <SidebarLink to="/admin/payments" icon={<DollarSign size={18} />} label="Payments" />
                    <SidebarLink to="/admin/feedback" icon={<MessageSquare size={18} />} label="Feedback" />
                    <SidebarLink to="/admin/messages" icon={<Mail size={18} />} label="Messages" />
                    <SidebarLink to="/admin/jobs" icon={<Briefcase size={18} />} label="Careers" />
                    <SidebarLink to="/admin/reports" icon={<BarChart3 size={18} />} label="Reports" />
                    <SidebarLink to="/admin/staff" icon={<Users size={18} />} label="Staff Members" />
                    <SidebarLink to="/admin/awards" icon={<Layout size={18} />} label="Awards" />
                    <SidebarLink to="/admin/content" icon={<LayoutDashboard size={18} />} label="Website CMS" />

                    <div className="pt-2 mt-2 border-t border-gray-700/50">
                        <SidebarLink to="/admin/settings" icon={<SettingsIcon size={18} />} label="Settings" />
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 w-full rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto flex flex-col">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 z-10 sticky top-0">
                    <h2 className="text-gray-500 font-medium">Welcome back, <span className="text-gray-800 font-bold">{admin?.name}</span></h2>

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative transition-colors"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button onClick={markAllAsRead} className="text-[10px] font-bold text-[#696cff] uppercase tracking-wider hover:underline">
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map(notif => (
                                                <div
                                                    key={notif._id}
                                                    onClick={() => {
                                                        if (!notif.isRead) markAsRead(notif._id);
                                                        if (notif.link) navigate(notif.link);
                                                        setShowNotifications(false);
                                                    }}
                                                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 flex items-start gap-3 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                                                        notif.type === 'feedback' ? 'bg-amber-100 text-amber-600' :
                                                            notif.type === 'message' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {notif.type === 'booking' ? <CalendarRange size={14} /> :
                                                            notif.type === 'feedback' ? <MessageSquare size={14} /> :
                                                                notif.type === 'message' ? <Mail size={14} /> : <Bell size={14} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <p className={`text-sm ${!notif.isRead ? 'text-gray-900 font-bold' : 'text-gray-800 font-medium'}`}>{notif.title}</p>
                                                            {!notif.isRead && <div className="w-1.5 h-1.5 bg-[#696cff] rounded-full mt-1.5"></div>}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">
                                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Bell size={20} className="text-gray-300" />
                                                </div>
                                                <p className="text-sm text-gray-400">No notifications yet</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-50 text-center bg-gray-50/30">
                                        <button className="text-xs font-bold text-[#696cff] hover:underline uppercase tracking-widest">View History</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                                className="flex items-center gap-3 hover:bg-gray-50 pl-2 pr-3 py-1.5 rounded-full transition-all border border-transparent hover:border-gray-100"
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#696cff] to-[#60a5fa] flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white overflow-hidden">
                                    {admin?.avatar ? (
                                        <img src={admin.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        admin?.name?.charAt(0) || 'A'
                                    )}
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-bold text-gray-800 leading-tight">{admin?.name || 'Admin User'}</div>
                                    <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{admin?.role || 'Administrator'}</div>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                                        <p className="font-semibold text-gray-800">{admin?.name}</p>
                                        <p className="text-xs text-gray-500">{admin?.email}</p>
                                    </div>

                                    <NavLink to="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#696cff] transition-colors">
                                        <SettingsIcon size={16} />
                                        Settings
                                    </NavLink>
                                    <div className="border-t border-gray-50 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <div className="p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
