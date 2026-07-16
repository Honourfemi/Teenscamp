'use client';

import { useEffect, useRef, useState } from 'react';

type Participant = {
  id: string;
  registration_id: string;
  full_name: string;
  payment_status: string;
  platoon: string | null;
  checked_in: boolean;
};

export default function CheckinPage() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [message, setMessage] = useState('');
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let html5QrCode: any;

    async function startScanner() {
      const { Html5Qrcode } = await import('html5-qrcode');
      html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (decodedText: string) => handleScan(decodedText),
          () => {}
        );
      } catch (err) {
        setMessage('Could not access camera. Please allow camera permission and reload.');
      }
    }

    if (scannerActive) {
      startScanner();
    }

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerActive]);

  async function handleScan(registrationId: string) {
    if (!scannerActive) return;
    setScannerActive(false);
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
    }

    setMessage('Looking up registration...');
    setParticipant(null);
    setAlreadyCheckedIn(false);

    try {
      const res = await fetch(`/api/admin/checkin?registrationId=${encodeURIComponent(registrationId)}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Registration not found.');
        return;
      }

      setParticipant(data.participant);
      setAlreadyCheckedIn(data.participant.checked_in);
      setMessage('');
    } catch {
      setMessage('Something went wrong looking up this registration.');
    }
  }

  async function confirmCheckin() {
    if (!participant) return;
    const res = await fetch('/api/admin/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationId: participant.registration_id }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Could not check in this participant.');
      return;
    }

    setParticipant(data.participant);
    setAlreadyCheckedIn(true);
  }

  function scanNext() {
    setParticipant(null);
    setMessage('');
    setAlreadyCheckedIn(false);
    setScannerActive(true);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-extrabold text-camp-purple mb-6 text-center">
          QR Check-in Scanner
        </h1>

        {scannerActive && (
          <div id="qr-reader" className="bg-white rounded-2xl shadow overflow-hidden mb-4" />
        )}

        {message && (
          <p className="text-center text-gray-600 bg-white rounded-xl shadow p-4 mb-4">
            {message}
          </p>
        )}

        {participant && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-sm text-gray-500 mb-1">Registration ID</p>
            <p className="text-xl font-extrabold text-camp-purple mb-4">
              {participant.registration_id}
            </p>

            <p className="text-sm text-gray-500 mb-1">Name</p>
            <p className="text-lg font-bold mb-4">{participant.full_name}</p>

            <p className="text-sm text-gray-500 mb-1">Platoon</p>
            <p className="text-lg font-bold mb-4">{participant.platoon || '—'}</p>

            <p className="text-sm text-gray-500 mb-1">Payment Status</p>
            <p
              className={`text-lg font-bold mb-6 ${
                participant.payment_status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {participant.payment_status}
            </p>

            {alreadyCheckedIn ? (
              <p className="bg-yellow-50 border border-yellow-300 text-yellow-700 font-bold rounded-lg p-3 mb-4">
                ✅ Already checked in
              </p>
            ) : participant.payment_status === 'success' ? (
              <button
                onClick={confirmCheckin}
                className="w-full bg-camp-orange text-white font-bold py-3 rounded-full mb-4"
              >
                Confirm Check-in
              </button>
            ) : (
              <p className="bg-red-50 border border-red-300 text-red-700 font-bold rounded-lg p-3 mb-4">
                Payment not confirmed — cannot check in.
              </p>
            )}

            <button
              onClick={scanNext}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-full"
            >
              Scan Next Participant
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
