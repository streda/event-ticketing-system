// services/api-gateway/src/server.js

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; // HTTP request logger middleware
import { createProxyMiddleware } from 'http-proxy-middleware';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Configuration
const PORT = process.env.API_GATEWAY_PORT || 3000; // Port for the gateway itself
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'; // Target URL for Auth service
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://localhost:3002'; // Target URL for Event service 
// I will add URLs for Booking, Payment, Notification services here as I build them. For example:
// const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:3003';

// --- Middleware ---
app.use(cors()); // Enable CORS for requests from frontend
app.use(morgan('dev')); // Use of morgan for logging incoming requests 
app.use(express.json()); 

// --- Proxy Routes ---

// Proxy requests for /api/auth/* to the Auth Service
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true, // Changes the origin of the host header to the target URL
    pathRewrite: {
        '^/api/auth': '', // Rewrite '/api/auth/login' to '/login' before sending to Auth Service
    },
    onProxyReq: (proxyReq, req, res) => { // Log proxied requests
        console.log(`[GW] Proxying ${req.method} ${req.originalUrl} -> ${AUTH_SERVICE_URL}${proxyReq.path}`);
    },
    onError: (err, req, res) => { // Handle proxy errors
        console.error('[GW] Proxy error:', err);
        res.status(502).send('Proxy Error: Could not connect to the authentication service.'); // 502 Bad Gateway
    }
}));

// Proxy requests for /api/events/* to the Event Service 
app.use('/api/events', createProxyMiddleware({
    target: EVENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/events': '', // Rewrite '/api/events/123' to '/123'
    },
     onProxyReq: (proxyReq, req, res) => { 
        console.log(`[GW] Proxying ${req.method} ${req.originalUrl} -> ${EVENT_SERVICE_URL}${proxyReq.path}`);
    },
     onError: (err, req, res) => { 
        console.error('[GW] Proxy error:', err);
        res.status(502).send('Proxy Error: Could not connect to the event service.'); 
    }
}));

// I will add similar proxy middleware for /api/bookings, /api/payments, etc. here


// --- Basic Health Check Route for the Gateway itself ---
app.get('/health', (req, res) => {
    res.status(200).send('API Gateway is healthy');
});

// --- Start the Gateway Server ---
app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
    console.log(`Proxying /api/auth to ${AUTH_SERVICE_URL}`);
    console.log(`Proxying /api/events to ${EVENT_SERVICE_URL}`);
    // I will log other proxy targets ... here
});