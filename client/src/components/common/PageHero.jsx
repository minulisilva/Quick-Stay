import { motion } from 'framer-motion';

const PageHero = ({ title, subtitle, bgImage }) => {
    return (
        <div className="relative h-[60vh] flex items-center justify-center text-center text-white">
            {/* Background */}
            <div className="absolute inset-0">
                <img src={bgImage} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="block text-sm uppercase tracking-[0.2em] mb-4 text-white/90">{subtitle}</span>
                    <h1 className="text-5xl md:text-6xl font-serif mb-6 drop-shadow-lg">{title}</h1>
                </motion.div>
            </div>
        </div>
    );
};

export default PageHero;
