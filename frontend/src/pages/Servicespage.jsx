import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GrainOverlay from '../components/GrainOverlay';
import CategoryGrid from '../components/CategoryGrid';

const ServicesPage = () => {
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
      <CategoryGrid />
    </Box>
  );
};

export default ServicesPage;