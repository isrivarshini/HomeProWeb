import { verifyToken } from '../utils/generateToken.js';
import supabase from '../config/supabase.js';
import { HTTP_STATUS } from '../config/constants.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    // ── 1. Try custom JWT first (email/password users) ──────────────────
    const decoded = verifyToken(token);

    if (decoded) {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, full_name, phone')
        .eq('id', decoded.id)
        .single();

      if (!error && user) {
        req.user = user;
        return next();
      }
    }

    // ── 2. Fall back to Supabase JWT (Google OAuth users) ───────────────
    const { data: { user: supabaseUser }, error: supabaseError } =
      await supabase.auth.getUser(token);

    if (supabaseError || !supabaseUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized, invalid token',
      });
    }

    // Try to find matching user in your users table
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('id, email, full_name, phone')
      .eq('email', supabaseUser.email)
      .single();

    if (!dbError && dbUser) {
      // Existing user found
      req.user = dbUser;
      return next();
    }

    // ── 3. Auto-create user row for first-time Google OAuth users ────────
    const fullName =
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      supabaseUser.email.split('@')[0];

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: supabaseUser.id,
        email: supabaseUser.email,
        full_name: fullName,
        phone: supabaseUser.phone || '',
        password_hash: 'oauth_user', // placeholder, OAuth users don't need a password
      })
      .select('id, email, full_name, phone')
      .single();

    if (createError || !newUser) {
      console.error('Failed to create OAuth user:', createError);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Failed to create user profile',
      });
    }

    req.user = newUser;
    return next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized',
    });
  }
};