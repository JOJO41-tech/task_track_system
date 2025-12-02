// frontend/app/components/Toast.js
'use client';
import { useEffect } from 'react';

export default function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`px-5 py-3 rounded-lg shadow-lg text-white animate-slide
        ${type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}
        role="status"
      >
        {message}
      </div>

      <style jsx>{`
        .animate-slide {
          animation: slide-in 0.32s ease forwards;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
