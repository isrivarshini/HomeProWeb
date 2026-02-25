import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CategoryGrid from '../components/CategoryGrid';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);
  return (
    <Box sx={{ position: 'relative', backgroundColor: '#0A0A0A' }}>
      <GrainOverlay />
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '95vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0A0A0A',
        }}
      >
        {/* Purple gradient orbs */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '-5%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <Container maxWidth="lg">
          <Stack spacing={5} alignItems="center" textAlign="center" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 3,
                  py: 1,
                  borderRadius: 50,
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#8B5CF6',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.4 },
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: '#FFFFFF',
                    letterSpacing: '0.05em',
                  }}
                >
                  TRUSTED BY 10,000+ CUSTOMERS
                </Typography>
              </Box>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '2.5rem', sm: '4rem', md: '6rem', lg: '7rem' }, // Changed xs from 3.5rem
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  mb: 2,
                  color: '#FFFFFF',
                }}
              >
                The truly{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    fontStyle: 'italic',
                    color: '#8B5CF6',
                  }}
                >
                  limitless
                </Box>
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '2rem', sm: '3.5rem', md: '5rem', lg: '6rem' }, // Changed xs
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  color: '#FFFFFF',
                }}
              >
                home services.
              </Typography>
            </motion.div>

            {/* Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
            <Typography
              sx={{
                maxWidth: 700,
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#A1A1AA',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }, // Changed xs
                px: { xs: 2, sm: 0 }, // Add padding on mobile
              }}
            >
                Say goodbye to expensive freelancers, and hello to{' '}
                <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
                  limitless
                </Box>
                , lightning fast home services.
              </Typography>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {
                    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.125rem',
                    fontWeight: 700,
                  }}
                >
                  Browse Services
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.125rem',
                    fontWeight: 700,
                  }}
                >
                  See Plans
                </Button>
              </Stack>
            </motion.div>
          </Stack>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box id="categories" sx={{ backgroundColor: '#0A0A0A' }}>
        <CategoryGrid />
      </Box>
    </Box>
  );
};

export default LandingPage;