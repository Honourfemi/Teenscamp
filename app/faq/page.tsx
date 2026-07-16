import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CAMP_CONFIG } from '@/lib/campConfig';

const FAQS = [
  {
    q: 'How much is registration?',
    a: `Registration is ₦${CAMP_CONFIG.feeNaira.toLocaleString()} per participant, payable securely online during registration.`,
  },
  {
    q: 'How do I know my platoon?',
    a: 'Your platoon is assigned automatically after payment and shown on the confirmation page and in your confirmation email.',
  },
  {
    q: 'What do I bring on the first day?',
    a: 'Bring your QR code (printed or on your phone) from the confirmation email — this is used for check-in.',
  },
  {
    q: 'Can I register on behalf of my child?',
    a: 'Yes — a parent or guardian can fill the registration form for their teenager.',
  },
];

export default function FaqPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-camp-purple mb-8 text-center">
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {FAQS.map((f) => (
            <div key={f.q} className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <p className="font-bold text-camp-purple mb-2">{f.q}</p>
              <p className="text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
