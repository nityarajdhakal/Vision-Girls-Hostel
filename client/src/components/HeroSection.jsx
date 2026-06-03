import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => (
  <section className="relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80)' }}>
    <div className="absolute inset-0 bg-gradient-to-br from-plum/80 via-plum/40 to-transparent"></div>
    <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-20">
      <div className="max-w-2xl text-white">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
          🏅 Trusted by 200+ Residents
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-serif text-5xl sm:text-6xl">
          Your Home Away From Home
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-6 max-w-xl text-lg leading-8 text-cream/90">
          Experience comfort, safety, and community at Vision Girls Hostel.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 flex flex-wrap gap-4">
          <Link to="/rooms" className="rounded-full bg-rosegold px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-500">
            Explore Rooms
          </Link>
          <a href="#contact" className="rounded-full border border-white/50 px-6 py-3 text-sm text-white transition hover:bg-white/10">
            Book a Visit
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
