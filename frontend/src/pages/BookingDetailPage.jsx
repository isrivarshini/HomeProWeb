import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Divider,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ReceiptIcon from '@mui/icons-material/Receipt';

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchBookingDetails();
  }, [bookingId, isAuthenticated, navigate]);

  const fetchBookingDetails = async () => {
    try {
      const response = await bookingAPI.getById(bookingId);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await bookingAPI.cancel(bookingId, cancelReason);
      setCancelDialog(false);
      fetchBookingDetails(); // Refresh
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

  const getStatusStep = (status) => {
    const steps = {
      pending: 0,
      confirmed: 1,
      in_progress: 2,
      completed: 3,
      cancelled: -1,
    };
    return steps[status] || 0;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#8B5CF6' }} />
      </Box>
    );
  }

  if (!booking) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
        <Navbar />
        <Container sx={{ py: 8 }}>
          <Typography variant="h5" sx={{ color: '#A1A1AA', textAlign: 'center' }}>
            Booking not found
          </Typography>
        </Container>
      </Box>
    );
  }

  const statusStep = getStatusStep(booking.status);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
      <GrainOverlay />
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/bookings')}
            sx={{ mb: 4, color: '#A1A1AA', '&:hover': { color: '#FFFFFF' } }}
          >
            Back to Bookings
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
                Booking{' '}
                <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
                  Details
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
                Booking ID: {booking.id.substring(0, 8)}...
              </Typography>
            </Box>

            <Chip
              label={booking.status.toUpperCase()}
              sx={{
                backgroundColor: getStatusColor(booking.status).bg,
                color: getStatusColor(booking.status).text,
                border: `1px solid ${getStatusColor(booking.status).border}`,
                fontWeight: 600,
                fontSize: '1rem',
                py: 2.5,
                px: 2,
              }}
            />
          </Stack>
        </motion.div>

        {/* Booking Timeline */}
        {booking.status !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3, fontWeight: 600 }}>
                  Booking Timeline
                </Typography>
                <Stepper activeStep={statusStep} alternativeLabel>
                  <Step>
                    <StepLabel>Pending</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Confirmed</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>In Progress</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Completed</StepLabel>
                  </Step>
                </Stepper>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Grid container spacing={4}>
          {/* Left Column - Service Details */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Provider Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3, fontWeight: 600 }}>
                      Service Provider
                    </Typography>

                    <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                      <Avatar
                        src={booking.provider?.profile_image_url}
                        alt={booking.provider?.business_name}
                        sx={{ width: 80, height: 80 }}
                      />
                      <Box>
                        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
                          {booking.provider?.business_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
                          {booking.provider?.description?.substring(0, 80)}...
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PhoneIcon sx={{ color: '#8B5CF6', fontSize: '1.2rem' }} />
                          <Typography sx={{ color: '#A1A1AA' }}>{booking.provider?.phone}</Typography>
                        </Stack>
                      </Grid>
                      {booking.provider?.email && (
                        <Grid item xs={12} sm={6}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <EmailIcon sx={{ color: '#8B5CF6', fontSize: '1.2rem' }} />
                            <Typography sx={{ color: '#A1A1AA' }}>{booking.provider?.email}</Typography>
                          </Stack>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Service Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3, fontWeight: 600 }}>
                      Service Information
                    </Typography>

                    <Stack spacing={3}>
                      {/* Date */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CalendarTodayIcon sx={{ color: '#8B5CF6', fontSize: '1.5rem' }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 0.5 }}>
                            Service Date
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                            {new Date(booking.service_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Time */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <AccessTimeIcon sx={{ color: '#8B5CF6', fontSize: '1.5rem' }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 0.5 }}>
                            Service Time
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                            {booking.service_time} ({booking.estimated_hours} {booking.estimated_hours === 1 ? 'hour' : 'hours'})
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Address */}
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <LocationOnIcon sx={{ color: '#8B5CF6', fontSize: '1.5rem', mt: 0.3 }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 0.5 }}>
                            Service Address
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                            {booking.address?.address_line1}
                            {booking.address?.address_line2 && <>, {booking.address.address_line2}</>}
                            <br />
                            {booking.address?.city}, {booking.address?.state} {booking.address?.zip_code}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Notes */}
                      {booking.notes && (
                        <>
                          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 1 }}>
                              Additional Notes
                            </Typography>
                            <Box sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2 }}>
                              <Typography variant="body1" sx={{ color: '#FFFFFF', fontStyle: 'italic' }}>
                                "{booking.notes}"
                              </Typography>
                            </Box>
                          </Box>
                        </>
                      )}

                      {/* Cancellation Info */}
                      {booking.status === 'cancelled' && booking.cancellation_reason && (
                        <>
                          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#FCA5A5', mb: 1, fontWeight: 600 }}>
                              Cancellation Reason
                            </Typography>
                            <Box sx={{ p: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 2, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                              <Typography variant="body1" sx={{ color: '#FCA5A5' }}>
                                {booking.cancellation_reason}
                              </Typography>
                            </Box>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Stack>
          </Grid>

          {/* Right Column - Payment & Actions */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Payment Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3, fontWeight: 600 }}>
                      Payment Summary
                    </Typography>

                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ color: '#A1A1AA' }}>Hourly Rate</Typography>
                        <Typography sx={{ color: '#FFFFFF' }}>${booking.provider?.hourly_rate}/hr</Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ color: '#A1A1AA' }}>Estimated Hours</Typography>
                        <Typography sx={{ color: '#FFFFFF' }}>{booking.estimated_hours} hrs</Typography>
                      </Stack>

                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                          Total Amount
                        </Typography>
                        <Typography variant="h4" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                          ${parseFloat(booking.total_amount).toFixed(2)}
                        </Typography>
                      </Stack>

                      {booking.payment && (
                        <>
                          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 1 }}>
                              Payment Status
                            </Typography>
                            <Chip
                              label={booking.payment.status.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: booking.payment.status === 'completed' 
                                  ? 'rgba(34, 197, 94, 0.15)' 
                                  : 'rgba(234, 179, 8, 0.15)',
                                color: booking.payment.status === 'completed' 
                                  ? '#86EFAC' 
                                  : '#FACC15',
                              }}
                            />
                          </Box>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {booking.status === 'pending' && (
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() => setCancelDialog(true)}
                        >
                          Cancel Booking
                        </Button>
                      )}

                      {booking.status === 'completed' && (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => navigate(`/reviews/create/${booking.id}`)}
                        >
                          Leave a Review
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(`/providers/${booking.provider?.id}`)}
                      >
                        View Provider
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialog}
        onClose={() => setCancelDialog(false)}
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
          <Button onClick={() => setCancelDialog(false)} sx={{ color: '#A1A1AA' }}>
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

export default BookingDetailPage;