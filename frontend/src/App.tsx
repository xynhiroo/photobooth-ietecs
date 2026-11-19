import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Photobooth from './pages/Photobooth';
import Gallery from './pages/Gallery';
import SharedPhoto from './pages/SharedPhoto';
import Templates from './pages/Templates';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans selection:bg-amber-400/30 text-slate-100">
        <div className="aurora-bg"></div>
        <div className="aurora-blob pointer-events-none text-purple-900/30 w-[50vw] h-[50vw] top-[-10%] left-[-10%]"></div>
        <div className="aurora-blob pointer-events-none text-amber-500/10 w-[60vw] h-[60vw] bottom-[-20%] right-[-10%]"></div>

        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-8 sm:pb-12 relative z-10 max-w-6xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/booth" element={<Photobooth />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/share/:token" element={<SharedPhoto />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
