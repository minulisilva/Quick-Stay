import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, Loader, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative z-10">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link to="/" className="text-sm uppercase tracking-widest text-gray-500 mb-8 block hover:text-primary transition-colors">
                            &larr; Return Home
                        </Link>

                        <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-3">Welcome back</h1>
                        <p className="text-gray-500 mb-10 text-lg">Please enter your details to sign in.</p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider font-bold text-gray-900">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs uppercase tracking-wider font-bold text-gray-900">Password</label>
                                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-secondary text-white py-4 rounded-xl font-medium text-lg hover:bg-secondary/90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader size={24} className="animate-spin" />
                                ) : (
                                    <>Sign In <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-gray-500">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary font-bold hover:underline">
                                    Create for free
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block w-1/2 relative bg-gray-900 overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3870&auto=format&fit=crop"
                        alt="Luxury Hotel"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </motion.div>

                <div className="absolute bottom-20 left-12 right-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <h2 className="text-5xl font-serif mb-6 leading-tight">"Experience the epitome of luxury and comfort."</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-primary rounded-full"></div>
                            <p className="font-light tracking-wider uppercase">QuickStay Resorts</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
