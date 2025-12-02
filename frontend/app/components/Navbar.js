'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const name = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
    if (token && name) setUser({ name });
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-sky-600 to-indigo-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white text-xl shadow">
              🗂
            </div>
            <div className="text-white font-semibold text-lg">Task Tracker System</div>
          </Link>
          <nav className="flex items-center gap-4">
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-white/90 text-sm">Hi, <span className="font-medium">{user.name}</span></span>
                <button onClick={logout} className="bg-white text-indigo-600 px-3 py-1 rounded">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-white/90 text-sm px-3 py-1 rounded hover:bg-white/5">Login</Link>
                <Link href="/register" className="bg-white text-indigo-600 px-3 py-1 rounded">Sign up</Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
