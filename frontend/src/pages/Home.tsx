import { Link } from 'react-router-dom';
import { Camera, Printer, QrCode, Sparkles, Volume2, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  return (
    <div className="flex flex-col gap-24 pb-20 select-none">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center pt-10">
        {/* Glow & Backdrop */}
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(#4c1d95_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -top-10 -z-10 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
        />
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl px-4 flex flex-col items-center"
        >
          {/* Event Badge */}
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black mb-6 shadow-lg shadow-amber-500/10 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Official Photobooth • HMTI Fair 2026</span>
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 variants={fadeIn} className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight mb-6 relative z-10 font-serif">
            Rise Beyond Infinity <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]">
              Abadikan Momen Acaramu!
            </span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Selamat datang di booth HMTI Fair 2026 di Pollux Mall Batam Center! Nikmati pengalaman photobooth interaktif bertema Kaca Jendela Patri & Kristal Elemen dengan cetak fisik instan serta unduhan digital via QR Code.
          </motion.p>
          
          {/* Primary Action Button */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/booth" 
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-500 hover:from-purple-600 hover:to-amber-400 text-white px-9 py-4 rounded-full font-black text-lg shadow-[0_0_50px_rgba(251,191,36,0.4)] hover:shadow-[0_0_70px_rgba(251,191,36,0.6)] transition-all hover:scale-105 border border-amber-300/40 cursor-pointer"
            >
              <Camera className="w-6 h-6 text-amber-300" />
              <span>Mulai Berfoto Sekarang</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Mascot & Stained Glass Showcase */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-14 relative w-full max-w-4xl px-4 flex flex-col md:flex-row items-center justify-center gap-8"
        >
          {/* Mascot Gobi Card */}
          <div className="glass-card bg-slate-950/80 border border-amber-400/40 p-6 rounded-3xl flex items-center gap-5 shadow-2xl max-w-md">
            <div className="w-24 h-24 rounded-2xl bg-purple-950/60 border border-amber-400/40 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
              <img 
                src="/hmti_assets/7. RANDOM STONE/gobi pose 2.png" 
                alt="Mascot Gobi" 
                className="w-24 h-24 object-contain transform scale-110" 
              />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">Maskot Resmi</span>
              <h3 className="text-lg font-black text-white font-serif">Gobi The Guardian</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Penyihir pelindung kristal elemen siap menemani fotomu di setiap frame HMTI Fair 2026.
              </p>
            </div>
          </div>

          {/* Quick Stats / Info */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="glass-card bg-slate-950/70 border border-white/10 p-4 rounded-2xl text-left">
              <Printer className="w-6 h-6 text-amber-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Cetak Fisik 4R</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">300 DPI tajam langsung ke printer booth.</p>
            </div>
            <div className="glass-card bg-slate-950/70 border border-white/10 p-4 rounded-2xl text-left">
              <QrCode className="w-6 h-6 text-purple-400 mb-2" />
              <h4 className="text-sm font-bold text-white">QR Code Cepat</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Scan kamera HP untuk simpan ke galeri.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase text-amber-400 tracking-widest">Keunggulan Booth</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-serif mt-2">
            Dirancang Khusus untuk Kelancaran Antrean
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card bg-slate-950/80 border border-amber-400/20 p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6 text-amber-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-serif">Hitung Mundur & Audio Shutter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dilengkapi suara hitung mundur, petunjuk pose anti-canggung, dan bunyi klik shutter mekanik asli photobooth.
            </p>
          </div>

          <div className="glass-card bg-slate-950/80 border border-purple-400/20 p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-serif">Kiosk & Offline Resilient</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jika Wi-Fi venue mall melambat, foto tetap tersimpan aman di folder lokal laptop dan proses cetak fisik tetap berjalan lancar.
            </p>
          </div>

          <div className="glass-card bg-slate-950/80 border border-pink-400/20 p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-pink-400/10 border border-pink-400/30 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-pink-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-serif">Pilihan Cetak 1 atau 2 Lembar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pengunjung yang berpasangan atau berkelompok bisa memilih 2 lembar cetak otomatis tanpa perlu operator mengatur ulang.
            </p>
          </div>
        </div>
      </section>

      {/* Footer info */}
      <footer className="text-center text-xs text-slate-500 pt-10 border-t border-white/5">
        <p>© 2026 HMTI Fair • Polibatam • Powered by Photobooth Engine</p>
      </footer>
    </div>
  );
};

export default Home;
