// // services/auth-service/src/server.ts

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('!!! AUTH_SERVICE: Unhandled Rejection at:', promise, 'reason:', reason);
// });

// process.on('uncaughtException', (err, origin) => {
//   console.error('!!! AUTH_SERVICE: Uncaught Exception:', err, 'Origin:', origin);
//   process.exit(1); 
// });


// import 'dotenv/config';
// import express, { Express, Request, Response, NextFunction } from 'express';

// const app: Express = express();
// const portString: string = process.env.PORT || '3001';
// const PORT: number = parseInt(portString, 10);


// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log(`[AUTH_SERVICE] Test: Received request: ${req.method} ${req.originalUrl}`);
//     next();
// });

// app.post('/login', (req: Request, res: Response) => { 
//     console.log('[AUTH_SERVICE] Test: /login route hit!');
//     res.status(200).json({ message: 'Auth service /login POST endpoint reached (test)' });
// });

// app.get('/health', (req: Request, res: Response) => {
//     console.log('[AUTH_SERVICE] Test: /health route hit!');
//     res.status(200).send('Auth Service OK (test)');
// });



// const startServer = async (): Promise<void> => {
//     try {
//         console.log(`[AUTH_SERVICE] Attempting to listen on port ${PORT}...`);
//         app.listen(PORT, () => {
//             console.log(`${process.env.SERVICE_NAME || 'Auth Service'} listening on port ${PORT} (minimal test mode)`);
//         });

//     } catch (error: any) {
//         console.error(`[AUTH_SERVICE] Failed to start server:`, error); 
//         process.exit(1); 
//     }
// };

// startServer();

// ---> LOAD ENVIRONMENT VARIABLES FIRST <---
import 'dotenv/config'; 

// ---> Standard Imports  <---
import express, { Express, Request, Response, NextFunction } from 'express'; 
import cors from 'cors';
import pool, { connectDB } from './db/index'; 
import authRoutes from './routes/authRoutes'; 

// Explicitly type the app instance (optional but good practice)
const app: Express = express(); 

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[AUTH_SERVICE] Received request: ${req.method} ${req.originalUrl}`);
    next();
});

// Treating PORT as a number for listen
// process.env variables are strings or undefined
const portString: string = process.env.PORT || '3001'; // Default to string '3001'
const PORT: number = parseInt(portString, 10); // Parse to number

// ---> Register Global Middlewares <---
app.use(cors());
app.use(express.json());

// Debugging error
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[AUTH_SERVICE] After express.json(). Request body:`, req.body);
    next();
});

app.use(express.urlencoded({ extended: true })); 

// ---> Routes <---
app.use('/api/auth', authRoutes); 

// Adding types to request and response objects for route handlers
app.get('/health', (req: Request, res: Response) => {
    res.send('Auth Service OK');
}); 

app.get('/', (req: Request, res: Response) => {
    res.send(`Hello from the ${process.env.SERVICE_NAME || 'Auth Service'}!`);
});

/*
Catches all unhandled errors that occur anywhere in my server after the request hits middlewares or routes.
Prevents the server from crashing or exposing sensitive error info to the client.
Instead, it returns a generic 500 Internal Server Error safely.
*/
// ---> Global Error Handler (special error-handling middleware) <---
// Add types for all parameters, including the Error object
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Logs the full error stack trace for debugging on the server
    console.error("Auth Service Error:", err.stack); 
    // Sends a generic error response to the client
    res.status(500).json({ message: 'Internal Server Error' }); 
    // I shouldn't call next() here if I don't have any more error handlers
});

// ---> Start Server Function <---
const startServer = async (): Promise<void> => { // Adding return type Promise<void>
    try {
        await connectDB(); // Test connection
        
        const dbUrlFromEnv: string | undefined = process.env.DATABASE_URL; // Explicit type
        const defaultDbMsg: string = '[DATABASE_URL not found or invalid in env]';
        
        let dbNameForLog: string = '[unknown]'; // Initialize log variable

        // Safely parse the URL only if it exists and looks like a URL
        if (dbUrlFromEnv && !dbUrlFromEnv.startsWith('[')) { 
            try {
                const url = new URL(dbUrlFromEnv);
                // Removes leading '/' if present from the pathname
                dbNameForLog = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname; 
                if (!dbNameForLog) { // Handle case where pathname is just '/' or empty
                    dbNameForLog = '[database name missing in URL]';
                }
            } catch (parseError: any) { // Catches potential URL parsing errors
                // Logs the error message from the caught error
                console.warn(`Could not parse DATABASE_URL to extract name: ${parseError?.message || 'Unknown parsing error'}`);
                dbNameForLog = '[invalid URL format]';
            }
        } else {
           console.warn(defaultDbMsg); // Warns if URL is missing or the placeholder
           dbNameForLog = defaultDbMsg;
        }

        console.log(`Database connection pool established successfully (Targeting: '${dbNameForLog}' based on ENV).`);
        
        // ---> Single app.listen call inside the function <---
        console.log(`[AUTH_SERVICE] Attempting to listen on port ${PORT}...`);
        app.listen(PORT, () => {
            // Uses the SERVICE_NAME from env if available
            console.log(`${process.env.SERVICE_NAME || 'Auth Service'} listening on port ${PORT}`);
        });

    } catch (error: any) { // Catches potential errors during connection
        const targetDbName: string = process.env.DATABASE_URL || '[configured database]'; // Logs the raw URL on error
        // Logs the error object itself for more details
        console.error(`Failed to connect using DATABASE_URL '${targetDbName}':`, error); 
        process.exit(1); // Exits the process with an error code
    }
};

// ---> Call Start Server <---
startServer();
