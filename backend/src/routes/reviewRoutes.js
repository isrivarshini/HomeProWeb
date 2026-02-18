import express from 'express';
import { createReview, getProviderReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create review (protected)
router.post('/', protect, createReview);

// Get provider reviews (public)
router.get('/provider/:provider_id', getProviderReviews);

export default router;