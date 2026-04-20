import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraFeedProps {
  filters: {
    brightness: number;
    contrast: number;
    sepia: number;
    grayscale: number;
  };
  onCapture: (image: string) => void;
  countdown: number;
  burstCount: number;
}

const CameraFeed = ({ filters, onCapture, countdown, burstCount }: CameraFeedProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentCountdown, setCurrentCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const filterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`
  };

  const captureSingle = useCallback(() => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      if (!video) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Apply the exact same CSS filters to the canvas context
      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%)`;
      
      // Mirror the image on canvas since webcam is mirrored
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageSrc = canvas.toDataURL('image/jpeg', 0.9);
      onCapture(imageSrc);
    }
  }, [filters, onCapture]);

  const handleCaptureClick = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    const takeShots = async () => {
      for (let i = 0; i < burstCount; i++) {
        // Run countdown if needed
        if (countdown > 0) {
          for (let c = countdown; c > 0; c--) {
            setCurrentCountdown(c);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        setCurrentCountdown(null);
        
        // Trigger Flash
        setFlash(true);
        captureSingle();
        
        setTimeout(() => setFlash(false), 150);
        
        if (i < burstCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 800)); // Delay between burst shots
        }
      }
      setIsCapturing(false);
    };

    takeShots();
  };

  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-[4/3] w-full max-w-4xl mx-auto border-4 border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
      
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        className="w-full h-full object-cover"
        style={filterStyle}
        mirrored={true}
      />
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-0 right-0 h-px bg-white"></div>
        <div className="absolute top-2/3 left-0 right-0 h-px bg-white"></div>
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white"></div>
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white"></div>
      </div>

      {/* Camera UI Corners */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/50 pointer-events-none"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/50 pointer-events-none"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/50 pointer-events-none"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/50 pointer-events-none"></div>

      {/* White flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-white pointer-events-none z-20"
          />
        )}
      </AnimatePresence>

      {/* Countdown overlay */}
      <AnimatePresence mode="wait">
        {currentCountdown !== null && (
          <motion.div 
            key={currentCountdown}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          >
            <span className="text-[12rem] font-black text-white/90 drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]">
              {currentCountdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCaptureClick}
          disabled={isCapturing}
          className={`flex items-center justify-center gap-3 w-20 h-20 rounded-full font-bold transition-all border-4 ${
            isCapturing 
              ? 'bg-slate-800/80 border-slate-600 text-slate-400 cursor-not-allowed backdrop-blur-md' 
              : 'bg-white/10 border-white text-white hover:bg-white/20 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.3)]'
          }`}
        >
          {isCapturing ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
        </motion.button>
      </div>
    </div>
  );
};

export default CameraFeed;
