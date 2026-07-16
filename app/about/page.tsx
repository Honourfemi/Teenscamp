import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CAMP_CONFIG } from '@/lib/campConfig';

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-camp-purple mb-6">About the Camp</h1>
        <p className="text-gray-700 text-lg mb-4">
          {CAMP_CONFIG.name} is organized by {CAMP_CONFIG.church}, bringing
          teenagers together for a week of fun, friendship, worship, and
          spiritual growth.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          This year's theme is <strong>"{CAMP_CONFIG.theme}"</strong> —
          camp date: <strong>{CAMP_CONFIG.dateDisplay}</strong> at{' '}
          <strong>{CAMP_CONFIG.venue}</strong>.
        </p>
        <p className="text-gray-700 text-lg">
          Campers will be placed in one of six platoons — Red, Blue, Green,
          Yellow, Purple, or Orange — for team activities and friendly
          competition throughout the week.
        </p>
      </section>
      <Footer />
    </main>
  );
}
