import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Instagram } from 'lucide-react';

const LeadershipTeam = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch('http://localhost:3000/staff');
                const data = await response.json();
                // Only show staff members marked for display on About page
                const publicStaff = data.filter(member => member.visible === true || member.displayOnAbout === true);
                setTeamMembers(publicStaff);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching staff:', error);
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    if (loading) return null;
    if (teamMembers.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 relative">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <span className="block text-primary uppercase tracking-[0.2em] text-xs font-bold mb-4">The People</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-secondary">Meet Our Leadership</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, idx) => (
                        <motion.div
                            key={member._id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className="group bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="h-80 overflow-hidden relative">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <div className="p-8 text-center relative">
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 border border-gray-100 shadow-sm">
                                    <span className="text-xs font-bold tracking-widest text-primary uppercase">{member.role}</span>
                                </div>
                                <h3 className="text-2xl font-serif text-secondary mb-3 mt-2">{member.name}</h3>
                                <p className="text-gray-500 text-sm font-light leading-relaxed mb-4">{member.bio}</p>

                                {/* Social Media Links */}
                                {member.socials && (member.socials.linkedin || member.socials.twitter || member.socials.instagram) && (
                                    <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
                                        {member.socials.linkedin && (
                                            <a
                                                href={`https://linkedin.com/in/${member.socials.linkedin}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#0077b5] text-gray-600 hover:text-white flex items-center justify-center transition-all duration-300"
                                            >
                                                <Linkedin size={16} />
                                            </a>
                                        )}
                                        {member.socials.twitter && (
                                            <a
                                                href={`https://twitter.com/${member.socials.twitter}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#1da1f2] text-gray-600 hover:text-white flex items-center justify-center transition-all duration-300"
                                            >
                                                <Twitter size={16} />
                                            </a>
                                        )}
                                        {member.socials.instagram && (
                                            <a
                                                href={`https://instagram.com/${member.socials.instagram}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gradient-to-tr hover:from-[#f58529] hover:via-[#dd2a7b] hover:to-[#8134af] text-gray-600 hover:text-white flex items-center justify-center transition-all duration-300"
                                            >
                                                <Instagram size={16} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LeadershipTeam;
