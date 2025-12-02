// backend/routes/auth.js
import express from 'express';
import pool from '../db.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { signToken } from '../utils/jwt.js';

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    // check existing
    const [rows] = await pool.query('SELECT id FROM user WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await hashPassword(password);
    const [result] = await pool.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: err.message });
  }
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, name: user.name });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
