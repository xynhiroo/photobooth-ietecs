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
      setIsScrolled(window.scrollY > 20);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/85 backdrop-blur-xl border-b border-amber-400/30 shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between max-w-6xl">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-800 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-purple-500/30 border border-amber-300/40 flex items-center justify-center">
            <img 
              src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" 
              alt="HMTI Logo" 
              className="w-7 h-7 object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400 font-serif">
                HMTI FAIR
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 font-bold">2026</span>
            </div>
            <span className="block text-[8px] font-bold text-amber-300/90 tracking-widest uppercase">
              Official Photobooth Kiosk
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-sm font-semibold transition-colors hover:text-amber-300 ${
                location.pathname === link.path ? 'text-amber-300 border-b-2 border-amber-400 pb-1' : 'text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <Link 
            to="/booth" 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-500 hover:from-purple-600 hover:to-amber-400 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-lg shadow-purple-500/25 transition-all hover:scale-105 border border-amber-300/40 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>Mulai Foto</span>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-2xl border-b border-amber-400/30"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-bold ${
                    location.pathname === link.path ? 'text-amber-300' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/booth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-amber-500 text-white py-3 rounded-xl text-sm font-black shadow-lg border border-amber-300/40"
              >
                <Camera className="w-4 h-4 text-amber-300" />
                Masuk ke Studio Photobooth
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
