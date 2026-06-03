import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-plum/10 bg-white/80 py-10 text-plum">
    <div className="mx-auto max-w-7xl px-5">
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-2xl">Vision Girls Hostel</h3>
          <p className="mt-3 text-sm text-plum/80">Luxury girls hostel living with safety, comfort and community.</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <div className="mt-3 space-y-2 text-sm text-plum/80">
            <Link to="/about" className="block hover:text-plum">About</Link>
            <Link to="/rooms" className="block hover:text-plum">Rooms</Link>
            <Link to="/gallery" className="block hover:text-plum">Gallery</Link>
            <Link to="/contact" className="block hover:text-plum">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Follow Us</h4>
          <div className="mt-3 flex items-center gap-3 text-plum/80">
            <a href="#"><Facebook /></a>
            <a href="#"><Instagram /></a>
            <a href="#"><Twitter /></a>
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-sm text-plum/60">© 2026 Vision Girls Hostel. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
