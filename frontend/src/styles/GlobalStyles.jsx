import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

const GlobalStyles = () => {
  return (
    <MuiGlobalStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
          backgroundColor: '#0A0A0A',
        },
        body: {
          fontFamily: 'Satoshi, -apple-system, BlinkMacSystemFont, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backgroundColor: '#0A0A0A',
          color: '#FFFFFF',
        },
        '#root': {
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
        },
        // Custom scrollbar
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: '#0A0A0A',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#333333',
          borderRadius: '4px',
          '&:hover': {
            background: '#555555',
          },
        },
      }}
    />
  );
};

export default GlobalStyles;