import React, { useState } from 'react';
import { Maximize2, X, Image as ImageIcon, ChevronLeft, ChevronRight, Play, Film } from 'lucide-react';
import { getGalleryImages, getPromoVideo } from '../utils/db';

export default function Gallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todas');

  const galleryImages = getGalleryImages();
  const videoUrl = getPromoVideo();

  const categories = ['Todas', 'Louvor', 'Gincanas'];

  const filteredImages = activeFilter === 'Todas'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

  const openLightbox = (index: number) => {
    setSelectedIdx(index);
    document.body.style.overflow = 'hidden'; // Lock scrolling
  };

  const closeLightbox = () => {
    setSelectedIdx(null);
    document.body.style.overflow = ''; // Unlock scrolling
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null && filteredImages.length > 0) {
      setSelectedIdx((selectedIdx + 1) % filteredImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null && filteredImages.length > 0) {
      setSelectedIdx((selectedIdx - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#081021] relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>Nossa Vivência</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Vídeo Oficial & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300">Momentos Reais</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Sinta a energia, a alegria e a glória de Deus que marcaram nossas edições anteriores através do aftermovie e das fotos.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a1226] shadow-2xl group aspect-video">
            {isPlayingVideo ? (
              <iframe
                src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title="Summer Camp Promo"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <div 
                onClick={() => setIsPlayingVideo(true)}
                className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center group"
              >
                {/* Thumbnail Background */}
                <img
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224574?q=80&w=1200&auto=format&fit=crop"
                  alt="Summer Camp Aftermovie Thumbnail"
                  className="w-full h-full object-cover filter brightness-[0.35] group-hover:scale-102 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Pulsing Play Button */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-orange-600 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 active:scale-95 transition-all duration-300 relative">
                    <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping pointer-events-none" />
                    <Play className="w-8 h-8 md:w-9 md:h-9 fill-current ml-1" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] md:text-xs font-mono font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full">
                      Teaser & Aftermovie
                    </span>
                    <h3 className="text-xl md:text-3xl font-black font-display text-white">
                      Assista ao Vídeo Oficial do Retiro
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm font-sans max-w-md mx-auto">
                      Clique para ver o mover de Deus, as gincanas, o louvor e os testemunhos reais dos jovens.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setSelectedIdx(null); // Close lightbox if filter changes to avoid mismatch
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                activeFilter === cat
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 border-transparent text-white shadow-lg shadow-orange-500/25'
                  : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pinterest-like Masonry Grid Layout */}
        {filteredImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => openLightbox(index)}
                className="break-inside-avoid relative rounded-3xl overflow-hidden group cursor-pointer border border-white/5 bg-[#0a1226] shadow-xl hover:scale-[1.02] hover:border-orange-500/20 transition-all duration-300"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-auto object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay with info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest mb-1.5 bg-orange-500/10 px-2.5 py-1 rounded-full w-fit">
                    {img.category}
                  </span>
                  <h4 className="text-lg font-bold text-white font-display leading-snug">
                    {img.title}
                  </h4>
                  <div className="mt-4 flex items-center space-x-1.5 text-xs text-orange-300 font-bold uppercase tracking-wider">
                    <Maximize2 className="w-4 h-4" />
                    <span>Ampliar</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Nenhuma foto adicionada nesta categoria ainda.</p>
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      {selectedIdx !== null && filteredImages[selectedIdx] && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 p-4"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer z-50"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={prevImage}
            className="absolute left-6 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer z-50"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-6 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer z-50"
            aria-label="Próxima"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Content Area */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredImages[selectedIdx].url}
              alt={filteredImages[selectedIdx].title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
              referrerPolicy="no-referrer"
            />
            
            <div className="mt-4 text-center max-w-2xl px-4">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded-full">
                {filteredImages[selectedIdx].category}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white font-display mt-2">
                {filteredImages[selectedIdx].title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
