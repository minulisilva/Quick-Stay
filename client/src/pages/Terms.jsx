import PageHero from '../components/common/PageHero';
import { ScrollText, CreditCard, Clock, XCircle } from 'lucide-react';

const Terms = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero
                title="Terms & Conditions"
                subtitle="Guidelines for Your Stay"
                bgImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=3870&auto=format&fit=crop"
            />

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white p-8 md:p-16 rounded-lg shadow-xl max-w-4xl mx-auto">
                    <div className="text-center mb-12 border-b border-gray-100 pb-8">
                        <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">Effective Date: January 1, 2025</p>
                        <p className="text-gray-600 italic">
                            Welcome to Quick Stay Hotel. These terms and conditions govern your use of our website and your stay at our property. By making a reservation, you agree to these terms.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Section 1 */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <ScrollText className="text-primary" size={24} />
                                <h3 className="text-xl font-serif text-secondary font-bold">Reservations</h3>
                            </div>
                            <p className="text-gray-600 font-light text-sm leading-relaxed">
                                All reservations are subject to availability. To guarantee your booking, a valid credit card is required at the time of reservation. The hotel reserves the right to cancel reservations with invalid payment information.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="text-primary" size={24} />
                                <h3 className="text-xl font-serif text-secondary font-bold">Check-in / Check-out</h3>
                            </div>
                            <p className="text-gray-600 font-light text-sm leading-relaxed">
                                Check-in time is from **2:00 PM** onwards. Check-out time is by **12:00 PM** noon. Early check-in or late check-out is subject to availability and may incur additional charges (usually 50% of the room rate up to 6:00 PM).
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <XCircle className="text-primary" size={24} />
                                <h3 className="text-xl font-serif text-secondary font-bold">Cancellation Policy</h3>
                            </div>
                            <p className="text-gray-600 font-light text-sm leading-relaxed">
                                Cancellations made 48 hours prior to arrival incur no fee. Cancellations within 48 hours or no-shows will be charged the first night's room rate and tax. Non-refundable bookings are charged in full at the time of booking.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="text-primary" size={24} />
                                <h3 className="text-xl font-serif text-secondary font-bold">Payment & Taxes</h3>
                            </div>
                            <p className="text-gray-600 font-light text-sm leading-relaxed">
                                We accept Visa, MasterCard, and American Express. All rates are subject to applicable local taxes and service charges (currently 15% total). Full payment for the stay + incidental deposit is required upon check-in.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-gray-50 rounded-lg border-l-4 border-secondary">
                        <h4 className="font-bold text-secondary mb-2">House Rules</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>• Quick Stay Hotel is a 100% non-smoking property. A cleaning fee applies for violations.</li>
                            <li>• Pets are not allowed, with the exception of diverse-ability service animals.</li>
                            <li>• Quiet hours are observed from 10:00 PM to 7:00 AM.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
