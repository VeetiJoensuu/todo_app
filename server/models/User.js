import { pool } from '../helpers/db.js';

const insertUser = async (email, hashedPassword) => {
    try {
        const result = await pool.query('INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        return result.rows[0];
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
};

const selectUserByEmail = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM account WHERE email=$1', [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error selecting user by email:', error);
        throw error;
    }
};

export { insertUser, selectUserByEmail };
