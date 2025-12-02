// frontend/app/login/page.js
'use client';

import { useState } from 'react';
import Toast from '../components/Toast';

export default function LoginPage() {
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: 'Please enter email and password', type: 'error' });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || 'Login failed', type: 'error' });
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name || email);
      setToast({ message: 'Login successful', type: 'success' });
      setTimeout(() => (window.location.href = '/'), 900);
    } catch (err) {
      console.error('Login error', err);
      setToast({ message: 'Server error', type: 'error' });
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Welcome </h1>

        
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleLogin} className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full border p-2 rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Login</button>
      </form>

      <p className="text-sm text-slate-500 mt-4">No account? <a href="/register" className="text-blue-600">Register</a></p>
    </div>
  );
}
