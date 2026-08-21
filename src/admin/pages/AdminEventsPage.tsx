import React, { useState, useEffect } from 'react';
import { Calendar, Plus, MapPin, Edit2, Trash2, Globe, Sparkles } from 'lucide-react';
import { publicAPI, adminAPI } from '../../services/api';
import { autoTranslateToHindi, autoTranslateToOdia, fetchAutoTranslation } from '../../utils/translationHelper';
import { ImagePicker } from '../../components/ImagePicker';

import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

interface EventItem {
  id: string;
  title: string;
  description: string;
  title_hi?: string;
  description_hi?: string;
  title_or?: string;
  description_or?: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: string;
  imageUrl?: string;
}

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<EventItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [titleOr, setTitleOr] = useState('');
  const [descriptionOr, setDescriptionOr] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await publicAPI.getEvents();
      if (res.success && Array.isArray(res.data)) {
        const mapped: EventItem[] = res.data.map((item: any, idx: number) => ({
          id: item._id || item.id || String(idx),
          title: item.title || 'Festival Ritual',
          description: item.description || 'Devotional festival event and puja ceremony.',
          title_hi: item.title_hi || '',
          description_hi: item.description_hi || '',
          title_or: item.title_or || '',
          description_or: item.description_or || '',
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : '2026-09-07',
          startTime: item.startTime || '08:00 AM',
          endTime: item.endTime || '12:00 PM',
          location: item.location || 'Main Mandap Grounds',
          status: item.status || 'UPCOMING',
          imageUrl: item.imageUrl || item.url || '',
        }));
        setEvents(mapped.reverse());
      }
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setTitle('');
    setDescription('');
    setTitleHi('');
    setDescriptionHi('');
    setTitleOr('');
    setDescriptionOr('');
    setDate(new Date().toISOString().split('T')[0]);
    setLocation('');
    setImageUrl('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: EventItem) => {
    setEditItem(item);
    setTitle(item.title);
    setDescription(item.description);
    
    const hiTitle = (item.title_hi && item.title_hi !== item.title) ? item.title_hi : autoTranslateToHindi(item.title);
    const hiDesc = (item.description_hi && item.description_hi !== item.description) ? item.description_hi : autoTranslateToHindi(item.description);

    const orTitle = (item.title_or && item.title_or !== item.title) ? item.title_or : autoTranslateToOdia(item.title);
    const orDesc = (item.description_or && item.description_or !== item.description) ? item.description_or : autoTranslateToOdia(item.description);

    setTitleHi(hiTitle);
    setDescriptionHi(hiDesc);
    setTitleOr(orTitle);
    setDescriptionOr(orDesc);
    setDate(item.date);
    setLocation(item.location);
    setImageUrl(item.imageUrl || '');
    setShowModal(true);
  };

  const handleAutoFillTranslations = async () => {
    if (!title && !description) return;
    setTranslating(true);
    try {
      if (title) {
        const [hiTitle, orTitle] = await Promise.all([
          fetchAutoTranslation(title, 'hi'),
          fetchAutoTranslation(title, 'or'),
        ]);
        setTitleHi(hiTitle);
        setTitleOr(orTitle);
      }
      if (description) {
        const [hiDesc, orDesc] = await Promise.all([
          fetchAutoTranslation(description, 'hi'),
          fetchAutoTranslation(description, 'or'),
        ]);
        setDescriptionHi(hiDesc);
        setDescriptionOr(orDesc);
      }
    } catch {
      if (title) {
        setTitleHi(autoTranslateToHindi(title));
        setTitleOr(autoTranslateToOdia(title));
      }
      if (description) {
        setDescriptionHi(autoTranslateToHindi(description));
        setDescriptionOr(autoTranslateToOdia(description));
      }
    } finally {
      setTranslating(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    try {
      setLoading(true);
      const finalTitleHi = titleHi.trim() || autoTranslateToHindi(title);
      const finalDescHi = descriptionHi.trim() || autoTranslateToHindi(description || 'Devotional ceremony');
      const finalTitleOr = titleOr.trim() || autoTranslateToOdia(title);
      const finalDescOr = descriptionOr.trim() || autoTranslateToOdia(description || 'Devotional ceremony');

      const payload = {
        title,
        description: description || 'Festival ritual and devotional ceremony',
        title_hi: finalTitleHi,
        description_hi: finalDescHi,
        title_or: finalTitleOr,
        description_or: finalDescOr,
        date,
        startTime: '06:00 PM',
        endTime: '09:00 PM',
        location: location || 'Main Mandap Grounds',
        status: 'UPCOMING',
        imageUrl: imageUrl || '',
      };

      if (editItem) {
        await adminAPI.updateEvent(editItem.id, payload);
      } else {
        await adminAPI.createEvent(payload);
      }
      setShowModal(false);
      setEditItem(null);
      await fetchEvents();
    } catch {
      fetchEvents();
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (evt: EventItem) => {
    setDeleteTarget(evt);
  };

  const handleConfirmDeleteEvent = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      setEvents(events.filter((e) => e.id !== deleteTarget.id));
      await adminAPI.deleteEvent(deleteTarget.id);
      fetchEvents();
    } catch {
      fetchEvents();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider">
            Ganesh Mahotsav Events & Schedule CMS
          </h2>
          <p className="text-xs text-[#2A1710]/70 font-semibold">
            Schedule Ganesh Utsav rituals with interactive calendar picker and multi-language support (English, Hindi, Odia).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">Loading festival schedule from database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl p-5 shadow-md space-y-3 relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F4B942]" />
                  <h4 className="font-cinzel font-black text-base text-[#F4B942] uppercase">{evt.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4A72C] text-[#32070B] text-[10px] font-black uppercase">
                    {evt.status}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(evt)}
                    className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors ml-2"
                    title="Edit Event"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(evt)}
                    className="p-1.5 rounded-lg bg-red-900/60 hover:bg-red-700 text-red-200 text-xs font-bold transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#FFF7E8]/80 leading-relaxed font-medium">{evt.description}</p>

              {(evt.title_hi || evt.title_or) && (
                <div className="bg-[#170204]/80 p-2.5 rounded-xl border border-[#D4A72C]/20 text-[11px] text-[#F4B942] space-y-1">
                  {evt.title_hi && <div><strong className="text-[#E87516]">Hindi (हिंदी):</strong> {evt.title_hi}</div>}
                  {evt.title_or && <div><strong className="text-[#E87516]">Odia (ଓଡ଼ିଆ):</strong> {evt.title_or}</div>}
                </div>
              )}

              <div className="text-xs space-y-1 border-t border-[#D4A72C]/30 pt-3">
                <div className="flex items-center gap-2 text-[#F4B942]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Scheduled Date: {evt.date} ({evt.startTime} - {evt.endTime})</span>
                </div>
                <div className="flex items-center gap-2 text-[#FFF7E8]/70">
                  <MapPin className="w-3.5 h-3.5 text-[#D4A72C]" />
                  <span>{evt.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-6 w-full max-w-lg text-[#FFF7E8] space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-xl font-black text-[#F4B942] uppercase tracking-wider">
                {editItem ? 'Edit Festival Event' : 'Add Festival Event'}
              </h3>
              <button
                type="button"
                onClick={handleAutoFillTranslations}
                disabled={translating}
                className="px-3 py-1 rounded-lg bg-[#E87516] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-[#d0640d] transition-colors disabled:opacity-50"
                title="Auto-fill Hindi & Odia"
              >
                <Sparkles className={`w-3 h-3 ${translating ? 'animate-spin' : ''}`} />
                <span>{translating ? 'Translating...' : 'Auto-Fill Hindi & Odia'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F4B942]" />
                  <span>Select Event Date (Calendar Picker) *</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onClick={(e) => {
                      try {
                        (e.target as any).showPicker();
                      } catch (err) {}
                    }}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3.5 text-xs text-[#F4B942] font-bold cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">English Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleAutoFillTranslations}
                  placeholder="e.g. 108 Lamp Sandhya Aarti"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Location / Mandap Venue</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Main Aarti Hall"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">English Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleAutoFillTranslations}
                  placeholder="Details of ritual..."
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] resize-none"
                />
              </div>

              {/* Multi-language Translation Section */}
              <div className="bg-[#170204] p-3.5 rounded-2xl border border-[#D4A72C]/30 space-y-3">
                <div className="flex items-center justify-between text-[#F4B942] text-xs font-bold uppercase border-b border-[#D4A72C]/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#E87516]" />
                    <span>Multi-Language Translations (Hindi & Odia)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillTranslations}
                    className="text-[10px] bg-[#E87516] text-white px-2.5 py-1 rounded-lg hover:bg-[#d0640d] transition-colors font-bold uppercase tracking-wider flex items-center gap-1 shadow"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Translate</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-[#FFF7E8]/80 block">Hindi Title (हिंदी)</label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    placeholder="उदा. १०८ दीप संध्या आरती"
                    className="w-full bg-[#240407] border border-[#D4A72C]/40 rounded-xl py-1.5 px-3 text-xs text-[#FFF7E8]"
                  />
                  <textarea
                    rows={2}
                    value={descriptionHi}
                    onChange={(e) => setDescriptionHi(e.target.value)}
                    placeholder="हिंदी में विवरण..."
                    className="w-full bg-[#240407] border border-[#D4A72C]/40 rounded-xl py-1.5 px-3 text-xs text-[#FFF7E8] resize-none"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-[#D4A72C]/20">
                  <label className="text-[11px] font-bold uppercase text-[#FFF7E8]/80 block">Odia Title (ଓଡ଼ିଆ)</label>
                  <input
                    type="text"
                    value={titleOr}
                    onChange={(e) => setTitleOr(e.target.value)}
                    placeholder="ଯଥା: ୧୦୮ ଦୀପ ସନ୍ଧ୍ୟା ଆରତୀ"
                    className="w-full bg-[#240407] border border-[#D4A72C]/40 rounded-xl py-1.5 px-3 text-xs text-[#FFF7E8]"
                  />
                  <textarea
                    rows={2}
                    value={descriptionOr}
                    onChange={(e) => setDescriptionOr(e.target.value)}
                    placeholder="ଓଡ଼ିଆରେ ବିବରଣୀ..."
                    className="w-full bg-[#240407] border border-[#D4A72C]/40 rounded-xl py-1.5 px-3 text-xs text-[#FFF7E8] resize-none"
                  />
                </div>
              </div>

              <ImagePicker
                label="EVENT BANNER IMAGE (OPTIONAL)"
                value={imageUrl}
                onChange={setImageUrl}
              />

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#170204] border border-[#D4A72C]/30 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#F4B942] text-[#32070B] text-xs font-black uppercase tracking-wider hover:bg-[#e2a832] transition-colors"
                >
                  {editItem ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Festival Event"
        itemTitle={deleteTarget?.title}
        message={`Are you sure you want to delete the event "${deleteTarget?.title}"?`}
        confirmText="Yes, Delete Event"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteEvent}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
