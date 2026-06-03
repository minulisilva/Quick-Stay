import PageHero from '../components/common/PageHero';
import AlternatingSection from '../components/common/AlternatingSection';
import { useRooms } from '../hooks/useRooms';

const Rooms = () => {
    const { rooms, loading, error } = useRooms();

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading rooms...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center pt-20 text-red-500">{error}</div>;

    return (
        <div>
            <PageHero
                title="Accommodation"
                subtitle="Sanctuaries of Serenity"
                bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3870&auto=format&fit=crop"
            />

            <div className="bg-white">
                {rooms.map((room, index) => (
                    <AlternatingSection
                        key={room._id || room.id}
                        title={room.name}
                        subtitle="Detailed Craftsmanship"
                        description={room.description || room.shortDescription}
                        image={room.image}
                        features={room.amenities || room.features || []}
                        reverse={index % 2 !== 0}
                        actionText="Book This Suite"
                        linkTo={`/room/${room._id || room.id}`}
                        imageAspect="aspect-square md:aspect-[4/3]"
                        imageWidth="md:w-[40%]"
                        contentWidth="md:w-[55%]"
                    />
                ))}
            </div>
        </div>
    );
};

export default Rooms;
