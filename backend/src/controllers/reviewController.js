import supabase from '../config/supabase.js';

// Create review
export const createReview = async (req, res) => {
  try {
    const { booking_id, provider_id, rating, comment } = req.body;
    const user_id = req.user.id;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if booking exists and belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .eq('user_id', user_id)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings',
      });
    }

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('*')
      .eq('booking_id', booking_id)
      .single();

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this booking',
      });
    }

    // Create review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        booking_id,
        user_id,
        provider_id,
        rating,
        comment: comment || null,
      })
      .select()
      .single();

    if (reviewError) throw reviewError;

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get reviews for a provider
export const getProviderReviews = async (req, res) => {
  try {
    const { provider_id } = req.params;

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(full_name)
      `)
      .eq('provider_id', provider_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};