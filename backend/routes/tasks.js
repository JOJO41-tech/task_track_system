// backend/routes/tasks.js
import express from 'express';
import pool from '../db.js';
import requireAuth from '../middleware/auth.js';

const router = express.Router();

async function updateOverdueTasks() {
  const today = new Date().toISOString().split('T')[0];
  await pool.query(
    "UPDATE tasks SET status='Overdue' WHERE due_date < ? AND status != 'Completed'",
    [today]
  );
}

// GET tasks for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    await updateOverdueTasks();
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC', [userId]);
    res.json(rows);
  } catch (err) {
    console.error('GET /tasks error', err);
    res.status(500).json({ error: err.message });
  }
});

// Create new task (assign to current user)
router.post('/', requireAuth, async (req, res) => {
  const { title, subject, description, due_date, status } = req.body;
  const userId = req.user.id;

  if (!title || !subject || !due_date) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, subject, description, due_date, status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subject, description, due_date, status || 'Not Started', userId]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('POST /tasks error', err);
    res.status(500).json({ error: err.message });
  }
});

// Update full task (only owner)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, subject, description, due_date, status } = req.body;
  const userId = req.user.id;

  if (!title || !subject || !due_date) {
    return res.status(400).json({ error: 'title, subject and due_date are required' });
  }

  try {
    const [rows] = await pool.query('SELECT user_id FROM tasks WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    if (rows[0].user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const sql = `
      UPDATE tasks
      SET title = ?, subject = ?, description = ?, due_date = ?, status = ?
      WHERE id = ?
    `;
    await pool.query(sql, [title, subject, description, due_date, status || 'Not Started', id]);
    const [updated] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json({ success: true, task: updated[0] });
  } catch (err) {
    console.error('PUT /tasks/:id error', err);
    res.status(500).json({ error: err.message });
  }
});

// Update status only (owner check)
router.put('/:id/status', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  try {
    const [rows] = await pool.query('SELECT user_id FROM tasks WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    if (rows[0].user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error('PUT /tasks/:id/status error', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete task (only owner)
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [rows] = await pool.query('SELECT user_id FROM tasks WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    if (rows[0].user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /tasks/:id error', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
