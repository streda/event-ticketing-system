// Define Express routes. (POST /register and POST /login)
import express from 'express';
import {registerUser, loginUser} from '../controllers/authController.js'

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

// router.get('/me', authenticateTokenMiddleware, getUserProfile);


export default router;