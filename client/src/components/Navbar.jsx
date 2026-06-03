import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Rooms', to: '/rooms' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-plum/10 bg-cream/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="text-2xl font-serif text-plum">Vision Hostel</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition ${isActive ? 'text-plum' : 'text-plum/70 hover:text-plum'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <button onClick={logout} className="rounded-full bg-plum px-4 py-2 text-cream transition hover:bg-rose-600">
              Logout
            </button>
          ) : (
            <Link to="/login" className="rounded-full border border-plum px-4 py-2 text-plum transition hover:bg-plum hover:text-cream">
              Login
            </Link>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t border-plum/10 bg-cream px-5 pb-5 md:hidden">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="block py-2 text-plum/80">
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <button onClick={logout} className="w-full rounded-full bg-plum px-4 py-2 text-cream">
              Logout
            </button>
          ) : (
            <Link to="/login" className="block rounded-full border border-plum px-4 py-2 text-center text-plum">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
