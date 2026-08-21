import React, { useState } from 'react';
import { Camera, X, Sparkles, ZoomIn } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/mockData';
import type { GalleryItem } from '../types';
import { FloralLineDivider } from '../components/DevotionalIcons';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Idol', 'Aarti', 'Prasad', 'Cultural', 'Visarjan'];

  const filteredItems = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="bg-[#32070B] text-[#FFF7E8] py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto text-center space-y-8">
        
        {/* Section Title */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F4B942] bg-[#5A0F16]/80 px-4 py-1.5 rounded-full border border-[#D4A72C]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MOMENTS OF BHAKTI</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-shine">
            Memories From Our Celebrations
          </h2>
          <div className="max-w-xs mx-auto">
            <FloralLineDivider />
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#F4B942] to-[#E87516] text-[#32070B] border-[#FFF7E8] shadow-lg scale-105'
                  : 'bg-[#5A0F16]/60 text-[#FFF7E8]/80 border-[#D4A72C]/30 hover:border-[#D4A72C] hover:text-[#FFF7E8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-2xl overflow-hidden border border-[#D4A72C]/40 bg-[#5A0F16] cursor-pointer shadow-xl hover:shadow-2xl hover:border-[#F4B942] transition-all duration-500 h-72"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#32070B] via-[#32070B]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4B942] bg-[#5A0F16] px-2 py-0.5 rounded border border-[#D4A72C]">
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#D4A72C] text-[#32070B] flex items-center justify-center">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-cinzel text-lg font-bold text-[#FFF7E8]">
                  {item.title}
                </h4>
                <p className="text-xs text-[#FFF7E8]/80 line-clamp-1">
                  {item.caption}
                </p>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#32070B]/70 border border-[#D4A72C]/50 text-[#F4B942] flex items-center justify-center opacity-80 group-hover:opacity-0 transition-opacity">
                <Camera className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-[#32070B]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#5A0F16] border-2 border-[#F4B942] rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#32070B] border border-[#F4B942] text-[#F4B942] flex items-center justify-center hover:scale-110 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[70vh] rounded-2xl overflow-hidden bg-[#32070B]">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-full object-contain max-h-[70vh] mx-auto"
              />
            </div>

            <div className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F4B942] bg-[#32070B] px-2.5 py-0.5 rounded border border-[#D4A72C]">
                  {selectedImage.category}
                </span>
                <h3 className="font-cinzel text-xl font-bold text-[#FFF7E8]">
                  {selectedImage.title}
                </h3>
              </div>
              <p className="text-sm text-[#FFF7E8]/80">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
