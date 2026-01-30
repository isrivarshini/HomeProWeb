import { verifyToken } from '../utils/generateToken.js';
import supabase from '../config/supabase.js';
import { HTTP_STATUS } from '../config/constants.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized, invalid token'
      });
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized'
    });
  }
};