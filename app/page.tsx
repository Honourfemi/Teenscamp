import Navbar from '@/components/Navbar';
import CountdownTimer from '@/components/CountdownTimer';
import Footer from '@/components/Footer';
import { CAMP_CONFIG } from '@/lib/campConfig';

export default function Home() {
  return (
    <main>
      <Navbar />

      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 bg-gradient-to-br from-camp-orange via-camp-yellow to-camp-purple text-white"
      >
        <p className="uppercase tracking-widest font-bold mb-2 opacity-90">
          {CAMP_CONFIG.church}
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          {CAMP_CONFIG.name}
        </h1>
        <p className="text-2xl font-bold mb-2">Theme: "{CAMP_CONFIG.theme}"</p>
        <p className="text-xl max-w-xl mb-8">
          Join hundreds of teenagers for a week of fun, friendship, worship,
          and unforgettable memories.
        </p>
        <a
          href="/register"
          className="bg-white text-camp-orange font-bold px-8 py-3 rounded-full text-lg mb-10 hover:scale-105 transition"
        >
          Register Now
        </a>
        <CountdownTimer />
      </section>

      <section id="about" className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-camp-purple mb-4">About the Camp</h2>
        <p className="text-gray-600 text-lg">
          {CAMP_CONFIG.name} is organized by {CAMP_CONFIG.church}. This
          year's theme, "{CAMP_CONFIG.theme}," will guide a week of games,
          workshops, worship, and adventure for teenagers.
        </p>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-extrabold text-camp-purple mb-10 text-center">
          What Campers Say
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { name: 'Chidinma, 15', quote: 'Camp changed my life. I made friends I still talk to every day!' },
            { name: 'David, 16', quote: 'The best week of my year, every single year.' },
            { name: 'Grace, 14', quote: 'I grew so much closer to God during camp week.' },
          ].map((t) => (
            <div key={t.name} className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-gray-600 italic mb-3">"{t.quote}"</p>
              <p className="font-bold text-camp-purple">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq-preview" className="py-16 px-6 text-center">
        <h2 className="text-3xl font-extrabold text-camp-purple mb-4">Got Questions?</h2>
        <p className="text-gray-600 mb-6">Check our Frequently Asked Questions page.</p>
        <a href="/faq" className="text-camp-orange font-bold underline">
          Go to FAQ →
        </a>
      </section>

      <Footer />
    </main>
  );
}
