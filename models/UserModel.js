import pool from '../config/db.js';

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(60) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      address VARCHAR(400),
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'user'
    );
  `;
  await pool.query(query);
}

const createUser = async (name, email, address, password, role = 'user') => {
  const result = await pool.query(
    'INSERT INTO users (name, email, address, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, email, address, password, role]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export { createUserTable, createUser, findUserByEmail };
