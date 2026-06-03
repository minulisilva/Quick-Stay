import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSent(true);
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
                        <Link to="/login" className="text-sm uppercase tracking-widest text-gray-500 mb-8 block hover:text-primary transition-colors">
                            &larr; Back to Login
                        </Link>

                        <h1 className="text-4xl md:text-5xl font-serif text-secondary mb-3">Forgot Password?</h1>
                        <p className="text-gray-500 mb-10 text-lg">
                            Don't worry, we'll send you reset instructions.
                        </p>

                        {!isSent ? (
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

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-secondary text-white py-4 rounded-xl font-medium text-lg hover:bg-secondary/90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader size={24} className="animate-spin" />
                                    ) : (
                                        <>Send Instructions <ArrowRight size={20} /></>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 p-8 rounded-2xl text-center border border-green-100"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-serif text-secondary mb-2">Check your email</h3>
                                <p className="text-gray-600 mb-6">
                                    We've sent password reset instructions to <strong>{email}</strong>
                                </p>
                                <div className="text-sm text-gray-500">
                                    Did not receive the email? Check your spam filter or <button onClick={() => setIsSent(false)} className="text-primary font-bold hover:underline">try another email address</button>
                                </div>
                            </motion.div>
                        )}
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
                        src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=3870&auto=format&fit=crop"
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
                        <h2 className="text-5xl font-serif mb-6 leading-tight">"Your privacy and security are our top priority."</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-primary rounded-full"></div>
                            <p className="font-light tracking-wider uppercase">QuickStay Security</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
