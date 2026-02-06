import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6', // Purple
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6366F1', // Indigo
      light: '#818CF8',
      dark: '#4F46E5',
    },
    background: {
      default: '#0A0A0A', // Very dark
      paper: '#111111', // Slightly lighter dark
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA', // Gray
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: [
      'Satoshi',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 900,
      fontSize: '4.5rem',
      letterSpacing: '-0.03em',
      lineHeight: 1,
      color: '#FFFFFF',
    },
    h2: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: '#FFFFFF',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#FFFFFF',
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: '#FFFFFF',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#FFFFFF',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: '#FFFFFF',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1.125rem',
      lineHeight: 1.7,
      color: '#A1A1AA',
    },
    body2: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#A1A1AA',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 20px 60px 0 rgba(139, 92, 246, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 28px',
          fontSize: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
            boxShadow: '0 6px 20px 0 rgba(139, 92, 246, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          '&:hover': {
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B5CF6',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#A1A1AA',
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

export default theme;