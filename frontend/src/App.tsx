import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Photobooth from './pages/Photobooth';
import Gallery from './pages/Gallery';
import SharedPhoto from './pages/SharedPhoto';
import Templates from './pages/Templates';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen font-sans selection:bg-brand-500/30">
        <div className="aurora-bg"></div>
        <div className="aurora-blob pointer-events-none text-purple-600/30 w-[50vw] h-[50vw] top-[-10%] left-[-10%]"></div>
        <div className="aurora-blob pointer-events-none text-blue-600/20 w-[60vw] h-[60vw] bottom-[-20%] right-[-10%]"></div>
        <div className="aurora-blob pointer-events-none text-pink-600/20 w-[40vw] h-[40vw] top-[30%] left-[40%]"></div>

        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 pt-28 pb-8 sm:pb-12 relative z-10 max-w-6xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/share/:token" element={<SharedPhoto />} />
            <Route 
              path="/booth" 
              element={
                <ProtectedRoute>
                  <Photobooth />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gallery" 
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
