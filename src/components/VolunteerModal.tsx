import React, { useState } from 'react';
import { X, Users, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

import { publicAPI } from '../services/api';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await publicAPI.submitVolunteer({
        name,
        phone,
        email,
        areaOfInterest: selectedInterests.join(', ') || area || 'General Service',
        availability: 'Full Festival / Flexible',
        message,
      });
    } catch {}

    setIsSubmitting(false);
    setIsSubmitted(true);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F4B942', '#E87516', '#D4A72C'],
    });
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#32070B] border-2 border-[#D4A72C] rounded-2xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh] text-left">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#5A0F16] text-[#F4B942] flex items-center justify-center hover:bg-[#A31D24] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-[#5A0F16] border border-[#D4A72C] text-[#F4B942] flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6" />
              </div>
              <h3 className={`text-xl sm:text-2xl font-extrabold text-[#F4B942] uppercase ${fontClass}`}>
                {t.volunteerModal.title}
              </h3>
              <p className={`text-xs text-[#FFF7E8]/80 ${fontClass}`}>{t.volunteerModal.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-semibold text-[#FFF7E8]/80 ${fontClass}`}>
                    {t.volunteerModal.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.volunteerModal.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-[#D4A72C]/40 bg-[#5A0F16]/40 text-[#FFF7E8] text-sm focus:outline-none focus:border-[#F4B942] ${fontClass}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-semibold text-[#FFF7E8]/80 ${fontClass}`}>
                    {t.volunteerModal.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.volunteerModal.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-[#D4A72C]/40 bg-[#5A0F16]/40 text-[#FFF7E8] text-sm focus:outline-none focus:border-[#F4B942] ${fontClass}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-semibold text-[#FFF7E8]/80 ${fontClass}`}>
                    {t.volunteerModal.emailLabel}
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-[#D4A72C]/40 bg-[#5A0F16]/40 text-[#FFF7E8] text-sm focus:outline-none focus:border-[#F4B942] ${fontClass}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-semibold text-[#FFF7E8]/80 ${fontClass}`}>
                    {t.volunteerModal.areaLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.volunteerModal.areaPlaceholder}
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-[#D4A72C]/40 bg-[#5A0F16]/40 text-[#FFF7E8] text-sm focus:outline-none focus:border-[#F4B942] ${fontClass}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-bold text-[#F4B942] uppercase tracking-wider block ${fontClass}`}>
                  {t.volunteerModal.helpLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {t.volunteerModal.interests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`p-2 rounded-lg text-xs font-semibold text-left border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#5A0F16] text-[#F4B942] border-[#F4B942]'
                            : 'bg-[#5A0F16]/40 text-[#FFF7E8]/70 border-[#D4A72C]/20 hover:border-[#D4A72C]/50'
                        } ${fontClass}`}
                      >
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 text-[10px] ${isSelected ? 'bg-[#F4B942] text-[#32070B] border-[#F4B942]' : 'border-[#FFF7E8]/40'}`}>
                          {isSelected && '✓'}
                        </span>
                        <span className="truncate">{interest}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-semibold text-[#FFF7E8]/80 ${fontClass}`}>
                  {t.volunteerModal.msgLabel}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.volunteerModal.msgPlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full min-h-[75px] px-3 py-2 rounded-lg border border-[#D4A72C]/40 bg-[#5A0F16]/40 text-[#FFF7E8] text-sm focus:outline-none focus:border-[#F4B942] resize-y leading-relaxed ${fontClass}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform ${fontClass}`}
              >
                {isSubmitting ? t.volunteerModal.submittingBtn : t.volunteerModal.submitBtn}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-900/60 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
              <HeartHandshake className="w-10 h-10" />
            </div>

            <h3 className={`text-2xl font-black text-[#F4B942] uppercase ${fontClass}`}>
              {t.volunteerModal.successTitle}
            </h3>

            <p className={`text-base font-semibold text-[#FFF7E8] ${fontClass}`}>{t.volunteerModal.welcomeMsg}</p>

            <p className={`text-xs text-[#FFF7E8]/80 max-w-sm mx-auto leading-relaxed ${fontClass}`}>
              {t.volunteerModal.contactNote}
            </p>

            <button
              onClick={handleResetAndClose}
              className={`px-8 py-2.5 rounded-full bg-[#5A0F16] border border-[#D4A72C] text-[#FFF7E8] font-bold text-xs uppercase tracking-wider hover:bg-[#A31D24] transition-colors ${fontClass}`}
            >
              {t.volunteerModal.closeBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
