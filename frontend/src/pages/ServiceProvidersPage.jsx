import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Rating,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import { providerAPI, categoryAPI } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';

const ServiceProvidersPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoriesResponse = await categoryAPI.getAll();
        const currentCategory = categoriesResponse.data.data.find(
          (cat) => cat.id === categoryId
        );
        setCategory(currentCategory);

        // Fetch providers in this category
        const providersResponse = await providerAPI.getAll(categoryId);
        setProviders(providersResponse.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Failed to load providers');
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return (
      <Box sx={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
        <GrainOverlay />
        <Navbar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress sx={{ color: '#8B5CF6' }} size={60} />
        </Box>
      </Box>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Box sx={{ backgroundColor: '#0A0A0A', minHeight: '100vh', position: 'relative' }}>
      <GrainOverlay />
      <Navbar />

      {/* Purple gradient orb */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 4, color: '#A1A1AA', '&:hover': { color: '#FFFFFF' } }}
          >
            Back to Categories
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            {category?.name}{' '}
            <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
              Providers
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 6,
              color: '#A1A1AA',
              maxWidth: 600,
            }}
          >
            {category?.description || 'Find the perfect professional for your needs'}
          </Typography>
        </motion.div>

        {/* Providers Grid */}
        {providers.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Typography variant="h5" sx={{ color: '#A1A1AA', mb: 2 }}>
              No providers available in this category yet
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Browse Other Categories
            </Button>
          </Box>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Grid container spacing={3}>
              {providers.map((provider) => (
                <Grid item xs={12} sm={6} md={4} key={provider.id}>
                  <motion.div variants={item}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                        },
                      }}
                      onClick={() => navigate(`/providers/${provider.id}`)}
                    >
                      {/* Provider Avatar */}
                      <Box sx={{ p: 3, pb: 2, textAlign: 'center' }}>
                        <Avatar
                          sx={{
                            width: 100,
                            height: 100,
                            margin: '0 auto',
                            fontSize: '2.5rem',
                            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                          }}
                        >
                          {provider.business_name.charAt(0)}
                        </Avatar>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                        {/* Business Name */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: '#FFFFFF',
                            textAlign: 'center',
                          }}
                        >
                          {provider.business_name}
                        </Typography>

                        {/* Rating */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Rating
                            value={parseFloat(provider.rating) || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#8B5CF6',
                              },
                            }}
                          />
                          <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
                            ({provider.total_reviews})
                          </Typography>
                        </Box>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#A1A1AA',
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {provider.description}
                        </Typography>

                        {/* Price */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: '#8B5CF6',
                            }}
                          >
                            ${provider.hourly_rate}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: '#A1A1AA' }}
                          >
                            /hour
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/providers/${provider.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default ServiceProvidersPage;