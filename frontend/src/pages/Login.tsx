import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';
import { Camera } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      login(response.data.access_token, response.data.user);
      navigate('/booth');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="glass p-8 rounded-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Camera className="w-12 h-12 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors mt-6"
          >
            Log In
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
