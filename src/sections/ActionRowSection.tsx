import React, { useState } from 'react';
import { Heart, Mail, Users, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface ActionRowSectionProps {
  onOpenDonate: (presetAmount?: number) => void;
  onOpenVolunteer: () => void;
}

export const ActionRowSection: React.FC<ActionRowSectionProps> = ({ onOpenDonate, onOpenVolunteer }) => {
  const [email, setEmail] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number>(1001);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribeStatus('error');
      setSubscribeMessage('Please enter a valid email address.');
      return;
    }
    setSubscribeStatus('loading');
    setTimeout(() => {
      setSubscribeStatus('success');
      setSubscribeMessage('Thank you! You are subscribed to festival updates.');
      setEmail('');
    }, 800);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount ? parseFloat(customAmount) : selectedPreset;
    onOpenDonate(amount);
  };

  return (
    <section className="bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#D4A72C]/20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: SUPPORT VIGHNAHARTA (Donation) */}
          <div className="bg-[#FFFDF7] border border-[#D4A72C]/40 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:border-[#D4A72C] transition-all flex flex-col justify-between text-left space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center border border-[#D4A72C]/50 shadow-md">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#5A0F16]">
                SUPPORT VIGHNAHARTA
              </h3>
              <p className="text-xs sm:text-sm text-[#2A1710]/80">
                Your contribution helps us organize the celebration and community activities.
              </p>
            </div>

            <form onSubmit={handleDonateSubmit} className="space-y-4">
              {/* Presets */}
              <div className="grid grid-cols-3 gap-2">
                {[501, 1001, 2501].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      selectedPreset === amt && !customAmount
                        ? 'bg-[#5A0F16] text-[#F4B942] border-[#5A0F16]'
                        : 'bg-[#FFF7E8] text-[#5A0F16] border-[#D4A72C]/50 hover:border-[#5A0F16]'
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[#5A0F16]">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Enter Custom Amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-sm text-[#2A1710] font-semibold focus:outline-none focus:border-[#5A0F16]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Donate Now</span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#2A1710]/70 pt-2 border-t border-[#D4A72C]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E87516]" />
              <span>Secure • Simple • Transparent</span>
            </div>
          </div>

          {/* Card 2: STAY CONNECTED (Newsletter) */}
          <div className="bg-[#FFFDF7] border border-[#D4A72C]/40 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:border-[#D4A72C] transition-all flex flex-col justify-between text-left space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center border border-[#D4A72C]/50 shadow-md">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#5A0F16]">
                STAY CONNECTED
              </h3>
              <p className="text-xs sm:text-sm text-[#2A1710]/80">
                Get festival updates, event timings, announcements and celebrations.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (subscribeStatus !== 'idle') setSubscribeStatus('idle');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-sm text-[#2A1710] font-medium focus:outline-none focus:border-[#5A0F16]"
                />

                {subscribeMessage && (
                  <p className={`text-xs font-semibold ${subscribeStatus === 'error' ? 'text-red-600' : 'text-emerald-700'}`}>
                    {subscribeMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="w-full py-3.5 rounded-xl bg-[#5A0F16] hover:bg-[#32070B] border border-[#D4A72C] text-[#FFF7E8] hover:text-[#F4B942] font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#2A1710]/70 pt-2 border-t border-[#D4A72C]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E87516]" />
              <span>We respect your privacy.</span>
            </div>
          </div>

          {/* Card 3: BE PART OF THE CELEBRATION (Volunteer) */}
          <div className="bg-[#FFFDF7] border border-[#D4A72C]/40 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:border-[#D4A72C] transition-all flex flex-col justify-between text-left space-y-6 relative overflow-hidden">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center border border-[#D4A72C]/50 shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#5A0F16]">
                BE PART OF THE CELEBRATION
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#E87516]">
                Want to volunteer?
              </p>
            </div>

            {/* Checklist with Hand graphic side-by-side */}
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-2 text-xs font-semibold text-[#2A1710]/90">
                {['Volunteer', 'Decoration', 'Photography', 'Cultural Events', 'Event Management'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E87516] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Hand Vector Illustration Artwork */}
              <div className="w-20 h-24 opacity-80 flex-shrink-0">
                <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#E87516]">
                  <path d="M30 110V60C30 54 34 50 40 50C46 50 50 54 50 60V110" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M50 110V40C50 34 54 30 60 30C66 30 70 34 70 40V110" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M70 110V50C70 44 74 40 80 40C86 40 90 44 90 50V110" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M15 110V70C15 65 19 60 24 60C29 60 30 63 30 70V110" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenVolunteer}
                className="w-full py-3.5 rounded-full bg-[#5A0F16] hover:bg-[#32070B] border border-[#D4A72C] text-[#FFF7E8] hover:text-[#F4B942] font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Join Us</span>
                <ArrowRight className="w-4 h-4 text-[#F4B942] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
