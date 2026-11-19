import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { Camera, Download, AlertCircle } from 'lucide-react';

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
    return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="glass p-12 rounded-2xl text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Photo Not Found</h2>
          <p className="text-slate-400 mb-8">This link may be invalid or the photo has been removed.</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium transition-colors">
            Go Home
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
      // Fallback
      window.open(data.photo.image_url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-brand-500/30 flex flex-col items-center p-4 sm:p-8">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-8">
        <Camera className="w-6 h-6 text-pink-400" />
        HMTI Fair Photobooth
      </Link>
      
      <div className="glass-card bg-slate-900/90 border border-white/10 p-4 sm:p-6 rounded-2xl w-full max-w-4xl mx-auto shadow-2xl">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              ✨ Foto Booth Resmi
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Diambil oleh {data.user.name}</h2>
            <p className="text-sm text-slate-400">{new Date(data.photo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/25 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Resolusi Penuh</span>
          </button>
        </div>
        
        <div className="rounded-xl overflow-hidden bg-black/60 border border-slate-700/50 flex justify-center p-4">
          <img 
            src={data.photo.image_url} 
            alt="HMTI Fair Photobooth Capture" 
            className="max-h-[75vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>
      
      <div className="mt-8 text-center text-slate-400 text-sm">
        <p>Terima kasih telah berkunjung ke booth HMTI Fair!</p>
      </div>
    </div>
  );
};

export default SharedPhoto;
