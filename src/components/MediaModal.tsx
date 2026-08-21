import React from 'react';
import { X, ExternalLink, Film, Play } from 'lucide-react';
import { processMediaUrl, type ProcessedMedia } from '../utils/mediaHelper';
import { InstagramIcon, YoutubeIcon, GoogleDriveIcon } from './SocialIcons';

interface MediaModalProps {
  item: {
    id?: string;
    title?: string;
    category?: string;
    url?: string;
    mediaUrl?: string;
    imageUrl?: string;
    embedUrl?: string;
    mediaType?: string;
    caption?: string;
  } | null;
  onClose: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const [useIframe, setUseIframe] = React.useState(false);
  const rawUrl = item.mediaUrl || item.imageUrl || item.url || '';
  const processed: ProcessedMedia = processMediaUrl(rawUrl);
  const mediaType = item.mediaType || processed.mediaType;
  const embedUrl = item.embedUrl || processed.embedUrl;
  const imageUrl = item.imageUrl || processed.thumbnailUrl || '/assets/cultural-night.png';

  const title = item.title || 'Festival Media';
  const category = item.category || 'Puja';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-3xl w-full bg-[#1A0305] border-2 border-[#F4B942] rounded-3xl p-4 sm:p-6 text-[#FFF7E8] space-y-4 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#D4A72C]/30 pb-3">
          <div className="flex items-center gap-2">
            {mediaType === 'REEL' && <InstagramIcon className="w-5 h-5 text-pink-500" />}
            {mediaType === 'YOUTUBE' && <YoutubeIcon className="w-5 h-5 text-red-500" />}
            {mediaType === 'GDRIVE' && <GoogleDriveIcon className="w-5 h-5 text-blue-400" />}
            {mediaType === 'VIDEO' && <Film className="w-5 h-5 text-[#F4B942]" />}
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/40">
                {category} • {mediaType}
              </span>
              <h3 className="font-cinzel text-base sm:text-lg font-black text-[#F4B942] leading-tight mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF7E8]/80 hover:text-white transition-colors"
              title="Open Source Link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-red-900/50 hover:bg-red-800 text-white transition-colors"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Media Container */}
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/60 rounded-2xl border border-[#D4A72C]/30 relative min-h-[300px]">
          {mediaType === 'REEL' ? (
            useIframe ? (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-[540px] max-h-[75vh] rounded-xl border-none bg-black"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-[540px] max-h-[75vh] flex items-center justify-center bg-black rounded-xl overflow-hidden group">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/cultural-night.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-black/30 backdrop-blur-[2px]">
                  <button
                    onClick={() => setUseIframe(true)}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-yellow-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform border-2 border-white/40"
                  >
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </button>
                  <span className="mt-3 text-xs font-black text-white bg-black/80 px-3.5 py-1.5 rounded-full border border-[#F4B942]/50 backdrop-blur-md shadow-lg">
                    Play Reel In-Site
                  </span>
                </div>
              </div>
            )
          ) : mediaType === 'YOUTUBE' ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full aspect-video rounded-xl border-none bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : mediaType === 'GDRIVE' ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full aspect-video rounded-xl border-none bg-black"
              allowFullScreen
            />
          ) : mediaType === 'VIDEO' ? (
            <video
              src={rawUrl}
              controls
              autoPlay
              className="w-full max-h-[70vh] rounded-xl object-contain bg-black"
            />
          ) : (
            <img
              src={rawUrl}
              alt={title}
              className="w-full max-h-[75vh] object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/bannerimage.png';
              }}
            />
          )}
        </div>

        {/* Footer info */}
        {item.caption && (
          <p className="text-xs text-[#FFF7E8]/80 font-medium italic border-t border-[#D4A72C]/20 pt-2">
            "{item.caption}"
          </p>
        )}
      </div>
    </div>
  );
};
