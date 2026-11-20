import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { Share2, Download, Copy, Check, Image as ImageIcon, Trash2, X, Camera } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface Photo {
  id: string;
  image_url: string;
  filters_used: string[];
  share_token: string | null;
  created_at: string;
}

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
      alert('Gagal membuat tautan bagikan.');
    }
  };

  const downloadPhoto = async (photo: Photo) => {
    try {
      const response = await fetch(photo.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hmti-fair-photo-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download photo', error);
      alert('Gagal mengunduh foto.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus foto ini dari galeri booth?')) return;
    try {
      await api.delete(`/photos/${id}`);
      setPhotos(photos.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete photo', error);
      alert('Gagal menghapus foto.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        <p className="text-slate-400 text-xs font-medium">Memuat arsip foto...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="surface-card p-12 rounded-3xl text-center max-w-xl mx-auto mt-8 border border-white/10">
        <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-400">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white font-serif">Belum Ada Foto Tersimpan</h2>
        <p className="text-slate-400 mb-6 text-sm">
          Ayo mulai sesi foto pertamamu di studio photobooth HMTI Fair!
        </p>
        <Link 
          to="/booth" 
          className="btn-tactile inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-full text-xs font-bold shadow-md"
        >
          <Camera className="w-4 h-4 text-slate-950" />
          <span>Buka Studio Booth</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
            Arsip Booth Resmi
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white font-serif mt-0.5">
            Galeri Hasil Foto
          </h1>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Total Foto: <strong className="text-white">{photos.length} Lembar</strong>
        </div>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {photos.map((photo) => (
          <div key={photo.id} className="surface-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between">
            <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
              <img 
                src={photo.image_url} 
                alt={`Capture ${photo.id}`} 
                loading="lazy"
                onClick={() => setSelectedPhoto(photo)}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <button 
                  type="button"
                  onClick={() => handleShare(photo.id)}
                  className="btn-tactile w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center border border-white/20 hover:border-amber-400"
                  title="Bagikan Tautan"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                </button>
                <button 
                  type="button"
                  onClick={() => downloadPhoto(photo)}
                  className="btn-tactile w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center border border-white/20 hover:border-amber-400"
                  title="Unduh Foto"
                >
                  <Download className="w-4 h-4 text-white" />
                </button>
                <button 
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  className="btn-tactile w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center border border-white/20 hover:border-red-400"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            
            {/* Share status footer */}
            <div className="p-3 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-400">
              <span>{new Date(photo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
              {photo.share_token && (
                <button 
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/share/${photo.share_token}`);
                    setCopiedLink(photo.id);
                    setTimeout(() => setCopiedLink(null), 2500);
                  }}
                  className="flex items-center gap-1 text-amber-300 hover:text-white font-medium"
                >
                  {copiedLink === photo.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink === photo.id ? 'Tersalin' : 'Salin URL'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div 
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            style={{ overscrollBehavior: 'contain' }}
          >
            <button 
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img 
              onClick={(e) => e.stopPropagation()}
              src={selectedPhoto.image_url} 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/15 shadow-2xl"
              alt="Fullscreen Capture"
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
