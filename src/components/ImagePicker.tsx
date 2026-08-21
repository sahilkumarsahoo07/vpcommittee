import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Grid, Link as LinkIcon, Trash2 } from 'lucide-react';
import { publicAPI } from '../services/api';

const PRESET_ASSETS = [
  { title: 'Festival Banner', url: '/assets/bannerimage.png' },
  { title: 'Main Ganesha Idol', url: '/assets/main-ganesha.png' },
  { title: 'Circular Ganesha Logo', url: '/assets/circular-ganesha.png' },
  { title: 'Maha Aarti Night', url: '/assets/maha-aarti.png' },
  { title: 'Maha Prasad Feast', url: '/assets/mahaprasad.png' },
  { title: 'Visarjan Procession', url: '/assets/visarjan.png' },
  { title: 'Cultural Night', url: '/assets/cultural-night.png' },
  { title: 'Mandap Lighting 1', url: '/assets/1bgimage.png' },
  { title: 'Mandap Lighting 2', url: '/assets/2bgimage.png' },
  { title: 'Mandap Stage 3', url: '/assets/3rdbgimage.png' },
  { title: 'Temple Background', url: '/assets/bgimage.png' },
];

interface ImagePickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  value,
  onChange,
  label = 'BANNER / ATTACHED IMAGE',
}) => {
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dbImages, setDbImages] = useState<{ title: string; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDbGallery();
  }, []);

  const fetchDbGallery = async () => {
    try {
      const res = await publicAPI.getGallery();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((item: any) => ({
          title: item.title || 'Gallery Image',
          url: item.mediaUrl || item.url || item.imageUrl || '/assets/bannerimage.png',
        }));
        setDbImages(mapped);
      }
    } catch {
      setDbImages([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const allGalleryItems = [
    ...PRESET_ASSETS,
    ...dbImages.filter(d => !PRESET_ASSETS.some(p => p.url === d.url)),
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#F4B942]" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#F4B942]/80 hover:text-[#F4B942] flex items-center gap-1 underline"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL Input' : 'Direct URL'}</span>
        </button>
      </div>

      {/* Selected Image Preview or Action Buttons */}
      {value ? (
        <div className="relative group bg-[#170204] border-2 border-[#D4A72C]/40 rounded-2xl p-2 flex items-center gap-3">
          <img
            src={value}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-xl border border-[#D4A72C]/50 bg-black/40"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/bannerimage.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#F4B942] truncate">Selected Image</p>
            <p className="text-[11px] text-[#FFF7E8]/60 truncate font-mono">{value.slice(0, 40)}...</p>
            <div className="flex items-center gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] bg-[#D4A72C]/20 hover:bg-[#D4A72C]/30 text-[#F4B942] px-2 py-0.5 rounded-md font-bold transition-colors"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => setShowGalleryModal(true)}
                className="text-[10px] bg-[#E87516]/20 hover:bg-[#E87516]/30 text-[#E87516] px-2 py-0.5 rounded-md font-bold transition-colors"
              >
                Gallery
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
            title="Remove Image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-[#170204] hover:bg-[#2e0509] border border-dashed border-[#D4A72C]/50 rounded-xl p-3 text-xs text-[#FFF7E8] font-semibold transition-colors"
          >
            <Upload className="w-4 h-4 text-[#F4B942]" />
            <span>Upload File</span>
          </button>

          {/* Select from Gallery Button */}
          <button
            type="button"
            onClick={() => setShowGalleryModal(true)}
            className="flex items-center justify-center gap-2 bg-[#170204] hover:bg-[#2e0509] border border-[#D4A72C]/50 rounded-xl p-3 text-xs text-[#F4B942] font-semibold transition-colors"
          >
            <Grid className="w-4 h-4 text-[#E87516]" />
            <span>Choose from Gallery</span>
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Optional Direct URL Input */}
      {showUrlInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. /assets/bannerimage.png or https://..."
          className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] placeholder:text-[#FFF7E8]/40"
        />
      )}

      {/* Gallery Selection Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-6 w-full max-w-2xl text-[#FFF7E8] space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D4A72C]/30 pb-3">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#F4B942]" />
                <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase tracking-wider">
                  Select Image from Gallery
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="p-1 rounded-full text-[#FFF7E8]/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#FFF7E8]/70">
              Click any image below to automatically select it for this item:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {allGalleryItems.map((item, idx) => {
                const isSelected = value === item.url;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onChange(item.url);
                      setShowGalleryModal(false);
                    }}
                    className={`group relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all aspect-video bg-black/50 ${
                      isSelected
                        ? 'border-[#F4B942] ring-2 ring-[#F4B942]/50 scale-[1.02]'
                        : 'border-[#D4A72C]/30 hover:border-[#F4B942]/80 hover:scale-[1.02]'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/bannerimage.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                      <span className="text-[10px] font-bold text-[#FFF7E8] truncate drop-shadow">
                        {item.title}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-[#F4B942] text-black rounded-full p-1 shadow-lg">
                        <Check className="w-3.5 h-3.5 font-black" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#D4A72C]/30">
              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowGalleryModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#E87516] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#d0640d] transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Custom Image</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
