import express from 'express';
import { 
  getCategories, 
  getProviders, 
  getProviderById,
  getProviderAvailability 
} from '../controllers/providerController.js';

const router = express.Router();

// All provider routes are public (no authentication needed)
router.get('/categories', getCategories);
router.get('/providers', getProviders);
router.get('/providers/:id', getProviderById);
router.get('/providers/:id/availability', getProviderAvailability);

export default router;