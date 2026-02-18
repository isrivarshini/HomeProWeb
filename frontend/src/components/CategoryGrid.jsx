import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Container, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { categoryAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress sx={{ color: '#8B5CF6' }} />
      </Box>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography 
          variant="h2"
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Browse{' '}
          <Box 
            component="span" 
            sx={{ 
              fontStyle: 'italic',
              color: '#8B5CF6',
            }}
          >
            Services
          </Box>
        </Typography>
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            mb: 8, 
            maxWidth: 600, 
            mx: 'auto',
            color: '#A1A1AA',
            fontSize: '1.125rem',
          }}
        >
          Choose from our wide range of professional home services
        </Typography>
      </motion.div>

      {/* Category Grid - Uniform Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <motion.div 
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    cursor: 'pointer',
                    height: '220px', // Fixed height for uniformity
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={() => navigate(`/services/${category.id}`)}
                >
                  {/* Gradient overlay on hover */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0) 0%, rgba(139, 92, 246, 0.1) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      '.MuiCard-root:hover &': {
                        opacity: 1,
                      },
                    }}
                  />

                  <CardContent sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    {/* Category Image */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        overflow: 'hidden',
                        margin: '0 auto 20px',
                        transition: 'transform 0.3s ease',
                        '.MuiCard-root:hover &': {
                          transform: 'scale(1.1) rotate(-5deg)',
                        },
                      }}
                    >
                      <img
                        src={category.icon_url || `https://ui-avatars.com/api/?name=${category.name}&background=8B5CF6&color=fff&size=200`}
                        alt={category.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>

                    {/* Category name */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        color: '#FFFFFF',
                      }}
                    >
                      {category.name}
                    </Typography>
                    
                    {/* Short description */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.875rem',
                        color: '#A1A1AA',
                        lineHeight: 1.5,
                      }}
                    >
                      {category.description?.substring(0, 40)}...
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

// Helper function to get emoji for each category
const getCategoryEmoji = (categoryName) => {
  const emojiMap = {
    'Plumbing': '🔧',
    'Electrical': '⚡',
    'Cleaning': '🧹',
    'Spa & Massage': '💆',
    'Carpentry': '🪚',
    'Chef Services': '👨‍🍳',
    'Painting': '🎨',
    'HVAC': '❄️',
  };
  return emojiMap[categoryName] || '🔨';
};

export default CategoryGrid;
