'use client';

import { useEffect, useState, useCallback } from 'react';
import { CAMP_CONFIG } from '@/lib/campConfig';

type Participant = {
  id: string;
  registration_id: string | null;
  full_name: string;
  phone_number: string;
  email: string;
  gender: string;
  platoon: string | null;
  payment_status: string;
  checked_in: boolean;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState<{
    totalRegistrations: number;
    totalPaid: number;
    perPlatoon: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [platoon, setPlatoon] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [gender, setGender] = useState('');

  const loadParticipants = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (platoon) params.set('platoon', platoon);
    if (paymentStatus) params.set('paymentStatus', paymentStatus);
    if (gender) params.set('gender', gender);

    const res = await fetch(`/api/admin/participants?${params.toString()}`);
    const data = await res.json();
    setParticipants(data.participants || []);
  }, [search, platoon, paymentStatus, gender]);

  const loadStats = useCallback(async () => {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setStats(data);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadParticipants(), loadStats()]).finally(() => setLoading(false));
  }, [loadParticipants, loadStats]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const selectClass =
    'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-camp-orange';

  return (
    <main className="min-h-screen bg-gray-50 px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-camp-purple">
            Admin Dashboard — {CAMP_CONFIG.name}
          </h1>
          <div className="flex gap-3">
            <a
              href="/admin/checkin"
              className="bg-camp-purple text-white font-bold px-4 py-2 rounded-full text-sm"
            >
              QR Check-in Scanner
            </a>
            <a
              href="/api/admin/export"
              className="bg-camp-orange text-white font-bold px-4 py-2 rounded-full text-sm"
            >
              Export CSV
            </a>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-full text-sm"
            >
              Log Out
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-3xl font-extrabold text-camp-purple">{stats.totalRegistrations}</p>
              <p className="text-sm text-gray-500">Total Registrations</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-3xl font-extrabold text-camp-orange">{stats.totalPaid}</p>
              <p className="text-sm text-gray-500">Total Paid</p>
            </div>
            {CAMP_CONFIG.platoons.slice(0, 2).map((p) => (
              <div key={p} className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-3xl font-extrabold">{stats.perPlatoon[p] || 0}</p>
                <p className="text-sm text-gray-500">{p} Platoon</p>
              </div>
            ))}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {CAMP_CONFIG.platoons.slice(2).map((p) => (
              <div key={p} className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-3xl font-extrabold">{stats.perPlatoon[p] || 0}</p>
                <p className="text-sm text-gray-500">{p} Platoon</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
          <input
            placeholder="Search name, phone, email, or registration ID"
            className="flex-1 min-w-[220px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-camp-orange"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className={selectClass} value={platoon} onChange={(e) => setPlatoon(e.target.value)}>
            <option value="">All Platoons</option>
            {CAMP_CONFIG.platoons.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            className={selectClass}
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="">All Payment Status</option>
            <option value="success">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select className={selectClass} value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Reg. ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Platoon</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Checked In</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} className="p-6 text-center text-gray-500">Loading...</td></tr>
              )}
              {!loading && participants.length === 0 && (
                <tr><td colSpan={8} className="p-6 text-center text-gray-500">No participants found.</td></tr>
              )}
              {participants.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="p-3 font-semibold">{p.registration_id || '—'}</td>
                  <td className="p-3">{p.full_name}</td>
                  <td className="p-3">{p.phone_number}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.gender}</td>
                  <td className="p-3">{p.platoon || '—'}</td>
                  <td className="p-3">
                    <span
                      className={
                        p.payment_status === 'success'
                          ? 'text-green-600 font-semibold'
                          : p.payment_status === 'failed'
                          ? 'text-red-600 font-semibold'
                          : 'text-yellow-600 font-semibold'
                      }
                    >
                      {p.payment_status}
                    </span>
                  </td>
                  <td className="p-3">{p.checked_in ? '✅' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
