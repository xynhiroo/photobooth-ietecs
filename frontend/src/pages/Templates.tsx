import { motion } from 'framer-motion';
import { Camera, Printer, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TEMPLATES, TemplateRenderer, SAMPLE_PREVIEW_IMAGES } from '../components/TemplateRenderer';

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
        <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
          Semua template frame telah dikalibrasi presisi pada rasio kertas foto 4R (1200 × 1800 px di 300 DPI) dengan ornamen kaca patri resmi dan margin aman printer tanpa terpotong.
        </p>
      </div>

      {/* Grid of Real Visual Frame Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(TEMPLATES).map((template) => (
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.15 }}
            key={template.id} 
            className="surface-card p-4 rounded-3xl border border-white/10 flex flex-col justify-between group overflow-hidden"
          >
            {/* Top Badges */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                {template.badge}
              </span>
              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Printer className="w-3 h-3 text-slate-400" /> {template.printFormat}
              </span>
            </div>

            {/* REAL VISUAL PREVIEW OF THE FRAME (Scaled down 600x900 canvas) */}
            <div className="relative w-full h-[360px] rounded-2xl bg-[#04030a] border border-white/10 flex items-center justify-center overflow-hidden my-2 shadow-inner">
              <div className="transform scale-[0.38] origin-center shrink-0 pointer-events-none select-none">
                <TemplateRenderer
                  templateId={template.id}
                  images={SAMPLE_PREVIEW_IMAGES}
                />
              </div>

              {/* Hover Overlay Button */}
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-3">
                <div className="text-center">
                  <div className="text-xs font-bold text-amber-300 font-serif">{template.name}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{template.photosRequired} Pose Kamera</div>
                </div>
                <Link 
                  to={`/booth?template=${template.id}`}
                  className="btn-tactile inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-full text-xs shadow-lg"
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
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{template.photosRequired} Pose</span>
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
