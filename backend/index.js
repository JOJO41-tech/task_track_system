// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.send('✅ Personal Task Tracker API Running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import authRouter from './routes/auth.js';
app.use('/auth', authRouter);
