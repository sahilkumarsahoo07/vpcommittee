import React, { useState } from 'react';
import { Bell, Clock, ChevronRight, Sparkles, X } from 'lucide-react';
import { ANNOUNCEMENTS } from '../data/mockData';
import type { AnnouncementItem } from '../types';

export const AnnouncementsSection: React.FC = () => {
  const [activeAnnouncement, setActiveAnnouncement] = useState<AnnouncementItem | null>(null);

  return (
    <section id="announcements" className="bg-[#FFF7E8] text-[#2A1710] py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative border-t border-[#D4A72C]/20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E87516] bg-[#5A0F16]/10 px-3.5 py-1 rounded-full border border-[#D4A72C]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NOTIFICATIONS & UPDATES</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#5A0F16]">
            LATEST ANNOUNCEMENTS
          </h2>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {ANNOUNCEMENTS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveAnnouncement(item)}
              className="group bg-[#FFFDF7] border border-[#D4A72C]/40 hover:border-[#5A0F16] rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.isRedBadge && (
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    )}
                    <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#5A0F16] group-hover:text-[#E87516] transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#2A1710]/70">
                    <Clock className="w-3.5 h-3.5 text-[#E87516]" />
                    <span>{item.timeAgo}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#FFF7E8] text-[#5A0F16] group-hover:bg-[#5A0F16] group-hover:text-[#F4B942] flex items-center justify-center transition-all flex-shrink-0">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Announcement Detail Modal */}
      {activeAnnouncement && (
        <div
          onClick={() => setActiveAnnouncement(null)}
          className="fixed inset-0 z-50 bg-[#32070B]/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFDF7] border-2 border-[#D4A72C] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left space-y-4 relative"
          >
            <button
              onClick={() => setActiveAnnouncement(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#5A0F16] text-[#F4B942] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#E87516] bg-[#D4A72C]/20 px-2.5 py-0.5 rounded">
                Official Announcement
              </span>
              <h3 className="font-cinzel text-xl font-bold text-[#5A0F16]">
                {activeAnnouncement.title}
              </h3>
              <p className="text-xs text-[#2A1710]/60">
                Published {activeAnnouncement.timeAgo} ({activeAnnouncement.date})
              </p>
            </div>

            <p className="text-sm text-[#2A1710] leading-relaxed pt-2 border-t border-[#D4A72C]/20">
              {activeAnnouncement.content}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveAnnouncement(null)}
                className="px-5 py-2 rounded-xl bg-[#5A0F16] text-[#FFF7E8] text-xs font-bold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
