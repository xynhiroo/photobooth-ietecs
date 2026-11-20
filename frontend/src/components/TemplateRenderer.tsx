import { forwardRef } from 'react';
import { Camera } from 'lucide-react';

export interface TemplateData {
  id: number;
  name: string;
  category: string;
  photosRequired: number;
  description: string;
  printFormat: '4R Single' | '4R Dual Strip' | '4R Grid';
}

export interface PlacedStamp {
  id: string;
  src: string;
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  size: number; // in pixels
}

export const TEMPLATES: Record<number, TemplateData> = {
  1: { 
    id: 1, 
    name: "The Grand Patriarch", 
    category: "Official Stained Glass",
    photosRequired: 3,
    description: "Format 4R vertikal dengan ornamen kubah kaca patri ungu-emas khas HMTI Fair 2026.",
    printFormat: '4R Single'
  },
  2: { 
    id: 2, 
    name: "Crystal Arcana & Gobi", 
    category: "Playful Mascot",
    photosRequired: 3,
    description: "Edisi maskot Gorila Penyihir Gobi dengan bebatuan kristal elemen yang playful.",
    printFormat: '4R Single'
  },
  3: { 
    id: 3, 
    name: "Twin Strips (2x6 Cut)", 
    category: "Dual Shareable",
    photosRequired: 3,
    description: "Format 4R berisi 2 photostrip 2x6 inci berdampingan, siap dipotong dua untuk dibagi berdua.",
    printFormat: '4R Dual Strip'
  },
  4: {
    id: 4,
    name: "Royal Quad (2x2 Grid)",
    category: "Korean 4-Cut",
    photosRequired: 4,
    description: "Format 4 foto dalam grid 2x2 klasik yang populer untuk berfoto bersama teman satu geng.",
    printFormat: '4R Grid'
  }
};

interface TemplateRendererProps {
  templateId: number;
  images: string[];
  stamps?: PlacedStamp[];
}

export const TemplateRenderer = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ templateId, images, stamps = [] }, ref) => {
    
    // TEMPLATE 1: THE GRAND PATRIARCH (Official Stained Glass 300 DPI 4R: 1200x1800 px scaled to 600x900 px)
    if (templateId === 1) {
      return (
        <div 
          ref={ref} 
          className="relative w-[600px] h-[900px] bg-[#080718] overflow-hidden flex flex-col justify-between text-white select-none shadow-2xl"
          style={{
            background: 'radial-gradient(circle at 50% 15%, #240d4a 0%, #0d0822 65%, #050410 100%)',
            padding: '34px 36px 28px 36px', // 48px safe bleed margin scale
          }}
        >
          {/* Background Stained Glass Watermark */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen bg-cover bg-center"
            style={{ backgroundImage: `url('/hmti_assets/4.  PATRI WINDOWS/Test4 (NO-BG).png')` }}
          />

          {/* Golden Lead Frame Borders */}
          <div className="absolute inset-4 border border-amber-400/40 rounded-2xl pointer-events-none z-10" />
          <div className="absolute inset-5 border border-amber-400/15 rounded-xl pointer-events-none z-10" />

          {/* Header */}
          <div className="relative z-20 text-center pt-1 pb-2">
            <div className="flex items-center justify-center gap-3 mb-1.5">
              <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Polibatam Univ Logo (1).png" alt="Polibatam" className="h-6 object-contain" />
              <div className="w-1 h-1 rounded-full bg-amber-400/80" />
              <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" alt="HMTI" className="h-6 object-contain" />
            </div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-amber-200 uppercase font-serif">
              HMTI FAIR 2026
            </h1>
            <p className="text-[8.5px] tracking-[0.25em] text-amber-300/80 font-medium uppercase mt-0.5">
              United Beyond Limits, Rise Beyond Infinity
            </p>
          </div>

          {/* Photo Slots (3 shots, dynamically fitted so all 3 fit within 900px canvas) */}
          <div className="relative z-20 flex flex-col gap-3 flex-1 min-h-0 my-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="relative w-full flex-1 min-h-0 bg-[#0d101d] rounded-xl overflow-hidden border border-amber-400/35 shadow-md flex items-center justify-center"
              >
                {images[i] ? (
                  <img src={images[i]} className="w-full h-full object-cover" alt={`Pose ${i + 1}`} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-amber-300/50">
                    <Camera className="w-6 h-6 mb-1 opacity-60" />
                    <span className="text-[11px] font-semibold tracking-wider uppercase">Pose {i + 1}</span>
                  </div>
                )}
                {/* Clean Corner Brackets */}
                <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
                <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
                <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Footer Bar */}
          <div className="relative z-20 pt-2 border-t border-amber-400/25 flex justify-between items-center text-[9.5px] text-amber-300/90 font-medium tracking-wider">
            <span>POLLUX MALL BATAM CENTER</span>
            <div className="flex items-center gap-1.5">
              <img src="/hmti_assets/1. INFINITY STONE/Gemstone-03.png" alt="Gem" className="w-3.5 h-3.5 object-contain" />
              <span className="text-amber-200 font-bold">28-29 NOV 2026</span>
            </div>
            <span>OFFICIAL PHOTOBOOTH</span>
          </div>

          {/* Render User Placed Stamps */}
          {stamps.map((stamp) => (
            <img 
              key={stamp.id}
              src={stamp.src}
              alt={stamp.name}
              style={{
                position: 'absolute',
                left: `${stamp.x}%`,
                top: `${stamp.y}%`,
                width: `${stamp.size}px`,
                height: `${stamp.size}px`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 35,
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))'
              }}
            />
          ))}
        </div>
      );
    }

    // TEMPLATE 2: CRYSTAL ARCANA & GOBI (Cute Mascot Edition)
    if (templateId === 2) {
      return (
        <div 
          ref={ref} 
          className="relative w-[600px] h-[900px] bg-[#0c0618] overflow-hidden flex flex-col justify-between text-white select-none shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #1d0935 0%, #100624 55%, #070312 100%)',
            padding: '34px 36px 28px 36px',
          }}
        >
          {/* Subtle Decorative Frame */}
          <div className="absolute inset-4 border border-purple-400/30 rounded-2xl pointer-events-none z-10" />

          {/* Header with Mascot Gobi */}
          <div className="relative z-20 flex items-center justify-between pt-1 pb-1">
            <div>
              <span className="inline-block text-[9px] font-bold text-amber-300 tracking-wider uppercase mb-0.5">
                Maskot Resmi HMTI Fair
              </span>
              <h1 className="text-2xl font-bold text-white font-serif tracking-wide">
                Gobi The Guardian
              </h1>
              <p className="text-[8.5px] text-slate-300 tracking-wider">
                POLLUX MALL BATAM CENTER • 2026
              </p>
            </div>
            
            {/* Mascot Gobi Round Badge */}
            <div className="w-14 h-14 rounded-full bg-purple-900/40 border border-purple-400/50 flex items-center justify-center overflow-hidden shadow-md">
              <img 
                src="/hmti_assets/7. RANDOM STONE/gobi pose 2.png" 
                alt="Mascot Gobi" 
                className="w-14 h-14 object-contain transform scale-105" 
              />
            </div>
          </div>

          {/* Photo Slots (3 shots) */}
          <div className="relative z-20 flex flex-col gap-3 flex-1 min-h-0 my-1">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="relative w-full flex-1 min-h-0 bg-[#0d101d] rounded-xl overflow-hidden border border-purple-400/30 shadow-md flex items-center justify-center"
              >
                {images[i] ? (
                  <img src={images[i]} className="w-full h-full object-cover" alt={`Pose ${i + 1}`} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-purple-300/50">
                    <Camera className="w-6 h-6 mb-1 opacity-60" />
                    <span className="text-[11px] font-semibold tracking-wider uppercase">Pose {i + 1}</span>
                  </div>
                )}
                {/* Shard Label Badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 border border-purple-400/30 text-[8px] font-semibold text-purple-200">
                  SHARD 0{i + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="relative z-20 pt-2 border-t border-purple-400/25 flex justify-between items-center text-[9.5px] text-purple-200 font-medium">
            <span className="flex items-center gap-1.5">
              <img src="/hmti_assets/1. INFINITY STONE/Gemstone-03.png" alt="Gem" className="w-3.5 h-3.5 object-contain" />
              <span>RISE BEYOND INFINITY</span>
            </span>
            <div className="flex gap-2.5 items-center">
              <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Polibatam Univ Logo (1).png" alt="Polibatam" className="h-4 object-contain opacity-80" />
              <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" alt="HMTI" className="h-4 object-contain opacity-80" />
            </div>
          </div>

          {/* Render User Placed Stamps */}
          {stamps.map((stamp) => (
            <img 
              key={stamp.id}
              src={stamp.src}
              alt={stamp.name}
              style={{
                position: 'absolute',
                left: `${stamp.x}%`,
                top: `${stamp.y}%`,
                width: `${stamp.size}px`,
                height: `${stamp.size}px`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 35,
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))'
              }}
            />
          ))}
        </div>
      );
    }

    // TEMPLATE 3: TWIN STRIPS (2x6 Cut side-by-side on 4R sheet for sharing)
    if (templateId === 3) {
      return (
        <div 
          ref={ref} 
          className="relative w-[600px] h-[900px] bg-[#070512] overflow-hidden flex text-white select-none shadow-2xl p-3"
        >
          {/* Render Two Matching 2x6 Strips side-by-side */}
          {[0, 1].map((stripIndex) => (
            <div 
              key={stripIndex} 
              className={`w-1/2 h-full flex flex-col justify-between p-4 ${stripIndex === 0 ? 'border-r border-dashed border-amber-400/40' : ''}`}
              style={{
                background: 'radial-gradient(circle at 50% 25%, #180e30 0%, #080614 80%)'
              }}
            >
              {/* Strip Header */}
              <div className="text-center pt-1 pb-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" alt="HMTI" className="h-4 object-contain" />
                </div>
                <h2 className="text-xs font-bold text-amber-200 font-serif tracking-wider">HMTI FAIR 2026</h2>
                <p className="text-[7px] text-slate-400 tracking-widest uppercase">POLLUX MALL BATAM</p>
              </div>

              {/* Strip Photos */}
              <div className="flex flex-col gap-2.5 flex-1 min-h-0 my-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-full flex-1 min-h-0 bg-[#0c0f1c] rounded-lg overflow-hidden border border-amber-400/30 flex items-center justify-center">
                    {images[i] ? (
                      <img src={images[i]} className="w-full h-full object-cover" alt={`Strip ${stripIndex} Photo ${i + 1}`} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-[9px] font-medium">
                        Pose {i + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Strip Footer */}
              <div className="text-center text-[7.5px] text-amber-300/80 font-medium border-t border-amber-400/20 pt-1.5 flex justify-between items-center">
                <span>POLLUX MALL</span>
                <span>2026</span>
              </div>
            </div>
          ))}

          {/* Render User Placed Stamps */}
          {stamps.map((stamp) => (
            <img 
              key={stamp.id}
              src={stamp.src}
              alt={stamp.name}
              style={{
                position: 'absolute',
                left: `${stamp.x}%`,
                top: `${stamp.y}%`,
                width: `${stamp.size}px`,
                height: `${stamp.size}px`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 35,
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))'
              }}
            />
          ))}
        </div>
      );
    }

    // TEMPLATE 4: ROYAL QUAD (2x2 Grid)
    return (
      <div 
        ref={ref} 
        className="relative w-[600px] h-[900px] bg-[#080718] overflow-hidden flex flex-col justify-between text-white select-none shadow-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 15%, #240d4a 0%, #0d0822 65%, #050410 100%)',
          padding: '34px 36px 28px 36px',
        }}
      >
        {/* Golden Frame Borders */}
        <div className="absolute inset-4 border border-amber-400/40 rounded-2xl pointer-events-none z-10" />

        {/* Header */}
        <div className="relative z-20 text-center pt-1 pb-2">
          <div className="flex items-center justify-center gap-3 mb-1">
            <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Polibatam Univ Logo (1).png" alt="Polibatam" className="h-5 object-contain" />
            <img src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" alt="HMTI" className="h-5 object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-[0.2em] text-amber-200 uppercase font-serif">
            HMTI FAIR 2026
          </h1>
          <p className="text-[8.5px] tracking-widest text-amber-300/80 uppercase">
            Korean 4-Cut Classic • Pollux Mall Batam
          </p>
        </div>

        {/* 2x2 Grid Photo Slots */}
        <div className="relative z-20 grid grid-cols-2 gap-3 flex-1 min-h-0 my-1">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="relative w-full h-full bg-[#0d101d] rounded-xl overflow-hidden border border-amber-400/35 flex items-center justify-center shadow-md"
            >
              {images[i] ? (
                <img src={images[i]} className="w-full h-full object-cover" alt={`Pose ${i + 1}`} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-300/50">
                  <Camera className="w-5 h-5 mb-1 opacity-60" />
                  <span className="text-[10px] font-semibold tracking-wider uppercase">Pose {i + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-20 pt-2 border-t border-amber-400/25 flex justify-between items-center text-[9.5px] text-amber-300/90 font-medium">
          <span>POLLUX MALL BATAM CENTER</span>
          <span className="text-amber-200 font-bold">28-29 NOV 2026</span>
          <span>OFFICIAL PHOTOBOOTH</span>
        </div>

        {/* Render User Placed Stamps */}
        {stamps.map((stamp) => (
          <img 
            key={stamp.id}
            src={stamp.src}
            alt={stamp.name}
            style={{
              position: 'absolute',
              left: `${stamp.x}%`,
              top: `${stamp.y}%`,
              width: `${stamp.size}px`,
              height: `${stamp.size}px`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 35,
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.6))'
            }}
          />
        ))}
      </div>
    );
  }
);

TemplateRenderer.displayName = 'TemplateRenderer';
