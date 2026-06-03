import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
