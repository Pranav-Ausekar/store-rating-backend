import pool from '../config/db.js';

export const getStoreByOwner = async (req, res) => {
    const ownerId = req.user.id;

    try {
        const store = await pool.query(
            'SELECT * FROM stores WHERE owner_id = $1',
            [ownerId]
        );

        if (store.rows.length === 0) {
            return res.status(404).json({ message: 'No store found for this owner.' });
        }

        // Calculate average rating
        const avgRatingResult = await pool.query(
            'SELECT AVG(rating) AS average_rating FROM ratings WHERE store_id = $1',
            [store.rows[0].id]
        );

        const averageRating = avgRatingResult.rows[0]?.average_rating || 0;

        res.status(200).json({
            ...store.rows[0],
            averageRating
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch store data', error: err.message });
    }
};

export const getRatingsByStore = async (req, res) => {
    const ownerId = req.user.id;

    try {
        const ratings = await pool.query(
            `SELECT r.id, u.name AS user_name, r.rating 
             FROM ratings r 
             JOIN users u ON r.user_id = u.id
             JOIN stores s ON r.store_id = s.id
             WHERE s.owner_id = $1`,
            [ownerId]
        );

        const storeResult = await pool.query(
            `SELECT s.name, s.address, 
                    COALESCE(CAST(AVG(r.rating) AS FLOAT), 0) AS average_rating
             FROM stores s 
             LEFT JOIN ratings r ON r.store_id = s.id
             WHERE s.owner_id = $1
             GROUP BY s.id`,
            [ownerId]
        );

        const store = storeResult.rows[0] || {};

        res.status(200).json({
            ratings: ratings.rows,
            storeName: store.name || 'N/A',
            storeAddress: store.address || 'N/A',
            averageRating: store.average_rating || 0
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch ratings', error: err.message });
    }
};
