// Implement "register", "login"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/index';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}

// Register User
interface RegisterUserRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

interface RegisterUserResponse extends Response {
    json: (body: {
        message: string;
        user?: {
            id: number;
            email: string;
            created_at: string;
        };
    }) => this;
}

const registerUser = async (req: RegisterUserRequest, res: RegisterUserResponse, next: NextFunction): Promise<void> => {
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
        const userCheck = await pool.query('SELECT * FROM auth_schema.users WHERE email = $1', [email]); 
        if (userCheck.rows.length > 0) {
            res.status(409).json({ message: 'Email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
           'INSERT INTO auth_schema.users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, passwordHash]
        );

        console.log(`User registered: ${newUser.rows[0].email}`);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0],
        });

    } catch (error) {
        console.error("Registration error:", error);
        next(error);
    }
};

interface LoginUserRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

interface LoginUserResponse extends Response {
    json: (body: {
        message: string;
        token?: string;
        user?: {
            id: number;
            email: string;
        };
    }) => this;
}

const loginUser = async (req: LoginUserRequest, res: LoginUserResponse, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Problem with the request. Provide a working email and password' });
        return;
    }

    try {
        const result = await pool.query('SELECT * FROM auth_schema.users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log(`User - ${email} not found.`);
            res.status(401).json({ message: 'Unauthorized: User not found.' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            console.log(`Login attempt failed: Incorrect password - ${email}`);
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const payload = {
            userId: user.id,
            email: user.email,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        console.log(`User logged in: ${user.email}`);

        res.status(200).json({
            message: 'Successful login.',
            token: token,
            user: {
                id: user.id,
                email: user.email,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};


export { registerUser, loginUser};