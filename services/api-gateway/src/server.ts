// ---> LOAD ENV VARS FIRST <---
import 'dotenv/config'; 

// ---> Standard Imports (with types) <---
import express, { Express, Request, Response, NextFunction } from 'express'; // Import types
import cors from 'cors';
import morgan from 'morgan'; // HTTP request logger middleware
import { createProxyMiddleware, Options, RequestHandler } from 'http-proxy-middleware';
import http from 'http'; // Node's built-in HTTP types
import { Socket } from 'net';
const app: Express = express();

// ---> Configuration <---
const portString: string = process.env.API_GATEWAY_PORT || '3000'; // Default to string '3000'
const PORT: number = parseInt(portString, 10);

// Explicitly typing of Url target | undefined initially
const AUTH_SERVICE_URL: string | undefined = process.env.AUTH_SERVICE_URL;
const EVENT_SERVICE_URL: string | undefined = process.env.EVENT_SERVICE_URL;
// const BOOKING_SERVICE_URL: string | undefined = process.env.BOOKING_SERVICE_URL;

// ---> Validation of required environment variables <---
if (!AUTH_SERVICE_URL) {
    console.error("FATAL ERROR: AUTH_SERVICE_URL is not defined in environment variables.");
    process.exit(1);
}
if (!EVENT_SERVICE_URL) {
    console.error("FATAL ERROR: EVENT_SERVICE_URL is not defined in environment variables.");
    process.exit(1);
}

// ---> Middleware <---
app.use(cors());
app.use(morgan('dev')); 
app.use(express.json()); 

// ---> Common Proxy Options <---
const commonProxyOptions: Partial<Options> = { 
    changeOrigin: true,
};

// ---> Proxy Routes <---

// Inside services/api-gateway/src/server.ts

// --- Proxy Routes ---

// Proxy requests for /api/auth/* to the Auth Service
app.use('/api/auth', createProxyMiddleware({
    on: {
        proxyReq: (proxyReq: http.ClientRequest, req: Request, res: Response) => { 
            console.log(`[GW] Proxying ${req.method} ${req.originalUrl} -> ${AUTH_SERVICE_URL}${proxyReq.path}`);
        },
        // ---> Correctly types 'res' and uses a type guard <---
        error: (err: Error, req: Request, res: Response | Socket, target?: string | Options['target']) => { 
            console.error(`[GW] Auth Proxy error: ${err.message}`, { target }); // Logs error and target

            // I have to check if 'res' is an HTTP Response object (has 'status' method)
            if ('status' in res && typeof res.status === 'function') {
                // It's an Express Response
                if (!res.headersSent && res.socket?.writable) {
                    res.status(502).send('Proxy Error: Could not connect to the authentication service.');
                } else if (res.socket?.writable) {
                    // Headers might be sent, but socket is still open, just end it.
                    res.end();
                }
            } else if (res instanceof Socket) {
                // It's a raw Socket, likely a connection error to the target
                console.error('[GW] Network error connecting to target. Destroying socket.');
                res.destroy(err); // Destroy the socket with the error
            } else {
                 // Fallback for unexpected scenarios
                 console.error('[GW] Unknown error type in proxy error handler.');
            }
        }
    }
}));

// Proxy requests for /api/events/* to the Event Service 
app.use('/api/events', createProxyMiddleware({
    on: {
        proxyReq: (proxyReq: http.ClientRequest, req: Request, res: Response) => { 
             console.log(`[GW] Proxying ${req.method} ${req.originalUrl} -> ${EVENT_SERVICE_URL}${proxyReq.path}`);
        },
        // ---> Correctly types 'res' and uses a type guard <---
        error: (err: Error, req: Request, res: Response | Socket, target?: string | Options['target']) => { 
            console.error(`[GW] Event Proxy error: ${err.message}`, { target });

            if ('status' in res && typeof res.status === 'function') {
                 if (!res.headersSent && res.socket?.writable) {
                     res.status(502).send('Proxy Error: Could not connect to the event service.'); 
                 } else if (res.socket?.writable) {
                     res.end();
                 }
            } else if (res instanceof Socket) {
                 console.error('[GW] Network error connecting to target. Destroying socket.');
                 res.destroy(err);
            } else {
                 console.error('[GW] Unknown error type in proxy error handler.');
            }
        }
    }
}));

// I need more proxy middleware for /api/bookings, /api/payments, etc. here

// ---> Basic Health Check Route for the Gateway itself <---
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('API Gateway is healthy');
});

// ---> Optional: Catch-all for unproxied routes (404) <---
// I need to make sure Catch-all for un proxied routes after all my specific proxy routes and health checks
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found: The requested resource does not exist on the API Gateway.' });
});

// ---> Starts the Gateway Server <---
app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);

    console.log(`Proxying /api/auth to ${AUTH_SERVICE_URL}`);
    console.log(`Proxying /api/events to ${EVENT_SERVICE_URL}`);
});