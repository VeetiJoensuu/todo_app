import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DBNAME:', process.env.DBNAME);
console.log('TEST_DB_NAME:', process.env.TEST_DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.NODE_ENV === 'development' ? process.env.DBNAME : process.env.TEST_DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export { pool };
