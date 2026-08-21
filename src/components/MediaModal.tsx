import React from 'react';
import { X, ExternalLink, Film } from 'lucide-react';
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

  const rawUrl = item.mediaUrl || item.imageUrl || item.url || '';
  const processed: ProcessedMedia = processMediaUrl(rawUrl);
  const mediaType = item.mediaType || processed.mediaType;
  const embedUrl = item.embedUrl || processed.embedUrl;

  const title = item.title || 'Festival Media';
  const category = item.category || 'Festival';

  const isReel = mediaType === 'REEL';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full bg-[#180305] border-2 border-[#D4A72C]/70 rounded-3xl p-4 sm:p-5 text-[#FFF7E8] space-y-3 shadow-2xl overflow-hidden max-h-[96vh] flex flex-col transition-all ${
          isReel ? 'max-w-[420px]' : 'max-w-3xl'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#D4A72C]/30 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-xl bg-[#5A0F16] border border-[#F4B942]/40 flex items-center justify-center flex-shrink-0 shadow">
              {isReel && <InstagramIcon className="w-4 h-4 text-pink-400" />}
              {mediaType === 'YOUTUBE' && <YoutubeIcon className="w-4 h-4 text-red-500" />}
              {mediaType === 'GDRIVE' && <GoogleDriveIcon className="w-4 h-4 text-blue-400" />}
              {mediaType === 'VIDEO' && <Film className="w-4 h-4 text-[#F4B942]" />}
              {mediaType === 'IMAGE' && <Film className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/30 inline-block truncate max-w-full">
                {category} • {mediaType}
              </span>
              <h3 className="font-cinzel text-sm sm:text-base font-black text-[#F4B942] leading-tight truncate">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {rawUrl && (
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF7E8]/80 hover:text-white transition-colors"
                title={isReel ? 'Open on Instagram' : 'Open Link'}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-900/50 hover:bg-red-800 text-white transition-colors"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Player Container */}
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/80 rounded-2xl border border-[#D4A72C]/20 relative">
          {isReel ? (
            <div className="w-full flex items-center justify-center bg-black rounded-xl overflow-hidden py-1">
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-[580px] max-h-[76vh] border-0 rounded-xl bg-black block mx-auto shadow-2xl"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                scrolling="no"
              />
            </div>
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

        {/* Caption */}
        {item.caption && (
          <p className="text-[11px] text-[#FFF7E8]/80 font-medium italic border-t border-[#D4A72C]/20 pt-2 line-clamp-2">
            "{item.caption}"
          </p>
        )}
      </div>
    </div>
  );
};
