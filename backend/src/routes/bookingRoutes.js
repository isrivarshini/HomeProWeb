import express from 'express';
import { 
  createBooking, 
  getUserBookings, 
  getBookingById,
  cancelBooking 
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All booking routes require authentication
router.post('/bookings', protect, createBooking);
router.get('/bookings', protect, getUserBookings);
router.get('/bookings/:id', protect, getBookingById);
router.put('/bookings/:id/cancel', protect, cancelBooking);

export default router;