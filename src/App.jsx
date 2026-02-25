import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, MapPin, Building2, Users, ArrowRight, Globe, Maximize2 } from 'lucide-react';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200";
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'Footprint', href: '#map' },
    { name: 'Acquisition', href: '#land' },
  ];

  const projects = [
    {
      id: 1,
      name: '321 MLK Jr Way S',
      location: 'Seattle, WA 98144',
      status: 'Completed (2023)',
      type: 'Modern Townhouse',
      description: 'A flagship development in South Seattle, designed for modern urban professionals. This project emphasizes vertical living with massive floor-to-ceiling windows and premium rooftop spaces. The interior flow is optimized for natural light and contemporary art displays.',
      highlights: ['Lake Washington Views', 'Rooftop Entertaining', 'Modern Aesthetic', 'Eco-friendly Siding'],
      mapPos: { top: '65%', left: '42%' },
      image: '321 MLK JR Way S.jpg',
      gallery: ['321 MLK JR Way S.jpg', '321 MLK JR Way S 2.jpg']
    },
    {
      id: 2,
      name: 'Bellevue Heights',
      location: 'Bellevue, WA',
      status: 'Active Development',
      type: 'Luxury Estate',
      description: 'An upcoming luxury single-family residence featuring high-end smart home technology and custom artisanal masonry.',
      highlights: ['Smart Home System', 'Bespoke Masonry', 'Privacy Landscaping'],
      mapPos: { top: '45%', left: '55%' },
      image: 'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 3,
      name: 'Kirkland Waterfront',
      location: 'Kirkland, WA',
      status: 'Pipeline',
      type: 'Boutique Multi-Family',
      description: 'Concept phase for a high-density, high-design multi-family project near the Kirkland waterfront.',
      highlights: ['Walkable District', 'Sustainable Design', 'Community Garden'],
      mapPos: { top: '30%', left: '48%' },
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  return (
    <div className={`min-h-screen bg-white font-sans text-slate-900 antialiased tracking-tight ${selectedProject ? 'overflow-hidden' : ''}`}>
      
      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-md transition-all duration-500">
          <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-y-auto relative rounded-sm shadow-2xl">
            <button 
              onClick={() => setSelectedProject(null)}
              className="fixed top-10 right-10 z-[110] p-4 bg-white/90 hover:bg-white rounded-full transition-all shadow-2xl border border-slate-100"
            >
              <X size={28} />
            </button>

            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-3/5 bg-slate-50 p-6 lg:p-16 space-y-10">
                <div className="aspect-[16/10] w-full overflow-hidden shadow-2xl border border-white">
                   <img src={selectedProject.image} className="w-full h-full object-cover" alt={selectedProject.name} onError={handleImageError} />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {selectedProject.gallery?.map((img, idx) => (
                    <div key={idx} className="aspect-square overflow-hidden shadow-lg hover:scale-105 transition-transform duration-700 bg-slate-200">
                      <img src={img} className="w-full h-full object-cover" alt={`Angle ${idx + 1}`} onError={handleImageError} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-2/5 p-8 lg:p-24 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-[0.5em] text-slate-400 block mb-8 font-bold">{selectedProject.status}</span>
                <h2 className="text-6xl font-light mb-8 tracking-tighter leading-tight">{selectedProject.name}</h2>
                <div className="flex items-center text-slate-500 text-[10px] mb-12 tracking-[0.3em] uppercase font-bold">
                  <MapPin size={16} className="mr-3 text-slate-300" /> {selectedProject.location}
                </div>
                <div className="w-16 h-px bg-slate-200 mb-12"></div>
                <p className="text-slate-600 leading-relaxed font-light mb-16 text-xl">{selectedProject.description}</p>
                <div className="grid grid-cols-1 gap-y-6 mb-20">
                  {selectedProject.highlights?.map((tag, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-slate-600 font-bold">{tag}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-8 bg-slate-900 text-white uppercase tracking-[0.4em] text-[10px] font-black hover:bg-black transition-all shadow-2xl">
                  Inquire Now <ArrowRight className="inline-block ml-4" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 py-6 md:px-16 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-5' : 'bg-transparent text-white'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <svg width="45" height="35" viewBox="0 0 40 30" fill="none" className={isScrolled ? 'stroke-black' : 'stroke-white'}>
              <path d="M2 28V18L12 12V2L22 8V20L38 24V28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col -space-y-1 text-left">
              <span className="text-[10px] uppercase tracking-[0.5em] font-light">Homes</span>
              <span className="text-2xl font-bold tracking-tighter uppercase leading-none">Westwood</span>
            </div>
          </div>

          <div className="hidden md:flex space-x-12 items-center">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className={`text-[10px] uppercase tracking-[0.4em] font-black hover:opacity-40 transition-all ${isScrolled ? 'text-slate-900' : 'text-white'}`}>{item.name}</a>
            ))}
            <button className={`px-10 py-3.5 border-2 text-[10px] uppercase tracking-[0.4em] font-black transition-all ${isScrolled ? 'border-black bg-black text-white hover:bg-transparent hover:text-black' : 'border-white hover:bg-white hover:text-black'}`}>Contact</button>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-60">
          <img src="321 MLK JR Way S.jpg" className="w-full h-full object-cover scale-105" alt="Westwood Architecture" onError={handleImageError} />
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
          <span className="text-white/50 text-[10px] uppercase tracking-[1em] mb-10 font-bold">Pacific Northwest Premier Developer</span>
          <h1 className="text-6xl md:text-[10rem] text-white font-light tracking-tighter mb-16 max-w-7xl leading-[0.8]">
            Designed <br/>with Vision.
          </h1>
          <div className="flex flex-col md:flex-row gap-10">
            <a href="#portfolio" className="px-16 py-7 bg-white text-black uppercase tracking-[0.5em] text-[11px] font-black hover:bg-slate-200 transition-all shadow-2xl">View Collection</a>
            <a href="#land" className="px-16 py-7 bg-transparent border-2 border-white/40 text-white uppercase tracking-[0.5em] text-[11px] font-black hover:bg-white hover:text-black transition-all">Land Acquisition</a>
          </div>
        </div>
      </section>

      {/* Footprint Section */}
      <section id="map" className="py-40 px-6 md:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto text-left">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 text-left">
            <div className="max-w-3xl">
              <span className="text-[10px] uppercase tracking-[0.6em] text-slate-400 block mb-8 font-black underline underline-offset-[12px]">Regional Presence</span>
              <h2 className="text-7xl font-light tracking-tighter mb-10 leading-none">Market Footprint</h2>
              <p className="text-slate-500 text-xl font-light leading-relaxed">Concentrated expertise in high-yield corridors. Every point represents a strategic commitment to architectural excellence and investor transparency.</p>
            </div>
          </div>
          <div className="relative aspect-[21/9] w-full bg-white rounded-sm overflow-hidden border border-slate-200 shadow-2xl">
            {projects.map((proj) => (
              <div 
                key={proj.id} 
                className="absolute transition-all duration-700 cursor-pointer z-20 group/pin"
                style={{ top: proj.mapPos.top, left: proj.mapPos.left }}
                onClick={() => setSelectedProject(proj)}
              >
                <div className="w-6 h-6 bg-slate-900 rounded-full absolute -inset-0 animate-ping opacity-10"></div>
                <div className="w-6 h-6 bg-slate-900 rounded-full relative z-10 border-[6px] border-white shadow-2xl group-hover/pin:scale-125 transition-transform duration-500"></div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 bg-white px-8 py-5 shadow-3xl border border-slate-100 opacity-0 group-hover/pin:opacity-100 transition-all translate-y-4 group-hover/pin:translate-y-0 whitespace-nowrap z-30">
                  <span className="text-[12px] uppercase tracking-[0.4em] font-black block mb-2">{proj.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">{proj.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-40 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto text-left">
          <div className="flex justify-between items-end mb-32 border-b border-slate-100 pb-20">
            <div>
              <span className="text-[10px] uppercase tracking-[0.6em] text-slate-400 block mb-8 font-black">Curated Collection</span>
              <h2 className="text-8xl font-light tracking-tighter leading-none">The Portfolio</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-20 text-left">
            {projects.map((proj) => (
              <div key={proj.id} className="group cursor-pointer" onClick={() => setSelectedProject(proj)}>
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 mb-12">
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-1000 z-10 flex items-center justify-center">
                      <span className="px-8 py-4 bg-white text-black text-[11px] uppercase tracking-[0.5em] font-black opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-10 group-hover:translate-y-0">View Project</span>
                  </div>
                  <img src={proj.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" alt={proj.name} onError={handleImageError} />
                </div>
                <div className="space-y-6">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-slate-400 block font-bold">{proj.type}</span>
                  <h3 className="text-4xl font-light tracking-tight group-hover:text-slate-500 transition-colors leading-tight">{proj.name}</h3>
                  <div className="flex items-center text-slate-400 text-[11px] pt-6 uppercase tracking-[0.3em] font-bold"><MapPin size={14} className="mr-4 text-slate-300" /> {proj.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Land Acquisition Section */}
      <section id="land" className="py-48 px-6 md:px-16 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <span className="text-white/40 text-[10px] uppercase tracking-[1em] mb-12 block font-bold text-center">Capital & Acquisitions</span>
          <h2 className="text-6xl md:text-[8rem] font-light mb-16 tracking-tighter leading-[0.85] text-center">Unlock Your <br/>Land Value.</h2>
          <p className="text-white/50 text-2xl mb-24 max-w-3xl mx-auto font-light leading-relaxed text-center">We specialize in turning raw land and underutilized properties into high-performance residential assets. Partner with Westwood for transparent, data-driven execution.</p>
          <button className="px-20 py-8 bg-white text-black uppercase tracking-[0.5em] text-[12px] font-black hover:bg-slate-200 transition-all shadow-3xl mx-auto block">Request Feasibility Study</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-6 md:px-16 bg-white border-t border-slate-100 text-left">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-bold tracking-tighter uppercase mb-12 flex items-center gap-6">
               <svg width="40" height="30" viewBox="0 0 40 30" fill="none" className="stroke-black"><path d="M2 28V18L12 12V2L22 8V20L38 24V28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
               Westwood
            </div>
            <p className="text-slate-400 text-xs leading-[2.5] uppercase tracking-[0.3em] font-bold max-w-md">Boutique Residential Development. <br/>Strategic Acquisitions. <br/>Visionary Capital Partnerships.</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.6em] font-black text-slate-300 mb-12">Navigation</h4>
            <ul className="space-y-6 text-[11px] font-black tracking-[0.4em] uppercase">
              {navItems.map(item => <li key={item.name}><a href={item.href} className="hover:opacity-30 transition-all">{item.name}</a></li>)}
            </ul>
          </div>
          <div>
             <h4 className="text-[10px] uppercase tracking-[0.6em] font-black text-slate-300 mb-12">Headquarters</h4>
             <div className="text-[11px] font-bold tracking-[0.4em] uppercase space-y-8 leading-loose">
                <p className="text-slate-500">Bellevue, WA 98004 <br/>United States</p>
                <p className="border-b-2 border-slate-900 pb-2 inline-block">inquiries@westwood.com</p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
