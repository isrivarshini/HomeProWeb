import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Rating,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';

const CreateReviewPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
  });

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
      const bookingData = response.data.data;
      
      // Check if booking is completed
      if (bookingData.status !== 'completed') {
        setError('You can only review completed bookings');
      }
      
      setBooking(bookingData);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (reviewForm.rating === 0) {
    setError('Please select a rating');
    return;
  }

  // Check if provider exists
  if (!booking.provider || !booking.provider.id) {
    setError('Provider information is missing');
    return;
  }

  setSubmitting(true);
  setError('');

  try {
    // Create review via API
    await axios.post(
      `http://localhost:3001/api/reviews`,
      {
        booking_id: bookingId,
        provider_id: booking.provider.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    setSuccess('Review submitted successfully!');
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate(`/bookings/${bookingId}`);
    }, 2000);
  } catch (error) {
    console.error('Failed to submit review:', error);
    setError(error.response?.data?.message || 'Failed to submit review');
  } finally {
    setSubmitting(false);
  }
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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
      <GrainOverlay />
      <Navbar />

      <Container maxWidth="md" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/bookings/${bookingId}`)}
            sx={{ mb: 4, color: '#A1A1AA', '&:hover': { color: '#FFFFFF' } }}
          >
            Back to Booking
          </Button>
        </motion.div>

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
            Leave a{' '}
            <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
              Review
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 6,
              color: '#A1A1AA',
            }}
          >
            Share your experience with {booking.provider?.business_name}
          </Typography>
        </motion.div>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardContent sx={{ p: 5 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5' }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3, backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#86EFAC' }}>
                  {success}
                </Alert>
              )}

              {booking.status === 'completed' && !error && (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    {/* Rating */}
                    <Box>
                      <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
                        How would you rate this service?
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Rating
                          name="rating"
                          value={reviewForm.rating}
                          onChange={(event, newValue) => {
                            setReviewForm({ ...reviewForm, rating: newValue });
                            setError('');
                          }}
                          size="large"
                          sx={{
                            fontSize: '3rem',
                            '& .MuiRating-iconFilled': { color: '#8B5CF6' },
                            '& .MuiRating-iconHover': { color: '#A78BFA' },
                            '& .MuiRating-iconEmpty': { color: 'rgba(255, 255, 255, 0.2)' },
                          }}
                        />
                        {reviewForm.rating > 0 && (
                          <Typography variant="h5" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                            {reviewForm.rating}.0
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Rating Labels */}
                      {reviewForm.rating > 0 && (
                        <Typography variant="body2" sx={{ color: '#A1A1AA', mt: 1 }}>
                          {reviewForm.rating === 1 && 'Poor - Not satisfied'}
                          {reviewForm.rating === 2 && 'Fair - Below expectations'}
                          {reviewForm.rating === 3 && 'Good - Met expectations'}
                          {reviewForm.rating === 4 && 'Very Good - Exceeded expectations'}
                          {reviewForm.rating === 5 && 'Excellent - Outstanding service!'}
                        </Typography>
                      )}
                    </Box>

                    {/* Comment */}
                    <Box>
                      <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
                        Share your experience (Optional)
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="Tell us about your experience with this provider..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        inputProps={{ maxLength: 500 }}
                        helperText={`${reviewForm.comment.length}/500 characters`}
                      />
                    </Box>

                    {/* Service Details Summary */}
                    <Box sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 1 }}>
                        Service Date
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 2 }}>
                        {new Date(booking.service_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 1 }}>
                        Provider
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        {booking.provider?.business_name}
                      </Typography>
                    </Box>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={submitting || reviewForm.rating === 0}
                      sx={{ py: 2, fontSize: '1.1rem', fontWeight: 600 }}
                    >
                      {submitting ? 'Submitting Review...' : 'Submit Review'}
                    </Button>
                  </Stack>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CreateReviewPage;