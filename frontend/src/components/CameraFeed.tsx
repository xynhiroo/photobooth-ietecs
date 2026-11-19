import { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { 
  Camera, 
  SwitchCamera, 
  FlipHorizontal, 
  Check, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  StopCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEffects } from '../utils/audioEffects';

interface CameraFeedProps {
  filters: {
    brightness: number;
    contrast: number;
    sepia: number;
    grayscale: number;
  };
  onCapture: (image: string) => void;
  countdown: number;
  requiredPhotos?: number;
  currentPhotosCount?: number;
}

const POSE_PROMPTS = [
  'Pose 1: Tunjukkan Kristal Terkuatmu! 💎',
  'Pose 2: Gaya Bebas & Santuy bareng Bestie! 😎',
  'Pose 3: Senyum Manis Pesona HMTI! ✨',
  'Pose 4: Gaya Juara Rise Beyond Infinity! 🚀',
];

const CameraFeed = ({ 
  filters, 
  onCapture, 
  countdown, 
  requiredPhotos = 3, 
  currentPhotosCount = 0 
}: CameraFeedProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isMirrored, setIsMirrored] = useState(true);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [isCapturingSequence, setIsCapturingSequence] = useState(false);
  const [currentCountdown, setCurrentCountdown] = useState<number | null>(null);
  const [posePrompt, setPosePrompt] = useState<string>('');
  const [flash, setFlash] = useState(false);
  const abortSequenceRef = useRef(false);

  // Enumerate video devices
  const updateDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter(d => d.kind === 'videoinput');
      setDevices(videoInputs);

      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.error('Failed to enumerate media devices:', err);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    updateDevices();
  }, [updateDevices]);

  const handleUserMedia = useCallback(() => {
    updateDevices();
  }, [updateDevices]);

  const filterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`
  };

  const captureSingle = useCallback(() => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      if (!video) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Apply CSS filters to canvas
      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`;

      // Mirror horizontally if mirroring is on
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageSrc = canvas.toDataURL('image/jpeg', 0.95);
      onCapture(imageSrc);
    }
  }, [filters, isMirrored, onCapture]);

  // Automated Multi-Shot Sequence
  const runSequence = async () => {
    if (isCapturingSequence) return;
    setIsCapturingSequence(true);
    abortSequenceRef.current = false;

    const totalToTake = requiredPhotos;
    let taken = currentPhotosCount;

    while (taken < totalToTake && !abortSequenceRef.current) {
      const currentPoseIndex = taken % POSE_PROMPTS.length;
      setPosePrompt(POSE_PROMPTS[currentPoseIndex]);

      // Buffer time for changing poses if not first shot
      if (taken > currentPhotosCount) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      if (abortSequenceRef.current) break;

      // Countdown
      const countTime = countdown > 0 ? countdown : 3;
      for (let c = countTime; c > 0; c--) {
        if (abortSequenceRef.current) break;
        setCurrentCountdown(c);
        if (soundEnabled) {
          if (c === 1) {
            soundEffects.playFinalCountdownBeep();
          } else {
            soundEffects.playCountdownBeep();
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (abortSequenceRef.current) break;

      // Flash & Mechanical Shutter Sound
      setCurrentCountdown(null);
      setFlash(true);
      if (soundEnabled) {
        soundEffects.playShutterSound();
      }

      captureSingle();
      taken++;

      await new Promise(resolve => setTimeout(resolve, 200));
      setFlash(false);

      // Brief pause between shots
      if (taken < totalToTake && !abortSequenceRef.current) {
        setPosePrompt('Bagus! Bersiap untuk pose berikutnya...');
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
    }

    setPosePrompt('');
    setCurrentCountdown(null);
    setIsCapturingSequence(false);
  };

  const cancelSequence = () => {
    abortSequenceRef.current = true;
    setIsCapturingSequence(false);
    setCurrentCountdown(null);
    setPosePrompt('');
  };

  const currentDeviceLabel = devices.find(d => d.deviceId === selectedDeviceId)?.label 
    || (devices.length > 0 ? 'Kamera Utama' : 'Default Camera');

  const videoConstraints: MediaTrackConstraints = selectedDeviceId
    ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
    : { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } };

  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-[4/3] w-full max-w-4xl mx-auto border-4 border-amber-400/30 shadow-[0_0_60px_rgba(46,16,101,0.7)] group select-none">
      
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={handleUserMedia}
        className="w-full h-full object-cover"
        style={filterStyle}
        mirrored={isMirrored}
      />

      {/* Stained Glass Corner Brackets */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-amber-400/70 rounded-tl-xl pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-amber-400/70 rounded-tr-xl pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-amber-400/70 rounded-bl-xl pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-amber-400/70 rounded-br-xl pointer-events-none"></div>

      {/* Top Header Overlay: Device Switcher, Mirror Toggle & Sound */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30 pointer-events-auto">
        {/* Device Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDeviceMenu(!showDeviceMenu)}
            disabled={isCapturingSequence}
            className="flex items-center gap-2 bg-slate-950/85 hover:bg-slate-900 text-white/90 hover:text-white px-3.5 py-2 rounded-xl backdrop-blur-md border border-amber-400/30 text-xs font-semibold shadow-xl transition-all disabled:opacity-50"
            title="Pilih Kamera"
          >
            <SwitchCamera className="w-4 h-4 text-amber-400" />
            <span className="max-w-[140px] sm:max-w-[200px] truncate">{currentDeviceLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${showDeviceMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showDeviceMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-64 bg-slate-950/95 backdrop-blur-xl border border-amber-400/40 rounded-xl p-1.5 shadow-2xl z-40 space-y-1"
              >
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Sumber Kamera ({devices.length})
                </div>
                {devices.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-400">Tidak ada kamera terdeteksi</div>
                ) : (
                  devices.map((device, idx) => (
                    <button
                      key={device.deviceId || idx}
                      type="button"
                      onClick={() => {
                        setSelectedDeviceId(device.deviceId);
                        setShowDeviceMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                        selectedDeviceId === device.deviceId
                          ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-2">{device.label || `Kamera ${idx + 1}`}</span>
                      {selectedDeviceId === device.deviceId && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side toggles: Sound & Mirror */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(prev => !prev)}
            className={`flex items-center justify-center w-9 h-9 rounded-xl backdrop-blur-md border text-xs transition-all shadow-lg ${
              soundEnabled 
                ? 'bg-amber-400/20 border-amber-400/40 text-amber-300' 
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Efek Suara Aktif' : 'Efek Suara Dibisukan'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mirror Toggle */}
          <button
            type="button"
            onClick={() => setIsMirrored(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-semibold transition-all shadow-lg ${
              isMirrored 
                ? 'bg-purple-600/30 border-purple-400/50 text-white' 
                : 'bg-slate-950/80 hover:bg-slate-900 border-white/15 text-slate-300 hover:text-white'
            }`}
            title={isMirrored ? 'Cermin Aktif' : 'Cermin Nonaktif'}
          >
            <FlipHorizontal className={`w-4 h-4 ${isMirrored ? 'text-purple-300' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isMirrored ? 'Mirror On' : 'Mirror Off'}</span>
          </button>
        </div>
      </div>

      {/* White flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-white pointer-events-none z-30"
          />
        )}
      </AnimatePresence>

      {/* Pose Prompt Banner */}
      <AnimatePresence>
        {posePrompt && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-6 right-6 flex justify-center z-25 pointer-events-none"
          >
            <div className="bg-slate-950/90 border-2 border-amber-400/60 text-amber-200 px-6 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md font-bold text-center text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{posePrompt}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown overlay */}
      <AnimatePresence mode="wait">
        {currentCountdown !== null && (
          <motion.div 
            key={currentCountdown}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none"
          >
            <div className="w-48 h-48 rounded-full bg-slate-950/60 border-4 border-amber-400/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_80px_rgba(251,191,36,0.6)]">
              <span className="text-[7.5rem] font-black text-amber-300 leading-none drop-shadow-[0_0_30px_rgba(251,191,36,0.9)]">
                {currentCountdown}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-20">
        {!isCapturingSequence ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runSequence}
            className="flex items-center gap-3 px-8 py-4 rounded-full font-black text-white transition-all border-2 border-amber-300 bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 shadow-[0_0_35px_rgba(251,191,36,0.5)] cursor-pointer"
            title="Mulai Sesi Otomatis"
          >
            <Camera className="w-6 h-6 text-amber-300" />
            <span className="tracking-wide">
              {requiredPhotos > 1 ? `MULAI SESI (${requiredPhotos} FOTO)` : 'AMBIL FOTO'}
            </span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={cancelSequence}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-red-600/90 border-2 border-red-400 backdrop-blur-md shadow-xl cursor-pointer"
            title="Batalkan Sesi"
          >
            <StopCircle className="w-5 h-5" />
            <span>Batalkan</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CameraFeed;
