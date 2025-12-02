// frontend/app/layout.js
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'Task Tracker System',
  description: 'A beautiful task tracker with auth',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-sky-50 text-slate-900">
        <Navbar />
        <main className="py-10">
          <div className="max-w-6xl mx-auto px-4">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
