import supabase from '../config/supabase.js';
import { HTTP_STATUS } from '../config/constants.js';

// @desc    Get all service categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('display_order');

    if (error) throw error;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};

// @desc    Get providers by category
// @route   GET /api/providers?category_id=xxx
// @access  Public
export const getProviders = async (req, res) => {
  try {
    const { category_id } = req.query;

    let query = supabase
      .from('service_providers')
      .select(`
        *,
        service_categories (
          id,
          name
        )
      `)
      .eq('is_active', true);

    // Filter by category if provided
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    const { data: providers, error } = await query.order('rating', { ascending: false });

    if (error) throw error;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error fetching providers'
    });
  }
};

// @desc    Get single provider details
// @route   GET /api/providers/:id
// @access  Public
export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: provider, error } = await supabase
      .from('service_providers')
      .select(`
        *,
        service_categories (
          id,
          name
        ),
        provider_availability (
          id,
          day_of_week,
          start_time,
          end_time,
          is_active
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !provider) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Provider not found'
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: provider
    });
  } catch (error) {
    console.error('Get provider error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error fetching provider'
    });
  }
};

// @desc    Get provider availability for a specific date
// @route   GET /api/providers/:id/availability?date=YYYY-MM-DD
// @access  Public
export const getProviderAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide a date'
      });
    }

    // Get day of week from date (0=Sunday, 6=Saturday)
    const dayOfWeek = new Date(date).getDay();

    // Get provider's availability for this day
    const { data: availability, error } = await supabase
      .from('provider_availability')
      .select('*')
      .eq('provider_id', id)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true);

    if (error) throw error;

    if (!availability || availability.length === 0) {
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Provider not available on this day',
        data: { available: false, slots: [] }
      });
    }

    // Get existing bookings for this date
    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('service_time, estimated_hours')
      .eq('provider_id', id)
      .eq('service_date', date)
      .in('status', ['pending', 'confirmed', 'in_progress']);

    if (bookingError) throw bookingError;

    // Generate available time slots (1-hour intervals)
    const slots = [];
    const bookedTimes = bookings.map(b => b.service_time);

    availability.forEach(slot => {
      const startHour = parseInt(slot.start_time.split(':')[0]);
      const endHour = parseInt(slot.end_time.split(':')[0]);

      for (let hour = startHour; hour < endHour; hour++) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        const isBooked = bookedTimes.includes(timeSlot);
        
        slots.push({
          time: timeSlot,
          available: !isBooked
        });
      }
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        available: true,
        date,
        day_of_week: dayOfWeek,
        slots
      }
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error fetching availability'
    });
  }
};