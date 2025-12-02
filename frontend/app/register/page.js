// frontend/app/register/page.js
'use client';

import { useState } from 'react';
import Toast from '../components/Toast';

export default function RegisterPage() {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(e) {
    e.preventDefault();

    // Frontend validation
    if (!name || !email || !password) {
      setToast({ message: "Please fill all fields", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || "Registration failed", type: "error" });
        return;
      }

      setToast({ message: "Registration successful!", type: "success" });
      setTimeout(() => (window.location.href = "/login"), 1200);

    } catch (err) {
      console.error(err);
      setToast({ message: "Server error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow card-shadow mt-10">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

      <form onSubmit={handleRegister} className="space-y-4">

        <input
          className="w-full border p-3 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          placeholder="Email"
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-md shadow hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-4 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-indigo-600 font-medium">Login</a>
      </p>
    </div>
  );
}
