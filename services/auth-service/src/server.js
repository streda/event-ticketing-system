import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

import authRoutes from './routes/authRoutes';
import {connectDB} from './db'
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/auth', authRoutes);
app.get('/api/auth/health', (req, res) => res.send('Auth Service OK'));

app.get('/', (req, res) => {
    res.send(`Hello from the ${process.env.SERVICE_NAME || 'Auth Service'}!`);
})

app.use((err, req, res, next) => {
    console.error("Auth Service Error:", err.stack)
    res.status(500).send({message: 'Internal Server Error', error: err.message});
})

app.listen(PORT, async() => {
    try {
        await connectDB(),
        console.log('Database connected successfully.');
        console.log(`Auth Service listening on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit if DB connection fails on startup
  }
});

app.listen(PORT, () => {
    console.log(`${process.env.SERVICE_NAME || 'Microservice'} listening on PORT ${PORT}`);
})