import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { User, Package, LogOut, Settings } from 'lucide-react';

const Account = () => {
    const { user, logout, updateProfile, bookings, diningBookings, offerBookings, loadingBookings } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingTab, setBookingTab] = useState('rooms');
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        country: user?.country || '',
        dietaryPreferences: user?.dietaryPreferences || '',
        specialRequests: user?.specialRequests || ''
    });
    const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdateStatus({ type: 'loading', message: 'Updating profile...' });
        try {
            await updateProfile(profileData);
            setUpdateStatus({ type: 'success', message: 'Profile updated successfully!' });
            setTimeout(() => setUpdateStatus({ type: '', message: '' }), 3000);
        } catch (error) {
            setUpdateStatus({ type: 'error', message: error.message || 'Failed to update profile' });
        }
    };

    if (!user) {
        return (
            <div className="bg-gray-50 min-h-screen pb-20">
                <PageHero title="My Account" subtitle="Login" bgImage="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=3870&auto=format&fit=crop" />
                <div className="container mx-auto px-4 -mt-20 relative z-10 flex justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                        <User size={48} className="mx-auto text-primary mb-4" />
                        <h2 className="text-2xl font-serif text-secondary mb-2">Welcome Back</h2>
                        <p className="text-gray-500 mb-8">Sign in to manage your bookings and profile.</p>
                        <Button to="/login" className="w-full">Sign In</Button>
                        <div className="mt-4 text-sm text-gray-500">
                            New here? <Link to="/signup" className="text-secondary font-bold hover:underline">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderBookings = () => {
        if (loadingBookings) {
            return (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Fetching your reservations...</p>
                </div>
            );
        }

        let items = [];
        let emptyMessage = "";
        let browseLink = "";
        let browseText = "";

        if (bookingTab === 'rooms') {
            items = bookings;
            emptyMessage = "No room bookings yet";
            browseLink = "/rooms";
            browseText = "Browse Rooms";
        } else if (bookingTab === 'dining') {
            items = diningBookings;
            emptyMessage = "No table reservations yet";
            browseLink = "/dining";
            browseText = "Explore Dining";
        } else if (bookingTab === 'offers') {
            items = offerBookings;
            emptyMessage = "No offer bookings yet";
            browseLink = "/offers";
            browseText = "View Offers";
        }

        if (!items || items.length === 0) {
            return (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">{emptyMessage}</h3>
                    <p className="mt-1 text-sm text-gray-500">Time to plan your next experience!</p>
                    <div className="mt-6">
                        <Button to={browseLink}>{browseText}</Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary flex flex-col md:flex-row justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex-1">
                            <div className="text-sm text-gray-400 mb-2">
                                {item.createdAt ? `Booked on ${new Date(item.createdAt).toLocaleDateString()}` : 'Reservation'}
                            </div>

                            <div className="mb-2 last:mb-0">
                                <h4 className="text-xl font-bold text-secondary">
                                    {item.room || item.restaurant || item.offer}
                                </h4>
                                <p className="text-gray-500 text-sm">
                                    {item.checkIn ? `${new Date(item.checkIn).toLocaleDateString()} - ${new Date(item.checkOut).toLocaleDateString()}` :
                                        item.date ? `${new Date(item.date).toLocaleDateString()}${item.time ? ` at ${item.time}` : ''}` : ''
                                    }
                                </p>
                                {item.guests && <p className="text-xs text-gray-400 mt-1">{item.guests} Guest(s)</p>}
                            </div>

                            <p className="text-xs text-gray-400 mt-2 font-mono">Ref: {item.id || item._id}</p>
                        </div>

                        <div className="text-right flex flex-col justify-between">
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                    item.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            {(item.amount || item.totalPrice) && (
                                <div className="text-xl font-bold text-primary mt-4">
                                    ${Number(item.amount || item.totalPrice || 0).toFixed(2)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero title="My Dashboard" subtitle={`Welcome, ${user.name}`} bgImage="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=3870&auto=format&fit=crop" />

            <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 bg-secondary text-white text-center">
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {user.name.charAt(0)}
                                </div>
                                <h3 className="font-serif text-xl">{user.name}</h3>
                                <p className="text-white/60 text-sm">{user.email}</p>
                            </div>
                            <nav className="p-4 space-y-2">
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'bookings' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Package size={18} /> My Bookings
                                </button>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Settings size={18} /> Profile Settings
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'bookings' && (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <h3 className="text-2xl font-serif text-secondary">Your Bookings</h3>

                                    <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                                        <button
                                            onClick={() => setBookingTab('rooms')}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${bookingTab === 'rooms' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-secondary'}`}
                                        >
                                            Rooms
                                        </button>
                                        <button
                                            onClick={() => setBookingTab('dining')}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${bookingTab === 'dining' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-secondary'}`}
                                        >
                                            Dining
                                        </button>
                                        <button
                                            onClick={() => setBookingTab('offers')}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${bookingTab === 'offers' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-secondary'}`}
                                        >
                                            Offers
                                        </button>
                                    </div>
                                </div>

                                {renderBookings()}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-white p-8 rounded-lg shadow-md">
                                <h3 className="text-2xl font-serif text-secondary mb-2">Profile Settings</h3>
                                <p className="text-gray-500 mb-6 text-sm">Keep your details up to date for faster checkouts.</p>

                                {updateStatus.message && (
                                    <div className={`mb-6 p-4 rounded-md text-sm ${updateStatus.type === 'error' ? 'bg-red-50 text-red-700' :
                                        updateStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                        {updateStatus.message}
                                    </div>
                                )}

                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleProfileChange}
                                                className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors font-serif text-secondary bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleProfileChange}
                                                className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors font-serif text-secondary bg-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleProfileChange}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full border-b border-gray-300 py-2 outline-none focus:border-primary transition-colors font-serif text-secondary bg-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileChange}
                                            placeholder="123 Luxury Lane"
                                            className="w-full border-b border-gray-300 py-2 outline-none font-serif text-secondary bg-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={profileData.city}
                                                onChange={handleProfileChange}
                                                placeholder="New York"
                                                className="w-full border-b border-gray-300 py-2 outline-none font-serif text-secondary bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={profileData.country}
                                                onChange={handleProfileChange}
                                                placeholder="United States"
                                                className="w-full border-b border-gray-300 py-2 outline-none font-serif text-secondary bg-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Dietary Preferences</label>
                                        <input
                                            type="text"
                                            name="dietaryPreferences"
                                            value={profileData.dietaryPreferences}
                                            onChange={handleProfileChange}
                                            placeholder="e.g., Vegetarian, Gluten-free"
                                            className="w-full border-b border-gray-300 py-2 outline-none font-serif text-secondary bg-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Special Requests</label>
                                        <textarea
                                            name="specialRequests"
                                            value={profileData.specialRequests}
                                            onChange={handleProfileChange}
                                            rows="3"
                                            placeholder="Any preferences for your stay?"
                                            className="w-full border border-gray-300 p-3 rounded-md outline-none font-serif text-secondary resize-none bg-transparent"
                                        ></textarea>
                                    </div>

                                    <Button variant="primary" type="submit" disabled={updateStatus.type === 'loading'} className="mt-4">
                                        {updateStatus.type === 'loading' ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>

                </div>
            </div >
        </div >
    );
};

export default Account;
