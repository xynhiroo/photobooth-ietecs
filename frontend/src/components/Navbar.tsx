import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Pilihan Frame', path: '/templates' },
    { name: 'Galeri Foto', path: '/gallery' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-[#07090e]/90 backdrop-blur-md border-b border-white/[0.08] shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-18 flex items-center justify-between max-w-6xl">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center transition-colors group-hover:border-amber-400/40">
            <img 
              src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" 
              alt="HMTI Logo" 
              className="w-6 h-6 object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-serif">
                HMTI FAIR 2026
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-semibold border border-amber-400/30">
                Pollux Mall
              </span>
            </div>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Official Photobooth Studio
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-xs font-semibold tracking-wide transition-colors hover:text-amber-300 ${
                location.pathname === link.path 
                  ? 'text-amber-300 border-b-2 border-amber-400 pb-1' 
                  : 'text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <Link 
            to="/booth" 
            className="btn-tactile inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer"
          >
            <Camera className="w-4 h-4 text-slate-950" />
            <span>Mulai Foto</span>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          type="button"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-[#0a0d16] border-b border-white/10 px-6 py-5 shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-2 font-medium ${
                    location.pathname === link.path ? 'text-amber-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/booth" 
                onClick={() => setMobileMenuOpen(false)}
                className="btn-tactile mt-2 flex items-center justify-center gap-2 bg-amber-400 text-slate-950 py-3 rounded-xl text-xs font-bold"
              >
                <Camera className="w-4 h-4" />
                Mulai Berfoto
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
