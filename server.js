import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createUserTable } from './models/UserModel.js'
import { createStoreTable } from './models/StoreModel.js'
import { createRatingTable } from './models/RatingModel.js'
import authRoutes from './routes/authRoute.js'
import adminRoutes from './routes/adminRoute.js'
import storeRoutes from './routes/storeRoute.js'
import ratingRoutes from './routes/ratingRoute.js'
import storeOwnerRoutes from './routes/storeOwnerRoutes.js';


const app = express();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
    credentials: true // Allow cookies and credentials
}))

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Create user table on startup
const startServer = async () => {
    try {
        await createUserTable();
        await createStoreTable();
        await createRatingTable();

        app.use('/api/auth', authRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/stores', storeRoutes);
        app.use('/api/ratings', ratingRoutes);
        app.use('/api/store-owner', storeOwnerRoutes);

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();