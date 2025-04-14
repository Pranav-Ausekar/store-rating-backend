import { addRating, getAverageRating } from '../models/RatingModel.js'
import pool from '../config/db.js'

const submitRating = async (req, res) => {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    try {
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Add or update rating
        const newRating = await addRating(userId, storeId, rating);

        // Update store's average rating
        const averageRating = await getAverageRating(storeId);
        await pool.query(
            'UPDATE stores SET rating = $1 WHERE id = $2',
            [averageRating, storeId]
        );

        res.status(201).json(newRating);
    } catch (err) {
        res.status(500).json({ message: 'Error submitting rating', error: err.message });
    }
};

export default submitRating;