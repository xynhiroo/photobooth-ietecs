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
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateRenderer, TEMPLATES } from '../components/TemplateRenderer';
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

const Photobooth = () => {
  const [searchParams] = useSearchParams();
  const initialTemplateId = parseInt(searchParams.get('template') || '1');
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const currentTemplate = TEMPLATES[selectedTemplateId] || TEMPLATES[1];

  const [mode] = useState<'single' | 'template'>('template');

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
  
  // QR Code & Share State
  const [savedShareData, setSavedShareData] = useState<SavedShareData | null>(null);
  const [copied, setCopied] = useState(false);
  const [autoResetTimer, setAutoResetTimer] = useState<number | null>(null);
  const [pauseAutoReset, setPauseAutoReset] = useState(false);
  
  const templateRef = useRef<HTMLDivElement>(null);

  // Auto-reset timer when modal is shown
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (savedShareData && !pauseAutoReset) {
      if (autoResetTimer === null) {
        setAutoResetTimer(10);
      } else if (autoResetTimer > 0) {
        interval = setTimeout(() => {
          setAutoResetTimer(prev => (prev !== null ? prev - 1 : null));
        }, 1000);
      } else if (autoResetTimer === 0) {
        // Reset booth for next queue
        setSavedShareData(null);
        setCapturedPhotos([]);
        setAutoResetTimer(null);
      }
    }
    return () => clearTimeout(interval);
  }, [savedShareData, autoResetTimer, pauseAutoReset]);

  const handleCapture = (image: string) => {
    setCapturedPhotos(prev => {
      const newPhotos = [...prev, image];
      return newPhotos;
    });
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

  const generateFinalImage = async (): Promise<string | null> => {
    if (mode === 'single') {
      return capturedPhotos[0] || null;
    }
    if (!templateRef.current) return null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Render at pixelRatio 2 for 300 DPI sharpness (1200x1800 px)
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
          mode === 'single' ? 'Mode:Single' : `Template:${currentTemplate.name}`,
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

      setAutoResetTimer(10);
      setPauseAutoReset(false);
    } catch (error) {
      console.error('Gagal mencetak / menyimpan foto', error);
      // Fallback: download lokal jika backend/jaringan terganggu
      downloadLocal();
      alert('Gagal mengirim ke server printer. Foto otomatis diunduh ke laptop ini sebagai cadangan!');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadLocal = async () => {
    if (capturedPhotos.length < requiredPhotos) {
      alert(`Silakan ambil semua ${requiredPhotos} foto terlebih dahulu.`);
      return;
    }
    
    setIsProcessing(true);
    const compositeImage = await generateFinalImage();
    setIsProcessing(false);
    
    if (compositeImage) {
      const link = document.createElement('a');
      link.href = compositeImage;
      const fileName = mode === 'single' ? 'single' : currentTemplate.name.replace(/\s+/g, '-').toLowerCase();
      link.download = `hmti-fair-${fileName}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReprintLast = async () => {
    if (!confirm('Kirim ulang foto terakhir ke printer? (Gunakan jika kertas macet/habis)')) return;
    try {
      const res = await api.post('/photos/reprint-last');
      alert(res.data.message || 'Foto terakhir berhasil dikirim ulang ke antrean printer!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengirim ulang foto ke antrean.');
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto pb-10"
    >
      {/* Top Bar with Branding & Kiosk Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-600 to-amber-500 rounded-2xl shadow-lg shadow-purple-500/20 border border-amber-300/40">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold tracking-wider uppercase">
                Pollux Mall Batam Center
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 font-serif">
              HMTI Fair Photobooth 2026
            </h2>
          </div>
        </div>

        {/* Kiosk Mode & Operator Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReprintLast}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            title="Cetak ulang foto terakhir (Emergency Reprint)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reprint Terakhir</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="Mode Kiosk Layar Penuh"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Keluar Fullscreen' : 'Mode Kiosk'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Camera Area */}
        <div className="xl:col-span-3 space-y-8">
          <div className="relative">
            {capturedPhotos.length < requiredPhotos ? (
              <>
                <CameraFeed 
                  filters={filters} 
                  onCapture={handleCapture}
                  countdown={countdown}
                  requiredPhotos={requiredPhotos}
                  currentPhotosCount={capturedPhotos.length}
                />
                {mode === 'template' && (
                  <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-full border border-amber-400/40 shadow-xl z-20">
                    <span className="text-amber-300 font-bold tracking-widest text-xs sm:text-sm">
                      {capturedPhotos.length} / {requiredPhotos} DIAMBIL
                    </span>
                  </div>
                )}
              </>
            ) : null}
          </div>
          
          {/* Review & Print Bar */}
          <AnimatePresence>
            {capturedPhotos.length >= requiredPhotos && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card bg-slate-950/90 border border-amber-400/40 p-6 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white font-serif">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Tinjau Foto & Pilih Cetak
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Standar cetak 300 DPI 4R (1200 × 1800 px) dengan margin aman printer
                    </p>
                  </div>

                  {/* Copy Selector (1 Lembar / 2 Lembar) */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Jumlah Cetak:</span>
                    <div className="flex bg-slate-900 border border-amber-400/30 p-1 rounded-xl">
                      <button
                        onClick={() => setCopies(1)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                          copies === 1 
                            ? 'bg-amber-400 text-slate-950 shadow-md' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        1 Lembar
                      </button>
                      <button
                        onClick={() => setCopies(2)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                          copies === 2 
                            ? 'bg-amber-400 text-slate-950 shadow-md' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        2 Lembar (Berdua)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                  <button 
                    onClick={() => {
                      setCapturedPhotos([]);
                      setSavedShareData(null);
                    }}
                    className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-2 font-semibold text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Foto Ulang (Retake)
                  </button>

                  <div className="flex gap-3">
                    <button 
                      onClick={downloadLocal}
                      disabled={isProcessing || capturedPhotos.length < requiredPhotos}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-2 font-semibold text-xs disabled:opacity-50"
                      title="Unduh backup langsung ke laptop"
                    >
                      <Download className="w-4 h-4" /> Cadangan File
                    </button>

                    <button 
                      onClick={handlePrintAndSave}
                      disabled={isProcessing || capturedPhotos.length < requiredPhotos}
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:scale-105 text-white transition-all shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center gap-2.5 font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed border border-amber-300/50 cursor-pointer"
                    >
                      {isProcessing ? 'Mengirim ke Printer...' : (
                        <>
                          <Printer className="w-4 h-4 text-amber-200" />
                          <span>Cetak ({copies} Lembar) & Tampilkan QR</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* 300 DPI Canvas Preview */}
                <div className="flex justify-center bg-slate-950/80 p-6 sm:p-8 rounded-2xl overflow-x-auto border border-white/5">
                  <div className="scale-65 md:scale-80 transform origin-top shadow-2xl">
                    <TemplateRenderer 
                      ref={templateRef} 
                      templateId={selectedTemplateId} 
                      images={capturedPhotos} 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="glass-card bg-slate-950/80 border border-amber-400/30 p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-2 mb-6 text-base font-bold border-b border-white/10 pb-4 text-amber-200">
              <Layout className="w-5 h-5 text-amber-400" />
              Pilih Frame HMTI Fair 2026
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {Object.values(TEMPLATES).map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplateId(template.id);
                    setCapturedPhotos([]);
                    setSavedShareData(null);
                  }}
                  className={`py-3.5 px-4 rounded-2xl border text-sm font-bold transition-all text-left flex flex-col gap-1 ${
                    selectedTemplateId === template.id 
                      ? 'bg-gradient-to-r from-purple-900/80 to-slate-900 border-amber-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.25)]' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-serif tracking-wide">{template.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black">
                      {template.photosRequired} Pose
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm font-bold border-t border-white/10 pt-6 text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Preset Warna
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {filterPresets.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => setFilters(preset.values)}
                  className="py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-400/20 hover:border-amber-400/40 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm font-bold border-t border-white/10 pt-6 text-amber-200">
              <Sliders className="w-4 h-4 text-amber-400" />
              Penyesuaian Pencahayaan
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-[11px] font-bold text-slate-400 mb-1.5 uppercase">
                  <span>Kecerahan (Brightness)</span>
                  <span className="text-amber-300">{filters.brightness}%</span>
                </label>
                <input 
                  type="range" min="50" max="150" 
                  value={filters.brightness} 
                  onChange={(e) => setFilters({...filters, brightness: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
              <div>
                <label className="flex justify-between text-[11px] font-bold text-slate-400 mb-1.5 uppercase">
                  <span>Kontras</span>
                  <span className="text-amber-300">{filters.contrast}%</span>
                </label>
                <input 
                  type="range" min="50" max="150" 
                  value={filters.contrast} 
                  onChange={(e) => setFilters({...filters, contrast: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Countdown timer picker */}
          <div className="glass-card bg-slate-950/80 border border-white/10 p-5 rounded-3xl">
            <label className="block text-xs font-bold text-amber-300 mb-2.5 uppercase tracking-wider">
              Jeda Hitung Mundur
            </label>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              {[3, 5, 7].map(val => (
                <button
                  key={val}
                  onClick={() => setCountdown(val)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${
                    countdown === val 
                      ? 'bg-amber-400 text-slate-950 shadow-md' 
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

      {/* QR Code & Print Success Modal */}
      <AnimatePresence>
        {savedShareData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="glass-card bg-slate-950 border-2 border-amber-400/60 p-6 sm:p-8 rounded-3xl max-w-2xl w-full shadow-[0_0_80px_rgba(251,191,36,0.35)] relative overflow-hidden"
            >
              {/* Radial Glow */}
              <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={() => setSavedShareData(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                  <Printer className="w-3.5 h-3.5 text-amber-400" /> Sedang Mencetak ({savedShareData.copies} Lembar)
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">
                  Silakan Ambil Foto di Meja Operator!
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  Sambil menunggu cetak fisik keluar, scan QR Code di bawah dengan kamera HP untuk mengunduh soft-copy resolusi penuh langsung ke galeri.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* QR Code Container */}
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-2xl shadow-2xl border-4 border-amber-400/60">
                    <QRCodeSVG
                      value={savedShareData.shareUrl}
                      size={190}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 mt-3 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-amber-400" /> Arahkan Kamera HP ke QR Code
                  </span>
                </div>

                {/* Details & Actions */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Tautan Akses Digital</label>
                    <div className="flex items-center gap-2 bg-slate-900 border border-white/15 rounded-xl p-1.5 pl-3">
                      <span className="text-xs text-slate-300 truncate select-all">{savedShareData.shareUrl}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(savedShareData.shareUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>

                  {/* Auto-reset bar */}
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>
                        {pauseAutoReset 
                          ? 'Auto-reset dijeda' 
                          : `Reset otomatis dalam ${autoResetTimer || 0} detik...`}
                      </span>
                    </div>
                    <button
                      onClick={() => setPauseAutoReset(prev => !prev)}
                      className="text-[11px] font-bold text-amber-300 hover:underline"
                    >
                      {pauseAutoReset ? 'Lanjutkan' : 'Jeda Timer'}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-1">
                    <a
                      href={savedShareData.shareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Buka Foto di Tab Baru
                    </a>

                    <button
                      onClick={() => {
                        setSavedShareData(null);
                        setCapturedPhotos([]);
                        setAutoResetTimer(null);
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-500 hover:scale-[1.02] text-white text-xs font-black transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
                    >
                      <Camera className="w-4 h-4 text-amber-200" /> Selesai / Antrean Berikutnya
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Photobooth;
