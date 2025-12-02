// frontend/app/components/TaskCard.js
'use client';

import { useState } from 'react';
import Toast from './Toast';

function statusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'completed') return 'bg-emerald-100 text-emerald-700';
  if (s === 'in progress') return 'bg-yellow-100 text-yellow-700';
  if (s === 'overdue') return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-700';
}

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

export default function TaskCard({ task, onDelete, onStatusChange, onTaskUpdated, onNotify }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: task.title || '',
    subject: task.subject || '',
    description: task.description || '',
    due_date: task.due_date ? task.due_date.split('T')[0] : '',
    status: task.status || 'Not Started',
  });
  const [toast, setToast] = useState(null);

  function notify(obj) {
    if (onNotify) return onNotify(obj);
    setToast(obj);
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function saveEdit() {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(form),
      });
      if (res.status === 401) { window.location.href = '/login'; return; }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        notify({ message: err.error || 'Update failed', type: 'error' });
        return;
      }
      notify({ message: 'Task updated', type: 'success' });
      setEditing(false);
      if (onTaskUpdated) onTaskUpdated();
    } catch (err) {
      console.error('Save edit error', err);
      notify({ message: 'Network error while saving', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    if (!confirm('Delete this task?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/tasks/${task.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401) { window.location.href = '/login'; return; }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        notify({ message: err.error || 'Delete failed', type: 'error' });
        return;
      }
      notify({ message: 'Task deleted', type: 'success' });
      if (onDelete) onDelete();
    } catch (err) {
      console.error(err);
      notify({ message: 'Network error on delete', type: 'error' });
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-white p-5 rounded-lg card-shadow">
        {!editing ? (
          <>
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <div className="text-sm text-slate-500">{task.subject}</div>
                <div className="text-xs text-slate-400 mt-1">Due: {formatDate(task.due_date)}</div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(task.status)}`}>
                  {task.status}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(true)} className="text-sm px-3 py-1 border rounded hover:bg-slate-50">Edit</button>
                  <button onClick={doDelete} className="text-sm px-3 py-1 text-red-600">Delete</button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-slate-700">{task.description}</p>

            <div className="mt-4">
              <label className="text-xs text-slate-500 block mb-2">Update status</label>
              <select className="border p-2 rounded" defaultValue={task.status} onChange={e => onStatusChange && onStatusChange(e.target.value)}>
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="subject" value={form.subject} onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="due_date" type="date" value={form.due_date} onChange={handleChange} className="w-full border p-2 rounded" />
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
            <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="bg-indigo-600 text-white px-3 py-1 rounded">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
