import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { Camera, Download, AlertCircle, Share2, Sparkles } from 'lucide-react';

interface SharedPhotoData {
  photo: {
    id: string;
    image_url: string;
    created_at: string;
  };
  user: {
    name: string;
  };
}

const SharedPhoto = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<SharedPhotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSharedPhoto = async () => {
      try {
        const response = await api.get(`/shared/${token}`);
        setData(response.data);
      } catch (err) {
        console.error('Failed to load shared photo', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSharedPhoto();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        <p className="text-slate-400 text-xs font-medium">Mengambil foto dari stan booth...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        <div className="surface-card p-10 rounded-3xl text-center max-w-md border border-white/10">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-1 font-serif">Foto Tidak Ditemukan</h2>
          <p className="text-slate-400 text-xs mb-6">Tautan ini mungkin sudah kadaluarsa atau foto telah dihapus.</p>
          <Link to="/" className="btn-tactile inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-5 py-2.5 rounded-full text-xs font-bold">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!data?.photo.image_url) return;
    try {
      const response = await fetch(data.photo.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hmti-fair-photo-${data.photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(data.photo.image_url, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Foto Resmi HMTI Fair 2026',
          text: 'Lihat hasil fotoku di photobooth HMTI Fair 2026 Pollux Mall Batam!',
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan foto berhasil disalin!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        <Link to="/" className="flex items-center gap-2 text-white font-serif font-bold text-lg">
          <img 
            src="/hmti_assets/5. LOGO HMTI, POLIBATAM, FAIR/Salinan HMTI.png" 
            alt="HMTI Logo" 
            className="w-5 h-5 object-contain" 
          />
          <span>HMTI Fair 2026 Photobooth</span>
        </Link>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-semibold border border-amber-400/30">
          Soft-Copy Digital
        </span>
      </div>
      
      {/* Photo Showcase Card */}
      <div className="surface-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diambil di Pollux Mall Batam Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-serif">
              Hasil Cetak Photobooth
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(data.photo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="btn-tactile px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Bagikan</span>
            </button>

            <button 
              type="button"
              onClick={handleDownload}
              className="btn-tactile px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Resolusi Penuh</span>
            </button>
          </div>
        </div>
        
        {/* Full Resolution Photo Viewer */}
        <div className="rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex justify-center p-4 sm:p-6">
          <img 
            src={data.photo.image_url} 
            alt="Hasil Foto HMTI Fair" 
            className="max-h-[75vh] object-contain rounded-xl shadow-2xl"
          />
        </div>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Terima kasih telah berkunjung ke stan HMTI Fair 2026!</span>
          <Link to="/booth" className="text-amber-400 hover:underline font-semibold flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" /> Ambil Foto Lagi
          </Link>
        </div>
      </div>

    </div>
  );
};

export default SharedPhoto;
