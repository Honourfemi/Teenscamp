'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CAMP_CONFIG } from '@/lib/campConfig';

const initialForm = {
  fullName: '',
  homeAddress: '',
  phoneNumber: '',
  email: '',
  gender: '',
  dateOfBirth: '',
  guardianName: '',
  guardianPhone: '',
  emergencyContact: '',
  churchOrSchool: '',
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const registerRes = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(registerData.error || 'Registration failed.');
      }

      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: registerData.participantId }),
      });
      const initData = await initRes.json();

      if (!initRes.ok) {
        throw new Error(initData.error || 'Could not start payment.');
      }

      window.location.href = initData.authorizationUrl;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-camp-orange';

  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-20 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-camp-purple mb-2 text-center">
          Register for {CAMP_CONFIG.name}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Registration fee: <strong>₦{CAMP_CONFIG.feeNaira.toLocaleString()}</strong>. You'll be
          taken to a secure payment page after submitting this form.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded-2xl p-6">
          <div>
            <label className="block font-semibold mb-1">Full Name *</label>
            <input
              required
              className={inputClass}
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Home Address *</label>
            <input
              required
              className={inputClass}
              value={form.homeAddress}
              onChange={(e) => updateField('homeAddress', e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Phone Number *</label>
              <input
                required
                type="tel"
                className={inputClass}
                value={form.phoneNumber}
                onChange={(e) => updateField('phoneNumber', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email Address *</label>
              <input
                required
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Gender *</label>
              <select
                required
                className={inputClass}
                value={form.gender}
                onChange={(e) => updateField('gender', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Date of Birth *</label>
              <input
                required
                type="date"
                className={inputClass}
                value={form.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Parent/Guardian Name *</label>
              <input
                required
                className={inputClass}
                value={form.guardianName}
                onChange={(e) => updateField('guardianName', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Parent/Guardian Phone *</label>
              <input
                required
                type="tel"
                className={inputClass}
                value={form.guardianPhone}
                onChange={(e) => updateField('guardianPhone', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Emergency Contact (optional)</label>
            <input
              className={inputClass}
              value={form.emergencyContact}
              onChange={(e) => updateField('emergencyContact', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Church or School (optional)</label>
            <input
              className={inputClass}
              value={form.churchOrSchool}
              onChange={(e) => updateField('churchOrSchool', e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-camp-orange text-white font-bold py-3 rounded-full text-lg hover:bg-orange-600 transition disabled:opacity-60"
          >
            {loading ? 'Please wait...' : `Continue to Payment (₦${CAMP_CONFIG.feeNaira.toLocaleString()})`}
          </button>
        </form>
      </section>
      <Footer />
    </main>
  );
}
