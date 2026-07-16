'use client';

import { useEffect, useState } from 'react';
import { CAMP_CONFIG } from '@/lib/campConfig';

function getTimeLeft() {
  const total = CAMP_CONFIG.date.getTime() - new Date().getTime();
  const days = Math.max(Math.floor(total / (1000 * 60 * 60 * 24)), 0);
  const hours = Math.max(Math.floor((total / (1000 * 60 * 60)) % 24), 0);
  const minutes = Math.max(Math.floor((total / (1000 * 60)) % 60), 0);
  const seconds = Math.max(Math.floor((total / 1000) % 60), 0);
  return { days, hours, minutes, seconds };
}

export default function CountdownTimer() {
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const boxes = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {boxes.map((box) => (
        <div
          key={box.label}
          className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 text-center min-w-[80px]"
        >
          <div className="text-3xl font-extrabold">{box.value}</div>
          <div className="text-sm uppercase tracking-wide">{box.label}</div>
        </div>
      ))}
    </div>
  );
}
