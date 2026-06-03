import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import Button from './Button';

const AlternatingSection = ({
    title,
    subtitle,
    description,
    image,
    reverse = false,
    features = [],
    actionText = "Learn More",
    onAction,
    linkTo,
    imageAspect = "aspect-[4/5] md:aspect-[3/4]",
    imageWidth = "md:w-1/2",
    contentWidth = "md:w-1/2",
    className
}) => {
    return (
        <section className={twMerge("py-20 md:py-32 overflow-hidden", className)}>
            <div className="container mx-auto px-6 md:px-12">
                <div className={twMerge("flex flex-col md:flex-row items-center gap-12 lg:gap-20", reverse ? "md:flex-row-reverse" : "")}>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className={twMerge("w-full relative group", imageWidth)}
                    >
                        <div className={`relative overflow-hidden ${imageAspect}`}>
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s]"
                            />
                            {/* Decorative Frame */}
                            <div className={twMerge("absolute inset-0 border-[1px] border-white/20 m-4 z-10 transition-all duration-500", reverse ? "border-r-0" : "border-l-0")}></div>
                        </div>
                        {/* Decorative Offset Box */}
                        <div className={twMerge("absolute -bottom-6 -z-10 w-full h-full bg-gray-100 hidden md:block", reverse ? "-right-6" : "-left-6")}></div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={twMerge("w-full", contentWidth)}
                    >
                        <span className="block text-primary uppercase tracking-[0.2em] text-xs font-bold mb-6">{subtitle}</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary mb-8 leading-tight">{title}</h2>
                        <p className="text-gray-600 font-light text-lg leading-relaxed mb-8">
                            {description}
                        </p>

                        {features.length > 0 && (
                            <ul className="grid grid-cols-2 gap-4 mb-10">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-500 uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <Button
                            variant="primary"
                            className="bg-transparent border-secondary text-secondary hover:bg-secondary hover:text-white"
                            onClick={onAction}
                            to={linkTo}
                        >
                            {actionText}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AlternatingSection;
