// backend/db.js
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const passwordEnv = process.env.DB_PASS ?? process.env.DB_PASSWORD ?? '';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  // convert empty string to null for some MySQL configs
  password: passwordEnv === '' ? null : passwordEnv,
  database: process.env.DB_NAME || 'personal_task_db',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool.promise();
