import express from 'express';
import cors from 'cors';
import todoRouter from './routers/todoRouter.js';
import userRouter from './routers/userRouter.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config(); // Load environment variables from .env file

// Function to generate a random JWT secret key if not provided
const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Set JWT secret key if not already set
if (!process.env.JWT_SECRET_KEY) {
    process.env.JWT_SECRET_KEY = generateSecretKey();
    console.log('Generated new JWT secret key:', process.env.JWT_SECRET_KEY);
}

const port = process.env.PORT; // Get port from environment variable

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
});

app.use('/', todoRouter); // Use router for task-related routes
app.use('/user', userRouter); // Use router for user-related routes

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