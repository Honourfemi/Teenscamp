export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="text-xl md:text-2xl font-extrabold text-camp-purple">
          🏕️ Teens Camp 4th Edition
        </a>
        <div className="hidden md:flex gap-8 font-semibold text-gray-700">
          <a href="/" className="hover:text-camp-orange">Home</a>
          <a href="/about" className="hover:text-camp-orange">About</a>
          <a href="/faq" className="hover:text-camp-orange">FAQ</a>
          <a href="/contact" className="hover:text-camp-orange">Contact</a>
        </div>
        <a
          href="/register"
          className="bg-camp-orange text-white px-5 py-2 rounded-full font-bold hover:bg-orange-600 transition"
        >
          Register Now
        </a>
      </div>
    </nav>
  );
}
