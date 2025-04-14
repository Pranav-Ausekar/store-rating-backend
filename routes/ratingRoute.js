import express from 'express'
import submitRating from '../controllers/ratingController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

// Normal users can rate stores
router.post('/', authMiddleware(['user']), submitRating);

export default router;