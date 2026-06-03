import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Signup = () => {
    const { login } = useAuth(); // We'll just auto-login after signup for now
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // In a real app, we'd register then login. Here we just simulate login with the new name.
            login(formData.email, formData.name);
            setIsLoading(false);
            navigate('/account');
        }, 1500);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero title="Create Account" subtitle="Join Quick Stay" bgImage="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3870&auto=format&fit=crop" />

            <div className="container mx-auto px-4 -mt-20 relative z-10 flex justify-center">
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-lg w-full">
                    <div className="text-center mb-10">
                        <ShieldCheck size={48} className="mx-auto text-primary mb-4" />
                        <h2 className="text-3xl font-serif text-secondary mb-2">Join Membership</h2>
                        <p className="text-gray-500">Unlock best rates and exclusive benefits.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md outline-none focus:border-primary font-serif text-secondary"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="text-xs text-gray-500">
                            By creating an account, you agree to our <Link to="/terms" className="text-secondary underline">Terms of Service</Link> and <Link to="/privacy" className="text-secondary underline">Privacy Policy</Link>.
                        </div>

                        <Button
                            variant="primary"
                            className="w-full py-4 flex justify-center items-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
