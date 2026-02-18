import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState({ open: false, bookingId: null });
  const [cancelReason, setCancelReason] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data.data);
      filterBookings(response.data.data, 0);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = (allBookings, tabIndex) => {
    if (tabIndex === 0) {
      // All bookings
      setFilteredBookings(allBookings);
    } else if (tabIndex === 1) {
      // Upcoming (pending, confirmed)
      setFilteredBookings(allBookings.filter(b => ['pending', 'confirmed'].includes(b.status)));
    } else if (tabIndex === 2) {
      // Completed
      setFilteredBookings(allBookings.filter(b => b.status === 'completed'));
    } else if (tabIndex === 3) {
      // Cancelled
      setFilteredBookings(allBookings.filter(b => b.status === 'cancelled'));
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    filterBookings(bookings, newValue);
  };

  const handleCancelBooking = async () => {
    try {
      await bookingAPI.cancel(cancelDialog.bookingId, cancelReason);
      setCancelDialog({ open: false, bookingId: null });
      setCancelReason('');
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: 'rgba(234, 179, 8, 0.15)', text: '#FACC15', border: 'rgba(234, 179, 8, 0.3)' },
      confirmed: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.3)' },
      in_progress: { bg: 'rgba(139, 92, 246, 0.15)', text: '#A78BFA', border: 'rgba(139, 92, 246, 0.3)' },
      completed: { bg: 'rgba(34, 197, 94, 0.15)', text: '#86EFAC', border: 'rgba(34, 197, 94, 0.3)' },
      cancelled: { bg: 'rgba(239, 68, 68, 0.15)', text: '#FCA5A5', border: 'rgba(239, 68, 68, 0.3)' },
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#8B5CF6' }} />
      </Box>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
      <GrainOverlay />
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              color: '#FFFFFF',
              fontWeight: 700,
            }}
          >
            My{' '}
            <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
              Bookings
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: '#A1A1AA',
            }}
          >
            View and manage all your service bookings
          </Typography>
        </motion.div>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#8B5CF6',
              },
              '& .MuiTab-root': {
                color: '#A1A1AA',
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#8B5CF6',
                },
              },
            }}
          >
            <Tab label="All" />
            <Tab label="Upcoming" />
            <Tab label="Completed" />
            <Tab label="Cancelled" />
          </Tabs>
        </Box>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#A1A1AA', mb: 2 }}>
              No bookings found
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
              Browse Services
            </Button>
          </Box>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Grid container spacing={3}>
              {filteredBookings.map((booking) => (
                <Grid item xs={12} key={booking.id}>
                  <motion.div variants={item}>
                    <Card>
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                          {/* Left: Booking Info */}
                          <Grid item xs={12} md={8}>
                            <Stack spacing={2}>
                              {/* Provider Name */}
                              <Typography variant="h5" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                                {booking.provider?.business_name || 'Provider'}
                              </Typography>

                              {/* Status */}
                              <Chip
                                label={booking.status.toUpperCase()}
                                sx={{
                                  backgroundColor: getStatusColor(booking.status).bg,
                                  color: getStatusColor(booking.status).text,
                                  border: `1px solid ${getStatusColor(booking.status).border}`,
                                  fontWeight: 600,
                                  width: 'fit-content',
                                }}
                              />

                              {/* Date & Time */}
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <CalendarTodayIcon sx={{ color: '#8B5CF6', fontSize: '1.2rem' }} />
                                  <Typography sx={{ color: '#A1A1AA' }}>
                                    {new Date(booking.service_date).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center">
                                  <AccessTimeIcon sx={{ color: '#8B5CF6', fontSize: '1.2rem' }} />
                                  <Typography sx={{ color: '#A1A1AA' }}>
                                    {booking.service_time} ({booking.estimated_hours} {booking.estimated_hours === 1 ? 'hour' : 'hours'})
                                  </Typography>
                                </Stack>
                              </Stack>

                              {/* Address */}
                              <Stack direction="row" spacing={1} alignItems="flex-start">
                                <LocationOnIcon sx={{ color: '#8B5CF6', fontSize: '1.2rem', mt: 0.3 }} />
                                <Typography sx={{ color: '#A1A1AA' }}>
                                  {booking.address?.address_line1}, {booking.address?.city}, {booking.address?.state} {booking.address?.zip_code}
                                </Typography>
                              </Stack>
                              

                              {/* Notes */}
                              {booking.notes && (
                                <Box sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2 }}>
                                  <Typography variant="body2" sx={{ color: '#A1A1AA', fontStyle: 'italic' }}>
                                    "{booking.notes}"
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Grid>

                          {/* Right: Amount & Actions */}
                          <Grid item xs={12} md={4}>
                            <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                              {/* Total Amount */}
                              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 0.5 }}>
                                  Total Amount
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                                  ${parseFloat(booking.total_amount).toFixed(2)}
                                </Typography>
                              </Box>

                              {/* Actions */}
                              <Stack spacing={1} sx={{ width: '100%' }}>
                                <Button
                                  variant="outlined"
                                  fullWidth
                                  onClick={() => navigate(`/bookings/${booking.id}`)}
                                >
                                  View Details
                                </Button>

                                {booking.status === 'pending' && (
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    onClick={() => setCancelDialog({ open: true, bookingId: booking.id })}
                                  >
                                    Cancel Booking
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </Container>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, bookingId: null })}
        PaperProps={{
          sx: {
            backgroundColor: '#111111',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#FFFFFF' }}>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#A1A1AA', mb: 2 }}>
            Please provide a reason for cancellation:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Reason for cancellation..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, bookingId: null })} sx={{ color: '#A1A1AA' }}>
            Keep Booking
          </Button>
          <Button onClick={handleCancelBooking} variant="contained" color="error">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookingsPage;