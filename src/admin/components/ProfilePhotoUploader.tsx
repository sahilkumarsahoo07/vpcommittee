import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, Link as LinkIcon, User } from 'lucide-react';

interface ProfilePhotoUploaderProps {
  value: string;
  onChange: (photoUrl: string) => void;
  userName?: string;
  label?: string;
  required?: boolean;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  value,
  onChange,
  userName = '',
  label = 'Profile Photo',
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Photo is larger than 8MB. Please choose a smaller photo.');
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

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-3 bg-[#170204] border border-[#D4A72C]/30 p-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#F4B942] flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-[#F4B942]" />
          <span>{label} {required && <span className="text-red-400">*</span>}</span>
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#FFF7E8]/70 hover:text-[#F4B942] flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL' : 'Use Photo Link'}</span>
        </button>
      </div>

      {/* Hidden Native File Input (Direct Mobile Gallery & Camera Access) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Big Avatar Clickable Container */}
        <div
          onClick={handleTriggerUpload}
          className="relative cursor-pointer group shrink-0"
          title="Click to choose directly from mobile gallery or camera"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#F4B942] bg-[#32070B] shadow-md shadow-[#D4A72C]/20 flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-[#E87516]">
            {value ? (
              <img src={value} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#F4B942] bg-gradient-to-br from-[#32070B] to-[#1F0407]">
                {userName ? (
                  <span className="text-2xl font-black font-cinzel">{userName.charAt(0).toUpperCase()}</span>
                ) : (
                  <User className="w-8 h-8 text-[#D4A72C]" />
                )}
              </div>
            )}
          </div>

          {/* Camera Overlay Badge */}
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gradient-to-br from-[#D4A72C] to-[#E87516] text-[#1F0407] border-2 border-[#170204] shadow-md transition-transform group-hover:scale-110">
            <Camera className="w-4 h-4" />
          </div>
        </div>

        {/* Upload Action Buttons */}
        <div className="flex-1 space-y-2 text-center sm:text-left w-full">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={handleTriggerUpload}
              className="px-4 py-2 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/50 text-[#F4B942] font-bold text-xs rounded-xl transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo (Gallery / Camera)</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-2 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-[#FFF7E8]/60">
            Tap above to directly select and upload from your <b>mobile phone gallery</b> or camera.
          </p>
        </div>
      </div>

      {/* Direct URL Input (Toggled) */}
      {showUrlInput && (
        <div className="pt-2">
          <input
            type="text"
            placeholder="Paste direct image link (e.g. https://...)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
          />
        </div>
      )}
    </div>
  );
};
