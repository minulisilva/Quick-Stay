import useContent from '../../hooks/useContent';

const Stats = () => {
    const { content } = useContent('home');
    const stats = content?.stats || {
        rooms: '150',
        guests: '10000+',
        years: '25',
        awards: '15'
    };

    const statsData = [
        { label: 'Rooms', value: stats.rooms },
        { label: 'Happy Guests', value: stats.guests },
        { label: 'Years of Service', value: stats.years },
        { label: 'Awards Won', value: stats.awards }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {statsData.map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 uppercase tracking-wider text-sm">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;