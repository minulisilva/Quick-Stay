import Hero from '../components/home/Hero';
import Welcome from '../components/home/Welcome';
import FeaturedRooms from '../components/home/FeaturedRooms';
import DiningPreview from '../components/home/DiningPreview';
import Offers from '../components/home/Offers';
import Testimonials from '../components/common/Testimonials';

const Home = () => {
    return (
        <>
            <Hero />
            <div className="relative z-10 bg-white">
                <Welcome />
                <FeaturedRooms />
                <DiningPreview />
                <Offers />
                <Testimonials />
            </div>
        </>
    );
};

export default Home;
