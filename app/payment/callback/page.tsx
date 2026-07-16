'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function CallbackContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Confirming your payment, please wait...');

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference was found. Please try registering again.');
      return;
    }

    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.success) {
          window.location.href = `/confirmation/${data.registrationId}`;
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment could not be confirmed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong while confirming payment.');
      });
  }, [reference]);

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 px-6 max-w-lg mx-auto text-center">
        {status === 'checking' && (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-camp-orange border-t-transparent rounded-full mx-auto mb-6" />
            <p className="text-lg text-gray-700">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-3xl font-extrabold text-red-600 mb-4">Payment Issue</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <a href="/register" className="text-camp-orange font-bold underline">
              Try registering again
            </a>
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center">Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
