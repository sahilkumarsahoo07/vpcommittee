import React, { useState, useEffect } from 'react';
import { Bell, Plus, Calendar, Sparkles, Trash2, Edit2, Globe } from 'lucide-react';
import { publicAPI, adminAPI } from '../../services/api';
import { autoTranslateToHindi, autoTranslateToOdia, fetchAutoTranslation } from '../../utils/translationHelper';
import { ImagePicker } from '../../components/ImagePicker';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  title_hi?: string;
  description_hi?: string;
  title_or?: string;
  description_or?: string;
  date: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  showPopup: boolean;
  popupDurationDays: number;
  imageUrl?: string;
}

export const AdminAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<AnnouncementItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [titleOr, setTitleOr] = useState('');
  const [descriptionOr, setDescriptionOr] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [showPopup, setShowPopup] = useState(true);
  const [popupDurationDays, setPopupDurationDays] = useState(3);
  const [imageUrl, setImageUrl] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await publicAPI.getAnnouncements();
      if (res.success && Array.isArray(res.data)) {
        const mapped: AnnouncementItem[] = res.data.map((item: any) => ({
          id: item._id || item.id,
          title: item.title,
          description: item.description || item.content || '',
          title_hi: item.title_hi || '',
          description_hi: item.description_hi || item.content_hi || '',
          title_or: item.title_or || '',
          description_or: item.description_or || item.content_or || '',
          date: item.publishDate ? new Date(item.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: item.category || 'General',
          priority: item.priority || 'HIGH',
          showPopup: item.showPopup ?? true,
          popupDurationDays: item.popupDurationDays || 3,
          imageUrl: item.imageUrl || item.image || '',
        }));
        setAnnouncements(mapped.reverse());
      }
    } catch {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
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
    setCategory('General');
    setPriority('HIGH');
    setShowPopup(true);
    setPopupDurationDays(3);
    setImageUrl('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: AnnouncementItem) => {
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
    setDate(item.date || new Date().toISOString().split('T')[0]);
    setCategory(item.category);
    setPriority(item.priority);
    setShowPopup(item.showPopup);
    setPopupDurationDays(item.popupDurationDays || 3);
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

  const handleSaveAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      setLoading(true);
      const finalTitleHi = titleHi.trim() || autoTranslateToHindi(title);
      const finalDescHi = descriptionHi.trim() || autoTranslateToHindi(description);
      const finalTitleOr = titleOr.trim() || autoTranslateToOdia(title);
      const finalDescOr = descriptionOr.trim() || autoTranslateToOdia(description);

      const payload = {
        title,
        content: description,
        description,
        title_hi: finalTitleHi,
        description_hi: finalDescHi,
        content_hi: finalDescHi,
        title_or: finalTitleOr,
        description_or: finalDescOr,
        content_or: finalDescOr,
        publishDate: date,
        category,
        priority,
        showPopup,
        popupDurationDays: Number(popupDurationDays),
        imageUrl: imageUrl.trim(),
      };

      if (editItem) {
        await adminAPI.updateAnnouncement(editItem.id, payload);
      } else {
        await adminAPI.createAnnouncement(payload);
      }
      setShowModal(false);
      setEditItem(null);
      await fetchAnnouncements();
    } catch {
      fetchAnnouncements();
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<AnnouncementItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item: AnnouncementItem) => {
    setDeleteTarget(item);
  };

  const handleConfirmDeleteAnn = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      setAnnouncements(announcements.filter((a) => a.id !== deleteTarget.id));
      await adminAPI.deleteAnnouncement(deleteTarget.id);
      fetchAnnouncements();
    } catch {
      fetchAnnouncements();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4A72C]/40 pb-3">
        <div>
          <h2 className="font-cinzel text-lg sm:text-2xl font-black text-[#32070B] uppercase tracking-wider">
            Ganesh Utsav Announcements CMS
          </h2>
          <p className="text-[11px] sm:text-xs text-[#2A1710]/70 font-semibold">
            Manage festival announcements, popups, and multi-language translations (English, Hindi, Odia).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-1.5 shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Notice</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-xs">Loading announcements...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl p-5 shadow-md space-y-3 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#F4B942]" />
                  <span className="text-xs font-black uppercase text-[#F4B942] tracking-wider">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      item.priority === 'URGENT' || item.priority === 'HIGH'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-[#D4A72C]/20 text-[#F4B942]'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors ml-2"
                    title="Edit Announcement"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="p-1.5 rounded-lg bg-red-900/60 hover:bg-red-700 text-red-200 text-xs font-bold transition-colors"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {item.imageUrl && (
                <div className="rounded-xl overflow-hidden max-h-32 border border-[#D4A72C]/30 bg-[#170204]">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}

              <h4 className="font-cinzel font-black text-lg text-[#F4B942] leading-snug">{item.title}</h4>

              <p className="text-xs text-[#FFF7E8]/80 leading-relaxed font-medium line-clamp-3">{item.description}</p>

              {(item.title_hi || item.title_or) && (
                <div className="bg-[#170204]/80 p-2.5 rounded-xl border border-[#D4A72C]/20 text-[11px] text-[#F4B942] space-y-1">
                  {item.title_hi && <div><strong className="text-[#E87516]">Hindi (हिंदी):</strong> {item.title_hi}</div>}
                  {item.title_or && <div><strong className="text-[#E87516]">Odia (ଓଡ଼ିଆ):</strong> {item.title_or}</div>}
                </div>
              )}

              <div className="pt-3 border-t border-[#D4A72C]/20 flex flex-wrap items-center justify-between text-[11px] text-[#FFF7E8]/70 gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F4B942]" />
                  <span>Date: {item.date}</span>
                </div>

                {item.showPopup ? (
                  <span className="inline-flex items-center gap-1 text-green-400 font-bold bg-green-950/60 px-2 py-0.5 rounded-full border border-green-800/40">
                    <Sparkles className="w-3 h-3 text-green-400" />
                    Popup Active ({item.popupDurationDays} Days)
                  </span>
                ) : (
                  <span className="text-[#FFF7E8]/50 italic">No Popup</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-6 w-full max-w-xl text-[#FFF7E8] space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-xl font-black text-[#F4B942] uppercase tracking-wider">
                {editItem ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
              <button
                type="button"
                onClick={handleAutoFillTranslations}
                className="px-3 py-1 rounded-lg bg-[#E87516] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-[#d0640d] transition-colors"
                title="Auto-fill Hindi & Odia"
              >
                <Sparkles className={`w-3 h-3 ${translating ? 'animate-spin' : ''}`} />
                <span>{translating ? 'Translating...' : 'Auto-Fill Hindi & Odia'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveAnn} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F4B942]" />
                  <span>Announcement Date (Calendar Picker) *</span>
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
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">English Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mahaprasad Timing Changed"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3.5 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block">English Content / Details *</label>
                  <span className="text-[10px] text-[#F4B942]/80 font-mono font-bold">{description.length} chars</span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleAutoFillTranslations}
                  placeholder="Write complete notice details..."
                  className="w-full min-h-[110px] bg-[#170204] border border-[#D4A72C]/40 focus:border-[#F4B942] rounded-xl py-2.5 px-3.5 text-xs text-[#FFF7E8] resize-y outline-none leading-relaxed"
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
                    className="text-[10px] bg-[#E87516]/20 border border-[#E87516] text-[#F4B942] px-2.5 py-1 rounded-lg hover:bg-[#E87516] hover:text-white transition-colors font-bold uppercase tracking-wider"
                  >
                    ⚡ Auto-Translate
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-[#FFF7E8]/80 block">Hindi Title & Content (हिंदी)</label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    placeholder="उदा. महाप्रसाद समय परिवर्तन सूचना"
                    className="w-full bg-[#240407] border border-[#D4A72C]/40 rounded-xl py-1.5 px-3 text-xs text-[#FFF7E8]"
                  />
                  <textarea
                    rows={3}
                    value={descriptionHi}
                    onChange={(e) => setDescriptionHi(e.target.value)}
                    placeholder="हिंदी विवरण..."
                    className="w-full min-h-[85px] bg-[#240407] border border-[#D4A72C]/40 focus:border-[#F4B942] rounded-xl py-2 px-3 text-xs text-[#FFF7E8] resize-y outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-[#D4A72C]/20">
                  <label className="text-[11px] font-bold uppercase text-[#FFF7E8]/80 block">Odia Title & Content (ଓଡ଼ିଆ)</label>
                  <input
                    type="text"
                    value={titleOr}
                    onChange={(e) => setTitleOr(e.target.value)}
                    placeholder="ଯଥା: ମହାପ୍ରସାଦ ସମୟ ପରିବର୍ତ୍ତନ ସୂଚନା"
                    className="w-full bg-[#240407] border border-[#D4A72C]/40 rounded-xl py-1.5 px-3 text-xs text-[#FFF7E8]"
                  />
                  <textarea
                    rows={3}
                    value={descriptionOr}
                    onChange={(e) => setDescriptionOr(e.target.value)}
                    placeholder="ଓଡ଼ିଆ ବିବରଣୀ..."
                    className="w-full min-h-[85px] bg-[#240407] border border-[#D4A72C]/40 focus:border-[#F4B942] rounded-xl py-2 px-3 text-xs text-[#FFF7E8] resize-y outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Popup Configuration Box */}
              <div className="bg-[#170204] p-4 rounded-2xl border-2 border-[#D4A72C]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F4B942]" />
                    <span className="text-xs font-black uppercase text-[#F4B942]">Show as Overlay Popup on Website</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPopup}
                      onChange={(e) => setShowPopup(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E87516]"></div>
                  </label>
                </div>

                {showPopup && (
                  <div className="space-y-2 pt-2 border-t border-[#D4A72C]/20">
                    <label className="text-[11px] font-bold uppercase text-[#FFF7E8]/80 block">Popup Duration (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={popupDurationDays}
                      onChange={(e) => setPopupDurationDays(Number(e.target.value))}
                      className="w-full bg-[#240407] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#F4B942] font-bold"
                    />
                  </div>
                )}
              </div>

              <ImagePicker
                label="ANNOUNCEMENT IMAGE / BANNER"
                value={imageUrl}
                onChange={setImageUrl}
              />

              <div className="flex gap-2 pt-2">
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
                  {editItem ? 'Update Announcement' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Announcement"
        itemTitle={deleteTarget?.title}
        message={`Are you sure you want to delete the announcement "${deleteTarget?.title}"?`}
        confirmText="Yes, Delete Announcement"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteAnn}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
