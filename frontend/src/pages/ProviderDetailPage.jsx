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
  Rating,
  Stack,
  Avatar,
  Divider,
  TextField,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import { providerAPI, userAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ProviderDetailPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [provider, setProvider] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    address_id: '',
    service_date: '',
    service_time: '09:00',
    estimated_hours: 2,
    notes: '',
  });

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch provider details
      const providerRes = await providerAPI.getById(providerId);
      setProvider(providerRes.data.data);

      // Fetch reviews
      try {
        const reviewsRes = await axios.get(`http://localhost:3001/api/reviews/provider/${providerId}`);
        setReviews(reviewsRes.data.data);
      } catch (reviewError) {
        console.error('Failed to fetch reviews:', reviewError);
      } finally {
        setReviewsLoading(false);
      }

      // Fetch user addresses if authenticated
      if (isAuthenticated) {
        const addressesRes = await userAPI.getAddresses();
        setAddresses(addressesRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [providerId, isAuthenticated]);

  const handleBookingChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bookingForm.address_id) {
      setError('Please select an address');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const bookingData = {
        provider_id: providerId,
        address_id: bookingForm.address_id,
        service_date: bookingForm.service_date,
        service_time: bookingForm.service_time,
        estimated_hours: parseFloat(bookingForm.estimated_hours),
        notes: bookingForm.notes,
      };

      await bookingAPI.create(bookingData);
      setSuccess('Booking created successfully!');
      
      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#8B5CF6' }} />
      </Box>
    );
  }

  if (!provider) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
        <Navbar />
        <Container sx={{ py: 8 }}>
          <Typography variant="h5" sx={{ color: '#A1A1AA', textAlign: 'center' }}>
            Provider not found
          </Typography>
        </Container>
      </Box>
    );
  }

  // Generate time slots (9 AM to 5 PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    timeSlots.push(time);
  }

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
            onClick={() => navigate(-1)}
            sx={{ mb: 4, color: '#A1A1AA', '&:hover': { color: '#FFFFFF' } }}
          >
            Back
          </Button>
        </motion.div>

        <Grid container spacing={4}>
          {/* Left Column - Provider Info */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent sx={{ p: 4 }}>
                  {/* Provider Header */}
                  <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar
                      src={provider.profile_image_url}
                      alt={provider.business_name}
                      sx={{ width: 100, height: 100 }}
                    />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                        {provider.business_name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Rating
                          value={parseFloat(provider.rating) || 0}
                          precision={0.1}
                          readOnly
                          sx={{
                            '& .MuiRating-iconFilled': { color: '#8B5CF6' },
                            '& .MuiRating-iconEmpty': { color: 'rgba(255, 255, 255, 0.2)' },
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
                          {provider.rating ? parseFloat(provider.rating).toFixed(1) : '0.0'} ({provider.total_reviews || 0} reviews)
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  {/* Description */}
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFFFFF', mb: 2 }}>
                    About
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#A1A1AA', mb: 3 }}>
                    {provider.description}
                  </Typography>

                  <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  {/* Contact Info */}
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFFFFF', mb: 2 }}>
                    Contact Information
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PhoneIcon sx={{ color: '#8B5CF6' }} />
                      <Typography sx={{ color: '#A1A1AA' }}>{provider.phone}</Typography>
                    </Stack>
                    {provider.email && (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <EmailIcon sx={{ color: '#8B5CF6' }} />
                        <Typography sx={{ color: '#A1A1AA' }}>{provider.email}</Typography>
                      </Stack>
                    )}
                  </Stack>

                  <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  {/* Pricing */}
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#FFFFFF', mb: 2 }}>
                    Pricing
                  </Typography>
                  <Chip
                    label={`$${provider.hourly_rate}/hour`}
                    sx={{
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      color: '#8B5CF6',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      py: 2.5,
                      px: 2,
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Column - Booking Form */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card sx={{ position: 'sticky', top: 100 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 3 }}>
                    Book{' '}
                    <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
                      Service
                    </Box>
                  </Typography>

                  {error && (
                    <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 2 }}>
                      <Typography sx={{ color: '#FCA5A5' }}>{error}</Typography>
                    </Box>
                  )}

                  {success && (
                    <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 2 }}>
                      <Typography sx={{ color: '#86EFAC' }}>{success}</Typography>
                    </Box>
                  )}

                  <form onSubmit={handleBooking}>
                    <Stack spacing={3}>
                      {/* Address Selection */}
                      <TextField
                        select
                        label="Service Address"
                        name="address_id"
                        value={bookingForm.address_id}
                        onChange={handleBookingChange}
                        required
                        fullWidth
                        disabled={addresses.length === 0}
                        helperText={addresses.length === 0 ? 'Please add an address in your profile first' : ''}
                      >
                        {addresses.map((address) => (
                          <MenuItem key={address.id} value={address.id}>
                            {address.address_line1}, {address.city}, {address.state}
                          </MenuItem>
                        ))}
                      </TextField>

                      {/* Service Date */}
                      <TextField
                        label="Service Date"
                        name="service_date"
                        type="date"
                        value={bookingForm.service_date}
                        onChange={handleBookingChange}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: new Date().toISOString().split('T')[0], // Today or later
                        }}
                      />

                      {/* Service Time */}
                      <TextField
                        select
                        label="Service Time"
                        name="service_time"
                        value={bookingForm.service_time}
                        onChange={handleBookingChange}
                        required
                        fullWidth
                      >
                        {timeSlots.map((time) => (
                          <MenuItem key={time} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                      </TextField>

                      {/* Estimated Hours */}
                      <TextField
                        select
                        label="Estimated Hours"
                        name="estimated_hours"
                        value={bookingForm.estimated_hours}
                        onChange={handleBookingChange}
                        required
                        fullWidth
                      >
                        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8].map((hours) => (
                          <MenuItem key={hours} value={hours}>
                            {hours} {hours === 1 ? 'hour' : 'hours'}
                          </MenuItem>
                        ))}
                      </TextField>

                      {/* Notes */}
                      <TextField
                        label="Additional Notes (Optional)"
                        name="notes"
                        value={bookingForm.notes}
                        onChange={handleBookingChange}
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Any special instructions or requirements..."
                      />

                      {/* Total Amount */}
                      <Box sx={{ p: 2, backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
                            Estimated Total:
                          </Typography>
                          <Typography variant="h5" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                            ${(provider.hourly_rate * bookingForm.estimated_hours).toFixed(2)}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={bookingLoading || addresses.length === 0}
                        sx={{ py: 1.5 }}
                      >
                        {bookingLoading ? 'Creating Booking...' : 'Book Now'}
                      </Button>

                      {!isAuthenticated && (
                        <Typography variant="body2" sx={{ color: '#A1A1AA', textAlign: 'center' }}>
                          Please{' '}
                          <Box
                            component="span"
                            sx={{ color: '#8B5CF6', cursor: 'pointer' }}
                            onClick={() => navigate('/login')}
                          >
                            log in
                          </Box>
                          {' '}to book this service
                        </Typography>
                      )}
                    </Stack>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
        {/* Reviews Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 4 }}>
            Customer{' '}
            <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
              Reviews
            </Box>
          </Typography>

          {reviewsLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#8B5CF6' }} />
            </Box>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body1" sx={{ color: '#A1A1AA' }}>
                  No reviews yet. Be the first to review this provider!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={3}>
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
                          {review.user?.full_name || 'Anonymous'}
                        </Typography>
                        <Rating
                          value={review.rating}
                          readOnly
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': { color: '#8B5CF6' },
                            '& .MuiRating-iconEmpty': { color: 'rgba(255, 255, 255, 0.2)' },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Stack>

                    {review.comment && (
                      <Typography variant="body1" sx={{ color: '#A1A1AA', lineHeight: 1.6 }}>
                        {review.comment}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>

      </Container>
    </Box>
  );
};

export default ProviderDetailPage;