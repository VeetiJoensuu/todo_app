// Import the 'pg' package and 'dotenv' to manage environment variables.
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from the .env file into process.env.
dotenv.config();

// Destructure and get the Pool class from the 'pg' package.
const { Pool } = pkg;

// Log the database connection details to console.
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DBNAME:', process.env.DBNAME);
console.log('TEST_DB_NAME:', process.env.TEST_DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);

// Create a new Pool instance to manage connections to the PostgreSQL database.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.NODE_ENV === 'development' ? process.env.DBNAME : process.env.TEST_DB_NAME, // Select database based on environment
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export { pool };
