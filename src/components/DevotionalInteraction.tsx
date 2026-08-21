import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Music } from 'lucide-react';
import { OmIcon } from './DevotionalIcons';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const DevotionalInteraction: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songs = [
    { title: 'Morya Re Bappa Morya', src: '/assets/morya_re_bappa_morya.mp3' },
    { title: 'Mumbai Cha Raja', src: '/assets/mumbai_cha_raja.mp3' },
  ];

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  const triggerChant = () => {
    // 1. Devotional Confetti Shower
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.82 },
      colors: ['#F4B942', '#E87516', '#D4A72C', '#5A0F16', '#FFDF00'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
    });

    setToastMessage(t.devotional.toastMsg);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);

    // 2. Stop currently playing audio if any
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
    }

    // 3. Determine next song to play
    let nextIndex = currentSongIndex;
    if (isPlaying) {
      nextIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(nextIndex);
    }

    const activeSong = songs[nextIndex];
    const newAudio = new Audio(activeSong.src);
    audioRef.current = newAudio;

    newAudio.onended = () => {
      setIsPlaying(false);
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    };

    newAudio.onerror = () => {
      setIsPlaying(false);
    };

    newAudio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  return (
    <>
      {/* Floating Devotional Chant & Audio Song Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={triggerChant}
          title="Click to play Ganpati Bappa Morya Song!"
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#5A0F16] via-[#32070B] to-[#5A0F16] border-2 border-[#F4B942] text-[#F4B942] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:scale-110 active:scale-95 transition-all group drop-shadow-[0_4px_20px_rgba(244,185,66,0.4)] ${
            isPlaying ? 'ring-4 ring-[#F4B942]/60 animate-pulse' : ''
          } ${fontClass}`}
        >
          <OmIcon className="w-5 h-5 text-[#F4B942] group-hover:rotate-12 transition-transform" />
          <span>{t.devotional.chantBtn}</span>
          {isPlaying ? (
            <Volume2 className="w-4.5 h-4.5 text-[#F4B942] animate-bounce" />
          ) : (
            <Music className="w-4 h-4 text-[#F4B942] animate-pulse" />
          )}
        </button>
      </div>

      {/* Devotional Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm bg-[#32070B] border-2 border-[#F4B942] rounded-2xl p-4 shadow-2xl text-left animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5A0F16] border border-[#F4B942] text-[#F4B942] flex items-center justify-center flex-shrink-0">
              <OmIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className={`text-xs font-bold text-[#F4B942] uppercase tracking-wider ${fontClass}`}>
                {t.devotional.toastShloka}
              </p>
              <p className={`text-xs text-[#FFF7E8]/90 font-medium leading-relaxed ${fontClass}`}>
                {toastMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
