import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Play, Film, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';
import { publicAPI, adminAPI } from '../../services/api';
import { ImagePicker } from '../../components/ImagePicker';
import { processMediaUrl, extractInstagramShortcode, type ProcessedMedia } from '../../utils/mediaHelper';
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
  imageUrl?: string;
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
  const [url, setUrl] = useState('');
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
            imageUrl: item.imageUrl,
            embedUrl: item.embedUrl,
            albumName: item.albumName || 'Ganesh Utsav 2026',
          };
        });
        setGallery(mapped);
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
    setUrl('');
    setManualLink('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setUrl(item.url || '');
    setManualLink(item.url || '');
    setShowModal(true);
  };

  const handleManualLinkChange = (newLink: string) => {
    setManualLink(newLink);
    if (newLink.trim()) {
      const processed = processMediaUrl(newLink.trim());
      if (category === 'Puja' || !category) {
        if (processed.mediaType === 'REEL') setCategory('Reels');
        else if (processed.mediaType === 'YOUTUBE') setCategory('Videos');
        else if (processed.mediaType === 'GDRIVE') setCategory('GDrive');
      }
    }
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const finalUrl = manualLink.trim() || url.trim();
    if (!finalUrl) {
      alert('Please paste a media URL or choose/upload a thumbnail image.');
      return;
    }

    const processed: ProcessedMedia = processMediaUrl(finalUrl);

    try {
      setLoading(true);
      const payload = {
        title,
        category: category || (processed.mediaType === 'REEL' ? 'Reels' : 'Puja'),
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
      setUrl('');
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

  const currentProcessed = manualLink.trim() ? processMediaUrl(manualLink.trim()) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-black text-[#5A0F16]">Gallery & Media CMS</h2>
          <p className="text-xs text-[#32070B]/70 font-semibold">
            Manage festival photos, Instagram reels, YouTube streams & devotional media
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#D4A72C] font-bold text-xs shadow-md hover:bg-[#32070B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Item</span>
        </button>
      </div>

      {/* Instagram Official Stream Configuration Card */}
      <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-3xl border-2 border-[#D4A72C]/50 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <InstagramIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-cinzel font-black text-sm text-[#F4B942]">Official Instagram Handle Stream</h4>
              <p className="text-[11px] text-[#FFF7E8]/70">
                Sync festival Instagram handle: @{instagramHandle} (Embeds Reels & feeds live)
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveInstagramHandle} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F4B942]">@</span>
              <input
                type="text"
                required
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="vighnaharta_puja"
                className="w-full pl-7 pr-3 py-2 text-xs rounded-xl bg-[#170204] border border-[#D4A72C]/40 text-[#FFF7E8] focus:border-[#F4B942] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={savingIg}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#D4A72C] font-bold text-xs hover:bg-[#32070B] transition-colors whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5" />
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
            const rawUrl = g.mediaUrl || g.url || '';
            const processed = processMediaUrl(rawUrl);
            const mediaType = g.mediaType || processed.mediaType;
            const isReel = mediaType === 'REEL';
            const isYoutube = mediaType === 'YOUTUBE';
            const isGdrive = mediaType === 'GDRIVE';
            const isVideo = mediaType === 'VIDEO';
            const isPhoto = mediaType === 'IMAGE';

            const shortcode = isReel ? extractInstagramShortcode(rawUrl) : null;
            const thumbUrl = isReel
              ? (shortcode ? `/api/media/proxy-thumbnail?shortcode=${shortcode}` : processed.thumbnailUrl)
              : (processed.thumbnailUrl || g.imageUrl || rawUrl);

            return (
              <div
                key={g.id}
                className="bg-[#180305] text-[#FFF7E8] border-2 border-[#D4A72C]/40 hover:border-[#F4B942] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
              >
                <div
                  onClick={() => setActiveMediaItem(g)}
                  className="h-64 sm:h-72 overflow-hidden bg-black relative cursor-pointer flex items-center justify-center"
                >
                  {isReel ? (
                    <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center pointer-events-none">
                      <iframe
                        src={g.embedUrl || `https://www.instagram.com/p/${shortcode}/embed/`}
                        title={g.title}
                        className="w-full h-[540px] -mt-10 border-0 pointer-events-none opacity-95 group-hover:opacity-100 transition-opacity"
                        scrolling="no"
                      />
                    </div>
                  ) : (
                    <img
                      src={thumbUrl || '/assets/bannerimage.png'}
                      alt={g.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/bannerimage.png';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 group-hover:from-black/60 transition-colors pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5A0F16]/90 text-[#F4B942] text-[10px] font-black uppercase border border-[#F4B942]/60 backdrop-blur-md shadow">
                      {g.category}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white/90 bg-black/60 border border-white/20 backdrop-blur-md shadow flex items-center gap-1">
                      {isReel && <InstagramIcon className="w-3 h-3 text-pink-400" />}
                      {isYoutube && <YoutubeIcon className="w-3 h-3 text-red-400" />}
                      {isGdrive && <GoogleDriveIcon className="w-3 h-3 text-blue-400" />}
                      {isVideo && <Film className="w-3 h-3 text-[#F4B942]" />}
                      {isPhoto && <ImageIcon className="w-3 h-3 text-emerald-400" />}
                      <span>{isReel ? 'Instagram' : isYoutube ? 'YouTube' : isPhoto ? 'Photo' : 'Video'}</span>
                    </span>
                  </div>

                  {/* Sleek Hover Play Icon */}
                  {!isPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-black/75 backdrop-blur-md border-2 border-[#F4B942] text-[#F4B942] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-[#F4B942] ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-[#FFF7E8] text-sm line-clamp-1 group-hover:text-[#F4B942] transition-colors">{g.title}</h4>
                  <p className="text-[11px] text-[#FFF7E8]/70 line-clamp-1 font-mono truncate">{g.url}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#D4A72C]/20">
                    <button
                      onClick={() => setActiveMediaItem(g)}
                      className="text-[11px] font-bold text-[#F4B942] hover:underline flex items-center gap-1"
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
                <div className="flex items-center justify-between">
                  <label className="text-[#F4B942]">
                    Paste Media URL (Instagram Reel / YouTube / Google Drive / Direct Video)
                  </label>
                  {currentProcessed && (
                    <span className="text-[10px] text-pink-300 font-extrabold uppercase px-2 py-0.5 rounded bg-pink-900/50 border border-pink-500/40">
                      Detected: {currentProcessed.mediaType}
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  value={manualLink}
                  onChange={(e) => handleManualLinkChange(e.target.value)}
                  placeholder="https://www.instagram.com/reel/... or https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl bg-[#170204] border border-[#D4A72C]/40 text-[#FFF7E8] focus:border-[#F4B942] outline-none font-mono text-[11px]"
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        confirmText="Yes, Delete Media"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteMedia}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
