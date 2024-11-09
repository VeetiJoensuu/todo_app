import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.NODE_ENV === 'development' ? process.env.DBNAME : process.env.TEST_DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

export { pool }