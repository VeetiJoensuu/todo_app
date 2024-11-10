import express from 'express';
import cors from 'cors';
import todoRouter from './routers/todoRouter.js';
import userRouter from './routers/userRouter.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

if (!process.env.JWT_SECRET_KEY) {
    process.env.JWT_SECRET_KEY = generateSecretKey();
}

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', todoRouter);
app.use('/user', userRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
});

app.listen(port);



// npm run devStart