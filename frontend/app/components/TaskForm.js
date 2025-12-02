// frontend/app/components/TaskForm.js
'use client';

import { useState } from 'react';
import Toast from './Toast';

export default function TaskForm({ onTaskAdded, onNotify }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  function notify(obj) {
    if (onNotify) return onNotify(obj);
    setToast(obj);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !subject || !dueDate) {
      notify({ message: 'Please fill title, subject, and due date.', type: 'error' });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ title, subject, description, due_date: dueDate, status }),
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        notify({ message: err.error || 'Failed to add task', type: 'error' });
        return;
      }

      notify({ message: 'Task added', type: 'success' });

      setTitle(''); setSubject(''); setDescription(''); setDueDate(''); setStatus('Not Started');
      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      console.error('Add task error:', err);
      notify({ message: 'Network error adding task', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add New Task</h2>
          <div className="text-sm text-slate-500">Your tasks are private to you.</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-3 rounded-md" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="border p-3 rounded-md" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="date" className="border p-3 rounded-md" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <select className="border p-3 rounded-md" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <textarea className="w-full border p-3 rounded-md" rows="3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-5 py-2 rounded-md shadow hover:opacity-95">
            {saving ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </>
  );
}
