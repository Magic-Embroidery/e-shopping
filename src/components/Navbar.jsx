import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Scissors } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Designs', path: '/designs' },
    { name: 'Customised Design', path: '/custom-design' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-brand-white/90 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-primary p-2 rounded-full text-brand-white group-hover:rotate-12 transition-transform duration-300">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-brand-secondary leading-none">
                Magic Embroidery
              </span>
              <span className="text-[10px] sm:text-xs font-medium tracking-widest text-brand-primary uppercase mt-0.5">
                It's Digital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-body text-sm font-semibold tracking-wide transition-colors relative py-1 hover:text-brand-primary ${
                    isActive ? 'text-brand-primary' : 'text-brand-textDark'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.span 
                        layoutId="activeUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <Link 
              to="/designs" 
              className="bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/30"
            >
              Designs
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-brand-textDark hover:bg-brand-accent/20 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-textDark md:hidden z-45"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-brand-cardBg shadow-2xl p-6 flex flex-col gap-8 md:hidden z-50"
            >
              <div className="flex items-center justify-between border-b border-brand-accent/20 pb-4">
                <span className="font-heading text-lg font-bold text-brand-secondary">Menu</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-brand-textDark hover:bg-brand-accent/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `font-body text-lg font-bold transition-colors ${
                        isActive ? 'text-brand-primary' : 'text-brand-textDark'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                <Link 
                  to="/designs" 
                  onClick={() => setIsOpen(false)}
                  className="bg-brand-primary text-brand-white text-center font-body font-bold py-3 rounded-full shadow-lg shadow-brand-primary/20 mt-4"
                >
                  Designs
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
