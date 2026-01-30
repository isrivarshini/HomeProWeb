import supabase from '../config/supabase.js';
import { HTTP_STATUS } from '../config/constants.js';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, created_at')
      .eq('id', user_id)
      .single();

    if (error || !user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { full_name, phone } = req.body;

    // Validate input
    if (!full_name && !phone) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide fields to update'
      });
    }

    // Build update object
    const updates = {};
    if (full_name) updates.full_name = full_name;
    if (phone) updates.phone = phone;

    // Update user
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user_id)
      .select('id, email, full_name, phone')
      .single();

    if (error) throw error;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// @desc    Get user addresses
// @route   GET /api/user/addresses
// @access  Private
export const getAddresses = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user_id)
      .order('is_primary', { ascending: false });

    if (error) throw error;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error fetching addresses'
    });
  }
};

// @desc    Add new address
// @route   POST /api/user/addresses
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { address_line1, address_line2, city, state, zip_code, is_primary } = req.body;

    // Validate input
    if (!address_line1 || !city || !state || !zip_code) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide all required address fields'
      });
    }

    // Create address
    const { data: newAddress, error } = await supabase
      .from('addresses')
      .insert([{
        user_id,
        address_line1,
        address_line2,
        city,
        state,
        zip_code,
        is_primary: is_primary || false
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Address added successfully',
      data: newAddress
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error adding address'
    });
  }
};

// @desc    Update address
// @route   PUT /api/user/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { address_line1, address_line2, city, state, zip_code, is_primary } = req.body;

    // Check if address belongs to user
    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (!existingAddress) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Build update object
    const updates = {};
    if (address_line1) updates.address_line1 = address_line1;
    if (address_line2 !== undefined) updates.address_line2 = address_line2;
    if (city) updates.city = city;
    if (state) updates.state = state;
    if (zip_code) updates.zip_code = zip_code;
    if (is_primary !== undefined) updates.is_primary = is_primary;

    // Update address
    const { data: updatedAddress, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error updating address'
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/user/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if address belongs to user
    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('id')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (!existingAddress) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Delete address
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Error deleting address'
    });
  }
};