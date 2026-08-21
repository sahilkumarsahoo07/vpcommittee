import React, { useState, useEffect } from 'react';
import { X, Heart, ShieldCheck, CheckCircle2, QrCode, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 1001,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  const [amount, setAmount] = useState<number>(initialAmount);
  const [customInput, setCustomInput] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  const fontClass = language === 'hi' ? 'font-devanagari' : language === 'or' ? 'font-odia' : 'font-cinzel';

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
      setCustomInput('');
    }
  }, [initialAmount, isOpen]);

  if (!isOpen) return null;

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInput(val);
    if (val && !isNaN(Number(val))) {
      setAmount(Number(val));
    }
  };

  const handlePresetClick = (preset: number) => {
    setAmount(preset);
    setCustomInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const randomReceipt = 'VPC-' + Math.floor(100000 + Math.random() * 900000);
      setReceiptNumber(randomReceipt);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F4B942', '#E87516', '#D4A72C', '#5A0F16'],
      });
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#32070B] border-2 border-[#D4A72C] rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden text-left">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#5A0F16] text-[#F4B942] flex items-center justify-center hover:bg-[#A31D24] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-[#5A0F16] border border-[#D4A72C] text-[#F4B942] flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h3 className={`text-xl sm:text-2xl font-extrabold text-[#F4B942] uppercase ${fontClass}`}>
                {t.donationModal.title}
              </h3>
              <p className={`text-xs text-[#FFF7E8]/80 ${fontClass}`}>{t.donationModal.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Amount */}
              <div className="space-y-2">
                <label className={`text-xs font-bold text-[#F4B942] uppercase tracking-wider block ${fontClass}`}>
                  {t.donationModal.selectAmount}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[251, 501, 1001, 2501].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        amount === preset && !customInput
                          ? 'bg-gradient-to-r from-[#F4B942] to-[#E87516] text-[#32070B] border-[#F4B942] shadow-md'
                          : 'bg-[#5A0F16]/60 text-[#FFF7E8] border-[#D4A72C]/30 hover:border-[#D4A72C]'
                      }`}
                    >
                      ₹{preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm text-[#F4B942]">₹</span>
                  <input
                    type="number"
                    placeholder={t.donationModal.customAmount}
                    value={customInput}
                    onChange={handleCustomChange}
                    className={`w-full pl-8 pr-4 py-2 rounded-lg border border-[#D4A72C]/40 bg-[#5A0F16]/40 text-[#FFF7E8] text-sm focus:outline-none focus:border-[#F4B942] ${fontClass}`}
                  />
                </div>
              </div>

              {/* Devotee Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-semibold text-[#FFF7E8]/80 ${fontClass}`}>
                    {t.donationModal.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.donationModal.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-[#D4A72C]/40 bg-[#5A0F16]/40 text-[#FFF7E8] text-sm focus:outline-none focus:border-[#F4B942] ${fontClass}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-semibold text-[#FFF7E8]/80 ${fontClass}`}>
                    {t.donationModal.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.donationModal.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border border-[#D4A72C]/40 bg-[#5A0F16]/40 text-[#FFF7E8] text-sm focus:outline-none focus:border-[#F4B942] ${fontClass}`}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className={`text-xs font-bold text-[#F4B942] uppercase tracking-wider block ${fontClass}`}>
                  {t.donationModal.paymentMethod}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-[#5A0F16] text-[#F4B942] border-[#F4B942]'
                        : 'bg-[#5A0F16]/40 text-[#FFF7E8]/70 border-[#D4A72C]/20'
                    } ${fontClass}`}
                  >
                    <QrCode className="w-4 h-4" />
                    {t.donationModal.upiMethod}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#5A0F16] text-[#F4B942] border-[#F4B942]'
                        : 'bg-[#5A0F16]/40 text-[#FFF7E8]/70 border-[#D4A72C]/20'
                    } ${fontClass}`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {t.donationModal.cardMethod}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 rounded-xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform ${fontClass}`}
              >
                {isProcessing ? t.donationModal.processingBtn : `${t.donationModal.payBtn} (₹${amount.toLocaleString()})`}
              </button>

              <div className={`flex items-center justify-center gap-1.5 text-[11px] text-[#FFF7E8]/60 ${fontClass}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-[#F4B942]" />
                <span>{t.donationModal.securityBadge}</span>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-900/60 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className={`inline-block text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40 ${fontClass}`}>
              {t.donationModal.successBadge}
            </span>

            <p className={`text-base font-semibold text-[#F4B942] ${fontClass}`}>{t.donationModal.successShloka}</p>

            <h3 className={`text-2xl font-black text-[#FFF7E8] uppercase ${fontClass}`}>{t.donationModal.thankYou}</h3>

            <p className={`text-sm text-[#FFF7E8]/85 max-w-sm mx-auto leading-relaxed ${fontClass}`}>
              {t.donationModal.blessingMsg}
            </p>

            <div className="bg-[#5A0F16]/60 border border-[#D4A72C]/40 rounded-xl p-3 text-xs text-[#F4B942] space-y-1">
              <p className={fontClass}>{t.donationModal.receiptNo} <span className="font-mono font-bold text-[#FFF7E8]">{receiptNumber}</span></p>
              <p className={fontClass}>Amount Paid: <span className="font-bold text-[#FFF7E8]">₹{amount.toLocaleString()}</span></p>
            </div>

            <button
              onClick={handleResetAndClose}
              className={`px-8 py-2.5 rounded-full bg-[#5A0F16] border border-[#D4A72C] text-[#FFF7E8] font-bold text-xs uppercase tracking-wider hover:bg-[#A31D24] transition-colors ${fontClass}`}
            >
              {t.donationModal.doneBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
