import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, X, Film, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { publicAPI } from '../services/api';
import { processMediaUrl, extractInstagramShortcode } from '../utils/mediaHelper';
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

export const GallerySection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch gallery items
        const res = await publicAPI.getGallery();
        if (res.success && Array.isArray(res.data)) {
          const mapped: GalleryItem[] = res.data.map((item: any) => {
            const rawUrl = item.mediaUrl || item.imageUrl || item.url || '';
            const processed = processMediaUrl(rawUrl);
            // Honour backend mediaType first, fall back to URL-detected type
            const mediaType = item.mediaType || processed.mediaType;
            const isInstagram = mediaType === 'REEL' || mediaType === 'INSTAGRAM_POST';
            const isYoutube = mediaType === 'YOUTUBE';

            const thumbUrl = isYoutube
              ? processed.thumbnailUrl
              : isInstagram
              ? processed.thumbnailUrl
              : item.imageUrl && !item.imageUrl.includes('bannerimage')
              ? item.imageUrl
              : (processed.thumbnailUrl || rawUrl || '');

            return {
              id: item._id || item.id,
              title: item.title || 'Festival Media',
              category: item.category || 'Puja',
              mediaType: mediaType,
              imageUrl: thumbUrl,
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
    setPlayingItemId(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPlayingItemId(null);
      const section = document.getElementById('gallery');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCardClick = (item: GalleryItem) => {
    const isPhoto = item.mediaType === 'IMAGE';
    if (isPhoto) {
      setSelectedMedia(item);
    } else {
      // Instantly start playing inline
      setPlayingItemId(item.id);
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
            {paginatedItems.map((item) => {
              const isReel = item.mediaType === 'REEL';
              const isInstagramPost = item.mediaType === 'INSTAGRAM_POST';
              const isInstagram = isReel || isInstagramPost;  // any Instagram content
              const isYoutube = item.mediaType === 'YOUTUBE';
              const isGdrive = item.mediaType === 'GDRIVE';
              const isVideo = item.mediaType === 'VIDEO';
              const isPhoto = item.mediaType === 'IMAGE';
              const isPlayable = isReel || isYoutube || isGdrive || isVideo; // only actual video types get play btn
              const isPlaying = playingItemId === item.id;

              const shortcode = isInstagram ? extractInstagramShortcode(item.mediaUrl || '') : null;

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-3xl overflow-hidden border-2 transition-all duration-300 shadow-lg hover:shadow-2xl aspect-[4/5] min-h-[380px] sm:min-h-[440px] flex items-center justify-center bg-[#120103] ${
                    isPlaying
                      ? 'border-[#F4B942] ring-4 ring-[#F4B942]/30 shadow-2xl'
                      : 'border-[#D4A72C]/40 hover:border-[#F4B942] cursor-pointer'
                  }`}
                >
                  {isPlaying ? (
                    /* ── PLAYING STATE (YouTube / GDrive / direct Video) ─── */
                    <div className="w-full h-full relative bg-black flex items-center justify-center">
                      {isYoutube ? (
                        <iframe src={item.embedUrl} title={item.title}
                          className="w-full h-full border-0 bg-black"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen />
                      ) : isGdrive ? (
                        <iframe src={item.embedUrl} title={item.title}
                          className="w-full h-full border-0 bg-black"
                          allowFullScreen />
                      ) : isVideo ? (
                        <video src={item.mediaUrl} controls autoPlay playsInline
                          className="w-full h-full object-contain bg-black" />
                      ) : null}

                      {/* Controls */}
                      <div className="absolute top-3 right-3 flex items-center gap-2 z-30">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedMedia(item); }}
                          className="p-2 rounded-xl bg-black/80 hover:bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/40 backdrop-blur-md shadow-lg transition-all"
                          title="Fullscreen">
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setPlayingItemId(null); }}
                          className="p-2 rounded-xl bg-red-950/90 hover:bg-red-900 text-white border border-red-500/40 backdrop-blur-md shadow-lg transition-all"
                          title="Close">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  ) : isInstagram ? (
                    /* ── INSTAGRAM (REEL / POST) ─────────────────────────────
                       Always show the interactive embed directly.
                       The Instagram header (View profile btn) is hidden by
                       pushing the iframe 62px up inside overflow:hidden.
                       pointerEvents:auto → single click plays the video natively.
                    ─────────────────────────────────────────────────────────── */
                    <div className="w-full h-full relative overflow-hidden">
                      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                        <iframe
                          src={item.embedUrl || `https://www.instagram.com/p/${shortcode}/embed/captioned/`}
                          title={item.title}
                          style={{
                            position: 'absolute',
                            top: '-62px',
                            left: 0,
                            width: '100%',
                            height: 'calc(100% + 62px)',
                            border: 'none',
                            background: '#000',
                            pointerEvents: 'auto',
                          }}
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          allowFullScreen
                          scrolling="no"
                        />
                      </div>

                      {/* Category badge — pointer-events:none so clicks reach the iframe */}
                      <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#F4B942] bg-[#3A060B]/90 border border-[#F4B942]/50 backdrop-blur-md shadow-md">
                          {item.category}
                        </span>
                      </div>

                      {/* Bottom title — pointer-events:none so clicks reach the iframe */}
                      <div className="absolute bottom-0 inset-x-0 p-4 z-20 pointer-events-none bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <h4 className={`text-sm font-extrabold text-[#FFF7E8] leading-snug drop-shadow line-clamp-1 ${fontClass}`}>
                          {item.title}
                        </h4>
                        {item.caption && (
                          <p className={`text-xs text-[#FFF7E8]/70 line-clamp-1 font-medium ${fontClass}`}>{item.caption}</p>
                        )}
                      </div>
                    </div>

                  ) : (
                    /* ── NON-INSTAGRAM PREVIEW ───────────────────────────────
                       Clean thumbnail with NO play button.
                       One click on the card starts playback immediately.
                    ─────────────────────────────────────────────────────────── */
                    <div
                      className="w-full h-full relative flex items-center justify-center cursor-pointer"
                      onClick={() => isPlayable ? setPlayingItemId(item.id) : setSelectedMedia(item)}
                    >
                      <img
                        src={item.imageUrl || '/assets/bannerimage.png'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/assets/bannerimage.png'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#100103] via-black/30 to-black/10 pointer-events-none" />

                      {/* Top badges */}
                      <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-20 pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#F4B942] bg-[#3A060B]/90 border border-[#F4B942]/50 backdrop-blur-md shadow-md">
                          {item.category}
                        </span>
                        {(isYoutube || isGdrive || isVideo) && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/90 bg-black/60 border border-white/20 backdrop-blur-md shadow-md flex items-center gap-1.5">
                            {isYoutube && <YoutubeIcon className="w-3 h-3 text-red-400" />}
                            {isGdrive && <GoogleDriveIcon className="w-3 h-3 text-blue-400" />}
                            {isVideo && <Film className="w-3 h-3 text-[#F4B942]" />}
                            <span>{isYoutube ? 'YouTube' : isGdrive ? 'Drive' : 'Video'}</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 space-y-1 text-left z-20 pointer-events-none">
                        <h4 className={`text-base font-extrabold text-[#FFF7E8] group-hover:text-[#F4B942] transition-colors leading-snug drop-shadow line-clamp-1 ${fontClass}`}>
                          {item.title}
                        </h4>
                        {item.caption && (
                          <p className={`text-xs text-[#FFF7E8]/70 line-clamp-1 font-medium ${fontClass}`}>{item.caption}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

      {/* General Media Modal Popup */}
      {selectedMedia && (
        <MediaModal item={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </section>
  );
};

