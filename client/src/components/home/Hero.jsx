import { motion, useScroll, useTransform } from 'framer-motion';
import BookingWidget from './BookingWidget';
import { useRef } from 'react';
import useContent from '../../hooks/useContent';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const { content, loading } = useContent('home');
    const hero = content?.hero || {
        welcomeText: 'Welcome to',
        title: 'Quick Stay',
        luxuryText: 'Luxury',
        description: 'Where timeless elegance meets modern luxury on the edge of the Indian Ocean.'
    };

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative w-full h-[105vh] overflow-hidden">
            {/* Parallax Background */}
            <motion.div style={{ y, opacity }} className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10"></div>
                {hero.videoUrl ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-105"
                        poster={hero.posterUrl}
                    >
                        <source src={hero.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : hero.posterUrl ? (
                    <img
                        src={hero.posterUrl}
                        alt="Hero Background"
                        className="w-full h-full object-cover scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary via-gray-800 to-black"></div>
                )}
            </motion.div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4 pb-20">
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative inline-block"
                    >
                        <span className="block text-xs md:text-sm uppercase tracking-[0.4em] mb-4 text-primary font-medium">{hero.welcomeText}</span>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-tight drop-shadow-2xl">
                            {hero.title}
                        </h1>
                        <span className="absolute -bottom-4 right-0 text-3xl md:text-5xl font-handwriting text-primary opacity-80" style={{ fontFamily: 'cursive' }}>{hero.luxuryText}</span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto text-white/80"
                    >
                        {hero.description}
                    </motion.p>
                </div>
            </div>

            {/* Booking Widget - Floating Glass Effect */}
            <div className="absolute bottom-12 left-0 w-full px-4 z-30">
                <div className="max-w-6xl mx-auto">
                    <BookingWidget />
                </div>
            </div>
        </section>
    );
};

export default Hero;
