"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ---> LOAD ENVIRONMENT VARIABLES FIRST <---
require("dotenv/config");
// ---> Standard Imports  <---
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./db/index");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Explicitly type the app instance (optional but good practice)
const app = (0, express_1.default)();
// Treating PORT as a number for listen
// process.env variables are strings or undefined
const portString = process.env.PORT || '3001'; // Default to string '3001'
const PORT = parseInt(portString, 10); // Parse to number
// ---> Register Global Middlewares <---
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ---> Routes <---
app.use('/api/auth', authRoutes_1.default);
// Adding types to request and response objects for route handlers
app.get('/health', (req, res) => {
    res.send('Auth Service OK');
});
app.get('/', (req, res) => {
    res.send(`Hello from the ${process.env.SERVICE_NAME || 'Auth Service'}!`);
});
/*
Catches all unhandled errors that occur anywhere in my server after the request hits middlewares or routes.
Prevents the server from crashing or exposing sensitive error info to the client.
Instead, it returns a generic 500 Internal Server Error safely.
*/
// ---> Global Error Handler (special error-handling middleware) <---
// Add types for all parameters, including the Error object
app.use((err, req, res, next) => {
    // Logs the full error stack trace for debugging on the server
    console.error("Auth Service Error:", err.stack);
    // Sends a generic error response to the client
    res.status(500).json({ message: 'Internal Server Error' });
    // I shouldn't call next() here if I don't have any more error handlers
});
// ---> Start Server Function <---
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, index_1.connectDB)(); // Test connection
        const dbUrlFromEnv = process.env.DATABASE_URL; // Explicit type
        const defaultDbMsg = '[DATABASE_URL not found or invalid in env]';
        let dbNameForLog = '[unknown]'; // Initialize log variable
        // Safely parse the URL only if it exists and looks like a URL
        if (dbUrlFromEnv && !dbUrlFromEnv.startsWith('[')) {
            try {
                const url = new URL(dbUrlFromEnv);
                // Removes leading '/' if present from the pathname
                dbNameForLog = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
                if (!dbNameForLog) { // Handle case where pathname is just '/' or empty
                    dbNameForLog = '[database name missing in URL]';
                }
            }
            catch (parseError) { // Catches potential URL parsing errors
                // Logs the error message from the caught error
                console.warn(`Could not parse DATABASE_URL to extract name: ${(parseError === null || parseError === void 0 ? void 0 : parseError.message) || 'Unknown parsing error'}`);
                dbNameForLog = '[invalid URL format]';
            }
        }
        else {
            console.warn(defaultDbMsg); // Warns if URL is missing or the placeholder
            dbNameForLog = defaultDbMsg;
        }
        console.log(`Database connection pool established successfully (Targeting: '${dbNameForLog}' based on ENV).`);
        // ---> Single app.listen call inside the function <---
        app.listen(PORT, () => {
            // Uses the SERVICE_NAME from env if available
            console.log(`${process.env.SERVICE_NAME || 'Auth Service'} listening on port ${PORT}`);
        });
    }
    catch (error) { // Catches potential errors during connection
        const targetDbName = process.env.DATABASE_URL || '[configured database]'; // Logs the raw URL on error
        // Logs the error object itself for more details
        console.error(`Failed to connect using DATABASE_URL '${targetDbName}':`, error);
        process.exit(1); // Exits the process with an error code
    }
});
// ---> Call Start Server <---
startServer();
