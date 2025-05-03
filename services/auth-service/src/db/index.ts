// Basic PostgreSQL connection setup (reads DATABASE_URL from env).
import pg from 'pg'; 

const { Pool } = pg; 

// ---> DEBUG: Log the value RIGHT BEFORE creating the Pool <---
console.log('[db/index.js] Reading process.env.DATABASE_URL:', process.env.DATABASE_URL);
// --- END DEBUG ---

// Configuring the connection pool using environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // I will add SSL configuration for my database next
    // ssl: {
    //   rejectUnauthorized: false 
    // }
});

// Function to test the connection
export const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Database connection pool established successfully.');
    } catch (error) {
        console.error('Error connecting to the database pool:', error);
        throw error; // Re-throwing the error to be caught by the caller (server.js)
    }
};

// Export the pool so that my controllers can use it for queries
export default pool; 