import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProvidersListPage from './pages/ProvidersListPage'; 
import ProviderDetailPage from './pages/ProviderDetailPage'; 
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage'; 
import BookingDetailPage from './pages/BookingDetailPage';
import CreateReviewPage from './pages/CreateReviewPage'; 
import Footer from './components/Footer'; 
import PaymentPage from './pages/PaymentPage'; 
import DashboardPage from './pages/DashboardPage';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ServicesPage from './pages/ServicesPage';

// Add this component before App()
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <Box sx={{ backgroundColor: '#0A0A0A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <BrowserRouter>
          <AuthProvider>
            <Box sx={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/services/:categoryId" element={<ProvidersListPage />} />
                <Route path="/providers/:providerId" element={<ProviderDetailPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                <Route path="/bookings/:bookingId" element={<ProtectedRoute><BookingDetailPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/reviews/create/:bookingId" element={<ProtectedRoute><CreateReviewPage /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />

              </Routes>
            </Box>
            <Footer />
          </AuthProvider>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;