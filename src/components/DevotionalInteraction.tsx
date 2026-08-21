import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Volume2, VolumeX, Heart } from 'lucide-react';
import { OmIcon } from './DevotionalIcons';

export const DevotionalInteraction: React.FC = () => {
  const [blessingCount, setBlessingCount] = useState(1008);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Synthesize divine Shankh & Bell vibration sound using Web Audio API
  const playDevotionalSound = () => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      
      // Fundamental shankh tone (harmonic frequency)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(136.1, ctx.currentTime); // 136.1 Hz is OM frequency
      osc.frequency.exponentialRampToValueAtTime(272.2, ctx.currentTime + 0.8);
      osc.frequency.exponentialRampToValueAtTime(136.1, ctx.currentTime + 2.5);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.9);

      // Bell chime overlay
      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(1080, ctx.currentTime + 0.2);
      bellGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.2);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);
      bellOsc.connect(bellGain);
      bellGain.connect(ctx.destination);
      bellOsc.start(ctx.currentTime + 0.2);
      bellOsc.stop(ctx.currentTime + 2.0);
    } catch {
      // Audio context fallback
    }
  };

  const handleTriggerBlessing = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    setBlessingCount(prev => prev + 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);

    playDevotionalSound();

    // Flowers & Gold Particles Confetti Explosion
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x, y },
      colors: ['#F4B942', '#D4A72C', '#E87516', '#FFF7E8', '#5A0F16'],
      shapes: ['circle', 'square'],
      scalar: 1.2,
      ticks: 120,
    });

    // Secondary marigold flower shower
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.2 },
        colors: ['#E87516', '#F4B942', '#FFF7E8'],
        gravity: 0.6,
        scalar: 1.4,
      });
    }, 200);
  };

  return (
    <>
      {/* Devotional Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 right-6 z-50 animate-bounce bg-gradient-to-r from-[#5A0F16] via-[#32070B] to-[#5A0F16] border-2 border-[#F4B942] text-[#FFF7E8] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-[#D4A72C]/20 border border-[#F4B942] flex items-center justify-center text-[#F4B942]">
            <OmIcon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="font-devanagari text-lg text-[#F4B942] font-bold">॥ ॐ गं गणपतये नमः ॥</p>
            <p className="text-xs text-[#FFF7E8]/90 font-medium">Ganpati Bappa Morya! Bappa blesses you with joy and prosperity.</p>
          </div>
        </div>
      )}

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Opt-in Sound Toggle */}
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          title={isAudioMuted ? "Enable Ambient Chant Sound" : "Mute Sound"}
          className="w-12 h-12 rounded-full bg-[#5A0F16]/90 border border-[#D4A72C] text-[#F4B942] flex items-center justify-center shadow-lg hover:scale-110 hover:bg-[#5A0F16] transition-all"
        >
          {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#F4B942] animate-pulse" />}
        </button>

        {/* Main Devotional Button */}
        <button
          onClick={handleTriggerBlessing}
          className="group relative overflow-hidden bg-gradient-to-r from-[#D4A72C] via-[#F4B942] to-[#E87516] text-[#32070B] font-bold text-sm md:text-base px-5 py-3 rounded-full shadow-2xl border-2 border-[#FFF7E8] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="text-lg">🙏</span>
          <span className="font-devanagari tracking-wide">गणपती बप्पा मोरया!</span>
          <span className="bg-[#32070B]/20 text-[#32070B] text-xs font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
            <Heart className="w-3 h-3 fill-current" />
            {blessingCount}
          </span>
          <Sparkles className="w-4 h-4 text-[#32070B] group-hover:rotate-45 transition-transform" />
        </button>
      </div>
    </>
  );
};
