import React, { useState } from 'react';
import { X, Heart, ShieldCheck, QrCode, CheckCircle, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OmIcon } from './DevotionalIcons';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, initialAmount = 1001 }) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentAmount = customAmountInput ? parseFloat(customAmountInput) || 0 : amount;

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F4B942', '#D4A72C', '#E87516', '#FFF7E8'],
      });
    }, 1500);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#32070B]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FFFDF7] border-2 border-[#D4A72C] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left text-[#2A1710]">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#5A0F16] text-[#F4B942] flex items-center justify-center hover:scale-110 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="font-cinzel text-2xl font-bold text-[#5A0F16]">
                  SUPPORT VIGHNAHARTA
                </h3>
                <p className="text-xs text-[#2A1710]/70 font-medium">
                  Contribute to Ganesh Utsav 2026 & Community Service
                </p>
              </div>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-5">
              {/* Amount Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[#5A0F16]">Select Donation Amount</label>
                <div className="grid grid-cols-3 gap-2">
                  {[501, 1001, 2501].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setAmount(amt);
                        setCustomAmountInput('');
                      }}
                      className={`py-2.5 rounded-xl font-extrabold text-sm border transition-all ${
                        amount === amt && !customAmountInput
                          ? 'bg-[#5A0F16] text-[#F4B942] border-[#5A0F16] shadow-md'
                          : 'bg-[#FFF7E8] text-[#5A0F16] border-[#D4A72C]/50'
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="relative pt-1">
                  <span className="absolute left-3.5 top-[18px] font-bold text-sm text-[#5A0F16]">₹</span>
                  <input
                    type="number"
                    placeholder="Enter Custom Amount"
                    value={customAmountInput}
                    onChange={(e) => setCustomAmountInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-sm text-[#2A1710] font-semibold focus:outline-none focus:border-[#5A0F16]"
                  />
                </div>
              </div>

              {/* Donor Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#5A0F16] block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Devotee Name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-xs font-medium text-[#2A1710] focus:outline-none focus:border-[#5A0F16]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#5A0F16] block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit Phone"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-xs font-medium text-[#2A1710] focus:outline-none focus:border-[#5A0F16]"
                  />
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[#5A0F16]">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-[#5A0F16] text-[#F4B942] border-[#5A0F16]'
                        : 'bg-[#FFF7E8] text-[#2A1710] border-[#D4A72C]/50'
                    }`}
                  >
                    <QrCode className="w-4 h-4" /> UPI / QR Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#5A0F16] text-[#F4B942] border-[#5A0F16]'
                        : 'bg-[#FFF7E8] text-[#2A1710] border-[#D4A72C]/50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Card / NetBanking
                  </button>
                </div>
              </div>

              {/* QR Preview if UPI */}
              {paymentMethod === 'upi' && (
                <div className="bg-[#FFF7E8] p-3 rounded-2xl border border-[#D4A72C]/40 text-center space-y-2">
                  <div className="w-24 h-24 bg-[#32070B] rounded-xl mx-auto flex items-center justify-center text-[#F4B942]">
                    <QrCode className="w-16 h-16" />
                  </div>
                  <p className="text-[11px] font-mono text-[#5A0F16] font-bold">UPI ID: vighnaharta@upi</p>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-bold text-base uppercase tracking-wider shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing Donation...' : `Proceed to Pay ₹${currentAmount.toLocaleString()}`}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#2A1710]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E87516]" />
                <span>256-bit Encrypted • Tax Exemption Receipt Sent to Phone</span>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#5A0F16] border-2 border-[#F4B942] text-[#F4B942] flex items-center justify-center mx-auto shadow-2xl">
              <OmIcon className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Donation Successful
              </span>
              <h3 className="font-devanagari text-2xl font-bold text-[#5A0F16]">
                ॥ ॐ गं गणपतये नमः ॥
              </h3>
              <p className="font-cinzel text-xl font-bold text-[#E87516]">
                Thank You, {donorName || 'Devotee'}!
              </p>
              <p className="text-xs text-[#2A1710]/80 max-w-sm mx-auto">
                Your generous contribution of <strong className="text-[#5A0F16]">₹{currentAmount.toLocaleString()}</strong> has been received. May Lord Ganesha shower endless health, prosperity & happiness upon you and your family!
              </p>
            </div>

            <div className="bg-[#FFF7E8] p-4 rounded-2xl border border-[#D4A72C]/40 text-left text-xs space-y-1 font-mono">
              <p><strong>Receipt No:</strong> VPC-2026-{Math.floor(100000 + Math.random() * 900000)}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>UPI Transaction ID:</strong> TXN{Date.now()}</p>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-xl bg-[#5A0F16] text-[#FFF7E8] font-bold text-xs uppercase tracking-wider hover:bg-[#32070B]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
