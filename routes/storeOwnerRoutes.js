import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getStoreByOwner, getRatingsByStore } from '../controllers/storeOwnerController.js';

const router = express.Router();

router.get('/my-store', authMiddleware(['store-owner']), getStoreByOwner);
router.get('/ratings', authMiddleware(['store-owner']), getRatingsByStore);

export default router;
