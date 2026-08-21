import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, X, Film } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { publicAPI } from '../services/api';
import { processMediaUrl } from '../utils/mediaHelper';
import { MediaModal } from '../components/MediaModal';
import { InstagramIcon, YoutubeIcon, GoogleDriveIcon } from '../components/SocialIcons';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  mediaType: string;
  imageUrl: string;
  mediaUrl: string;
  embedUrl: string;
  caption?: string;
}

interface InstagramReelItem {
  id: string;
  title: string;
  tag: string;
  mediaUrl: string;
  embedUrl: string;
  imageUrl: string;
  mediaType?: 'REEL' | 'IMAGE' | 'VIDEO';
  caption?: string;
}



interface InstagramViewerModalProps {
  item: InstagramReelItem;
  handle: string;
  onClose: () => void;
}

const InstagramViewerModal: React.FC<InstagramViewerModalProps> = ({ item, handle, onClose }) => {
  const [useIframe, setUseIframe] = useState<boolean>(false);
  const isVideo = item.mediaType === 'REEL' || item.mediaType === 'VIDEO' || !item.tag.toLowerCase().includes('photo');

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-y-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#160205] border-2 border-[#F4B942] rounded-3xl p-5 text-[#FFF7E8] space-y-4 shadow-2xl relative flex flex-col items-center"
      >
        {/* Modal Header */}
        <div className="w-full flex justify-between items-center border-b border-[#D4A72C]/30 pb-3">
          <div className="flex items-center gap-2">
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            <div>
              <span className="text-xs font-black text-[#F4B942] uppercase tracking-widest">
                @{handle}
              </span>
              <span className="ml-2 text-[9px] px-2 py-0.5 rounded-full bg-pink-950/80 text-pink-300 font-bold border border-pink-500/40 uppercase">
                {isVideo ? 'Reel' : 'Photo'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-950/80 border border-red-500/40 text-white hover:bg-red-900 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Container: Guaranteed NO WHITE SCREEN */}
        <div className="w-full max-w-sm aspect-[9/16] max-h-[60vh] rounded-2xl overflow-hidden border border-[#D4A72C]/40 bg-black shadow-2xl relative flex items-center justify-center group">
          {useIframe ? (
            <iframe
              title={item.title}
              src={item.embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              className="border-0 w-full h-full bg-black"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {/* Actual Instagram Media Preview Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/cultural-night.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* In-Site Interactive Play Action for Videos/Reels */}
              {isVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-black/30 backdrop-blur-[2px]">
                  <button
                    onClick={() => setUseIframe(true)}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-yellow-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform border-2 border-white/40 group-hover:scale-110"
                  >
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </button>
                  <span className="mt-3 text-xs font-black text-white bg-black/80 px-3.5 py-1.5 rounded-full border border-[#F4B942]/50 backdrop-blur-md shadow-lg">
                    Play Reel In-Site
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="w-full max-w-sm text-center space-y-2 pt-1">
          <div>
            <h4 className="text-xs font-extrabold text-white line-clamp-2">{item.title}</h4>
            <p className="text-[9px] text-[#F4B942] uppercase tracking-widest font-black mt-1">
              {item.tag} • {isVideo ? 'Instagram Reel' : 'Instagram Photo'}
            </p>
          </div>

          {/* Direct In-Site Controls */}
          {isVideo && (
            <div className="flex justify-center items-center gap-2 pt-1">
              <button
                onClick={() => setUseIframe(!useIframe)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#5A0F16] to-[#3B070C] hover:from-[#7A151E] hover:to-[#5A0F16] border border-[#F4B942]/40 text-[#F4B942] text-xs font-black transition-all flex items-center gap-2 shadow-md"
              >
                <Film className="w-3.5 h-3.5 text-pink-400" />
                <span>{useIframe ? 'Show Media Preview' : 'Load Interactive Embed'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const GallerySection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  // Instagram Handle Stream & Video Portfolio state
  const [instagramHandle, setInstagramHandle] = useState<string>('vighnaharta_puja');
  const [selectedInstagramVideo, setSelectedInstagramVideo] = useState<InstagramReelItem | null>(null);

  const fetchInstagramApiFeed = async (_handleStr: string) => {
    try {
      const res = await publicAPI.getInstagramFeed(_handleStr);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        // Feed loaded
      }
    } catch {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch settings for Instagram handle
        let activeHandle = 'vighnaharta_puja';
        try {
          const settingsRes = await publicAPI.getSettings();
          if (settingsRes.success && settingsRes.data?.instagramHandle) {
            activeHandle = settingsRes.data.instagramHandle;
          }
        } catch {}
        setInstagramHandle(activeHandle);
        fetchInstagramApiFeed(activeHandle);

        // Fetch gallery items
        const res = await publicAPI.getGallery();
        if (res.success && Array.isArray(res.data)) {
          const mapped: GalleryItem[] = res.data.map((item: any) => {
            const rawUrl = item.mediaUrl || item.imageUrl || item.url || '/assets/bannerimage.png';
            const processed = processMediaUrl(rawUrl);
            return {
              id: item._id || item.id,
              title: item.title || 'Festival Media',
              category: item.category || 'Puja',
              mediaType: item.mediaType || processed.mediaType,
              imageUrl: processed.thumbnailUrl || rawUrl,
              mediaUrl: rawUrl,
              embedUrl: item.embedUrl || processed.embedUrl,
              caption: item.caption || item.description || '',
            };
          });
          setGalleryItems(mapped);
        }
      } catch {
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [language]);

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  const categories = [
    { key: 'All', label: 'All Media' },
    { key: 'Puja', label: 'Puja & Rituals' },
    { key: 'Decorations', label: 'Decorations' },
    { key: 'Cultural', label: 'Cultural' },
    { key: 'Visarjan', label: 'Visarjan' },
    { key: 'Reels', label: 'Instagram Reels' },
    { key: 'Videos', label: 'Videos' },
    { key: 'GDrive', label: 'Google Drive' },
    { key: 'Photos', label: 'Photos' },
  ];

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter(
          (item) =>
            item.category === activeCategory ||
            (activeCategory === 'Reels' && item.mediaType === 'REEL') ||
            (activeCategory === 'Videos' && item.mediaType === 'YOUTUBE')
        );

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategoryChange = (catKey: string) => {
    setActiveCategory(catKey);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const section = document.getElementById('gallery');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="gallery" className="bg-[#FFF7E8] text-[#2A1710] py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/15 space-y-16">
      {/* 1. MAIN FESTIVAL GALLERY WITH CATEGORIES & PAGINATION */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#D4A72C]/30 pb-4">
          <div className="text-left space-y-1">
            <span className={`text-sm font-bold tracking-[0.2em] text-[#5A0F16] uppercase ${fontClass}`}>
              {t.gallery.tag}
            </span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#5A0F16] ${fontClass}`}>
              {t.gallery.title}
            </h2>
          </div>

          <div className="text-xs font-semibold text-[#5A0F16]/80 bg-[#F4B942]/20 px-3 py-1.5 rounded-full border border-[#D4A72C]/40">
            Showing {filteredItems.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
          </div>
        </div>

        {/* Categories Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.key
                  ? 'bg-[#5A0F16] text-[#F4B942] border border-[#D4A72C] shadow-sm'
                  : 'bg-white text-[#2A1710]/70 border border-[#D4A72C]/30 hover:border-[#5A0F16]'
              } ${fontClass}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-16 text-[#5A0F16] font-cinzel font-bold text-sm">
            Loading festival gallery...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-3xl border border-[#D4A72C]/30 text-[#2A1710]/60 text-xs font-semibold">
            No media found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="group relative rounded-3xl overflow-hidden border border-[#D4A72C]/30 shadow-md hover:shadow-2xl hover:border-[#D4A72C] transition-all cursor-pointer aspect-[4/3] bg-[#32070B]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/bannerimage.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#32070B] via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Play Icon Overlay for Videos/Reels */}
                {item.mediaType !== 'IMAGE' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#E87516]/90 border-2 border-[#F4B942] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      {item.mediaType === 'REEL' ? (
                        <InstagramIcon className="w-7 h-7 text-pink-200" />
                      ) : item.mediaType === 'YOUTUBE' ? (
                        <YoutubeIcon className="w-7 h-7 text-red-400" />
                      ) : (
                        <Play className="w-7 h-7 fill-white ml-0.5" />
                      )}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5 text-left">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#F4B942] bg-[#5A0F16]/90 px-2.5 py-0.5 rounded-full border border-[#D4A72C]/40 ${fontClass}`}>
                    {item.mediaType === 'REEL' && <InstagramIcon className="w-3 h-3 text-pink-300" />}
                    {item.mediaType === 'YOUTUBE' && <YoutubeIcon className="w-3 h-3 text-red-400" />}
                    {item.mediaType === 'GDRIVE' && <GoogleDriveIcon className="w-3 h-3 text-blue-300" />}
                    <span>{item.category}</span>
                  </span>
                  <h4 className={`text-base font-extrabold text-[#FFF7E8] leading-snug ${fontClass}`}>{item.title}</h4>
                  {item.caption && (
                    <p className={`text-xs text-[#FFF7E8]/80 line-clamp-1 ${fontClass}`}>{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#D4A72C]/20">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-[#D4A72C]/40 text-[#5A0F16] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5A0F16] hover:text-[#F4B942] transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${
                  currentPage === pageNum
                    ? 'bg-[#5A0F16] text-[#F4B942] border border-[#D4A72C] shadow-md scale-105'
                    : 'bg-white text-[#2A1710]/80 border border-[#D4A72C]/30 hover:border-[#5A0F16]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-[#D4A72C]/40 text-[#5A0F16] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5A0F16] hover:text-[#F4B942] transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. DYNAMIC INSTAGRAM VIDEO PORTFOLIO & REELS SHOWCASE (HIDDEN) */}
      {/* 
      <div id="instagram-videos" className="max-w-7xl mx-auto bg-gradient-to-br from-[#240407] via-[#1A0305] to-[#120204] text-[#FFF7E8] p-6 sm:p-10 rounded-3xl border-2 border-[#F4B942]/60 shadow-2xl space-y-8">
        ...
      </div>
      */}

      {/* 3. INSTAGRAM VIDEO PLAYER POPUP MODAL */}
      {selectedInstagramVideo && (
        <InstagramViewerModal
          item={selectedInstagramVideo}
          handle={instagramHandle}
          onClose={() => setSelectedInstagramVideo(null)}
        />
      )}

      {/* General Media Modal Popup */}
      {selectedMedia && (
        <MediaModal item={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </section>
  );
};
