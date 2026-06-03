import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const API_BASE_URL = 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        setUser(userData);
                        
                        // Validate token by fetching profile
                        const response = await fetch(`${API_BASE_URL}/users/profile`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        
                        if (!response.ok) {
                            throw new Error('Token validation failed');
                        }
                        
                        const profileData = await response.json();
                        setUser({ ...profileData, token });
                        localStorage.setItem('user', JSON.stringify({ ...profileData, token }));
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setToken(data.token);
            setUser(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, data };
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            setError(null);
            const res = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.errors ? data.errors.join(', ') : (data.message || 'Registration failed');
                throw new Error(errorMessage);
            }

            setToken(data.token);
            setUser(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, data };
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setError(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateProfile = async (profileData) => {
        try {
            setError(null);
            const res = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Update failed');
            }

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return { success: true, data };
        } catch (error) {
            console.error('Profile update error:', error);
            setError(error.message);
            return { success: false, error: error.message };
        }
    };

    const [bookings, setBookings] = useState([]);
    const [diningBookings, setDiningBookings] = useState([]);
    const [offerBookings, setOfferBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    const fetchUserBookings = async () => {
        if (!user || !token) return;
        setLoadingBookings(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            const [roomsRes, diningRes, offersRes] = await Promise.all([
                fetch(`${API_BASE_URL}/bookings`, { headers }),
                fetch(`${API_BASE_URL}/diningReservations`, { headers }),
                fetch(`${API_BASE_URL}/offerReservations`, { headers })
            ]);

            // Check for authentication errors
            if (roomsRes.status === 401 || diningRes.status === 401 || offersRes.status === 401) {
                console.warn("Token expired or invalid. Logging out.");
                logout();
                return;
            }

            const [roomsData, diningData, offersData] = await Promise.all([
                roomsRes.ok ? roomsRes.json() : [],
                diningRes.ok ? diningRes.json() : [],
                offersRes.ok ? offersRes.json() : []
            ]);

            setBookings(roomsData);
            setDiningBookings(diningData);
            setOfferBookings(offersData);

        } catch (error) {
            console.error("Error fetching user bookings:", error);
            setError('Failed to fetch bookings');
        } finally {
            setLoadingBookings(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchUserBookings();
        } else {
            setBookings([]);
            setDiningBookings([]);
            setOfferBookings([]);
            setLoadingBookings(false);
        }
    }, [user, token]);

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            user, token, login, register, logout, updateProfile, loading, error, clearError,
            bookings, diningBookings, offerBookings, loadingBookings, fetchUserBookings
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
