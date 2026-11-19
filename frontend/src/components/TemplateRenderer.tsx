import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';

export interface TemplateData {
  id: number;
  name: string;
  category: string;
  photosRequired: number;
  description: string;
  printFormat: '4R Single' | '4R Dual Strip' | '4R Grid';
}

export const TEMPLATES: Record<number, TemplateData> = {
  1: { 
    id: 1, 
    name: "The Grand Patriarch", 
    category: "Official Stained Glass",
    photosRequired: 3,
    description: "Format 4R klasik dengan kubah kaca patri ungu-emas resmi HMTI Fair 2026.",
    printFormat: '4R Single'
  },
  2: { 
    id: 2, 
    name: "Crystal Arcana & Gobi", 
    category: "Playful Mascot",
    photosRequired: 3,
    description: "Edisi lucu dan ceria bersama maskot Gorila Penyihir Gobi dan bebatuan kristal elemen.",
    printFormat: '4R Single'
  },
  3: { 
    id: 3, 
    name: "Twin Strips (2x6 Cut)", 
    category: "Dual Shareable",
    photosRequired: 3,
    description: "Format 4R berisi 2 photostrip berdampingan, siap digunting untuk berdua.",
    printFormat: '4R Dual Strip'
  },
};

interface TemplateRendererProps {
  templateId: number;
  images: string[];
}

export const TemplateRenderer = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ templateId, images }, ref) => {
    
    // TEMPLATE 1: THE GRAND PATRIARCH (Official Stained Glass 300 DPI 4R: 1200x1800 px)
    if (templateId === 1) {
      return (
        <div 
          ref={ref} 
          className="relative w-[600px] h-[900px] bg-slate-950 overflow-hidden flex flex-col justify-between text-white select-none shadow-2xl"
          style={{
            background: 'radial-gradient(circle at 50% 20%, #2e1065 0%, #0d0b24 70%, #050510 100%)',
            padding: '36px 36px 30px 36px', // 48px safe bleed margin scale
          }}
        >
          {/* Background Stained Glass Watermark */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen bg-cover bg-center"
            style={{ backgroundImage: `url('/hmti_assets/4.  PATRI WINDOWS/Test4 (NO-BG).png')` }}
          />

          {/* Golden Gothic Border Frame */}
          <div className="absolute inset-4 border-2 border-amber-400/50 rounded-2xl pointer-events-none z-10" />
          <div className="absolute inset-5 border border-amber-400/20 rounded-xl pointer-events-none z-10" />

          {/* Header */}
          <div className="relative z-20 text-center pt-2 pb-1">
            <div className="flex items-center justify-center gap-3 mb-1.5">
              <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Polibatam Univ Logo (1).png" alt="Polibatam" className="h-7 object-contain drop-shadow" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" alt="HMTI" className="h-7 object-contain drop-shadow" />
            </div>
            <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] uppercase font-serif">
              HMTI FAIR 2026
            </h1>
            <p className="text-[9px] tracking-widest text-amber-200/80 font-bold uppercase">
              United Beyond Limits, Rise Beyond Infinity
            </p>
          </div>

          {/* Photo Slots (3 shots) */}
          <div className="relative z-20 flex flex-col gap-3.5 my-auto">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="relative w-full aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden border-2 border-amber-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
              >
                {images[i] ? (
                  <img src={images[i]} className="w-full h-full object-cover" alt={`Pose ${i + 1}`} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/90 text-amber-300/60 font-bold">
                    <Sparkles className="w-6 h-6 mb-1 text-amber-400/50" />
                    <span className="text-xs uppercase tracking-wider">Foto {i + 1}</span>
                  </div>
                )}
                {/* Corner Accents */}
                <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400/70 pointer-events-none" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400/70 pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400/70 pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400/70 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Footer Bar */}
          <div className="relative z-20 pt-2 border-t border-amber-400/30 flex justify-between items-center text-[10px] text-amber-300 font-bold tracking-wider">
            <span>POLLUX MALL BATAM CENTER</span>
            <div className="flex items-center gap-1.5">
              <img src="/hmti_assets/1. INFINITY STONE/Gemstone-03.png" alt="Gem" className="w-4 h-4 object-contain animate-pulse" />
              <span className="text-amber-200">#HMTIFAIR2026</span>
            </div>
            <span>OFFICIAL PHOTOBOOTH</span>
          </div>
        </div>
      );
    }

    // TEMPLATE 2: CRYSTAL ARCANA & GOBI (Cute Mascot Edition)
    if (templateId === 2) {
      return (
        <div 
          ref={ref} 
          className="relative w-[600px] h-[900px] bg-slate-950 overflow-hidden flex flex-col justify-between text-white select-none shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #1e0b36 0%, #110724 50%, #060210 100%)',
            padding: '36px 36px 30px 36px',
          }}
        >
          {/* Glowing Aura Rings */}
          <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full bg-pink-600/25 blur-3xl pointer-events-none" />

          {/* Decorative Lead Glass Frame */}
          <div className="absolute inset-4 border-2 border-purple-400/40 rounded-2xl pointer-events-none z-10" />

          {/* Header with Mascot Gobi */}
          <div className="relative z-20 flex items-center justify-between pt-1 pb-1">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/40 text-[9px] font-black uppercase tracking-wider text-pink-300 mb-1">
                ★ SPECIAL EDITION
              </div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-300 font-serif">
                HMTI FAIR 2026
              </h1>
              <p className="text-[9px] font-bold text-slate-300 tracking-wider">
                RISE BEYOND INFINITY
              </p>
            </div>
            
            {/* Mascot Gobi Thumbnail */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-400/50 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                <img 
                  src="/hmti_assets/7. RANDOM STONE/gobi pose 2.png" 
                  alt="Mascot Gobi" 
                  className="w-16 h-16 object-contain transform scale-110" 
                />
              </div>
            </div>
          </div>

          {/* Photo Slots (3 shots) */}
          <div className="relative z-20 flex flex-col gap-3 my-auto">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="relative w-full aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden border-2 border-purple-400/40 shadow-xl"
              >
                {images[i] ? (
                  <img src={images[i]} className="w-full h-full object-cover" alt={`Pose ${i + 1}`} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/90 text-purple-300/60 font-bold">
                    <Sparkles className="w-6 h-6 mb-1 text-purple-400" />
                    <span className="text-xs uppercase tracking-wider">Foto {i + 1}</span>
                  </div>
                )}
                {/* Floating Crystal Badges */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/70 border border-purple-400/40 text-[8px] font-black text-purple-200">
                  SHARD 0{i + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Footer with Floating Infinity Gems */}
          <div className="relative z-20 pt-2 border-t border-purple-400/30 flex justify-between items-center text-[10px] text-purple-200 font-bold">
            <span className="flex items-center gap-1.5">
              <img src="/hmti_assets/1. INFINITY STONE/Gemstone-03.png" alt="Gem" className="w-4 h-4 object-contain" />
              GOBI THE GUARDIAN
            </span>
            <div className="flex gap-2">
              <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Polibatam Univ Logo (1).png" alt="Polibatam" className="h-4 object-contain opacity-80" />
              <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" alt="HMTI" className="h-4 object-contain opacity-80" />
            </div>
          </div>
        </div>
      );
    }

    // TEMPLATE 3: TWIN STRIPS (2x6 Cut side-by-side on 4R sheet for sharing)
    return (
      <div 
        ref={ref} 
        className="relative w-[600px] h-[900px] bg-slate-950 overflow-hidden flex text-white select-none shadow-2xl p-4"
        style={{
          background: '#0a0818',
        }}
      >
        {/* Render Two Matching 2x6 Strips side-by-side */}
        {[0, 1].map((stripIndex) => (
          <div 
            key={stripIndex} 
            className={`w-1/2 h-full flex flex-col justify-between p-4 ${stripIndex === 0 ? 'border-r-2 border-dashed border-amber-400/30' : ''}`}
            style={{
              background: 'radial-gradient(circle at 50% 30%, #1e113d 0%, #0c081c 80%)'
            }}
          >
            {/* Header */}
            <div className="text-center pt-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" alt="HMTI" className="h-5 object-contain" />
              </div>
              <h2 className="text-sm font-black text-amber-300 font-serif tracking-wider">HMTI FAIR 2026</h2>
              <p className="text-[7px] text-slate-300 tracking-widest uppercase">POLLUX MALL BATAM</p>
            </div>

            {/* Photos */}
            <div className="flex flex-col gap-2.5 my-auto">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-full aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden border border-amber-400/40 shadow-md">
                  {images[i] ? (
                    <img src={images[i]} className="w-full h-full object-cover" alt={`Strip ${stripIndex} Photo ${i + 1}`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px] font-bold">
                      Shot {i + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center text-[7px] text-amber-300/80 font-bold border-t border-amber-400/20 pt-1.5 flex justify-between items-center">
              <span>★ BEYOND LIMITS ★</span>
              <span>2026</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

TemplateRenderer.displayName = 'TemplateRenderer';
