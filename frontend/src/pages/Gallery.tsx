import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { Share2, Download, Copy, Check, Sparkles, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface Photo {
  id: string;
  image_url: string;
  filters_used: string[];
  share_token: string | null;
  created_at: string;
}

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await api.get('/photos');
        setPhotos(response.data);
      } catch (error) {
        console.error('Failed to fetch photos', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const handleShare = async (id: string) => {
    try {
      const response = await api.post(`/photos/${id}/share`);
      const newUrl = `${window.location.origin}/share/${response.data.share_token}`;
      
      setPhotos(photos.map(p => p.id === id ? { ...p, share_token: response.data.share_token } : p));
      
      navigator.clipboard.writeText(newUrl);
      setCopiedLink(id);
      setTimeout(() => setCopiedLink(null), 3000);
    } catch (error) {
      console.error('Failed to generate share link', error);
      alert('Failed to generate share link');
    }
  };

  const downloadPhoto = async (photo: Photo) => {
    try {
      const response = await fetch(photo.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ietecs-capture-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download photo', error);
      alert('Failed to download photo. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await api.delete(`/photos/${id}`);
      setPhotos(photos.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete photo', error);
      alert('Failed to delete photo');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-slate-400 animate-pulse font-medium">Loading magic...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 rounded-[2rem] text-center max-w-2xl mx-auto mt-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 to-pink-600/10 mix-blend-overlay"></div>
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <ImageIcon className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-3xl font-black mb-4 text-white">Your Gallery is Empty</h2>
        <p className="text-slate-400 mb-8 text-lg">Head over to the studio to capture your first aurora moment!</p>
        <Link to="/booth" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-brand-500/25 transition-transform hover:scale-105">
          <Sparkles className="w-5 h-5" />
          Enter Studio
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-10"
      >
        <div className="p-3 bg-pink-500/20 rounded-xl">
          <ImageIcon className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Your Magic Moments</h2>
          <p className="text-slate-400">Manage and share your captures</p>
        </div>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {photos.map((photo) => (
          <motion.div variants={itemVariants} key={photo.id} className="glass-card overflow-hidden group relative">
            <div className="relative aspect-[3/4] overflow-hidden group">
              <div 
                className="w-full h-full cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img 
                  src={photo.image_url} 
                  alt={`Capture ${photo.id}`} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-60"
                />
              </div>
              
              {/* Action Overlays */}
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button 
                  onClick={() => handleShare(photo.id)}
                  className="w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-400 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  title="Share Photo"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => downloadPhoto(photo)}
                  className="w-12 h-12 rounded-full bg-white hover:bg-slate-200 text-slate-900 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  title="Download Photo"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(photo.id)}
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  title="Delete Photo"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Share Status Bar */}
            {photo.share_token && (
              <div className="p-3 bg-brand-900/30 flex justify-between items-center text-xs border-t border-brand-500/20">
                <span className="flex items-center gap-1.5 text-brand-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  Shared Publicly
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/share/${photo.share_token}`);
                    setCopiedLink(photo.id);
                    setTimeout(() => setCopiedLink(null), 3000);
                  }}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedLink === photo.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Link
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.img 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              src={selectedPhoto.image_url} 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              alt="Fullscreen Capture"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
