import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Sparkles, Camera, Users, Layout } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 bg-brand-500/20 rounded-2xl">
            <Layout className="w-8 h-8 text-brand-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Template Selection</h1>
            <p className="text-slate-400 text-lg mt-1">Pilih template favorit dan sesuaikan dengan momenmu</p>
          </div>
        </div>
        
        {/* Filter/Sort (Mock UI) */}
        <div className="flex gap-3">
          <button className="glass px-6 py-3 rounded-full text-white font-bold hover:bg-white/10 transition-colors">
            Trending
          </button>
          <button className="px-6 py-3 rounded-full text-slate-400 font-bold hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
            Terbaru
          </button>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
      >
        {Object.values(TEMPLATES).map((template) => (
          <motion.div 
            variants={itemVariants}
            key={template.id} 
            className="flex flex-col group cursor-pointer"
          >
            {/* Card Outer Container */}
            <div className="bg-white rounded-3xl p-[4px] shadow-xl shadow-brand-500/10 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-brand-500/30">
              {/* Purple Border Wrap */}
              <div className="relative rounded-[1.35rem] border-4 border-brand-500 overflow-hidden bg-white h-[500px] flex flex-col">
                
                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 right-3 flex justify-between z-10 pointer-events-none">
                  {template.isFree && (
                    <div className="flex items-center gap-1 bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Free
                    </div>
                  )}
                  {template.isAdFree && (
                    <div className="bg-brand-500/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      Ad-free
                    </div>
                  )}
                </div>

                {/* Template Mockup Rendering */}
                <div className={`relative flex-1 ${template.bgClass} overflow-hidden`}>
                  {/* CSS Representation of the photostrip */}
                  <div className={`absolute inset-0 ${template.layout} justify-center items-center`}>
                     {template.slots.map(slot => (
                       <div key={slot} className="w-[85%] aspect-[4/3] bg-white rounded-md shadow-inner flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-slate-100 opacity-50"></div>
                       </div>
                     ))}
                  </div>

                  {/* Usage Badge (Bottom Left of Template area) */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                    <Users className="w-3 h-3 text-slate-300" />
                    {template.uses} uses
                  </div>

                  {/* Hover Overlay: Start Creating */}
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <Link 
                      to={`/booth?template=${template.id}`}
                      className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform"
                    >
                      <Camera className="w-4 h-4" />
                      Start Creating
                    </Link>
                  </div>
                </div>

              </div>

              {/* Card Footer (White Background) */}
              <div className="p-4 bg-white rounded-b-3xl mt-1">
                <h3 className="text-slate-900 font-bold text-lg leading-tight mb-1 truncate">
                  {template.name}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Camera className="w-4 h-4" />
                  {template.photosRequired} photos
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
};

export default Templates;
