// Basic Express app setup, use routes. Adds basic error handling middleware.
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import pool, {connectDB} from './db/index.js'
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/auth', authRoutes);
app.get('/api/auth/health', (req, res) => res.send('Auth Service OK'));

app.get('/', (req, res) => {
    res.send(`Hello from the ${process.env.SERVICE_NAME || 'Auth Service'}!`);
})

app.use((err, req, res, next) => {
    console.error("Auth Service Error:", err.stack)
    res.status(500).send({message: 'Internal Server Error', error: err.message});
})

app.listen(PORT, async() => {
    try {
        await connectDB();
        // --- Get database name from pool options ---
        // The pool object holds the configuration it used, including the database name
        const connectedDbName = pool.options.database || '[default/unknown]'; // Adding fallback in case
        // console.log('Database connected successfully.');
        console.log(`Database connection pool established successfully to '${connectedDbName}'.`);
        console.log(`Auth Service listening on port ${PORT}`);
  } catch (error) {
    // console.error('Failed to connect to the database:', error);
    // Adding DB name to error message too
    const targetDbName = pool?.options?.database || '[configured database]'; // Using optional chaining in case pool isn't fully formed on error
    process.exit(1); // Exit if DB connection fails on startup
  }
});

app.listen(PORT, () => {
    console.log(`${process.env.SERVICE_NAME || 'Microservice'} listening on PORT ${PORT}`);
})