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
exports.connectDB = void 0;
// Basic PostgreSQL connection setup (reads DATABASE_URL from env).
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
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
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.connect();
        console.log('Database connection pool established successfully.');
    }
    catch (error) {
        console.error('Error connecting to the database pool:', error);
        throw error; // Re-throwing the error to be caught by the caller (server.js)
    }
});
exports.connectDB = connectDB;
// Export the pool so that my controllers can use it for queries
exports.default = pool;
