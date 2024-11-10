import { pool } from '../helpers/db.js';

const insertUser = async (email, hashedPassword) => {
    try {
        const result = await pool.query('insert into account (email, password) values ($1, $2) returning *', [email, hashedPassword]);
        return result.rows[0];
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
};

const selectUserByEmail = async (email) => {
    try {
        const result = await pool.query('select * from account where email=$1', [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error selecting user by email:', error);
        throw error;
    }
};

export { insertUser, selectUserByEmail };
