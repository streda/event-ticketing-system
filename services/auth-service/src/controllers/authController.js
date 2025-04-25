// Implement "register", "login"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}

// Register User
const registerUser = async (req, res, next) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: 'Email and password are required;.'})
    }

    if(password.length < 6){
        return res.status(400).json({message: 'Password must be at least 6 characters long.'});
    }

    try{
        const userCheck = await pool.query('SELECT * FROM users where email =$1', [email]);
        if(userCheck.rows.length > 0) {
            return res.status(409).json({message: 'Email already exists.'})
        }

        // const saltRounds = 10;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at', [email, passwordHash]
        );

        console.log(`User registered: ${newUser.rows[0].email}`);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0]
        });

    } catch(error){
        console.error("Registration error:", error);
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Problem with the request. Provide a working email and password'});
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if(!user){
            console.log(`User - ${email} not found.`);
            return res.status(401).json({message: 'Unauthorized: User not found.'})
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if(!isMatch){
            console.log(`Login attempt failed: Incorrect password - ${email}`);
            return res.status(401).json({message: 'Invalid credentials'})
        }

        const payload = {
            userId: user.id,
            email: user.email,
        }

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            {expiresIn: '1h'}
        );

        console.log(`User logged in: ${user.email}`)

        res.status(200).json({
            message: 'Successful login.',
            token: token,
            user : {
                id: user.id,
                email: user.email
            }
        });

    } catch(error){
        console.error('Login error:', error);
        next(error);
    }
}


module.exports = { registerUser, loginUser};