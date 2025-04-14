import express from 'express'
import { addStore, getStores, getStoreByOwner } from '../controllers/storeController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/', authMiddleware(['admin', 'store_owner']), addStore);
router.get('/', authMiddleware(['admin', 'user', 'store_owner']), getStores);
router.get('/my-store', authMiddleware(['store_owner']), getStoreByOwner);

export default router;