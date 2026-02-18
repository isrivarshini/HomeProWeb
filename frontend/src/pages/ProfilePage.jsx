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
  TextField,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressDialog, setAddressDialog] = useState({ open: false, mode: 'add', address: null });
  const [addressForm, setAddressForm] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    is_primary: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchProfileData();
  }, [isAuthenticated, navigate]);

  const fetchProfileData = async () => {
    try {
      const [profileRes, addressesRes] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getAddresses(),
      ]);
      setProfile(profileRes.data.data);
      setAddresses(addressesRes.data.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressDialogOpen = (mode, address = null) => {
    if (mode === 'edit' && address) {
      setAddressForm({
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
        is_primary: address.is_primary,
      });
    } else {
      setAddressForm({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        is_primary: addresses.length === 0, // First address is primary by default
      });
    }
    setAddressDialog({ open: true, mode, address });
  };

  const handleAddressSubmit = async () => {
    try {
      if (addressDialog.mode === 'add') {
        await userAPI.addAddress(addressForm);
      } else {
        await userAPI.updateAddress(addressDialog.address.id, addressForm);
      }
      setAddressDialog({ open: false, mode: 'add', address: null });
      fetchProfileData();
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await userAPI.deleteAddress(addressId);
        fetchProfileData();
      } catch (error) {
        console.error('Failed to delete address:', error);
        alert('Failed to delete address');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#8B5CF6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
      <GrainOverlay />
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
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
            My{' '}
            <Box component="span" sx={{ fontStyle: 'italic', color: '#8B5CF6' }}>
              Profile
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 6,
              color: '#A1A1AA',
            }}
          >
            Manage your account and addresses
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* Profile Info */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#FFFFFF', mb: 3 }}>
                    Profile Information
                  </Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 0.5 }}>
                        Full Name
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        {profile?.full_name}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 0.5 }}>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        {profile?.email}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: '#A1A1AA', mb: 0.5 }}>
                        Phone
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        {profile?.phone}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Addresses */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                      Saved Addresses
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddressDialogOpen('add')}
                      size="small"
                    >
                      Add
                    </Button>
                  </Stack>

                  {addresses.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: '#A1A1AA', mb: 2 }}>
                        No addresses saved
                      </Typography>
                      <Button variant="outlined" onClick={() => handleAddressDialogOpen('add')}>
                        Add Your First Address
                      </Button>
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {addresses.map((address) => (
                        <Box
                          key={address.id}
                          sx={{
                            p: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: 2,
                            border: address.is_primary ? '1px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              {address.is_primary && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#8B5CF6',
                                    fontWeight: 600,
                                    mb: 0.5,
                                    display: 'block',
                                  }}
                                >
                                  PRIMARY
                                </Typography>
                              )}
                              <Typography sx={{ color: '#FFFFFF', mb: 0.5 }}>
                                {address.address_line1}
                              </Typography>
                              {address.address_line2 && (
                                <Typography sx={{ color: '#FFFFFF', mb: 0.5 }}>
                                  {address.address_line2}
                                </Typography>
                              )}
                              <Typography sx={{ color: '#A1A1AA' }}>
                                {address.city}, {address.state} {address.zip_code}
                              </Typography>
                            </Box>

                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleAddressDialogOpen('edit', address)}
                                sx={{ color: '#8B5CF6' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteAddress(address.id)}
                                sx={{ color: '#FCA5A5' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Address Dialog */}
      <Dialog
        open={addressDialog.open}
        onClose={() => setAddressDialog({ open: false, mode: 'add', address: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#111111',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#FFFFFF' }}>
          {addressDialog.mode === 'add' ? 'Add Address' : 'Edit Address'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Address Line 1"
              value={addressForm.address_line1}
              onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Address Line 2 (Optional)"
              value={addressForm.address_line2}
              onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="State"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="ZIP Code"
                  value={addressForm.zip_code}
                  onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialog({ open: false, mode: 'add', address: null })} sx={{ color: '#A1A1AA' }}>
            Cancel
          </Button>
          <Button onClick={handleAddressSubmit} variant="contained">
            {addressDialog.mode === 'add' ? 'Add Address' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;