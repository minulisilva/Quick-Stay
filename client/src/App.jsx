import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AnimatedRoutes from './components/common/AnimatedRoutes';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  )
}

export default App;
