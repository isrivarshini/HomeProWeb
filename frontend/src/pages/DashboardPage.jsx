import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, categoryAPI } from '../services/api';

const statusConfig = {
  pending:     { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)',  icon: <PendingIcon sx={{ fontSize: 16 }} />,      label: 'Pending' },
  confirmed:   { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,  label: 'Confirmed' },
  in_progress: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', icon: <PendingIcon sx={{ fontSize: 16 }} />,      label: 'In Progress' },
  completed:   { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,  label: 'Completed' },
  cancelled:   { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)',  icon: <CancelIcon sx={{ fontSize: 16 }} />,       label: 'Cancelled' },
};

const quickActions = [
  { label: 'Book a Service',   icon: <AddIcon />,             path: '/services',  accent: '#8B5CF6' },
  { label: 'My Bookings',      icon: <CalendarTodayIcon />,   path: '/bookings',  accent: '#6366F1' },
  { label: 'My Profile',       icon: <HomeRepairServiceIcon />, path: '/profile', accent: '#A78BFA' },
];
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Derive display name from either JWT user or Google OAuth user
  const displayName =
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'there';

  const firstName = displayName.split(' ')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, categoriesRes] = await Promise.all([
          bookingAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setBookings(bookingsRes.data.data?.slice(0, 5) || []);
        setCategories(categoriesRes.data.data?.slice(0, 6) || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    total:     bookings.length,
    upcoming:  bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />

      {/* Background orbs */}
      <motion.div
        style={{
          position: 'absolute', top: '5%', right: '10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', bottom: '10%', left: '5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="show">

          {/* Greeting */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h2" fontWeight={700} sx={{ color: '#FFFFFF', lineHeight: 1.2 }}>
                Welcome back,{' '}
                <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
                  {firstName}
                </Box>{' '}👋
              </Typography>
              <Typography variant="body1" sx={{ color: '#A1A1AA', mt: 1 }}>
                Here's what's happening with your home services
              </Typography>
            </Box>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {[
                { label: 'Total Bookings',    value: stats.total,     accent: '#8B5CF6' },
                { label: 'Upcoming',          value: stats.upcoming,  accent: '#6366F1' },
                { label: 'Completed',         value: stats.completed, accent: '#10B981' },
              ].map((stat) => (
                <Grid item xs={12} sm={4} key={stat.label}>
                  <Card sx={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: stat.accent },
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" fontWeight={700} sx={{ color: stat.accent }}>
                        {loading ? <CircularProgress size={28} sx={{ color: stat.accent }} /> : stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#A1A1AA', mt: 0.5 }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          <Grid container spacing={4}>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#FFFFFF', mb: 2 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  {quickActions.map((action) => (
                    <Card
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      sx={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: action.accent,
                          background: `rgba(139,92,246,0.08)`,
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box sx={{
                              width: 36, height: 36, borderRadius: 2,
                              backgroundColor: `${action.accent}20`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: action.accent,
                            }}>
                              {action.icon}
                            </Box>
                            <Typography fontWeight={600} sx={{ color: '#FFFFFF' }}>
                              {action.label}
                            </Typography>
                          </Stack>
                          <ArrowForwardIcon sx={{ color: '#A1A1AA', fontSize: 18 }} />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </motion.div>

              {/* Service Categories */}
              <motion.div variants={itemVariants}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#FFFFFF', mb: 2, mt: 4 }}>
                  Browse by Category
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {categories.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.name}
                      onClick={() => navigate(`/services/${cat.id}`)}
                      sx={{
                        backgroundColor: 'rgba(139,92,246,0.1)',
                        color: '#A78BFA',
                        border: '1px solid rgba(139,92,246,0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(139,92,246,0.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Recent Bookings */}
            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#FFFFFF' }}>
                    Recent Bookings
                  </Typography>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/bookings')}
                    sx={{ color: '#8B5CF6', '&:hover': { color: '#A78BFA' } }}
                  >
                    View All
                  </Button>
                </Stack>

                <Card sx={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                      <CircularProgress sx={{ color: '#8B5CF6' }} />
                    </Box>
                  ) : bookings.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, px: 4 }}>
                      <HomeRepairServiceIcon sx={{ fontSize: 48, color: '#3F3F46', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                        No bookings yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 3 }}>
                        Book your first home service to get started
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/services')}
                        sx={{ fontWeight: 600 }}
                      >
                        Book a Service
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      {bookings.map((booking, index) => {
                        const status = statusConfig[booking.status] || statusConfig.pending;
                        return (
                          <Box key={booking.id}>
                            <Box
                              sx={{
                                p: 3,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                '&:hover': { background: 'rgba(255,255,255,0.03)' },
                              }}
                              onClick={() => navigate(`/bookings/${booking.id}`)}
                            >
                              <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar sx={{
                                    backgroundColor: 'rgba(139,92,246,0.2)',
                                    color: '#8B5CF6',
                                    width: 44, height: 44,
                                  }}>
                                    <HomeRepairServiceIcon />
                                  </Avatar>
                                  <Box>
                                    <Typography fontWeight={600} sx={{ color: '#FFFFFF' }}>
                                      {booking.provider?.business_name || 'Service Provider'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
                                      {booking.service_date
                                        ? new Date(booking.service_date).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                          })
                                        : 'Date TBD'
                                      } · {booking.service_time?.slice(0, 5) || ''}
                                    </Typography>
                                  </Box>
                                </Stack>
                                <Stack alignItems="flex-end" spacing={0.5}>
                                  <Chip
                                    icon={status.icon}
                                    label={status.label}
                                    size="small"
                                    sx={{
                                      backgroundColor: status.bg,
                                      color: status.color,
                                      border: `1px solid ${status.color}40`,
                                      fontWeight: 600,
                                      '& .MuiChip-icon': { color: status.color },
                                    }}
                                  />
                                  <Typography variant="body2" fontWeight={700} sx={{ color: '#FFFFFF' }}>
                                    ${booking.total_amount}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Box>
                            {index < bookings.length - 1 && (
                              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DashboardPage;