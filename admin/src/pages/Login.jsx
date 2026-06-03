import { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { login } = useAdminAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(email, password);
        if (result.success) {
            // Persist preference if Remember Me is checked
            if (rememberMe) {
                localStorage.setItem('quickstay_remember_me', 'true');
                localStorage.setItem('quickstay_admin_email', email);
            } else {
                localStorage.removeItem('quickstay_remember_me');
                localStorage.removeItem('quickstay_admin_email');
            }

            // Small delay to ensure state is committed
            setTimeout(() => {
                navigate('/admin');
            }, 100);
        } else {
            setError(result.message || "Invalid email or password. Please try again.");
        }
    };

    useEffect(() => {
        // Auto-fill email if Remember Me was enabled
        const remembered = localStorage.getItem('quickstay_remember_me');
        if (remembered === 'true') {
            const savedEmail = localStorage.getItem('quickstay_admin_email');
            if (savedEmail) {
                setEmail(savedEmail);
                setRememberMe(true);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#f5f5f9] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">QUICK<span className="text-[#696cff]">STAY</span></h1>
                    <p className="text-gray-500 mt-2">Welcome back! Please login to your account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-lg flex items-center gap-3 text-sm border border-red-100 animate-shake">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <button
                                type="button"
                                onClick={() => alert("Password reset link has been sent to your registered email (Service currently limited).")}
                                className="text-sm text-[#696cff] hover:underline font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696cff] focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-[#696cff] border-gray-300 rounded focus:ring-[#696cff]"
                        />
                        <label className="ml-2 text-sm text-gray-600">Remember me</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#696cff] text-white py-3 rounded-lg font-bold hover:bg-[#5f62e6] transition-all shadow-md active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        Demo Account: <span className="text-gray-800 font-medium">admin@quickstay.com / admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
