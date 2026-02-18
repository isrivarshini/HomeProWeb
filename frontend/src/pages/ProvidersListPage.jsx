import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Rating,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Skeleton,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import { providerAPI, categoryAPI } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ProviderCardSkeleton from '../components/ProviderCardSkeleton';
import FilterListIcon from '@mui/icons-material/FilterList';

const ProvidersListPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, price_low, price_high, reviews
  const [priceRange, setPriceRange] = useState('all'); // all, under_50, 50_100, over_100

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch providers for this category
        const providersRes = await providerAPI.getAll(categoryId);
        setProviders(providersRes.data.data);
        setFilteredProviders(providersRes.data.data);

        // Fetch category details
        const categoriesRes = await categoryAPI.getAll();
        const currentCategory = categoriesRes.data.data.find(cat => cat.id === categoryId);
        setCategory(currentCategory);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Apply search, filter, and sort whenever they change
  useEffect(() => {
    let result = [...providers];

    // Search by name
    if (searchQuery) {
      result = result.filter(provider =>
        provider.business_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      if (priceRange === 'under_50') {
        result = result.filter(p => parseFloat(p.hourly_rate) < 50);
      } else if (priceRange === '50_100') {
        result = result.filter(p => parseFloat(p.hourly_rate) >= 50 && parseFloat(p.hourly_rate) <= 100);
      } else if (priceRange === 'over_100') {
        result = result.filter(p => parseFloat(p.hourly_rate) > 100);
      }
    }

    // Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => parseFloat(a.hourly_rate) - parseFloat(b.hourly_rate));
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => parseFloat(b.hourly_rate) - parseFloat(a.hourly_rate));
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
    }

    setFilteredProviders(result);
  }, [searchQuery, sortBy, priceRange, providers]);

  if (loading) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
      <GrainOverlay />
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Skeleton 
          variant="text" 
          width={200} 
          height={40} 
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', mb: 4 }} 
        />
        <Skeleton 
          variant="text" 
          width={400} 
          height={60} 
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', mb: 2 }} 
        />
        <Skeleton 
          variant="text" 
          width={300} 
          height={30} 
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', mb: 6 }} 
        />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <ProviderCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
      <GrainOverlay />
      <Navbar />

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
              color: '#FFFFFF',
              fontWeight: 700,
            }}
          >
            {category?.name}{' '}
            <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
              Services
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: '#A1A1AA',
              maxWidth: 700,
            }}
          >
            {category?.description}
          </Typography>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ mb: 4, p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#8B5CF6' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Price Range Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={priceRange}
                    label="Price Range"
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <MenuItem value="all">All Prices</MenuItem>
                    <MenuItem value="under_50">Under $50/hr</MenuItem>
                    <MenuItem value="50_100">$50 - $100/hr</MenuItem>
                    <MenuItem value="over_100">Over $100/hr</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Sort By */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="rating">Highest Rated</MenuItem>
                    <MenuItem value="reviews">Most Reviews</MenuItem>
                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Results Count */}
            <Typography variant="body2" sx={{ color: '#A1A1AA', mt: 2 }}>
              Showing {filteredProviders.length} of {providers.length} providers
            </Typography>
          </Card>
        </motion.div>

        {/* Providers Grid */}
        {filteredProviders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#A1A1AA', mb: 2 }}>
              {searchQuery || priceRange !== 'all' 
                ? 'No providers match your search criteria' 
                : 'No providers available in this category yet'}
            </Typography>
            {(searchQuery || priceRange !== 'all') && (
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Grid container spacing={3}>
              {filteredProviders.map((provider) => (
                <Grid item xs={12} sm={6} md={4} key={provider.id}>
                  <motion.div variants={item}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        },
                      }}
                      onClick={() => navigate(`/providers/${provider.id}`)}
                    >
                      {/* Provider Image */}
                      <CardMedia
                        component="img"
                        height="200"
                        image={provider.profile_image_url || 'https://ui-avatars.com/api/?name=' + provider.business_name}
                        alt={provider.business_name}
                        sx={{
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        }}
                      />

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Business Name */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: '#FFFFFF',
                          }}
                        >
                          {provider.business_name}
                        </Typography>

                        {/* Rating */}
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                          <Rating
                            value={parseFloat(provider.rating) || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': { color: '#8B5CF6' },
                              '& .MuiRating-iconEmpty': { color: 'rgba(255, 255, 255, 0.2)' },
                            }}
                          />
                          <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
                            {provider.rating ? parseFloat(provider.rating).toFixed(1) : '0.0'} ({provider.total_reviews || 0})
                          </Typography>
                        </Stack>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#A1A1AA',
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {provider.description}
                        </Typography>

                        {/* Hourly Rate */}
                        <Box sx={{ mt: 'auto' }}>
                          <Chip
                            label={`$${provider.hourly_rate}/hour`}
                            sx={{
                              backgroundColor: 'rgba(139, 92, 246, 0.15)',
                              color: '#8B5CF6',
                              fontWeight: 600,
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                            }}
                          />
                        </Box>

                        {/* Book Button */}
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/providers/${provider.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
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

export default ProvidersListPage;
