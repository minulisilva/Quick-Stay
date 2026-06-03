import PageHero from '../components/common/PageHero';
import { ShieldCheck, Database, Lock, Eye } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero
                title="Privacy Policy"
                subtitle="Your Trust, Our Priority"
                bgImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3764&auto=format&fit=crop"
            />

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white p-8 md:p-16 rounded-lg shadow-xl max-w-4xl mx-auto">
                    <div className="text-center mb-12 border-b border-gray-100 pb-8">
                        <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">Last Updated: December 10, 2025</p>
                        <p className="text-gray-600 italic">
                            At Quick Stay Hotel, we are committed to protecting the privacy and security of our guests. This policy outlines how we collect, use, and safeguard your personal information.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Section 1 */}
                        <div className="flex gap-6">
                            <div className="hidden md:block bg-primary/10 p-4 rounded-full h-fit text-primary">
                                <Database size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-secondary mb-4">Information We Collect</h3>
                                <p className="text-gray-600 leading-relaxed font-light mb-4">
                                    We collect information that you provide directly to us when you make a reservation, inquire about our services, or sign up for our loyalty program. This includes:
                                </p>
                                <ul className="list-disc list-inside text-gray-500 space-y-2 ml-2">
                                    <li>Personal identification (Name, email address, phone number)</li>
                                    <li>Payment information (Credit card details, billing address)</li>
                                    <li>Stay preferences (Room type, dietary requirements, special requests)</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="flex gap-6">
                            <div className="hidden md:block bg-primary/10 p-4 rounded-full h-fit text-primary">
                                <Eye size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-secondary mb-4">How We Use Your Information</h3>
                                <p className="text-gray-600 leading-relaxed font-light">
                                    Your data allows us to provide a seamless hospitality experience. We use it to:
                                </p>
                                <ul className="list-disc list-inside text-gray-500 space-y-2 ml-2 mt-4">
                                    <li>Process and confirm your reservations.</li>
                                    <li>Send you pre-arrival information and post-stay surveys.</li>
                                    <li>Personalize your stay based on your preferences.</li>
                                    <li>Improve our services and website functionality.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="flex gap-6">
                            <div className="hidden md:block bg-primary/10 p-4 rounded-full h-fit text-primary">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-secondary mb-4">Data Security</h3>
                                <p className="text-gray-600 leading-relaxed font-light">
                                    We employ industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. All payment transactions are encrypted using secure socket layer technology (SSL).
                                </p>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="flex gap-6">
                            <div className="hidden md:block bg-primary/10 p-4 rounded-full h-fit text-primary">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-secondary mb-4">Sharing of Information</h3>
                                <p className="text-gray-600 leading-relaxed font-light">
                                    We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 mb-4">Have questions about our privacy practices?</p>
                        <a href="mailto:privacy@quickstay.com" className="text-primary hover:text-secondary transition-colors font-medium">Contact Our Privacy Officer</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
