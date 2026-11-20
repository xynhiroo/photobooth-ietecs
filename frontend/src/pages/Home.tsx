import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Printer, 
  QrCode, 
  ArrowRight, 
  Layers, 
  SlidersHorizontal,
  Volume2,
  Calendar,
  MapPin,
  Sparkles,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { TEMPLATES, TemplateRenderer, SAMPLE_PREVIEW_IMAGES } from '../components/TemplateRenderer';

const floatingAnimation = {
  y: [-8, 8, -8],
  transition: {
    duration: 4.5,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

const floatingReverse = {
  y: [8, -8, 8],
  transition: {
    duration: 5.5,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};

const Home = () => {
  const [activePreviewId, setActivePreviewId] = useState<number>(1);
  const selectedTemplate = TEMPLATES[activePreviewId] || TEMPLATES[1];

  return (
    <div className="flex flex-col gap-24 pb-16 select-none overflow-hidden">
      
      {/* HERO SECTION WITH COLORFUL STAINED GLASS WINDOW & ELEMENTAL CRYSTALS */}
      <section className="relative pt-6 sm:pt-12 pb-12 flex flex-col items-center text-center">
        
        {/* Floating Elemental Crystal Gemstones */}
        <motion.div 
          animate={floatingAnimation}
          className="absolute top-2 left-4 sm:left-8 w-16 sm:w-20 opacity-90 pointer-events-none drop-shadow-[0_0_20px_rgba(168,85,247,0.7)] hidden sm:block z-10"
        >
          <img src="/hmti_assets/1. INFINITY STONE/Gemstone-03.png" alt="Crystal Amethyst" />
        </motion.div>

        <motion.div 
          animate={floatingReverse}
          className="absolute top-16 right-4 sm:right-12 w-14 sm:w-18 opacity-90 pointer-events-none drop-shadow-[0_0_20px_rgba(16,185,129,0.7)] hidden sm:block z-10"
        >
          <img src="/hmti_assets/1. INFINITY STONE/gemstone green-03.png" alt="Crystal Emerald" />
        </motion.div>

        {/* STAINED GLASS PATRI WINDOW BACKDROP (Vibrant Color & Illumination) */}
        <div 
          className="absolute inset-0 -z-20 bg-center bg-no-repeat bg-contain opacity-35 pointer-events-none"
          style={{ 
            backgroundImage: `url('/hmti_assets/4.  PATRI WINDOWS/Test4 (NO-BG).png')`,
            backgroundPosition: 'center 15%'
          }}
        />
        {/* Radial Purple & Gold Ambience Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[650px] h-[550px] bg-purple-600/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-48 left-1/2 -translate-x-1/2 -z-10 w-[550px] h-[450px] bg-amber-500/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-24 left-1/4 -z-10 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Event Meta Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/85 border border-amber-400/40 text-slate-200 text-xs font-semibold mb-6 shadow-md backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>HMTI Fair 2026 • Pollux Mall Batam Center</span>
        </div>
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-serif max-w-4xl leading-[1.12] drop-shadow-md">
          Abadikan Momen Terbaikmu di HMTI Fair
        </h1>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-200 mt-6 max-w-2xl leading-relaxed px-4 drop-shadow">
          Photobooth interaktif bertema <strong className="text-amber-300 font-semibold">Kaca Jendela Patri & Kristal Elemen</strong>. 
          Ambil pose berurutan, cetak langsung lembar fisik 4R 300 DPI di stan booth, dan simpan versi digital ke HP lewat QR Code.
        </p>
        
        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto px-4 z-20">
          <Link 
            to="/booth" 
            className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-4 rounded-full font-bold text-base shadow-xl shadow-amber-400/20 cursor-pointer"
          >
            <Camera className="w-5 h-5 text-slate-950" />
            <span>Buka Studio Photobooth</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>
          <Link 
            to="/templates" 
            className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white px-7 py-4 rounded-full font-semibold text-sm border border-amber-400/30 backdrop-blur-md"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Lihat 4 Pilihan Frame</span>
          </Link>
        </div>

        {/* HERO SHOWCASE CARD (LCP Image optimized per Modern Web Guidance) */}
        <div className="mt-14 w-full max-w-4xl px-2">
          <div className="surface-card bg-slate-950/85 p-6 sm:p-8 rounded-3xl border border-amber-400/30 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 text-left shadow-2xl backdrop-blur-md">
            
            {/* LCP Visual - Gobi The Mascot with high priority */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center p-3 shadow-lg">
              <img 
                src="/hmti_assets/7. RANDOM STONE/gobi pose 2.png" 
                alt="Maskot HMTI Gobi The Guardian"
                fetchPriority="high"
                width={176}
                height={176}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Event Description */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Maskot Resmi Acara
              </div>
              <h2 className="text-2xl font-bold text-white font-serif">
                Gobi The Guardian Siap Memandu Foto Kamu!
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tersedia 4 pilihan template frame eksklusif dengan ornamen kaca patri dan kristal elemen. Seluruh frame dirancang dengan rasio cetak 4R presisi 300 DPI dengan margin aman printer tanpa terpotong.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-amber-400" /> 28-29 November 2026
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-amber-400" /> Pollux Mall Batam Center
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE FRAME EXPLORER WITH REAL VISUAL PREVIEW */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30">
            Preview Frame Asli
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif mt-3">
            Eksplorasi Pilihan Frame Acara
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto">
            Klik pilihan frame di bawah untuk melihat preview bentuk frame lengkap dengan ornamen dan format cetaknya.
          </p>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8">
          {Object.values(TEMPLATES).map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setActivePreviewId(tmpl.id)}
              className={`btn-tactile px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePreviewId === tmpl.id
                  ? 'bg-amber-400 text-slate-950 shadow-md border border-amber-300'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Frame Detail Display with REAL CANVAS PREVIEW */}
        <div className="surface-card bg-slate-950/90 p-6 sm:p-8 rounded-3xl border border-amber-400/30 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          
          {/* Left: Info & Details */}
          <div className="w-full md:w-1/2 space-y-4 text-left">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30">
              {selectedTemplate.badge}
            </span>
            <h3 className="text-2xl font-bold text-white font-serif">
              {selectedTemplate.name}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedTemplate.description}
            </p>
            
            <div className="pt-2 space-y-2.5 text-xs text-slate-300 border-t border-white/10">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Format Kertas Fisik:</span>
                <span className="text-white font-semibold">{selectedTemplate.printFormat} (4R / 300 DPI)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Kebutuhan Pose Kamera:</span>
                <span className="text-amber-300 font-bold">{selectedTemplate.photosRequired} Pose Otomatis</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Margin Aman Potong:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 48px Safe Bleed Area
                </span>
              </div>
            </div>

            <Link
              to={`/booth?template=${selectedTemplate.id}`}
              className="btn-tactile inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-full font-bold text-xs shadow-md mt-2"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              <span>Gunakan Frame Ini di Booth</span>
            </Link>
          </div>

          {/* Right: REAL VISUAL FRAME PREVIEW */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-[240px] h-[360px] rounded-2xl bg-[#030208] border-2 border-amber-400/40 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="transform scale-[0.38] origin-center shrink-0 pointer-events-none select-none">
                <TemplateRenderer
                  templateId={selectedTemplate.id}
                  images={SAMPLE_PREVIEW_IMAGES}
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif">
            Kesiapan Booth & Teknologi Handal
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto">
            Didesain khusus untuk kelancaran antrean acara kampus dan mall tanpa hambatan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="surface-card surface-card-hover p-6 rounded-2xl border border-white/10">
            <Printer className="w-6 h-6 text-amber-400 mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Cetak Fisik 4R 300 DPI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hasil komposit langsung terkunci pada dimensi 1200 × 1800 px dengan margin aman borderless printing printer.
            </p>
          </div>

          <div className="surface-card surface-card-hover p-6 rounded-2xl border border-white/10">
            <QrCode className="w-6 h-6 text-purple-400 mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Scan QR Langsung ke HP</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pengunjung tinggal scan QR Code di layar stan booth untuk mengunduh soft-copy resolusi penuh dalam hitungan detik.
            </p>
          </div>

          <div className="surface-card surface-card-hover p-6 rounded-2xl border border-white/10">
            <SlidersHorizontal className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Studio Kreatif & Stiker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pilihan preset filter pencahayaan dan cap stiker maskot Gobi serta batu kristal elemen langsung di atas foto.
            </p>
          </div>

          <div className="surface-card surface-card-hover p-6 rounded-2xl border border-white/10">
            <Volume2 className="w-6 h-6 text-pink-400 mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Audio Shutter & Kiosk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Efek suara klik mekanik kamera asli dengan Web Audio API, hitung mundur layar, dan auto-reset antrean berikutnya.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-xs text-slate-400 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 max-w-5xl mx-auto px-4 w-full">
        <p>© 2026 HMTI Fair • Jurusan Teknik Informatika Politeknik Negeri Batam</p>
        <p className="text-slate-300">Stan Acara: Pollux Mall Batam Center</p>
      </footer>

    </div>
  );
};

export default Home;
