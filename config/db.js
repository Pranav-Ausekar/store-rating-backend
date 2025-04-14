import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const { Pool } = pkg;

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     ssl: {
//         rejectUnauthorized: false, // This allows an insecure SSL connection, but necessary for most cloud databases.
//     }
// })


// Use DATABASE_URL directly from the .env file
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // This is the full connection string
    ssl: {
        rejectUnauthorized: false, // Necessary for Railway or other cloud providers
    },
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log("Database connected")
    } catch (error) {
        console.log("Database connection error")
        process.exit(1);
    }
}

connectDB()

export default pool;