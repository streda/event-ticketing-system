// ---> LOADING ENVIRONMENTAL-VARIABLES <---
import 'dotenv/config'; 

// ---> Standard Imports <---
import express from 'express';
import cors from 'cors';
import pool, { connectDB } from './db/index.js'; 
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001; 

// ---> register global middlewares <---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// ---> Routes <---
app.use('/api/auth', authRoutes); 
app.get('/health', (req, res) => res.send('Auth Service OK')); 
app.get('/', (req, res) => {
    res.send(`Hello from the ${process.env.SERVICE_NAME || 'Auth Service'}!`);
});

/*
Catches all unhandled errors that occur anywhere in my server after the request hits a middlewares or routes.
Prevents the server from crashing or exposing sensitive error info to the client.
Instead, it returns a generic 500 Internal Server Error safely.
*/
// ---> Global Error Handler  (special error-handling middleware)<---
app.use((err, req, res, next) => {
    console.error("Auth Service Error:", err.stack);
    res.status(500).json({ message: 'Internal Server Error' }); 
});

// ---> Start Server Function <---
const startServer = async () => {
    try {
        await connectDB(); // Test connection
        
        // ---> Log the ENV VAR directly for verification <---
        const dbUrlFromEnv = process.env.DATABASE_URL || '[DATABASE_URL not found in env]';
        // Extract DB name from URL manually if pool.options isn't reliable
        let dbNameForLog = '[unknown]';
        try {
            const url = new URL(dbUrlFromEnv);
            // Remove leading '/' if present
            dbNameForLog = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname; 
        } catch (parseError) {
            console.warn("Could not parse DATABASE_URL to extract name:", parseError.message);
        }

        console.log(`Database connection pool established successfully (Targeting: '${dbNameForLog}' based on ENV).`);
        
        // ---> app.listen call inside the function <---
        app.listen(PORT, () => {
            console.log(`${process.env.SERVICE_NAME || 'Auth Service'} listening on port ${PORT}`);
        });

    } catch (error) {
        const targetDbName = process.env.DATABASE_URL || '[configured database]'; // Log the raw URL on error
        console.error(`Failed to connect using DATABASE_URL '${targetDbName}':`, error);
        process.exit(1); 
    }
};

// ---> Call Start Server <---
startServer(); 
