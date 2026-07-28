import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CameraFeed from '../components/CameraFeed';
import { api } from '../context/AuthContext';
import { Sliders, Download, CheckCircle, X, History, Sparkles, Camera, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateRenderer, TEMPLATES } from '../components/TemplateRenderer';
import * as htmlToImage from 'html-to-image';

const Photobooth = () => {
  const [searchParams] = useSearchParams();
  const initialTemplateId = parseInt(searchParams.get('template') || '1');
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const currentTemplate = TEMPLATES[selectedTemplateId] || TEMPLATES[1];

  const [mode, setMode] = useState<'single' | 'template'>('template');

  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    sepia: 0,
    grayscale: 0,
  });
  
  const [countdown, setCountdown] = useState(3);
  const requiredPhotos = mode === 'single' ? 1 : currentTemplate.photosRequired;
  
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const templateRef = useRef<HTMLDivElement>(null);

  const handleCapture = (image: string) => {
    setCapturedPhotos(prev => {
      const newPhotos = [...prev, image];
      return newPhotos;
    });
  };

  const generateFinalImage = async (): Promise<string | null> => {
    if (mode === 'single') {
      return capturedPhotos[0] || null;
    }
    if (!templateRef.current) return null;
    try {
      // Small delay to ensure images are fully rendered in the DOM before capturing
      await new Promise(resolve => setTimeout(resolve, 500));
      return await htmlToImage.toJpeg(templateRef.current, { quality: 0.95, pixelRatio: 2 });
    } catch (error) {
      console.error('Error generating template image', error);
      return null;
    }
  };

  const savePhotos = async () => {
    if (capturedPhotos.length < requiredPhotos) {
      alert(`Please capture all ${requiredPhotos} photos first.`);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const compositeImage = await generateFinalImage();
      if (!compositeImage) throw new Error("Failed to render composite image");

      await api.post('/photos/upload', {
        image: compositeImage,
        filters: [
          mode === 'single' ? 'Mode:Single' : `Template:${currentTemplate.name}`,
          `brightness:${filters.brightness}`,
          `contrast:${filters.contrast}`,
          `sepia:${filters.sepia}`,
          `grayscale:${filters.grayscale}`
        ]
      });
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      setCapturedPhotos([]);
    } catch (error) {
      console.error('Failed to save photo', error);
      alert('Failed to save photo to server.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadLocal = async () => {
    if (capturedPhotos.length < requiredPhotos) {
      alert(`Please capture all ${requiredPhotos} photos first.`);
      return;
    }
    
    setIsProcessing(true);
    const compositeImage = await generateFinalImage();
    setIsProcessing(false);
    
    if (compositeImage) {
      const link = document.createElement('a');
      link.href = compositeImage;
      const fileName = mode === 'single' ? 'single' : currentTemplate.name.replace(/\s+/g, '-').toLowerCase();
      link.download = `ietecs-${fileName}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filterPresets = [
    { name: 'Normal', values: { brightness: 100, contrast: 100, sepia: 0, grayscale: 0 } },
    { name: 'Vintage', values: { brightness: 110, contrast: 120, sepia: 40, grayscale: 0 } },
    { name: 'B&W', values: { brightness: 105, contrast: 130, sepia: 0, grayscale: 100 } },
    { name: 'Cinematic', values: { brightness: 90, contrast: 140, sepia: 10, grayscale: 10 } },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-500/20 rounded-xl">
          <Camera className="w-6 h-6 text-brand-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Studio</h2>
          <p className="text-slate-400">Capture your magic moments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Camera Area */}
        <div className="xl:col-span-3 space-y-8">
          <div className="relative">
            <div className="absolute -inset-1 rounded-[2.2rem] opacity-30 pointer-events-none" style={{ boxShadow: '0 0 40px 10px rgba(236, 72, 153, 0.5), 0 0 60px 20px rgba(139, 92, 246, 0.5)' }}></div>
            {capturedPhotos.length < requiredPhotos ? (
              <>
                <CameraFeed 
                  filters={filters} 
                  onCapture={handleCapture}
                  countdown={countdown}
                />
                {mode === 'template' && (
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl z-20">
                    <span className="text-white font-bold tracking-widest text-sm">
                      {capturedPhotos.length} / {requiredPhotos} CAPTURED
                    </span>
                  </div>
                )}
              </>
            ) : null}
          </div>
          
          <AnimatePresence>
            {capturedPhotos.length >= requiredPhotos && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-6 border-brand-500/30 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <History className="w-5 h-5 text-brand-400" />
                    Review & Compile ({capturedPhotos.length}/{requiredPhotos})
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setCapturedPhotos([])}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-2 font-medium"
                    >
                      <X className="w-4 h-4" /> Retake
                    </button>
                    <button 
                      onClick={downloadLocal}
                      disabled={isProcessing || capturedPhotos.length < requiredPhotos}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button 
                      onClick={savePhotos}
                      disabled={isProcessing || capturedPhotos.length < requiredPhotos}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white transition-all hover:scale-105 shadow-lg shadow-brand-500/25 flex items-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isProcessing ? 'Processing...' : <><CheckCircle className="w-4 h-4" /> Save to Gallery</>}
                    </button>
                  </div>
                </div>
                
                {uploadSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 border border-green-500/30 text-green-300 p-4 rounded-xl mb-6 text-center font-medium"
                  >
                    ✨ Template successfully saved to your magic gallery!
                  </motion.div>
                )}
                
                <div className="flex justify-center bg-slate-900/50 p-8 rounded-2xl overflow-x-auto">
                  {mode === 'template' ? (
                    <div className="scale-75 md:scale-100 transform origin-top">
                      <TemplateRenderer 
                        ref={templateRef} 
                        templateId={selectedTemplateId} 
                        images={capturedPhotos} 
                      />
                    </div>
                  ) : (
                    <img 
                      src={capturedPhotos[0]} 
                      className="max-h-[60vh] rounded-xl shadow-2xl border-4 border-white/10" 
                      alt="Single Capture" 
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6 text-lg font-bold border-b border-white/10 pb-4">
              <Layout className="w-5 h-5 text-brand-400" />
              Capture Mode
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6">
              <button
                onClick={() => { setMode('single'); setCapturedPhotos([]); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'single' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Single Photo
              </button>
              <button
                onClick={() => { setMode('template'); setCapturedPhotos([]); }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'template' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Templates
              </button>
            </div>

            {mode === 'template' && (
              <>
                <div className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Select Frame</div>
                <div className="flex flex-col gap-3 mb-6">
                  {Object.values(TEMPLATES).map(template => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplateId(template.id);
                        setCapturedPhotos([]); // Reset captures when changing template
                      }}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all text-left flex justify-between items-center ${
                        selectedTemplateId === template.id 
                          ? 'bg-brand-500 border-brand-400 text-white shadow-lg' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{template.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-md ${selectedTemplateId === template.id ? 'bg-black/20' : 'bg-black/40'}`}>
                        {template.photosRequired} frames
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center gap-2 mb-6 text-lg font-bold border-b border-white/10 pb-4 mt-8">
              <Sparkles className="w-5 h-5 text-brand-400" />
              Presets
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {filterPresets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => setFilters(preset.values)}
                  className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-brand-500/20 hover:border-brand-500/50 text-sm font-medium transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-6 text-lg font-bold border-b border-white/10 pb-4 mt-8">
              <Sliders className="w-5 h-5 text-brand-400" />
              Adjustments
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  <span>Brightness</span>
                  <span className="text-white">{filters.brightness}%</span>
                </label>
                <input 
                  type="range" min="50" max="150" 
                  value={filters.brightness} 
                  onChange={(e) => setFilters({...filters, brightness: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  <span>Contrast</span>
                  <span className="text-white">{filters.contrast}%</span>
                </label>
                <input 
                  type="range" min="50" max="150" 
                  value={filters.contrast} 
                  onChange={(e) => setFilters({...filters, contrast: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  <span>Sepia</span>
                  <span className="text-white">{filters.sepia}%</span>
                </label>
                <input 
                  type="range" min="0" max="100" 
                  value={filters.sepia} 
                  onChange={(e) => setFilters({...filters, sepia: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  <span>Grayscale</span>
                  <span className="text-white">{filters.grayscale}%</span>
                </label>
                <input 
                  type="range" min="0" max="100" 
                  value={filters.grayscale} 
                  onChange={(e) => setFilters({...filters, grayscale: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-4">Capture Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Countdown Timer</label>
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                  {[0, 3, 5, 10].map(val => (
                    <button
                      key={val}
                      onClick={() => setCountdown(val)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        countdown === val 
                          ? 'bg-brand-500 text-white shadow-lg' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {val === 0 ? 'Off' : `${val}s`}
                    </button>
                  ))}
                </div>
              </div>
              
              {mode === 'template' && (
                <div className="bg-brand-500/10 border border-brand-500/20 p-4 rounded-xl text-sm text-brand-200">
                  <p className="font-bold mb-1">Manual Frame Mode Active</p>
                  <p className="opacity-80">Take {requiredPhotos} photos manually. You have time to change poses between each shot!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Photobooth;
