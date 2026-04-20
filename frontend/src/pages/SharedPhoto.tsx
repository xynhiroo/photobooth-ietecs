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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30 flex flex-col items-center p-4 sm:p-8">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
        <Camera className="w-6 h-6 text-blue-400" />
        PhotoMagic
      </Link>
      
      <div className="glass p-4 sm:p-6 rounded-2xl w-full max-w-4xl mx-auto shadow-2xl animate-fade-in">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Captured by {data.user.name}</h2>
            <p className="text-sm text-slate-400">{new Date(data.photo.created_at).toLocaleDateString()}</p>
          </div>
          <a 
            href={data.photo.image_url}
            download={`photomagic-shared-${data.photo.id}.jpg`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download High-Res</span>
          </a>
        </div>
        
        <div className="rounded-xl overflow-hidden bg-black border border-slate-700/50 flex justify-center">
          <img 
            src={data.photo.image_url} 
            alt="Shared capture" 
            className="max-h-[70vh] object-contain"
          />
        </div>
      </div>
      
      <div className="mt-12 text-center text-slate-400">
        <p>Want to create your own magic moments?</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium mt-2 inline-block">
          Try PhotoMagic for free
        </Link>
      </div>
    </div>
  );
};

export default SharedPhoto;
