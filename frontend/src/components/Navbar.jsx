import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                cursor: 'pointer',
                letterSpacing: '-0.02em'
              }}
              onClick={() => navigate('/')}
            >
              HomePro
            </Typography>
          </motion.div>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button 
                    color="inherit" 
                    sx={{ color: '#FFFFFF' }}
                    onClick={() => navigate('/bookings')}
                  >
                    My Bookings
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    color="inherit" 
                    sx={{ color: '#FFFFFF' }}
                    onClick={() => navigate('/profile')}
                  >
                    {user?.full_name?.split(' ')[0] || 'Profile'}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    variant="outlined" 
                    onClick={logout}
                    sx={{ borderRadius: 2 }}
                  >
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button 
                    color="inherit" 
                    sx={{ color: '#FFFFFF' }}
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/signup')}
                    sx={{ borderRadius: 2 }}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;