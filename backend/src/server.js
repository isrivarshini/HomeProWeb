import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/supabase.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow localhost and Vercel domains
    const allowedOrigins = [
      'http://localhost:5173',
      'https://homeproweb.vercel.app',
      process.env.FRONTEND_URL
    ];
    
    // Allow any Vercel preview URL
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'HomePro API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      providers: '/api/providers',
      bookings: '/api/bookings',
      user: '/api/user'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', providerRoutes); // Categories and providers
app.use('/api', bookingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payments', paymentRoutes);
// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`📚 API Docs available at http://localhost:${PORT}/`);
});
