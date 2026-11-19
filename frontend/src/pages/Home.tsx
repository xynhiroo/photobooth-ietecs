import { Link } from 'react-router-dom';
import { 
  Camera, 
  Printer, 
  QrCode, 
  Sparkles, 
  Volume2, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Clock,
  Compass,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const floatingAnimation = {
  y: [-8, 8, -8],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

const floatingReverse = {
  y: [8, -8, 8],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

const Home = () => {
  return (
    <div className="flex flex-col gap-24 pb-20 select-none overflow-hidden">
      
      {/* HERO SECTION WITH DYNAMIC PARTICLES & STORYTELLING */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center pt-8">
        
        {/* Floating Decorative Elemental Crystals */}
        <motion.div 
          animate={floatingAnimation}
          className="absolute -top-6 left-4 sm:left-12 w-16 sm:w-20 opacity-80 pointer-events-none drop-shadow-[0_0_25px_rgba(168,85,247,0.7)] hidden sm:block"
        >
          <img src="/hmti_assets/1. INFINITY STONE/Gemstone-03.png" alt="Crystal Amethyst" />
        </motion.div>

        <motion.div 
          animate={floatingReverse}
          className="absolute top-24 right-4 sm:right-16 w-14 sm:w-16 opacity-80 pointer-events-none drop-shadow-[0_0_25px_rgba(59,130,246,0.7)] hidden sm:block"
        >
          <img src="/hmti_assets/1. INFINITY STONE/gemstone green-03.png" alt="Crystal Emerald" />
        </motion.div>

        {/* Stained Glass Rosette Radial Light Background */}
        <div 
          className="absolute inset-0 -z-20 bg-center bg-no-repeat bg-contain opacity-15 pointer-events-none"
          style={{ backgroundImage: `url('/hmti_assets/4.  PATRI WINDOWS/Test4 (NO-BG).png')` }}
        />
        <div className="absolute -top-16 -z-10 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -z-10 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Event Header Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/85 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-black mb-6 shadow-[0_0_25px_rgba(251,191,36,0.25)] tracking-wider uppercase backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>HMTI Fair 2026 • Pollux Mall Batam Center</span>
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.15] mb-6 font-serif max-w-4xl"
        >
          Rise Beyond Infinity <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400 drop-shadow-[0_2px_20px_rgba(251,191,36,0.6)]">
            Kreasikan Foto Kerenmu!
          </span>
        </motion.h1>
        
        {/* Subtitle Explaining the Experience */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed px-4"
        >
          Photobooth interaktif bertema <strong className="text-amber-300">Kaca Jendela Patri & Kristal Elemen</strong>. 
          Ambil 3 pose seru, cetak lembar fisik 300 DPI di meja booth, dan bawa pulang soft-file resolusi penuh via QR Code.
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 z-20"
        >
          <Link 
            to="/booth" 
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-500 hover:scale-105 text-white px-9 py-4 rounded-full font-black text-lg shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:shadow-[0_0_60px_rgba(251,191,36,0.6)] transition-all border border-amber-300/50 cursor-pointer"
          >
            <Camera className="w-6 h-6 text-amber-300" />
            <span>Mulai Berfoto Sekarang</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
          <Link 
            to="/templates" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-amber-200 px-7 py-4 rounded-full font-bold text-base border border-amber-400/30 backdrop-blur-md transition-all hover:border-amber-400"
          >
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Lihat Pilihan Frame</span>
          </Link>
        </motion.div>

        {/* HERO INTERACTIVE SHOWCASE: GOBI MASCOT & LIVE PHOTOSTRIP CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-16 w-full max-w-4xl px-4 flex flex-col md:flex-row items-center justify-center gap-8 relative"
        >
          {/* Mascot Greeting Box */}
          <div className="glass-card bg-slate-950/85 border-2 border-amber-400/40 p-6 rounded-3xl flex items-center gap-5 shadow-[0_0_50px_rgba(46,16,101,0.5)] max-w-md text-left relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <motion.div 
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" as const }}
              className="w-24 h-24 rounded-2xl bg-purple-950/80 border-2 border-amber-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow-lg"
            >
              <img 
                src="/hmti_assets/7. RANDOM STONE/gobi pose 2.png" 
                alt="Maskot Gobi" 
                className="w-24 h-24 object-contain transform scale-110" 
              />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-300" /> Maskot HMTI Fair
              </div>
              <h3 className="text-xl font-black text-white font-serif">Gobi The Guardian</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                "Pilih gayamu, hitung mundur 3 detik, dan abadikan kenangan terbaikmu di Pollux Mall!"
              </p>
            </div>
          </div>

          {/* Quick Highlights Pill Badges */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-400/30 text-left backdrop-blur-md">
              <Printer className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-xs font-bold text-white">Cetak Fisik 4R</div>
              <div className="text-[10px] text-slate-400">300 DPI tajam langsung keluar di booth.</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-purple-400/30 text-left backdrop-blur-md">
              <QrCode className="w-5 h-5 text-purple-400 mb-2" />
              <div className="text-xs font-bold text-white">Scan QR Instan</div>
              <div className="text-[10px] text-slate-400">Unduh soft-copy langsung ke galeri HP.</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-400/30 text-left backdrop-blur-md">
              <Volume2 className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-xs font-bold text-white">Audio Shutter</div>
              <div className="text-[10px] text-slate-400">Efek klik suara kamera asli photobooth.</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-pink-400/30 text-left backdrop-blur-md">
              <Clock className="w-5 h-5 text-pink-400 mb-2" />
              <div className="text-xs font-bold text-white">Multi-Shot Auto</div>
              <div className="text-[10px] text-slate-400">3 pose otomatis dengan jeda ganti gaya.</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STORYTELLING / VISUAL 3-STEP JOURNEY */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase text-amber-400 tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            Alur Pengalaman Booth
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-serif mt-3">
            Cara Mudah Berfoto di HMTI Fair
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
            Hanya 3 langkah cepat tanpa ribet registrasi atau instalasi aplikasi.
          </p>
        </div>

        {/* 3 Step Cards with Motion & Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* STEP 1 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="glass-card bg-slate-950/90 border-2 border-amber-400/40 p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-black text-lg mb-5 shadow-lg">
                01
              </div>
              <h3 className="text-xl font-black text-white font-serif mb-2">Pilih Frame Kaca Patri</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Pilih desain favoritmu: frame megah <strong>The Grand Patriarch</strong> dengan kubah kaca patri ungu-emas, atau edisi lucu bersama maskot <strong>Gobi</strong>.
              </p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-2 text-xs text-amber-300 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Format 4R 300 DPI Presisi</span>
            </div>
          </motion.div>

          {/* STEP 2 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="glass-card bg-slate-950/90 border-2 border-purple-400/40 p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-400/20 border border-purple-400/50 flex items-center justify-center text-purple-300 font-black text-lg mb-5 shadow-lg">
                02
              </div>
              <h3 className="text-xl font-black text-white font-serif mb-2">Pose & Jepret Otomatis</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Kamera akan menghitung mundur otomatis 3 pose berurutan dengan petunjuk pose seru di layar, kilatan flash, dan suara klik shutter asli!
              </p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-2 text-xs text-purple-300 font-bold">
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>Efek Suara Shutter & Flash</span>
            </div>
          </motion.div>

          {/* STEP 3 */}
          <motion.div 
            whileHover={{ y: -6 }}
            className="glass-card bg-slate-950/90 border-2 border-pink-400/40 p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-400/20 border border-pink-400/50 flex items-center justify-center text-pink-300 font-black text-lg mb-5 shadow-lg">
                03
              </div>
              <h3 className="text-xl font-black text-white font-serif mb-2">Cetak Fisik & Scan QR</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Pilih cetak 1 atau 2 lembar untuk dibagi berdua. Lembar fisik otomatis dicetak di meja operator, sementara QR Code muncul di layar untuk di-scan ke HP!
              </p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center gap-2 text-xs text-pink-300 font-bold">
              <QrCode className="w-4 h-4 shrink-0" />
              <span>Download Langsung ke Smartphone</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CALL TO ACTION BOTTOM BANNER */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="glass-card bg-gradient-to-r from-purple-950/90 via-slate-950 to-indigo-950/90 border-2 border-amber-400/50 p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden shadow-[0_0_80px_rgba(251,191,36,0.25)]">
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-amber-400 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Stan Photobooth Resmi
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-serif mb-4">
              Siap Mengabadikan Momen Terbaikmu?
            </h2>
            <p className="text-slate-300 text-sm mb-8 leading-relaxed">
              Langsung klik tombol di bawah untuk membuka kamera dan mulai berfoto. Tanpa login, langsung jepret!
            </p>
            <Link 
              to="/booth" 
              className="flex items-center gap-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-10 py-4 rounded-full font-black text-base shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all hover:scale-105 cursor-pointer"
            >
              <Camera className="w-5 h-5 text-slate-950" />
              <span>Buka Studio Photobooth Sekarang</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-xs text-slate-500 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 max-w-5xl mx-auto px-4">
        <p>© 2026 HMTI Fair • Politeknik Negeri Batam</p>
        <p className="text-slate-400">Tema: Kaca Jendela Patri & Infinity Crystals</p>
      </footer>

    </div>
  );
};

export default Home;
