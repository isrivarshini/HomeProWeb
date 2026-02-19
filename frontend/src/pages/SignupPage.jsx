import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Divider, // Add this
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GrainOverlay from '../components/GrainOverlay';
import GoogleIcon from '@mui/icons-material/Google';
const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      phone: formData.phone,
    });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 6,
        backgroundColor: '#0A0A0A',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GrainOverlay />

      {/* Purple gradient orbs */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '5%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 3, color: '#A1A1AA', '&:hover': { color: '#FFFFFF' } }}
          >
            Back to Home
          </Button>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h3"
                fontWeight={700}
                gutterBottom
                sx={{ color: '#FFFFFF' }}
              >
                Get{' '}
                <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
                  started
                </Box>
              </Typography>
              <Typography variant="body1" sx={{ color: '#A1A1AA' }}>
                Create your account to book services
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#FCA5A5',
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoFocus
                />

                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoComplete="email"
                />

                <TextField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  fullWidth
                  placeholder="5551234567"
                />

                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  helperText="At least 6 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#A1A1AA' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                {/* Google Login Button */}
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleLogin}
                  sx={{
                    py: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    },
                  }}
                >
                  Continue with Google
                </Button>

                <Box sx={{ position: 'relative', my: 2 }}>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: '#111111',
                      px: 2,
                      color: '#A1A1AA',
                      fontSize: '0.875rem',
                    }}
                  >
                    OR
                  </Typography>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    mt: 2,
                  }}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </Box>
            </form>

            {/* Login Link */}
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{
                    fontWeight: 600,
                    color: '#8B5CF6',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#A78BFA',
                    },
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignupPage;