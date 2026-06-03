import PageHero from '../components/common/PageHero';
import useContent from '../hooks/useContent';

const Gallery = () => {
    const { content } = useContent('gallery');

    const hero = content?.hero || {
        title: "Gallery",
        subtitle: "A Visual Journey",
        backgroundImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=3870&auto=format&fit=crop"
    };

    const galleryData = content?.images || {};
    const photos = galleryData?.photos || [];
    
    const imageArray = Array.isArray(photos) && photos.length > 0 
        ? photos.map(url => ({ src: url }))
        : [
            { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3870&auto=format&fit=crop" },
            { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=3774&auto=format&fit=crop" },
            { src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=3870&auto=format&fit=crop" },
            { src: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=3870&auto=format&fit=crop" }
        ];

    return (
        <div>
            <PageHero
                title={hero.title}
                subtitle={hero.subtitle}
                bgImage={hero.backgroundImage || hero.bgImage}
            />
            <div className="bg-white py-24">
                <div className="container mx-auto px-4 md:px-8">

                    {/* Gallery Images */}
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {imageArray.map((img, idx) => (
                            <div key={idx} className="break-inside-avoid relative group overflow-hidden cursor-pointer">
                                <img
                                    src={img.src}
                                    className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110"
                                    alt={`Gallery ${idx}`}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="text-white font-serif italic text-lg tracking-wider border border-white px-6 py-2">View</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
