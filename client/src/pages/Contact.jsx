import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { MapPin, Phone, Mail } from 'lucide-react';
import useContent from '../hooks/useContent';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
    const { content } = useContent('contact');
    const { user } = useAuth();

    const hero = content?.hero || {
        title: "Contact Us",
        subtitle: "At Your Service",
        backgroundImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=3869&auto=format&fit=crop"
    };

    const info = content?.info || {
        title: 'Get In Touch',
        location: '48 Janadhipathi Mawatha, Colombo 1, Sri Lanka',
        phone: '+94 112 421 221',
        email: 'info@quickstay.com',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7724181762424!2d79.84589851057514!3d6.917789293052988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259be2c6291d3%3A0xe9d61ae167b8738c!2sCinnamon%20Grand%20Colombo!5e0!3m2!1sen!2slk!4v1770024919739!5m2!1sen!2slk'
    };

    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');

        if (checkIn && checkOut && guests) {
            setMessage(`I would like to inquire about availability for ${guests} guest(s) from ${checkIn} to ${checkOut}.`);
        }
    }, [searchParams]);

    useEffect(() => {
        if (user) {
            const [first, ...lastParts] = (user.name || '').split(' ');
            setFirstName(first || '');
            setLastName(lastParts.join(' ') || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    email,
                    message: message
                })
            });
            if (response.ok) {
                alert('Message sent successfully!');
                setFirstName('');
                setLastName('');
                setEmail('');
                setMessage('');
            } else {
                alert('Failed to send message.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message.');
        }
    };

    return (
        <div>
            <PageHero
                title={hero.title}
                subtitle={hero.subtitle}
                bgImage={hero.backgroundImage}
            />

            <div className="bg-white relative">
                <div className="container mx-auto px-6 md:px-12 py-24 relative z-10">
                    <div className="flex flex-col lg:flex-row shadow-2xl bg-white">
                        <div className="w-full lg:w-5/12 bg-secondary text-white p-12 md:p-16 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[30px] border-white/5 opacity-20"></div>

                            <div>
                                <span className="block text-primary uppercase tracking-[0.2em] text-xs font-bold mb-8">Information</span>
                                <h2 className="text-4xl font-serif mb-12">{info.title}</h2>

                                <div className="space-y-10">
                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-primary">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-serif text-xl mb-2">Location</h4>
                                            <p className="text-white/70 font-light leading-relaxed">{info.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-primary">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-serif text-xl mb-2">Phone</h4>
                                            <p className="text-white/70 font-light">{info.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-primary">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-serif text-xl mb-2">Email</h4>
                                            <p className="text-white/70 font-light">{info.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 text-white/30 text-xs tracking-widest uppercase">
                                Quick Stay Hotel &copy; 2025
                            </div>
                        </div>

                        <div className="w-full lg:w-7/12 p-12 md:p-16">
                            <span className="block text-primary uppercase tracking-[0.2em] text-xs font-bold mb-8">Enquiry Form</span>
                            <h2 className="text-4xl font-serif text-secondary mb-12">Send a Message</h2>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group">
                                        <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            className="w-full border-b border-gray-200 py-2 outline-none focus:border-primary transition-colors bg-transparent text-secondary text-lg font-serif"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            className="w-full border-b border-gray-200 py-2 outline-none focus:border-primary transition-colors bg-transparent text-secondary text-lg font-serif"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full border-b border-gray-200 py-2 outline-none focus:border-primary transition-colors bg-transparent text-secondary text-lg font-serif"
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors">Message</label>
                                    <textarea
                                        rows="4"
                                        className="w-full border-b border-gray-200 py-2 outline-none focus:border-primary transition-colors bg-transparent text-secondary text-lg font-serif"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="pt-4">
                                    <Button type="submit" variant="primary" className="px-10 py-4 w-full md:w-auto">Send Message</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full bg-gray-200 relative">
                    {info.mapUrl ? (
                        <iframe
                            src={info.mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="filter grayscale opacity-80 hover:opacity-100 transition-opacity duration-500"
                            title="Hotel Location Map"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                                <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">Map will be displayed here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;