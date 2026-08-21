import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Play, Film, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';
import { publicAPI, adminAPI } from '../../services/api';
import { ImagePicker } from '../../components/ImagePicker';
import { processMediaUrl, type ProcessedMedia } from '../../utils/mediaHelper';
import { MediaModal } from '../../components/MediaModal';
import { InstagramIcon, YoutubeIcon, GoogleDriveIcon } from '../../components/SocialIcons';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  mediaType: string;
  url: string;
  mediaUrl?: string;
  embedUrl?: string;
  albumName: string;
}

const CATEGORY_OPTIONS = [
  { value: 'Puja', label: 'Puja & Rituals' },
  { value: 'Decorations', label: 'Decorations & Lighting' },
  { value: 'Cultural', label: 'Cultural Performances' },
  { value: 'Visarjan', label: 'Visarjan Procession' },
  { value: 'Reels', label: 'Instagram Reels & Posts' },
  { value: 'Videos', label: 'YouTube & Video Highlights' },
  { value: 'GDrive', label: 'Google Drive Videos' },
  { value: 'Photos', label: 'Special Photos & Wallpapers' },
  { value: 'Songs', label: 'Bhakti Devotional Songs' },
];

export const AdminGalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [activeMediaItem, setActiveMediaItem] = useState<GalleryItem | null>(null);

  // Instagram Handle Settings for SuperAdmin
  const [instagramHandle, setInstagramHandle] = useState('vighnaharta_puja');
  const [savingIg, setSavingIg] = useState(false);
  const [igSuccess, setIgSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Puja');
  const [url, setUrl] = useState('/assets/bannerimage.png');
  const [manualLink, setManualLink] = useState('');

  const fetchGallery = async () => {
    try {
      setLoading(true);
      // Fetch website settings for Superadmin configured Instagram handle
      try {
        const settingsRes = await publicAPI.getSettings();
        if (settingsRes.success && settingsRes.data?.instagramHandle) {
          setInstagramHandle(settingsRes.data.instagramHandle);
        }
      } catch {}

      const res = await publicAPI.getGallery();
      if (res.success && Array.isArray(res.data)) {
        const mapped: GalleryItem[] = res.data.map((item: any, idx: number) => {
          const rawUrl = item.mediaUrl || item.url || item.imageUrl || '/assets/bannerimage.png';
          return {
            id: item._id || item.id || `gal_${idx}`,
            title: item.title || 'Festival Moment',
            category: item.category || 'Puja',
            mediaType: item.mediaType || 'IMAGE',
            url: rawUrl,
            mediaUrl: item.mediaUrl || rawUrl,
            embedUrl: item.embedUrl,
            albumName: item.albumName || 'Ganesh Utsav 2026',
          };
        });
        setGallery(mapped.reverse());
      }
    } catch {
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSaveInstagramHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingIg(true);
      setIgSuccess('');
      const clean = instagramHandle.trim().replace(/^@/, '');
      const res = await adminAPI.updateSettings({ instagramHandle: clean });
      if (res.success) {
        setInstagramHandle(clean);
        setIgSuccess(`Official Instagram handle saved to @${clean}! Public stream synced.`);
        setTimeout(() => setIgSuccess(''), 5000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save Instagram Handle');
    } finally {
      setSavingIg(false);
    }
  };

  const handleOpenAdd = () => {
    setEditItem(null);
    setTitle('');
    setCategory('Puja');
    setUrl('/assets/bannerimage.png');
    setManualLink('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setUrl(item.url);
    setManualLink(item.url);
    setShowModal(true);
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const finalUrl = manualLink.trim() || url.trim() || '/assets/bannerimage.png';
    const processed: ProcessedMedia = processMediaUrl(finalUrl);

    try {
      setLoading(true);
      const payload = {
        title,
        category,
        mediaType: processed.mediaType,
        imageUrl: processed.thumbnailUrl || finalUrl,
        mediaUrl: finalUrl,
        url: finalUrl,
        embedUrl: processed.embedUrl,
        albumName: 'Ganesh Utsav 2026',
      };

      if (editItem) {
        await adminAPI.updateGalleryItem(editItem.id, payload);
      } else {
        await adminAPI.createGalleryItem(payload);
      }
      setTitle('');
      setManualLink('');
      setShowModal(false);
      await fetchGallery();
    } catch (err: any) {
      alert(err.message || 'Failed to save gallery media');
    } finally {
      setLoading(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item: GalleryItem) => {
    setDeleteTarget(item);
  };

  const handleConfirmDeleteMedia = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      setLoading(true);
      await adminAPI.deleteGalleryItem(deleteTarget.id);
      await fetchGallery();
    } catch (err: any) {
      alert(err.message || 'Failed to delete media item');
    } finally {
      setLoading(false);
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider">
            Gallery & Instagram CMS
          </h2>
          <p className="text-xs text-[#2A1710]/70 font-semibold">
            Manage media gallery and configure official Instagram stream API for the committee.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Link Media</span>
        </button>
      </div>

      {/* SUPERADMIN INSTAGRAM HANDLE API CONFIGURATION BOX */}
      <div className="bg-gradient-to-r from-[#240407] to-[#32070B] text-[#FFF7E8] p-5 sm:p-6 rounded-3xl border-2 border-[#F4B942]/60 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-[#120204] rounded-[14px] flex items-center justify-center">
                <InstagramIcon className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-black text-[#F4B942]">
                  SuperAdmin Instagram API Configuration
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-pink-900/60 border border-pink-500/40 text-pink-200 text-[10px] font-black uppercase">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#FFF7E8]/70 font-semibold">
                Set the official committee Instagram Handle ID to automatically fetch & display all posts & reels on the main website.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveInstagramHandle} className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-[#170204] border border-[#F4B942]/60 rounded-xl px-3 py-2 text-xs font-bold text-[#F4B942] w-full md:w-64">
              <InstagramIcon className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span className="text-pink-300">@</span>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="vighnaharta_puja"
                className="bg-transparent border-none text-[#FFF7E8] text-xs font-bold outline-none w-full"
                required
              />
            </div>
            <button
              type="submit"
              disabled={savingIg}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingIg ? 'Saving...' : 'Save & Sync API'}</span>
            </button>
          </form>
        </div>

        {igSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-900/60 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{igSuccess}</span>
          </div>
        )}
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">
          Loading media gallery from database...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map((g) => {
            const processed = processMediaUrl(g.url);
            const mediaType = g.mediaType || processed.mediaType;
            const thumbUrl = processed.thumbnailUrl || g.url;

            return (
              <div
                key={g.id}
                className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between relative group"
              >
                <div
                  onClick={() => setActiveMediaItem(g)}
                  className="h-48 overflow-hidden bg-[#170204] relative cursor-pointer"
                >
                  <img
                    src={thumbUrl}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/bannerimage.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  {/* Play icon overlay for non-image items */}
                  {mediaType !== 'IMAGE' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#E87516]/90 border-2 border-[#F4B942] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        {mediaType === 'REEL' ? (
                          <InstagramIcon className="w-6 h-6 text-pink-300" />
                        ) : mediaType === 'YOUTUBE' ? (
                          <YoutubeIcon className="w-6 h-6 text-red-400" />
                        ) : (
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        )}
                      </div>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#5A0F16] text-[#F4B942] text-[10px] font-black uppercase border border-[#F4B942]/60 flex items-center gap-1">
                    {mediaType === 'REEL' && <InstagramIcon className="w-3 h-3 text-pink-400" />}
                    {mediaType === 'YOUTUBE' && <YoutubeIcon className="w-3 h-3 text-red-400" />}
                    {mediaType === 'GDRIVE' && <GoogleDriveIcon className="w-3 h-3 text-blue-400" />}
                    {mediaType === 'VIDEO' && <Film className="w-3 h-3 text-[#F4B942]" />}
                    {mediaType === 'IMAGE' && <ImageIcon className="w-3 h-3 text-emerald-400" />}
                    <span>{g.category}</span>
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-[#FFF7E8] text-sm line-clamp-1">{g.title}</h4>
                  <p className="text-[11px] text-[#FFF7E8]/70 line-clamp-1 font-mono truncate">{g.url}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#D4A72C]/20">
                    <button
                      onClick={() => setActiveMediaItem(g)}
                      className="text-[10px] font-bold text-[#F4B942] hover:underline flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Preview
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(g)}
                        className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(g)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/40 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Media Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#240407] border-2 border-[#D4A72C] text-[#FFF7E8] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <h3 className="font-cinzel text-xl font-black text-[#F4B942]">
              {editItem ? 'Edit Media Item' : 'Upload or Link Media'}
            </h3>

            <form onSubmit={handleSaveMedia} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[#F4B942]">Title / Caption</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grand Visarjan Procession 2026"
                  className="w-full px-3 py-2 rounded-xl bg-[#170204] border border-[#D4A72C]/40 text-[#FFF7E8] focus:border-[#F4B942] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#F4B942]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#170204] border border-[#D4A72C]/40 text-[#FFF7E8] focus:border-[#F4B942] outline-none"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#F4B942]">
                  Paste Media URL (Instagram Reel / YouTube / Google Drive / Direct Video)
                </label>
                <input
                  type="url"
                  value={manualLink}
                  onChange={(e) => setManualLink(e.target.value)}
                  placeholder="https://www.instagram.com/reel/... or https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl bg-[#170204] border border-[#D4A72C]/40 text-[#FFF7E8] focus:border-[#F4B942] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#FFF7E8]/70">Or Choose Image / Asset Thumbnail</label>
                <ImagePicker value={url} onChange={setUrl} label="Select Thumbnail" />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#D4A72C] font-black uppercase hover:bg-[#32070B] transition-colors"
                >
                  Save Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Player Modal */}
      {activeMediaItem && (
        <MediaModal item={activeMediaItem} onClose={() => setActiveMediaItem(null)} />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Gallery Media"
        itemTitle={deleteTarget?.title}
        message={`Are you sure you want to delete the media item "${deleteTarget?.title}"?`}
        confirmText="Yes, Delete Media"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteMedia}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
