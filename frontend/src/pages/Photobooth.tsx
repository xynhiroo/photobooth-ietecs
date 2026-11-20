import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CameraFeed from '../components/CameraFeed';
import { api } from '../context/AuthContext';
import { 
  Sliders, 
  Download, 
  X, 
  Sparkles, 
  Camera, 
  Layout, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink,
  Printer,
  Maximize,
  Minimize,
  RotateCcw,
  Clock,
  Share2,
  Smile,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateRenderer, TEMPLATES, SAMPLE_PREVIEW_IMAGES } from '../components/TemplateRenderer';
import type { PlacedStamp } from '../components/TemplateRenderer';
import * as htmlToImage from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { soundEffects } from '../utils/audioEffects';

interface SavedShareData {
  photoId: number | string;
  shareToken: string;
  shareUrl: string;
  imageUrl: string;
  copies: number;
}

const AVAILABLE_STAMPS = [
  { id: 'gobi', name: 'Maskot Gobi', src: '/hmti_assets/7. RANDOM STONE/gobi pose 2.png', defaultSize: 72 },
  { id: 'amethyst', name: 'Kristal Ungu', src: '/hmti_assets/1. INFINITY STONE/Gemstone-03.png', defaultSize: 48 },
  { id: 'emerald', name: 'Kristal Hijau', src: '/hmti_assets/1. INFINITY STONE/gemstone green-03.png', defaultSize: 48 },
  { id: 'hmti', name: 'Logo HMTI', src: '/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png', defaultSize: 45 },
];

const FILTER_PRESETS = [
  { name: 'Natural', values: { brightness: 100, contrast: 100, sepia: 0, grayscale: 0 } },
  { name: 'Kaca Patri Glow', values: { brightness: 106, contrast: 115, sepia: 15, grayscale: 0 } },
  { name: 'Cyber Amethyst', values: { brightness: 102, contrast: 125, sepia: 0, grayscale: 0 } },
  { name: 'Classic Noir', values: { brightness: 108, contrast: 135, sepia: 0, grayscale: 100 } },
  { name: 'Vintage Kodak', values: { brightness: 105, contrast: 110, sepia: 35, grayscale: 0 } },
];

const Photobooth = () => {
  const [searchParams] = useSearchParams();
  const initialTemplateId = parseInt(searchParams.get('template') || '1');
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const currentTemplate = TEMPLATES[selectedTemplateId] || TEMPLATES[1];

  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    sepia: 0,
    grayscale: 0,
  });
  
  const [countdown, setCountdown] = useState(3);
  const [copies, setCopies] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const requiredPhotos = currentTemplate.photosRequired;
  
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Stamp Studio state
  const [placedStamps, setPlacedStamps] = useState<PlacedStamp[]>([]);
  
  // QR Code & Share State
  const [savedShareData, setSavedShareData] = useState<SavedShareData | null>(null);
  const [copied, setCopied] = useState(false);
  const [autoResetTimer, setAutoResetTimer] = useState<number | null>(null);
  const [pauseAutoReset, setPauseAutoReset] = useState(false);
  
  const templateRef = useRef<HTMLDivElement>(null);

  // Auto-reset countdown timer when QR modal is active
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (savedShareData && !pauseAutoReset) {
      if (autoResetTimer === null) {
        setAutoResetTimer(12);
      } else if (autoResetTimer > 0) {
        interval = setTimeout(() => {
          setAutoResetTimer(prev => (prev !== null ? prev - 1 : null));
        }, 1000);
      } else if (autoResetTimer === 0) {
        // Reset booth for the next queue
        setSavedShareData(null);
        setCapturedPhotos([]);
        setPlacedStamps([]);
        setAutoResetTimer(null);
      }
    }
    return () => clearTimeout(interval);
  }, [savedShareData, autoResetTimer, pauseAutoReset]);

  const handleCapture = (image: string) => {
    setCapturedPhotos(prev => {
      const next = [...prev, image];
      if (next.length === requiredPhotos) {
        soundEffects.playCrystalChime();
      }
      return next;
    });
  };

  const handleRetakeSingle = (index: number) => {
    setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleToggleStamp = (stampInfo: typeof AVAILABLE_STAMPS[0]) => {
    setPlacedStamps(prev => {
      const exists = prev.some(s => s.id === stampInfo.id);
      if (exists) {
        return prev.filter(s => s.id !== stampInfo.id);
      }
      // Place in default artistic positions
      const count = prev.length;
      const positions = [
        { x: 88, y: 88 },
        { x: 12, y: 88 },
        { x: 88, y: 14 },
        { x: 12, y: 14 },
      ];
      const pos = positions[count % positions.length];
      return [...prev, {
        id: stampInfo.id,
        src: stampInfo.src,
        name: stampInfo.name,
        x: pos.x,
        y: pos.y,
        size: stampInfo.defaultSize
      }];
    });
  };

  const generateFinalImage = async (): Promise<string | null> => {
    if (!templateRef.current) return null;
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // Render at pixelRatio 2 for 300 DPI lab sharpness (1200x1800 px)
      return await htmlToImage.toJpeg(templateRef.current, { quality: 0.95, pixelRatio: 2 });
    } catch (error) {
      console.error('Error generating template image', error);
      return null;
    }
  };

  const handlePrintAndSave = async () => {
    if (capturedPhotos.length < requiredPhotos) {
      alert(`Silakan ambil semua ${requiredPhotos} foto terlebih dahulu.`);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const compositeImage = await generateFinalImage();
      if (!compositeImage) throw new Error("Gagal merender gambar komposit 300 DPI");

      // Kirim ke endpoint Hot Folder Print Queue
      const response = await api.post('/photos/print-queue', {
        image: compositeImage,
        copies: copies,
        filters: [
          `Template:${currentTemplate.name}`,
          `brightness:${filters.brightness}`,
          `contrast:${filters.contrast}`,
          `sepia:${filters.sepia}`,
          `grayscale:${filters.grayscale}`
        ]
      });
      
      const photo = response.data?.photo;
      const token = response.data?.share_token || photo?.share_token;

      const shareUrl = token 
        ? `${window.location.origin}/share/${token}` 
        : window.location.href;

      soundEffects.playCrystalChime();

      setSavedShareData({
        photoId: photo?.id || Date.now(),
        shareToken: token || '',
        shareUrl,
        imageUrl: compositeImage,
        copies,
      });

      setAutoResetTimer(12);
      setPauseAutoReset(false);
    } catch (error) {
      console.error('Gagal mengirim ke antrean printer', error);
      // Fallback: unduh langsung ke laptop jika offline/bridge terputus
      downloadLocal();
      alert('Foto otomatis diunduh ke laptop ini sebagai cadangan!');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadLocal = async () => {
    if (capturedPhotos.length < requiredPhotos) return;
    
    setIsProcessing(true);
    const compositeImage = await generateFinalImage();
    setIsProcessing(false);
    
    if (compositeImage) {
      const link = document.createElement('a');
      link.href = compositeImage;
      const fileName = currentTemplate.name.replace(/\s+/g, '-').toLowerCase();
      link.download = `hmti-fair-${fileName}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && savedShareData) {
      try {
        await navigator.share({
          title: 'Foto HMTI Fair 2026',
          text: 'Unduh hasil photobooth HMTI Fair 2026!',
          url: savedShareData.shareUrl,
        });
      } catch {
        // user cancelled share
      }
    }
  };

  const handleReprintLast = async () => {
    if (!confirm('Kirim ulang foto terakhir ke printer? (Gunakan jika kertas macet/tinta habis)')) return;
    try {
      const res = await api.post('/photos/reprint-last');
      alert(res.data.message || 'Foto terakhir berhasil dikirim ulang ke antrean printer!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengirim ulang foto.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 select-none">
      
      {/* Top Header & Kiosk Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Studio Booth Aktif • Pollux Mall Batam
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif mt-0.5">
            {currentTemplate.name}
          </h1>
        </div>

        {/* Operator Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReprintLast}
            className="btn-tactile px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            title="Cetak ulang foto sesi sebelumnya (Emergency Reprint)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reprint Terakhir</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn-tactile px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Mode Kiosk Layar Penuh"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Keluar Kiosk' : 'Mode Kiosk'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Main Camera & Review Area */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* CAMERA FEED (Active when taking shots) */}
          {capturedPhotos.length < requiredPhotos && (
            <div className="space-y-4">
              <CameraFeed 
                filters={filters} 
                onCapture={handleCapture}
                countdown={countdown}
                requiredPhotos={requiredPhotos}
                currentPhotosCount={capturedPhotos.length}
              />

              {/* Progress Strip Preview Bar */}
              <div className="surface-card p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Progres: {capturedPhotos.length} / {requiredPhotos} Pose
                  </span>
                </div>
                
                {/* Thumbnails of taken photos with individual retake */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: requiredPhotos }).map((_, idx) => (
                    <div key={idx} className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-900 border border-white/15">
                      {capturedPhotos[idx] ? (
                        <>
                          <img src={capturedPhotos[idx]} alt={`Pose ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRetakeSingle(idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                            title={`Ulang foto ${idx + 1}`}
                          >
                            <RotateCcw className="w-3 h-3 text-amber-400" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 font-medium">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* REVIEW & PRINT CANVAS (Active when all required shots are captured) */}
          {capturedPhotos.length >= requiredPhotos && (
            <div className="surface-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Tinjau Lembar Foto & Siap Cetak
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Format cetak lab 4R 300 DPI (1200 × 1800 px) dengan margin aman printer
                  </p>
                </div>

                {/* Copy Count Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-300">Jumlah Cetak:</span>
                  <div className="flex bg-slate-900 border border-white/15 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCopies(1)}
                      className={`btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        copies === 1 ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      1 Lembar
                    </button>
                    <button
                      type="button"
                      onClick={() => setCopies(2)}
                      className={`btn-tactile px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        copies === 2 ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      2 Lembar (Berdua)
                    </button>
                  </div>
                </div>
              </div>

              {/* Stamp / Sticker Customizer Studio */}
              <div className="surface-card p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                  <Smile className="w-4 h-4 text-amber-400" />
                  <span>Tambahkan Cap Stiker Acara:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {AVAILABLE_STAMPS.map(stamp => {
                    const isPlaced = placedStamps.some(s => s.id === stamp.id);
                    return (
                      <button
                        key={stamp.id}
                        type="button"
                        onClick={() => handleToggleStamp(stamp)}
                        className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                          isPlaced 
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300' 
                            : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        <img src={stamp.src} alt={stamp.name} className="w-4 h-4 object-contain" />
                        <span>{stamp.name}</span>
                        {isPlaced && <Check className="w-3 h-3 text-amber-400" />}
                      </button>
                    );
                  })}

                  {placedStamps.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPlacedStamps([])}
                      className="px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                      title="Hapus semua stiker"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Stiker</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-between items-center gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setCapturedPhotos([]);
                    setSavedShareData(null);
                    setPlacedStamps([]);
                  }}
                  className="btn-tactile px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <X className="w-4 h-4" /> Foto Ulang Semua (Retake)
                </button>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={downloadLocal}
                    disabled={isProcessing}
                    className="btn-tactile px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" /> Unduh Cadangan
                  </button>

                  <button 
                    type="button"
                    onClick={handlePrintAndSave}
                    disabled={isProcessing}
                    className="btn-tactile px-7 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? 'Mengirim ke Mesin Cetak...' : (
                      <>
                        <Printer className="w-4 h-4 text-slate-950" />
                        <span>Cetak ({copies} Lembar) & Tampilkan QR</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 300 DPI Visual Preview Container */}
              <div className="flex justify-center bg-[#05060b] p-6 sm:p-8 rounded-2xl border border-white/5 overflow-x-auto">
                <div className="scale-65 md:scale-80 transform origin-top shadow-2xl">
                  <TemplateRenderer 
                    ref={templateRef} 
                    templateId={selectedTemplateId} 
                    images={capturedPhotos} 
                    stamps={placedStamps}
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          
          {/* Template Picker */}
          <div className="surface-card p-5 rounded-3xl border border-white/10">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-white border-b border-white/10 pb-3">
              <Layout className="w-4 h-4 text-amber-400" />
              <span>Pilihan Frame HMTI Fair</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {Object.values(TEMPLATES).map(tmpl => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplateId(tmpl.id);
                    setCapturedPhotos([]);
                    setSavedShareData(null);
                    setPlacedStamps([]);
                  }}
                  className={`btn-tactile p-2.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center gap-3 ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="w-10 h-14 rounded-lg bg-black border border-white/20 shrink-0 overflow-hidden flex items-center justify-center">
                    <div className="transform scale-[0.15] origin-center pointer-events-none select-none">
                      <TemplateRenderer templateId={tmpl.id} images={SAMPLE_PREVIEW_IMAGES} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold font-serif truncate">{tmpl.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-semibold shrink-0">
                        {tmpl.photosRequired} Pose
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {tmpl.category} • {tmpl.printFormat}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preset Color Filters */}
          <div className="surface-card p-5 rounded-3xl border border-white/10">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-white border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Preset Filter Warna</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-5">
              {FILTER_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setFilters(preset.values)}
                  className="btn-tactile py-2 px-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Manual Sliders */}
            <div className="space-y-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Kalibrasi Pencahayaan</span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                  <span>Kecerahan</span>
                  <span className="text-amber-300">{filters.brightness}%</span>
                </div>
                <input 
                  type="range" min="60" max="140" 
                  value={filters.brightness} 
                  onChange={(e) => setFilters({...filters, brightness: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1">
                  <span>Kontras</span>
                  <span className="text-amber-300">{filters.contrast}%</span>
                </div>
                <input 
                  type="range" min="60" max="140" 
                  value={filters.contrast} 
                  onChange={(e) => setFilters({...filters, contrast: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Countdown Selector */}
          <div className="surface-card p-5 rounded-3xl border border-white/10">
            <label className="block text-xs font-bold text-slate-300 mb-2.5 uppercase tracking-wider">
              Jeda Hitung Mundur
            </label>
            <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-white/10">
              {[3, 5, 7].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCountdown(val)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    countdown === val 
                      ? 'bg-amber-400 text-slate-950 font-black' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {val} Detik
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Accessible QR Code & Print Modal (Modern Web Guidance Compliant) */}
      <AnimatePresence>
        {savedShareData && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            style={{ overscrollBehavior: 'contain' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="surface-card p-6 sm:p-8 rounded-3xl max-w-xl w-full border border-amber-400/40 shadow-2xl relative"
              aria-labelledby="modal-title"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSavedShareData(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Tutup dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold mb-2">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Sedang Dicetak ({savedShareData.copies} Lembar)</span>
                </div>
                <h3 id="modal-title" className="text-2xl font-bold text-white font-serif">
                  Ambil Foto di Meja Operator!
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                  Arahkan kamera HP ke QR Code di bawah untuk menyimpan versi digital resolusi penuh langsung ke galeri smartphone.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* QR Code Container */}
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-2xl shadow-xl border-2 border-amber-400/60">
                    <QRCodeSVG
                      value={savedShareData.shareUrl}
                      size={180}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-amber-300 mt-2.5 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" /> Scan dengan Kamera HP
                  </span>
                </div>

                {/* Details & Actions */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Tautan Akses Digital</label>
                    <div className="flex items-center gap-2 bg-slate-900 border border-white/15 rounded-xl p-1.5 pl-3">
                      <span className="text-xs text-slate-300 truncate select-all">{savedShareData.shareUrl}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(savedShareData.shareUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="btn-tactile px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>

                  {/* Auto-reset bar */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {pauseAutoReset 
                          ? 'Auto-reset dijeda' 
                          : `Reset dalam ${autoResetTimer || 0} detik...`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPauseAutoReset(prev => !prev)}
                      className="text-[11px] font-bold text-amber-300 hover:underline"
                    >
                      {pauseAutoReset ? 'Lanjutkan' : 'Jeda Timer'}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                      <button
                        type="button"
                        onClick={handleNativeShare}
                        className="btn-tactile w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10"
                      >
                        <Share2 className="w-3.5 h-3.5 text-amber-400" /> Bagikan via WhatsApp / IG
                      </button>
                    )}

                    <a
                      href={savedShareData.shareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Buka Foto di Tab Baru
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSavedShareData(null);
                        setCapturedPhotos([]);
                        setPlacedStamps([]);
                        setAutoResetTimer(null);
                      }}
                      className="btn-tactile w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                      <Camera className="w-4 h-4 text-slate-950" /> Selesai / Sesi Berikutnya
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Photobooth;
