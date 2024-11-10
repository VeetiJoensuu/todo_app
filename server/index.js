import express from 'express';
import cors from 'cors';
import todoRouter from './routers/todoRouter.js';
import userRouter from './routers/userRouter.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables from .env file
dotenv.config();

const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

if (!process.env.JWT_SECRET_KEY) {
    process.env.JWT_SECRET_KEY = generateSecretKey();
    console.log('Generated new JWT secret key:', process.env.JWT_SECRET_KEY);
}

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

app.use('/', todoRouter);
app.use('/user', userRouter);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error('Error Status:', err.statusCode || 500);
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// npm run devStart