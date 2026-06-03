import { useState, useEffect } from 'react';
import { User, Lock, Save } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import ImageUpload from '../components/ImageUpload';

const Settings = () => {
    const { admin, updateProfile } = useAdminAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '', // Add avatar to form data
        dob: '',
        address: '',
        city: '',
        country: '',
        dietaryPreferences: '',
        specialRequests: '',
        currentPassword: '',
        newPassword: ''
    });

    useEffect(() => {
        if (admin) {
            setFormData(prev => ({
                ...prev,
                name: admin.name || '',
                email: admin.email || '',
                phone: admin.phone || '',
                avatar: admin.avatar || '',
                dob: admin.dob ? admin.dob.split('T')[0] : '', // Format date for input
                address: admin.address || '',
                city: admin.city || '',
                country: admin.country || '',
                dietaryPreferences: admin.dietaryPreferences || '',
                specialRequests: admin.specialRequests || ''
            }));
        }
    }, [admin]);

    const handleAvatarUpload = (url) => {
        console.log('Avatar upload success, updating profile with URL:', url);
        setFormData(prev => ({ ...prev, avatar: url }));
        updateProfile({ avatar: url });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Remove password fields if empty to avoid accidental updates
        const updates = { ...formData };
        if (!updates.newPassword) {
            delete updates.currentPassword;
            delete updates.newPassword;
        }
        console.log('Sending updates for admin:', updates);
        updateProfile(updates);
        alert('Profile updated successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <div className="mb-4">
                            <ImageUpload
                                currentImage={formData.avatar}
                                onUploadSuccess={handleAvatarUpload}
                            />
                        </div>
                        <h2 className="font-bold text-gray-800 text-lg">{admin?.name}</h2>
                        <p className="text-gray-500 text-sm mb-4">{admin?.role}</p>
                        <div className="text-xs text-gray-400">
                            Member since Dec 2024
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <User size={20} className="text-[#696cff]" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={formData.dob}
                                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <User size={20} className="text-[#696cff]" />
                                    Address
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                            placeholder="123 Main St"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={e => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <User size={20} className="text-[#696cff]" />
                                    Preferences
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
                                        <textarea
                                            value={formData.dietaryPreferences}
                                            onChange={e => setFormData({ ...formData, dietaryPreferences: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                            placeholder="e.g. Vegetarian, Gluten-free"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                                        <textarea
                                            value={formData.specialRequests}
                                            onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                            placeholder="e.g. Extra pillows, Late check-out"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Lock size={20} className="text-[#696cff]" />
                                    Security
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                value={formData.newPassword}
                                                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-[#696cff] text-white rounded-lg hover:bg-[#5f62e6] transition-colors font-medium shadow-md">
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Settings;
