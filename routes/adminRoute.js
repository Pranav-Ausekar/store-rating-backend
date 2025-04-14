import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getDashboardStats, getUsers, getStores, createUser, createStore } from '../controllers/adminController.js'

const router = express.Router();

router.get('/dashboard', authMiddleware(['admin']), getDashboardStats);
router.get('/users', authMiddleware(['admin']), getUsers);
router.get('/stores', authMiddleware(['admin', 'user']), getStores);
router.post('/users', authMiddleware(['admin']), createUser);
router.post('/stores', authMiddleware(['admin']), createStore);


export default router;