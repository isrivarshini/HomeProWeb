import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import axios from 'axios';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/payments/create-payment-intent`,
          { booking_id: bookingData.bookingId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        setError('Failed to initialize payment. Please try again.');
      }
    };

    createPaymentIntent();
  }, [bookingData.bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      // Payment successful - confirm with backend
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/payments/confirm-payment`,
        {
          booking_id: bookingData.bookingId,
          payment_intent_id: paymentIntent.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Redirect to success page
      navigate('/bookings', { 
        state: { 
          message: 'Payment successful! Your booking is confirmed.' 
        } 
      });
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5' }}>
            {error}
          </Alert>
        )}

        {/* Booking Summary */}
        <Box sx={{ p: 3, backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
            Booking Summary
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: '#A1A1AA' }}>Provider:</Typography>
              <Typography sx={{ color: '#FFFFFF' }}>{bookingData.providerName}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: '#A1A1AA' }}>Date:</Typography>
              <Typography sx={{ color: '#FFFFFF' }}>{bookingData.date}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: '#A1A1AA' }}>Time:</Typography>
              <Typography sx={{ color: '#FFFFFF' }}>{bookingData.time}</Typography>
            </Stack>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" sx={{ color: '#FFFFFF' }}>Total Amount:</Typography>
              <Typography variant="h5" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                ${bookingData.amount}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Card Element */}
        <Box>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
            <CreditCardIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Payment Information
          </Typography>
          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#FFFFFF',
                    '::placeholder': {
                      color: '#A1A1AA',
                    },
                  },
                  invalid: {
                    color: '#FCA5A5',
                  },
                },
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: '#A1A1AA', mt: 1, display: 'block' }}>
            <LockIcon sx={{ fontSize: '0.875rem', verticalAlign: 'middle', mr: 0.5 }} />
            Your payment information is secure and encrypted
          </Typography>
        </Box>

        {/* Test Card Info */}
        <Alert severity="info" sx={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Test Mode - Use Test Card:
          </Typography>
          <Typography variant="body2">
            Card: 4242 4242 4242 4242<br />
            Expiry: Any future date<br />
            CVC: Any 3 digits
          </Typography>
        </Alert>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={!stripe || processing || !clientSecret}
          sx={{ py: 2, fontSize: '1.1rem', fontWeight: 600 }}
        >
          {processing ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1, color: '#FFFFFF' }} />
              Processing Payment...
            </>
          ) : (
            `Pay $${bookingData.amount}`
          )}
        </Button>
      </Stack>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    navigate('/');
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
      <GrainOverlay />
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 2,
              color: '#FFFFFF',
              fontWeight: 700,
            }}
          >
            Complete{' '}
            <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
              Payment
            </Box>
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 6,
              color: '#A1A1AA',
            }}
          >
            Secure checkout powered by Stripe
          </Typography>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <Elements stripe={stripePromise}>
                <CheckoutForm bookingData={bookingData} />
              </Elements>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PaymentPage;