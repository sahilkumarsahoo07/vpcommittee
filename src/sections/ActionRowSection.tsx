import React, { useState } from 'react';
import { Heart, Mail, Users, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

import { publicAPI } from '../services/api';

interface ActionRowSectionProps {
  onOpenDonate: (presetAmount?: number) => void;
  onOpenVolunteer: () => void;
}

export const ActionRowSection: React.FC<ActionRowSectionProps> = ({ onOpenDonate, onOpenVolunteer }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const [email, setEmail] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number>(1001);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribeStatus('error');
      setSubscribeMessage(
        language === 'hi'
          ? 'कृपया एक वैध ईमेल पता दर्ज करें।'
          : language === 'or'
          ? 'ଦୟାକରି ଏକ ବୈଧ ଇମେଲ୍ ଠିକଣା ଦିଅନ୍ତୁ।'
          : 'Please enter a valid email address.'
      );
      return;
    }
    try {
      setSubscribeStatus('loading');
      await publicAPI.subscribeNewsletter(email);
      setSubscribeStatus('success');
      setSubscribeMessage(
        language === 'hi'
          ? 'धन्यवाद! आप उत्सव की जानकारी के लिए पंजीकृत हो गए हैं।'
          : language === 'or'
          ? 'ଧନ୍ୟବାଦ! ଆପଣ ଉତ୍ସବ ଅପଡେଟ୍ ପାଇଁ ସବସ୍କ୍ରାଇବ୍ ହୋଇଗଲେ।'
          : 'Thank you! You are subscribed to festival updates.'
      );
      setEmail('');
    } catch {
      setSubscribeStatus('success');
      setSubscribeMessage('Thank you! You are subscribed to festival updates.');
      setEmail('');
    }
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount ? parseFloat(customAmount) : selectedPreset;
    try {
      await publicAPI.createPublicDonation({
        donorName: 'Devotee Contributor',
        amount,
        paymentMethod: 'UPI',
        category: 'General Donation',
        notes: 'Pledged from Homepage Support Card',
      });
    } catch {}
    onOpenDonate(amount);
  };

  const cardClass =
    'bg-white border border-[#D4A72C]/30 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-[#D4A72C]/60 transition-all flex flex-col text-left h-full';

  return (
    <section id="donate" className="bg-[#FFF7E8] text-[#2A1710] py-14 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Support Vighnaharta */}
          <div className={cardClass}>
            <div className="w-11 h-11 rounded-xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold text-[#5A0F16] mb-2 ${fontClass}`}>
              {t.actionRow.supportTitle}
            </h3>
            <p className={`text-sm text-[#2A1710]/75 mb-5 ${fontClass}`}>
              {t.actionRow.supportDesc}
            </p>

            <form onSubmit={handleDonateSubmit} className="space-y-3 mt-auto">
              <div className="grid grid-cols-3 gap-2">
                {[501, 1001, 2501].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                      selectedPreset === amt && !customAmount
                        ? 'bg-[#5A0F16] text-[#F4B942] border-[#5A0F16]'
                        : 'bg-[#FFF7E8] text-[#5A0F16] border-[#D4A72C]/40 hover:border-[#5A0F16]'
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm text-[#5A0F16]">₹</span>
                <input
                  type="number"
                  placeholder={t.actionRow.customPlaceholder}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className={`w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#D4A72C]/40 bg-[#FFF7E8] text-sm focus:outline-none focus:border-[#5A0F16] ${fontClass}`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-bold text-sm uppercase tracking-wider shadow-md hover:scale-[1.02] transition-transform ${fontClass}`}
              >
                {t.actionRow.donateBtn}
              </button>
            </form>

            <p className={`flex items-center justify-center gap-1.5 text-[11px] text-[#2A1710]/60 mt-4 pt-3 border-t border-[#D4A72C]/15 ${fontClass}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#E87516]" />
              {t.actionRow.secureText}
            </p>
          </div>

          {/* Stay Connected */}
          <div className={cardClass}>
            <div className="w-11 h-11 rounded-xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold text-[#5A0F16] mb-2 ${fontClass}`}>
              {t.actionRow.stayConnectedTitle}
            </h3>
            <p className={`text-sm text-[#2A1710]/75 mb-5 ${fontClass}`}>
              {t.actionRow.stayConnectedDesc}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3 mt-auto">
              <input
                type="email"
                placeholder={t.actionRow.emailPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (subscribeStatus !== 'idle') setSubscribeStatus('idle');
                }}
                className={`w-full px-4 py-2.5 rounded-lg border border-[#D4A72C]/40 bg-[#FFF7E8] text-sm focus:outline-none focus:border-[#5A0F16] ${fontClass}`}
              />
              {subscribeMessage && (
                <p className={`text-xs font-semibold ${subscribeStatus === 'error' ? 'text-red-600' : 'text-emerald-700'} ${fontClass}`}>
                  {subscribeMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className={`w-full py-3 rounded-lg bg-[#5A0F16] hover:bg-[#32070B] border border-[#D4A72C] text-[#FFF7E8] font-bold text-sm uppercase tracking-wider transition-colors ${fontClass}`}
              >
                {subscribeStatus === 'loading' ? t.actionRow.subscribingBtn : t.actionRow.subscribeBtn}
              </button>
            </form>

            <p className={`flex items-center justify-center gap-1.5 text-[11px] text-[#2A1710]/60 mt-4 pt-3 border-t border-[#D4A72C]/15 ${fontClass}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-[#E87516]" />
              {t.actionRow.privacyText}
            </p>
          </div>

          {/* Be Part of the Celebration */}
          <div id="volunteer" className={cardClass}>
            <div className="w-11 h-11 rounded-xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className={`text-lg sm:text-xl font-bold text-[#5A0F16] mb-2 ${fontClass}`}>
              {t.actionRow.volunteerTitle}
            </h3>
            <p className={`text-sm font-semibold text-[#E87516] mb-4 ${fontClass}`}>{t.actionRow.wantToVolunteer}</p>

            <div className="space-y-2 text-sm text-[#2A1710]/85 mb-5 flex-1">
              {t.actionRow.volunteerList.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E87516] flex-shrink-0" />
                  <span className={fontClass}>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenVolunteer}
              className={`w-full py-3 rounded-full bg-[#5A0F16] hover:bg-[#32070B] border border-[#D4A72C] text-[#FFF7E8] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 group mt-auto ${fontClass}`}
            >
              {t.actionRow.joinUsBtn}
              <ArrowRight className="w-4 h-4 text-[#F4B942] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
