import pkg from 'pg';
import dotenv from 'dotenv';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DBNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const initializeTestDb = async () => {
    const client = await pool.connect();
    try {
        await client.query(`DROP TABLE IF EXISTS account, task`);
        await client.query(`
            CREATE TABLE account (
                id SERIAL PRIMARY KEY,
                email VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        await client.query(`
            CREATE TABLE task (
                id SERIAL PRIMARY KEY,
                description VARCHAR(255) NOT NULL
            )
        `);
        // Insert some test tasks
        await client.query(`
            INSERT INTO task (description) VALUES 
            ('Task 1'),
            ('Task 2'),
            ('Task 3')
        `);
        console.log('Test database initialized with sample data');
    } finally {
        client.release();
    }
};

const insertTestUser = async ({ email, password }) => {
    const hashedPassword = await hash(password, 10);
    try {
        await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    } catch (error) {
        if (error.code !== '23505') { // Ignore duplicate user errors
            throw error;
        }
    }
};

const getToken = (email) => {
    return `Bearer ${jwt.sign({ user: email }, process.env.JWT_SECRET_KEY)}`;
};

export { initializeTestDb, insertTestUser, getToken };
