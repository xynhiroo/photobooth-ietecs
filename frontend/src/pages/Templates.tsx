import { motion } from 'framer-motion';
import { Camera, Printer, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TEMPLATES } from '../components/TemplateRenderer';

const Templates = () => {
  return (
    <div className="max-w-6xl mx-auto pb-16 select-none">
      
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-semibold text-amber-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Koleksi Frame Resmi HMTI Fair 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif tracking-tight">
          Pilihan Frame Cetak 4R
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
          Semua template frame telah dikalibrasi presisi pada rasio 4R (1200 × 1800 px di 300 DPI) dengan margin aman printer tanpa khawatir terpotong saat dicetak borderless.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(TEMPLATES).map((template) => (
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ duration: 0.15 }}
            key={template.id} 
            className="surface-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between h-[450px] group"
          >
            {/* Top Badges */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                {template.category}
              </span>
              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Printer className="w-3 h-3 text-slate-400" /> {template.printFormat}
              </span>
            </div>

            {/* Visual Sketch Preview */}
            <div className="relative flex-1 rounded-xl bg-[#090b14] border border-white/10 flex flex-col items-center justify-between p-4 text-center my-2 overflow-hidden">
              <div className="text-[9px] font-bold text-amber-200 tracking-wider">
                HMTI FAIR 2026
              </div>

              {/* Photo Slots Simulation */}
              <div className={`w-full my-auto ${template.id === 4 ? 'grid grid-cols-2 gap-1.5' : 'flex flex-col gap-1.5'}`}>
                {Array.from({ length: template.photosRequired }).map((_, idx) => (
                  <div key={idx} className="w-full h-11 bg-slate-900 rounded border border-white/10 flex items-center justify-center text-[9px] text-slate-500 font-medium">
                    Pose {idx + 1}
                  </div>
                ))}
              </div>

              <div className="text-[8px] text-slate-400">
                POLLUX MALL BATAM
              </div>

              {/* Hover Overlay Button */}
              <div className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <Link 
                  to={`/booth?template=${template.id}`}
                  className="btn-tactile inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-full text-xs shadow-md"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Gunakan Frame</span>
                </Link>
              </div>
            </div>

            {/* Card Content & Action */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-white font-serif">{template.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {template.description}
              </p>
              
              <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  Kebutuhan: <strong className="text-white">{template.photosRequired} Pose</strong>
                </span>
                <Link
                  to={`/booth?template=${template.id}`}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  Pilih Frame →
                </Link>
              </div>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default Templates;
