import pool from "../config/db.js";
import bcrypt from 'bcryptjs'

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
        const totalStores = await pool.query('SELECT COUNT(*) FROM stores');
        const totalRatings = await pool.query('SELECT COUNT(*) FROM ratings');

        res.status(200).json({
            totalUsers: totalUsers.rows[0].count,
            totalStores: totalStores.rows[0].count,
            totalRatings: totalRatings.rows[0].count
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
    }
};

const getUsers = async (req, res) => {
    const { name, email, address, role } = req.query;

    try {
        let query = 'SELECT * FROM users WHERE 1 = 1';
        const params = [];

        if (name) {
            params.push(`%${name}%`);
            query += ` AND name ILIKE $${params.length}`;
        }
        if (email) {
            params.push(`%${email}%`);
            query += ` AND email ILIKE $${params.length}`;
        }
        if (address) {
            params.push(`%${address}%`);
            query += ` AND address ILIKE $${params.length}`;
        }
        if (role) {
            params.push(role);
            query += ` AND role = $${params.length}`;
        }

        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

const getStores = async (req, res) => {
    const { name, address } = req.query;

    try {
        let query = 'SELECT * FROM stores WHERE 1 = 1';
        const params = [];

        if (name) {
            params.push(`%${name}%`);
            query += ` AND name ILIKE $${params.length}`;
        }
        if (address) {
            params.push(`%${address}%`);
            query += ` AND address ILIKE $${params.length}`;
        }

        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stores', error: err.message });
    }
};

const createUser = async (req, res) => {
    const { name, email, password, role, address } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, role, address || null]
        );

        // Create a store for store-owner if not already created
        if (role === 'store-owner') {
            const existingStore = await pool.query(
                'SELECT * FROM stores WHERE owner_id = $1',
                [newUser.rows[0].id]
            );

            if (existingStore.rows.length === 0) {
                await pool.query(
                    'INSERT INTO stores (name, address, owner_id) VALUES ($1, $2, $3)',
                    [`${name}'s Store`, address, newUser.rows[0].id]
                );
            }
        }

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};


export const createStore = async (req, res) => {
    const { name, address, rating } = req.body;

    if (!name || !address || !rating) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Insert into the database
        const newStore = await pool.query(
            'INSERT INTO stores (name, address, rating) VALUES ($1, $2, $3) RETURNING *',
            [name, address, rating]
        );

        res.status(201).json(newStore.rows[0]);
    } catch (err) {
        console.error('Error creating store:', err.message);
        res.status(500).json({ message: 'Error creating store', error: err.message });
    }
};

const getStoreRatings = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT r.id, u.name AS user_name, r.rating 
             FROM ratings r 
             JOIN users u ON r.user_id = u.id
             JOIN stores s ON r.store_id = s.id
             WHERE s.owner_id = $1`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get store ratings', error: err.message });
    }
};

export { getDashboardStats, getUsers, getStores, createUser, getStoreRatings };