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
exports.loginUser = exports.registerUser = void 0;
// Implement "register", "login"
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = __importDefault(require("../db/index.js"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required;.' });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        return Promise.resolve();
    }
    try {
        const userCheck = yield index_js_1.default.query('SELECT * FROM users where email =$1', [email]);
        if (userCheck.rows.length > 0) {
            res.status(409).json({ message: 'Email already exists.' });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield index_js_1.default.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at', [email, passwordHash]);
        console.log(`User registered: ${newUser.rows[0].email}`);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0],
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        next(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Problem with the request. Provide a working email and password' });
        return;
    }
    try {
        const result = yield index_js_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            console.log(`User - ${email} not found.`);
            res.status(401).json({ message: 'Unauthorized: User not found.' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            console.log(`Login attempt failed: Incorrect password - ${email}`);
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const payload = {
            userId: user.id,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        console.log(`User logged in: ${user.email}`);
        res.status(200).json({
            message: 'Successful login.',
            token: token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        next(error);
    }
});
exports.loginUser = loginUser;
