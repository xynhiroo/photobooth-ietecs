import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Sparkles, Camera, Layout, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TEMPLATES } from '../components/TemplateRenderer';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Templates = () => {
  return (
    <div className="max-w-7xl mx-auto pb-20 select-none">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-700 to-amber-500 rounded-2xl shadow-xl shadow-purple-500/20 border border-amber-300/40">
            <Layout className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold uppercase tracking-wider">
              HMTI Fair 2026 Edition
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif mt-1">
              Pilihan Frame Photobooth
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Desain eksklusif Kaca Jendela Patri, Kristal Elemen, & Maskot Gobi beresolusi cetak 300 DPI 4R.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {Object.values(TEMPLATES).map((template) => (
          <motion.div 
            variants={itemVariants}
            key={template.id} 
            className="flex flex-col group cursor-pointer"
          >
            <div className="glass-card bg-slate-950/90 border-2 border-amber-400/40 rounded-3xl p-5 shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:border-amber-400 group-hover:shadow-[0_0_35px_rgba(251,191,36,0.3)] flex flex-col justify-between h-[480px]">
              
              {/* Header Badges */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300">
                  {template.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Printer className="w-3 h-3 text-amber-400" /> {template.printFormat}
                </span>
              </div>

              {/* Preview Graphic Representation */}
              <div className="relative flex-1 rounded-2xl overflow-hidden bg-gradient-to-b from-purple-950/60 to-slate-900 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-black text-white font-serif tracking-wide">{template.name}</h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed px-2">
                  {template.description}
                </p>

                {/* Hover overlay button */}
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                  <Link 
                    to={`/booth?template=${template.id}`}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-black px-6 py-3 rounded-full text-xs shadow-xl hover:scale-105 transition-transform border border-amber-300/40"
                  >
                    <Camera className="w-4 h-4 text-amber-300" />
                    Gunakan Frame Ini
                  </Link>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">
                  Kebutuhan: <strong className="text-white">{template.photosRequired} Pose</strong>
                </span>
                <Link
                  to={`/booth?template=${template.id}`}
                  className="text-xs font-black text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  Pilih Frame →
                </Link>
              </div>

            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Templates;
