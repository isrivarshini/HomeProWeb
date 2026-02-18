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
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <Box sx={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/services/:categoryId" element={<ProvidersListPage />} /> 
              <Route path="/providers/:providerId" element={<ProviderDetailPage />} />
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookings/:bookingId" element={<BookingDetailPage />} />
              <Route path="/reviews/create/:bookingId" element={<CreateReviewPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;