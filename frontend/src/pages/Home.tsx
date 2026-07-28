import { Link } from 'react-router-dom';
import { Camera, Sliders, Share2, Sparkles, Star, Users, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  return (
    <div className="flex flex-col gap-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center pt-20">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -top-20 -z-10 w-[600px] h-[600px] bg-brand-500/5 rounded-full"
          style={{ boxShadow: '0 0 150px 80px rgba(139, 92, 246, 0.15)' }}
        />
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl px-4 flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-brand-500/30 text-brand-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>The Next Generation Digital Photobooth</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6 relative z-10">
            Capture Magic Moments <br/>
            <span className="text-brand-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">
              Anywhere, Anytime.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Abadikan momen seru bersama teman dengan photobooth digital yang keren, praktis, dan modern. Tidak perlu alat mahal, cukup gunakan browser Anda.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="/register" 
              className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-1"
            >
              <Camera className="w-5 h-5" />
              Mulai Sekarang Gratis
            </Link>
            <a 
              href="#features" 
              className="flex items-center justify-center gap-2 glass hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Pelajari Lebih Lanjut
            </a>
          </motion.div>
        </motion.div>

        {/* Floating Mockups (Decorative) */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-20 relative w-full max-w-5xl"
        >
          <div className="glass-card p-4 mx-auto w-[90%] md:w-[80%] aspect-[16/9] relative rotate-2 shadow-2xl border-white/20">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
               {/* Abstract placeholder for camera view */}
               <div className="absolute inset-0 aurora-bg opacity-50"></div>
               <Camera className="w-24 h-24 text-white/20" />
               
               {/* Floating photo strips */}
               <motion.div 
                 animate={{ y: [-10, 10, -10], rotate: [-5, -2, -5] }}
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                 className="absolute -right-10 top-10 w-32 bg-white p-2 pb-6 rounded shadow-2xl flex flex-col gap-2"
               >
                 <div className="aspect-[4/3] w-full bg-gradient-to-tr from-orange-400 to-pink-500 rounded-sm"></div>
                 <div className="aspect-[4/3] w-full bg-gradient-to-tr from-brand-400 to-blue-500 rounded-sm"></div>
                 <div className="aspect-[4/3] w-full bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-sm"></div>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="glass-card p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 via-pink-500/10 to-blue-600/10 mix-blend-overlay"></div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-2">2k+</h3>
            <p className="text-slate-400 font-medium">Total Pengguna</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.2 }}>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-2">100k+</h3>
            <p className="text-slate-400 font-medium">Foto Diambil</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.4 }}>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center justify-center gap-2">
              4.9 <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </h3>
            <p className="text-slate-400 font-medium">Rating Pengguna</p>
          </motion.div>
        </div>
      </section>

      {/* How it Works / Features */}
      <section id="features" className="container mx-auto px-4 max-w-6xl pt-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Cara Kerja Semudah Kilat</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Buat memori tak terlupakan hanya dalam 4 langkah sederhana. Tidak perlu instalasi aplikasi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ImageIcon, title: 'Buka Booth', desc: 'Akses photobooth langsung dari browser hp atau laptopmu.' },
            { icon: Camera, title: 'Ambil Momen', desc: 'Gunakan fitur burst shot dan timer untuk pose terbaikmu.' },
            { icon: Sliders, title: 'Edit & Filter', desc: 'Sesuaikan brightness, kontras, dan warna secara real-time.' },
            { icon: Share2, title: 'Unduh & Bagikan', desc: 'Simpan ke galeri atau bagikan link publik ke teman-temanmu.' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass p-8 rounded-3xl hover:bg-white/10 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <feature.icon className="w-32 h-32" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-20 relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-3xl -z-10"></div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Kata Pengguna Kami</h2>
        </div>
        
        <div className="flex gap-6 overflow-hidden relative w-full">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex gap-6 w-max px-6"
          >
            {[1, 2].map((set) => (
              <div key={set} className="flex gap-6">
                {[
                  { name: "Raka", text: "Gila sih hasilnya rapi bener dan sat-set banget prosesnya. Temen-temen langsung paham pakenya." },
                  { name: "Melati", text: "Gampang banget dicocokin sama tema acara. Tampilan booth langsung naik kelas jadi kelihatan premium." },
                  { name: "Gilang", text: "Paling demen sama hasil export-nya, bersih dan tajam parah! Bisa langsung dibagikan detik itu juga." },
                  { name: "Indah", text: "Stabil banget dipake berjam-jam padahal acaranya lagi rame-ramenya. Aman banget!" },
                  { name: "Fajar", text: "Jujur dari sisi owner, dashboard-nya enak banget dipantau. Bener-bener motong waktu banyak banget." }
                ].map((testimonial, i) => (
                  <div key={i} className="glass-card w-[350px] p-6 flex flex-col justify-between shrink-0 hover:-translate-y-1 transition-transform cursor-pointer">
                    <div>
                      <div className="flex items-center gap-1 mb-4 text-brand-400">
                        {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-slate-300 italic mb-6">"{testimonial.text}"</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-white/20">
                        <Users className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                        <p className="text-sm text-brand-400">@{testimonial.name.toLowerCase()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 max-w-4xl text-center pb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-pink-600/20"></div>
          <div className="absolute w-[500px] h-[500px] rounded-full -top-50 -right-50" style={{ boxShadow: '0 0 150px 100px rgba(139, 92, 246, 0.2)' }}></div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10 text-white">Siap membuat memori <br/>tak terlupakan?</h2>
          <p className="text-xl text-slate-300 mb-10 relative z-10 max-w-xl mx-auto">
            Bergabunglah dengan ribuan pengguna lainnya dan buat photobooth impianmu hari ini.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition-all hover:scale-105 relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Buat Akun Gratis
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
