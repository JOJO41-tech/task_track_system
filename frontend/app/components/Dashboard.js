// frontend/app/components/Dashboard.js
'use client';

import { useEffect, useState } from 'react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import Toast from './Toast';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  async function loadTasks() {
    try {
      const token = typeof window !== 'undefined' && localStorage.getItem('token');
      const res = await fetch(`${apiBase}/tasks`, {
        cache: 'no-store',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setToast({ message: err.error || 'Failed to fetch tasks', type: 'error' });
        setTasks([]);
        return;
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setToast({ message: 'Network error while loading tasks', type: 'error' });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTask(id) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/tasks/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setToast({ message: err.error || 'Failed to delete', type: 'error' });
      } else {
        setToast({ message: 'Task deleted', type: 'success' });
      }
      loadTasks();
    } catch (err) {
      console.error('Delete failed:', err);
      setToast({ message: 'Network error on delete', type: 'error' });
    }
  }

  async function updateStatus(id, status) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBase}/tasks/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setToast({ message: err.error || 'Failed to update status', type: 'error' });
      } else {
        setToast({ message: 'Status updated', type: 'success' });
      }
      loadTasks();
    } catch (err) {
      console.error('Status update failed:', err);
      setToast({ message: 'Network error updating status', type: 'error' });
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading tasks...</p>;

  const token = typeof window !== 'undefined' && localStorage.getItem('token');

  // progress bar
  const total = tasks.length;
  const completed = tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between card-shadow">
        <div>
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <p className="text-slate-500 mt-1">Overview of your tasks and progress.</p>
        </div>

        <div className="mt-4 md:mt-0 w-full md:w-1/2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-slate-600">Progress</div>
            <div className="text-sm font-medium">{progress}%</div>
          </div>
          <div className="progress-track w-full">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-3 mt-4">
            <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded">
              <div className="text-xs">Total</div>
              <div className="font-semibold">{total}</div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded">
              <div className="text-xs">Completed</div>
              <div className="font-semibold">{completed}</div>
            </div>
          </div>
        </div>
      </div>

      <div id="add" className="card-shadow rounded-lg overflow-hidden">
        {token ? <TaskForm onTaskAdded={loadTasks} onNotify={setToast} /> : (
          <div className="bg-white p-6">
            <p className="text-center">Please <a href="/login" className="text-indigo-600">log in</a> to add tasks.</p>
          </div>
        )}
      </div>

      <div id="tasks" className="grid md:grid-cols-2 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-2 bg-white p-8 rounded card-shadow text-center text-slate-500">
            No tasks found — add your first task!
          </div>
        ) : tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => deleteTask(task.id)}
            onStatusChange={(status) => updateStatus(task.id, status)}
            onTaskUpdated={() => loadTasks()}
            onNotify={setToast}
          />
        ))}
      </div>
    </div>
  );
}
