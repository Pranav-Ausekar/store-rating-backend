import pool from '../config/db.js';

const createStoreTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        address VARCHAR(400) NOT NULL,
        rating FLOAT DEFAULT 0,
        owner_id INT REFERENCES users(id) ON DELETE SET NULL
      );
    `;
    await pool.query(query);
};

const createStore = async (name, address, ownerId) => {
    const result = await pool.query(
        'INSERT INTO stores (name, address, owner_id) VALUES ($1, $2, $3) RETURNING *',
        [name, address, ownerId]
    );
    return result.rows[0];
};

const getAllStores = async () => {
    const result = await pool.query('SELECT * FROM stores');
    return result.rows;
};

const getStoreById = async (id) => {
    const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    return result.rows[0];
};

export { createStoreTable, createStore, getAllStores, getStoreById }