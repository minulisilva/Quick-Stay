import { useState } from 'react';
import { Link } from 'react-router-dom';
import { roomsList } from '../data/rooms';
import PageHero from '../components/common/PageHero';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';

const Booking = () => {
    // This page is now primarily a "Select Room" catalog
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageHero
                title="Select Your Room"
                subtitle="Begin Your Journey"
                bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3870&auto=format&fit=crop"
            />

            <div className="container mx-auto px-4 md:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 gap-8">
                    {roomsList.map((room, index) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row group"
                        >
                            {/* Image */}
                            <div className="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-3xl font-serif text-secondary">{room.name}</h3>
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold">{room.size}</span>
                                    </div>
                                    <p className="text-gray-600 mb-6 font-light">{room.description}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        {room.amenities.slice(0, 4).map(a => (
                                            <span key={a} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded text-center">{a}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                                    <div>
                                        <span className="text-gray-400 text-sm block mb-1">Starting from</span>
                                        <span className="text-3xl font-bold text-primary">${room.price} <span className="text-sm text-gray-400 font-normal">/ night</span></span>
                                    </div>
                                    <Button to={`/room/${room.id}`} variant="primary" className="px-8">
                                        View Details & Book
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Booking;
