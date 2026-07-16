// Central place for camp details. Edit these values any time — the whole
// site will update automatically.

export const CAMP_CONFIG = {
  name: 'Teens Camp 4th Edition',
  church: 'Kingdom Connection Ministries Abuja - Teens Church',
  theme: 'The Obedience',
  // Update this to your real camp start date and time:
  date: new Date('2026-12-20T09:00:00'),
  dateDisplay: 'December 20, 2026',
  venue: 'To be announced',
  // Registration fee in Naira (whole number, not kobo):
  feeNaira: 5000,
  contactEmail: 'contact@yourcampdomain.com',
  contactPhone: '+234 000 000 0000',
  platoons: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'] as const,
};

export type Platoon = (typeof CAMP_CONFIG.platoons)[number];
