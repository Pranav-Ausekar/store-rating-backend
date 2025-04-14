import pool from '../config/db.js';


const createRatingTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        store_id INT REFERENCES stores(id) ON DELETE CASCADE,
        rating INT CHECK(rating >= 1 AND rating <= 5) NOT NULL,
        UNIQUE (user_id, store_id) 
      );
    `;
    await pool.query(query);
};

const addRating = async (userId, storeId, rating) => {
    const result = await pool.query(
        `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id) 
       DO UPDATE SET rating = EXCLUDED.rating
       RETURNING *`,
        [userId, storeId, rating]
    );
    return result.rows[0];
};

const getAverageRating = async (storeId) => {
    const result = await pool.query(
        `SELECT AVG(rating) as average_rating 
       FROM ratings 
       WHERE store_id = $1`,
        [storeId]
    );
    return result.rows[0].average_rating;
};

export { createRatingTable, addRating, getAverageRating };