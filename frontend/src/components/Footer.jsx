import { Box, Container, Typography, Stack, Link, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo/Logo';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          {/* Brand Section */}
          <Box sx={{ maxWidth: 300 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Logo size={32} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                HomePro
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#A1A1AA', lineHeight: 1.6 }}>
              Professional home services at your fingertips. Book trusted providers for all your household needs.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link
                component="button"
                onClick={() => navigate('/')}
                sx={{
                  color: '#A1A1AA',
                  textDecoration: 'none',
                  textAlign: 'left',
                  '&:hover': { color: '#8B5CF6' },
                  transition: 'color 0.2s',
                }}
              >
                Home
              </Link>
              <Link
                component="button"
                onClick={() => navigate('/bookings')}
                sx={{
                  color: '#A1A1AA',
                  textDecoration: 'none',
                  textAlign: 'left',
                  '&:hover': { color: '#8B5CF6' },
                  transition: 'color 0.2s',
                }}
              >
                My Bookings
              </Link>
              <Link
                component="button"
                onClick={() => navigate('/profile')}
                sx={{
                  color: '#A1A1AA',
                  textDecoration: 'none',
                  textAlign: 'left',
                  '&:hover': { color: '#8B5CF6' },
                  transition: 'color 0.2s',
                }}
              >
                Profile
              </Link>
            </Stack>
          </Box>

          {/* Services */}
          <Box>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
              Services
            </Typography>
            <Stack spacing={1}>
              {['Plumbing', 'Electrical', 'Cleaning', 'Spa & Massage'].map((service) => (
                <Typography
                  key={service}
                  variant="body2"
                  sx={{
                    color: '#A1A1AA',
                    cursor: 'pointer',
                    '&:hover': { color: '#8B5CF6' },
                    transition: 'color 0.2s',
                  }}
                >
                  {service}
                </Typography>
              ))}
            </Stack>
          </Box>

          {/* Contact */}
          <Box>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
              Connect
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#A1A1AA',
                  '&:hover': { color: '#8B5CF6' },
                  transition: 'color 0.2s',
                }}
              >
                <GitHubIcon />
              </Link>
              <Link
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#A1A1AA',
                  '&:hover': { color: '#8B5CF6' },
                  transition: 'color 0.2s',
                }}
              >
                <LinkedInIcon />
              </Link>
              <Link
                href="mailto:your.email@example.com"
                sx={{
                  color: '#A1A1AA',
                  '&:hover': { color: '#8B5CF6' },
                  transition: 'color 0.2s',
                }}
              >
                <EmailIcon />
              </Link>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

        {/* Bottom Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
            © {currentYear} HomePro. Built by{' '}
            <Box component="span" sx={{ color: '#8B5CF6', fontWeight: 600 }}>
              Sri Varshini Nakollu
            </Box>
          </Typography>

          <Stack direction="row" spacing={3}>
            <Typography
              variant="body2"
              sx={{
                color: '#A1A1AA',
                cursor: 'pointer',
                '&:hover': { color: '#8B5CF6' },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#A1A1AA',
                cursor: 'pointer',
                '&:hover': { color: '#8B5CF6' },
              }}
            >
              Terms of Service
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;