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
      <div className="min-h-screen font-sans bg-[#07090e] patri-pattern-bg text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 sm:px-6 pt-24 pb-12 max-w-6xl">
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
