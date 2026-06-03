import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
};

const API_BASE_URL = 'http://localhost:3000';

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            const storedAdmin = localStorage.getItem('quickstay_admin');
            const storedToken = localStorage.getItem('quickstay_admin_token');

            if (storedAdmin && storedToken) {
                try {
                    setAdmin(JSON.parse(storedAdmin));

                    const res = await fetch(`${API_BASE_URL}/users/profile`, {
                        headers: { 'Authorization': `Bearer ${storedToken}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.role !== 'Admin') {
                            logout();
                            return;
                        }
                        const updatedAdmin = { ...data, token: storedToken };
                        setAdmin(updatedAdmin);
                        localStorage.setItem('quickstay_admin', JSON.stringify(updatedAdmin));
                    } else if (res.status === 401) {
                        logout();
                    }
                } catch (error) {
                    console.error('Admin auth init failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.role !== 'Admin') {
                throw new Error('Access denied: Admin privileges required');
            }

            setAdmin(data);
            localStorage.setItem('quickstay_admin', JSON.stringify(data));
            localStorage.setItem('quickstay_admin_token', data.token);
            return { success: true };
        } catch (error) {
            console.error('Admin login error:', error);
            setError(error.message);
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        setAdmin(null);
        setError(null);
        localStorage.removeItem('quickstay_admin');
        localStorage.removeItem('quickstay_admin_token');
    };

    const updateProfile = async (updates) => {
        try {
            setError(null);
            const token = localStorage.getItem('quickstay_admin_token');
            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Update failed');
            }

            setAdmin(data);
            localStorage.setItem('quickstay_admin', JSON.stringify(data));
            if (data.token) {
                localStorage.setItem('quickstay_admin_token', data.token);
            }
            return { success: true, data };
        } catch (error) {
            console.error('Profile update error:', error);
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    const clearError = () => setError(null);

    return (
        <AdminAuthContext.Provider value={{
            admin, login, logout, loading, updateProfile, error, clearError
        }}>
            {!loading && children}
        </AdminAuthContext.Provider>
    );
};
