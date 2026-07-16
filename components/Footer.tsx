import { CAMP_CONFIG } from '@/lib/campConfig';

export default function Footer() {
  return (
    <footer id="contact" className="bg-camp-purple text-white py-10 text-center">
      <p className="font-bold text-lg mb-2">🏕️ {CAMP_CONFIG.name}</p>
      <p className="text-sm opacity-80">{CAMP_CONFIG.church}</p>
      <p className="text-sm opacity-80 mt-1">
        {CAMP_CONFIG.contactEmail} · {CAMP_CONFIG.contactPhone}
      </p>
      <p className="text-xs opacity-60 mt-4">
        © {new Date().getFullYear()} {CAMP_CONFIG.name}. All rights reserved.
      </p>
      <p className="text-xs opacity-60 mt-2">
        <a href="/admin/login" className="underline">Admin Login</a>
      </p>
    </footer>
  );
}
