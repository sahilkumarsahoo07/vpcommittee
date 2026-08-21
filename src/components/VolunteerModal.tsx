import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Send } from 'lucide-react';
import type { VolunteerFormData } from '../types';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: '',
    phone: '',
    email: '',
    area: '',
    interests: ['Volunteer Service'],
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const availableInterests = [
    'Volunteer Service',
    'Decorations & Pandal',
    'Photography & Media',
    'Cultural Events',
    'Event Management',
    'Prasad Distribution',
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
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
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-2xl font-bold text-[#5A0F16]">
                  BE PART OF THE CELEBRATION
                </h3>
                <p className="text-xs text-[#2A1710]/70 font-medium">
                  Register as a Volunteer for Ganesh Utsav 2026
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#5A0F16] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-xs font-medium text-[#2A1710] focus:outline-none focus:border-[#5A0F16]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#5A0F16] block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit Mobile"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-xs font-medium text-[#2A1710] focus:outline-none focus:border-[#5A0F16]"
                  />
                </div>
              </div>

              {/* Email & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#5A0F16] block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-xs font-medium text-[#2A1710] focus:outline-none focus:border-[#5A0F16]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#5A0F16] block mb-1">Area / Locality</label>
                  <input
                    type="text"
                    placeholder="e.g. Ganesh Nagar"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-xs font-medium text-[#2A1710] focus:outline-none focus:border-[#5A0F16]"
                  />
                </div>
              </div>

              {/* Checkboxes: How would you like to help? */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-[#5A0F16]">How would you like to help?</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {availableInterests.map((interest) => {
                    const isChecked = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-2 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#5A0F16] text-[#F4B942] border-[#5A0F16]'
                            : 'bg-[#FFF7E8] text-[#2A1710] border-[#D4A72C]/40'
                        }`}
                      >
                        <span className="truncate">{interest}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#F4B942] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[11px] font-bold uppercase text-[#5A0F16] block mb-1">Additional Message / Availability</label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your availability or prior volunteer experience..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D4A72C]/50 bg-[#FFF7E8] text-xs font-medium text-[#2A1710] focus:outline-none focus:border-[#5A0F16]"
                />
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F4B942] via-[#D4A72C] to-[#E87516] text-[#32070B] font-bold text-sm uppercase tracking-wider shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering...' : 'Submit Volunteer Application'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-cinzel text-2xl font-bold text-[#5A0F16]">
                Registration Successful!
              </h3>
              <p className="text-sm font-semibold text-[#E87516]">
                Welcome to the Vighnaharta Seva Team, {formData.name}!
              </p>
              <p className="text-xs text-[#2A1710]/80 max-w-sm mx-auto">
                Thank you for offering your voluntary service for Ganesh Utsav 2026. Our committee volunteer coordinator will contact you via WhatsApp / Call at <strong className="text-[#5A0F16]">{formData.phone}</strong> shortly.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-xl bg-[#5A0F16] text-[#FFF7E8] font-bold text-xs uppercase tracking-wider hover:bg-[#32070B]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
