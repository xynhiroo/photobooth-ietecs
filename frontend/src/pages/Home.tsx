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
  Sparkles
} from 'lucide-react';
import { TEMPLATES } from '../components/TemplateRenderer';

const Home = () => {
  const [activePreviewId, setActivePreviewId] = useState<number>(1);
  const selectedTemplate = TEMPLATES[activePreviewId] || TEMPLATES[1];

  return (
    <div className="flex flex-col gap-20 pb-16 select-none">
      
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-8 flex flex-col items-center text-center">
        
        {/* Event Meta Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>HMTI Fair 2026 • Pollux Mall Batam Center</span>
        </div>
        
        {/* Main Headline - Solid High Contrast Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-serif max-w-4xl leading-[1.12]">
          Abadikan Momen Terbaikmu di HMTI Fair
        </h1>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 mt-6 max-w-2xl leading-relaxed px-4">
          Photobooth interaktif bertema <strong className="text-amber-300 font-semibold">Kaca Jendela Patri & Kristal Elemen</strong>. 
          Ambil pose berurutan, cetak langsung lembar fisik 4R 300 DPI di stan booth, dan simpan versi digital ke HP lewat QR Code.
        </p>
        
        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto px-4 z-20">
          <Link 
            to="/booth" 
            className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-4 rounded-full font-bold text-base shadow-lg shadow-amber-400/10 cursor-pointer"
          >
            <Camera className="w-5 h-5 text-slate-950" />
            <span>Buka Studio Photobooth</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>
          <Link 
            to="/templates" 
            className="btn-tactile w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white px-7 py-4 rounded-full font-semibold text-sm border border-white/10"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Lihat 4 Pilihan Frame</span>
          </Link>
        </div>

        {/* HERO SHOWCASE CARD (LCP Image optimized per Modern Web Guidance) */}
        <div className="mt-14 w-full max-w-4xl px-2">
          <div className="surface-card p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 text-left">
            
            {/* LCP Visual - Gobi The Mascot with high priority */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-center p-3">
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
                Tersedia 4 pilihan template frame eksklusif: The Grand Patriarch, Crystal Arcana, Twin Strips (2x6 inci), dan Royal Quad 4-Cut. Semua frame dirancang dengan rasio cetak 4R presisi 300 DPI dengan margin aman printer tanpa terpotong.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-4 h-4 text-amber-400" /> 28-29 November 2026
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400" /> Pollux Mall Batam Center
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE FRAME EXPLORER */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif">
            Eksplorasi Pilihan Frame Acara
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
            Klik varian di bawah untuk melihat detail format cetak dan jumlah pose yang dibutuhkan.
          </p>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.values(TEMPLATES).map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setActivePreviewId(tmpl.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activePreviewId === tmpl.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>

        {/* Selected Frame Detail Display */}
        <div className="surface-card p-6 sm:p-8 rounded-3xl border border-white/10 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          <div className="w-full sm:w-1/2 space-y-4">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              {selectedTemplate.category}
            </span>
            <h3 className="text-2xl font-bold text-white font-serif">
              {selectedTemplate.name}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedTemplate.description}
            </p>
            
            <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-white/10">
              <div className="flex justify-between py-1">
                <span>Format Kertas Fisik:</span>
                <span className="text-white font-semibold">{selectedTemplate.printFormat} (4R / 300 DPI)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Jumlah Pose Diambil:</span>
                <span className="text-amber-300 font-bold">{selectedTemplate.photosRequired} Pose Kamera</span>
              </div>
            </div>

            <Link
              to={`/booth?template=${selectedTemplate.id}`}
              className="btn-tactile inline-flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-950 px-6 py-2.5 rounded-xl font-bold text-xs mt-2"
            >
              <Camera className="w-4 h-4" />
              <span>Gunakan Frame Ini</span>
            </Link>
          </div>

          <div className="w-full sm:w-1/2 flex justify-center">
            <div className="w-48 h-72 rounded-2xl bg-[#090b14] border border-amber-400/30 p-3 flex flex-col justify-between shadow-xl text-center">
              <div className="text-[9px] font-bold text-amber-200 uppercase tracking-wider">
                HMTI FAIR 2026
              </div>
              <div className="flex flex-col gap-2 my-auto">
                {Array.from({ length: selectedTemplate.photosRequired }).map((_, i) => (
                  <div key={i} className="w-full h-14 bg-slate-900 rounded-md border border-white/10 flex items-center justify-center text-[9px] text-slate-500 font-medium">
                    Pose {i + 1}
                  </div>
                ))}
              </div>
              <div className="text-[8px] text-slate-400 font-medium">
                POLLUX MALL BATAM
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
          <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
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
      <footer className="text-center text-xs text-slate-500 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 max-w-5xl mx-auto px-4 w-full">
        <p>© 2026 HMTI Fair • Jurusan Teknik Informatika Politeknik Negeri Batam</p>
        <p className="text-slate-400">Stan Acara: Pollux Mall Batam Center</p>
      </footer>

    </div>
  );
};

export default Home;
