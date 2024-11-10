import express from 'express';
const router = express.Router();
import { pool } from '../helpers/db.js';
import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

// Login route
router.post('/login', (req, res, next) => {
    const invalid_message = 'Invalid credentials.';
    try {
        pool.query('select * from account where email=$1',
            [req.body.email],
            (error, result) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return next(error);
                }
                if (result.rowCount === 0) return next(new Error(invalid_message));

                compare(req.body.password, result.rows[0].password, (error, match) => {
                    if (error) {
                        console.error('Error comparing passwords:', error);
                        return next(error);
                    }
                    if (!match) return next(new Error(invalid_message));

                    const token = sign({ user: req.body.email }, process.env.JWT_SECRET_KEY);
                    const user = result.rows[0];

                    return res.status(200).json({
                        'id': user.id,
                        'email': user.email,
                        'token': token
                    });
                });
            });
    } catch (error) {
        console.error('Unexpected error:', error);
        return next(error);
    }
});

// Register route
router.post('/register', (req, res, next) => {
    console.log('Received registration request:', req.body);

    const { email, password } = req.body;
    console.log(`Email type: ${typeof email}, Password type: ${typeof password}`);
    if (typeof email !== 'string' || typeof password !== 'string') {
        const error = new Error('Email and password must be strings');
        console.error(error);
        return next(error);
    }

    hash(password, 10, (error, hashedPassword) => {
        if (error) {
            console.error('Error hashing password:', error);
            return next(error);
        }
        try {
            pool.query('insert into account (email, password) values ($1, $2) returning *',
                [email, hashedPassword],
                (error, result) => {
                    if (error) {
                        console.error('Error inserting into database:', error);
                        return next(error);
                    }
                    console.log('User registered successfully:', result.rows[0]);
                    return res.status(201).json({ id: result.rows[0].id, email: result.rows[0].email });
                }
            );
        } catch (error) {
            console.error('Unexpected error:', error);
            return next(error);
        }
    });
});

export default router;
