import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CAMP_CONFIG } from '@/lib/campConfig';

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 px-6 max-w-xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-camp-purple mb-6">Contact Us</h1>
        <p className="text-gray-700 text-lg mb-2">Email: {CAMP_CONFIG.contactEmail}</p>
        <p className="text-gray-700 text-lg mb-2">Phone: {CAMP_CONFIG.contactPhone}</p>
        <p className="text-gray-700 text-lg">{CAMP_CONFIG.church}</p>
      </section>
      <Footer />
    </main>
  );
}
