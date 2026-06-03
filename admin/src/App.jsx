import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Bookings from './pages/Bookings'; // Import Bookings
import Rooms from './pages/Rooms';       // Import Rooms
import Users from './pages/Users';       // Import Users
import Settings from './pages/Settings'; // Import Settings
import Dining from './pages/Dining';     // Import Dining
import Experiences from './pages/Experiences'; // Import Experiences
import Offers from './pages/Offers';           // Import Offers
import Payments from './pages/Payments';         // Import Payments
import Feedback from './pages/Feedback';         // Import Feedback
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import Invoice from './pages/Invoice';           // Import Reports
import Messages from './pages/Messages';
import Jobs from './pages/Jobs';
import ContentManager from './pages/ContentManager';
import Awards from './pages/Awards';
import Calendar from './pages/Calendar';

const ProtectedRoute = ({ children }) => {
  const { admin } = useAdminAuth();
  const location = useLocation();

  if (!admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="dining" element={<Dining />} />
            <Route path="experiences" element={<Experiences />} />
            <Route path="offers" element={<Offers />} />
            <Route path="payments" element={<Payments />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="reports" element={<Reports />} />
            <Route path="staff" element={<Staff />} />
            <Route path="messages" element={<Messages />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="awards" element={<Awards />} />
            <Route path="invoice/:userId" element={<Invoice />} />
          </Route>

          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}
export default App;
