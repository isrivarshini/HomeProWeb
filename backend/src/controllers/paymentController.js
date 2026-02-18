import Stripe from 'stripe';
import supabase from '../config/supabase.js';

// Initialize Stripe lazily (after env is loaded)
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// Create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const stripe = getStripe();
    const { booking_id } = req.body;
    const user_id = req.user.id;

    // Get booking details
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, provider:service_providers(*)')
      .eq('id', booking_id)
      .eq('user_id', user_id)
      .single();

    if (error || !booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(booking.total_amount) * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        booking_id: booking.id,
        user_id: user_id,
        provider_name: booking.provider.business_name,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: booking.total_amount,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message,
    });
  }
};

// Confirm payment and update booking
export const confirmPayment = async (req, res) => {
  try {
    const stripe = getStripe();
    const { booking_id, payment_intent_id } = req.body;
    const user_id = req.user.id;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
      });
    }

    // Update booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', booking_id)
      .eq('user_id', user_id);

    if (bookingError) throw bookingError;

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id,
        stripe_payment_id: payment_intent_id,
        amount: paymentIntent.amount / 100, // Convert back to dollars
        status: 'completed',
        payment_method: 'card',
      });

    if (paymentError) throw paymentError;

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and booking updated',
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message,
    });
  }
};
