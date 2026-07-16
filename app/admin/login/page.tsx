'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid login.');
        setLoading(false);
        return;
      }

      window.location.href = '/admin/dashboard';
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-2xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-extrabold text-camp-purple mb-6 text-center">
          Admin Login
        </h1>

        <label className="block font-semibold mb-1">Username</label>
        <input
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-camp-orange"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block font-semibold mb-1">Password</label>
        <input
          required
          type="password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-camp-orange"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 text-sm font-semibold mb-4 bg-red-50 border border-red-200 rounded-lg p-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-camp-purple text-white font-bold py-3 rounded-full hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </main>
  );
}
