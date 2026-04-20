import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Aperture, LogOut, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Templates', path: '/templates' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/70 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between max-w-6xl">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center shadow-lg shadow-brand-500/30"
          >
            <Aperture className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:to-brand-400 transition-colors">
            ietecs
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-sm font-medium transition-colors hover:text-white ${
                location.pathname === link.path ? 'text-white' : 'text-slate-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            {user ? (
              <>
                <Link 
                  to="/booth" 
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Enter Booth
                </Link>
                <Link 
                  to="/gallery" 
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
                <div className="relative group cursor-pointer ml-2">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                    <User className="w-4 h-4 text-brand-400" />
                    <span className="text-sm font-medium text-white">{user.name.split(' ')[0]}</span>
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="glass-card p-2 flex flex-col gap-1">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-full shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
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
            className="md:hidden absolute top-full left-0 right-0 glass border-b border-white/10"
          >
            <div className="flex flex-col px-4 py-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-lg font-medium text-slate-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-white/10 my-2" />
              
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <Link 
                    to="/booth" 
                    className="block text-lg font-medium text-slate-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Enter Booth
                  </Link>
                  <Link 
                    to="/gallery" 
                    className="block text-lg font-medium text-slate-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Gallery
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-lg font-medium text-red-400 hover:text-red-300 mt-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Link 
                    to="/login" 
                    className="w-full text-center py-3 rounded-xl border border-white/10 font-medium text-white hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/register" 
                    className="w-full text-center py-3 rounded-xl bg-brand-600 font-medium text-white shadow-lg shadow-brand-500/25"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
