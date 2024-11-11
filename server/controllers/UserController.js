import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
import { pool } from '../helpers/db.js';

const { sign } = pkg;

const createUserObject = (id, email, token = undefined) => {
    return {
        id: id,
        email: email,
        ...(token !== undefined) && { token: token }
    };
};

// Controller for user login
export const postLogin = async (req, res, next) => {
    const invalid_message = 'Invalid credentials.';
    try {
        const result = await pool.query('SELECT * FROM account WHERE email=$1', [req.body.email]);
        if (result.rowCount === 0) return next(new Error(invalid_message));
        
        const user = result.rows[0];
        if (!await compare(req.body.password, user.password)) return next(new Error(invalid_message));
        
        const token = sign({ user: req.body.email }, process.env.JWT_SECRET_KEY);
        return res.status(200).json(createUserObject(user.id, user.email, token));
    } catch (error) {
        console.error('Error in postLogin:', error);
        return next(error);
    }
};

// Controller for user registration
export const postRegistration = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (typeof email !== 'string' || typeof password !== 'string') {
            const error = new Error('Email and password must be strings');
            error.statusCode = 400;
            return next(error);
        }
        const hashedPassword = await hash(password, 10);
        const result = await pool.query('INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        return res.status(201).json({ id: result.rows[0].id, email: result.rows[0].email });
    } catch (error) {
        if (error.code === '23505') {
            error.statusCode = 400;
            error.message = 'Email already exists';
        }
        return next(error);
    }
};


