import { forwardRef } from 'react';

export interface TemplateData {
  id: number;
  name: string;
  photosRequired: number;
}

export const TEMPLATES: Record<number, TemplateData> = {
  1: { id: 1, name: "Vintage Strip (4)", photosRequired: 4 },
  2: { id: 2, name: "Checkered Red (3)", photosRequired: 3 },
  3: { id: 3, name: "Grid Style (4)", photosRequired: 4 },
};

interface TemplateRendererProps {
  templateId: number;
  images: string[];
}

export const TemplateRenderer = forwardRef<HTMLDivElement, TemplateRendererProps>(
  ({ templateId, images }, ref) => {
    
    // GANIM X MOTOMESA style (4 photos, dark blue background, vintage ticket border)
    if (templateId === 1) {
      return (
        <div 
          ref={ref} 
          className="bg-[#1a233a] p-4 sm:p-6 w-full max-w-[400px] flex flex-col gap-4 relative overflow-hidden"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          {/* Vintage Header */}
          <div className="bg-[#f4ebd0] p-4 rounded-t-xl text-center border-b-2 border-dashed border-[#1a233a] relative">
            <h2 className="text-[#c1121f] text-3xl font-bold italic mb-2" style={{ fontFamily: "Georgia, serif" }}>ietecs</h2>
            <div className="flex justify-between text-[#1a233a] text-xs font-bold border-t border-b border-[#1a233a] py-1">
              <span>Friday, Jan 31st</span>
              <span>Row <span className="text-[#c1121f]">01</span></span>
              <span>Seat <span className="text-[#c1121f]">24</span></span>
            </div>
            <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-[#1a233a] rounded-full"></div>
            <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-[#1a233a] rounded-full"></div>
          </div>
          
          {/* Photo Layout */}
          <div className="bg-[#f4ebd0] p-4 flex flex-col gap-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-full aspect-[4/3] bg-slate-300 relative overflow-hidden border border-slate-400">
                {images[i] ? (
                  <img src={images[i]} className="w-full h-full object-cover" alt={`Capture ${i}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">Photo {i+1}</div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-[#f4ebd0] p-3 rounded-b-xl text-center border-t-2 border-dashed border-[#1a233a] relative">
            <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#1a233a] rounded-full"></div>
            <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#1a233a] rounded-full"></div>
            <p className="text-[#c1121f] text-lg font-black tracking-widest">★ BE MORE! ★</p>
          </div>
        </div>
      );
    }

    // Hirono Red style (3 photos, red checkered background)
    if (templateId === 2) {
      return (
        <div 
          ref={ref} 
          className="p-6 w-full max-w-[350px] flex flex-col gap-6 relative"
          style={{ 
            backgroundColor: '#d8b4b4',
            backgroundImage: 'repeating-linear-gradient(45deg, #b23a3a 25%, transparent 25%, transparent 75%, #b23a3a 75%, #b23a3a), repeating-linear-gradient(45deg, #b23a3a 25%, #d8b4b4 25%, #d8b4b4 75%, #b23a3a 75%, #b23a3a)',
            backgroundPosition: '0 0, 20px 20px',
            backgroundSize: '40px 40px'
          }}
        >
          {/* Photos */}
          {[0, 1, 2].map(i => (
            <div key={i} className="w-full aspect-[4/3] bg-white border-[6px] border-[#f4ebd0] shadow-xl relative overflow-hidden transform" style={{ rotate: i % 2 === 0 ? '-1deg' : '2deg' }}>
              {images[i] ? (
                <img src={images[i]} className="w-full h-full object-cover" alt={`Capture ${i}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold bg-slate-100">Photo {i+1}</div>
              )}
            </div>
          ))}
          
          {/* Decorative Footer */}
          <div className="mt-4 bg-[#f4ebd0] py-3 px-4 rounded shadow-2xl transform -rotate-2 border-2 border-[#b23a3a]">
            <h3 className="text-center text-[#b23a3a] font-black tracking-widest uppercase">Memories</h3>
          </div>
        </div>
      );
    }

    // Default Grid (4 photos)
    return (
      <div ref={ref} className="bg-slate-900 p-6 w-full max-w-[500px] border-8 border-brand-500 rounded-3xl relative">
        <div className="absolute top-0 right-0 p-4">
          <div className="text-brand-300 font-black text-xl tracking-widest opacity-50">ietecs</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-full aspect-square bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-white/10">
              {images[i] ? (
                <img src={images[i]} className="w-full h-full object-cover" alt={`Capture ${i}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold">Photo {i+1}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

TemplateRenderer.displayName = 'TemplateRenderer';
