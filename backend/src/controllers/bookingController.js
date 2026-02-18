import supabase from '../config/supabase.js';
import { calculateBookingAmount, validateEstimatedHours } from '../utils/calculateAmount.js';
import { HTTP_STATUS, BOOKING_STATUS } from '../config/constants.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { provider_id, address_id, service_date, service_time, estimated_hours, notes } = req.body;
    const user_id = req.user.id;

    // Validate input
    if (!provider_id || !address_id || !service_date || !service_time || !estimated_hours) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate estimated hours
    const hoursValidation = validateEstimatedHours(estimated_hours);
    if (!hoursValidation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: hoursValidation.message
      });
    }

    // Check if provider exists and is active
    const { data: provider, error: providerError } = await supabase
      .from('service_providers')
      .select('id, hourly_rate, is_active')
      .eq('id', provider_id)
      .single();

    if (providerError || !provider || !provider.is_active) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Provider not found or not active'
      });
    }

    // Check if address belongs to user
    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .select('id')
      .eq('id', address_id)
      .eq('user_id', user_id)
      .single();

    if (addressError || !address) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Address not found or does not belong to you'
      });
    }

    // Check for booking conflicts (same provider, date, time)
    const { data: conflictBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('provider_id', provider_id)
      .eq('service_date', service_date)
      .eq('service_time', service_time)
      .in('status', ['pending', 'confirmed', 'in_progress'])
      .single();

    if (conflictBooking) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Calculate total amount
    const total_amount = calculateBookingAmount(provider.hourly_rate, estimated_hours);

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id,
        provider_id,
        address_id,
        service_date,
        service_time,
        estimated_hours,
        total_amount,
        notes,
        status: BOOKING_STATUS.PENDING
      }])
      .select(`
        *,
        service_providers (
          business_name,
          hourly_rate
        ),
        addresses (
          address_line1,
          city,
          state
        )
      `)
      .single();

    if (bookingError) throw bookingError;

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error creating booking'
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { status } = req.query;

    let query = supabase
      .from('bookings')
      .select(`
        *,
        provider:service_providers(*),
        address:addresses(*)
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        provider:service_providers(*),
        address:addresses(*),
        payment:payments(*)
      `)
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (error || !booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { cancellation_reason } = req.body;

    // Get booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (fetchError || !booking) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === BOOKING_STATUS.COMPLETED) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Update booking status
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: BOOKING_STATUS.CANCELLED,
        cancellation_reason,
        cancelled_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error cancelling booking'
    });
  }
};