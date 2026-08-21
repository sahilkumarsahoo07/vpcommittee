import React, { useState, useEffect } from 'react';
import { Plus, Phone, Mail, Trash2, Edit2, Search, Camera, Image as ImageIcon } from 'lucide-react';
import { InstagramIcon } from '../../components/SocialIcons';
import { publicAPI, adminAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Pagination } from '../components/Pagination';

interface MemberItem {
  id: string;
  name: string;
  designation: string;
  roleType: string;
  phone: string;
  email: string;
  bio: string;
  image?: string;
  instagramId?: string;
  isActive: boolean;
}

export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<MemberItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [roleType, setRoleType] = useState('MEMBER');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [instagramId, setInstagramId] = useState('');

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await publicAPI.getMembers();
      if (res.success && Array.isArray(res.data)) {
        const mapped: MemberItem[] = res.data.map((item: any, idx: number) => ({
          id: item._id || item.id || String(idx),
          name: item.name || 'Committee Member',
          designation: item.designation || 'Executive Member',
          roleType: item.roleType || 'COMMITTEE_MEMBER',
          phone: item.phone || '+91 98000 00000',
          email: item.email || 'member@vighnaharta.org',
          bio: item.bio || item.description || '',
          image: item.image || item.photoUrl || '',
          instagramId: item.instagramId || item.instagram || item.socialLinks?.instagram || '',
          isActive: item.isActive !== false,
        }));
        setMembers(mapped.reverse());
      }
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.roleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.instagramId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedMembers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditItem(null);
    setName('');
    setDesignation('');
    setRoleType('MEMBER');
    setPhone('');
    setEmail('');
    setBio('');
    setImage('');
    setInstagramId('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: MemberItem) => {
    setEditItem(item);
    setName(item.name);
    setDesignation(item.designation);
    setRoleType(item.roleType);
    setPhone(item.phone);
    setEmail(item.email);
    setBio(item.bio || '');
    setImage(item.image || '');
    setInstagramId(item.instagramId || '');
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation) return;

    try {
      setLoading(true);
      const payload = {
        name,
        designation,
        roleType: roleType || 'COMMITTEE_MEMBER',
        phone: phone || '+91 98000 00000',
        email: email || 'member@vighnaharta.org',
        bio: bio || '',
        image: image || '',
        instagramId: instagramId || '',
        socialLinks: { instagram: instagramId || '' },
      };

      if (editItem) {
        await adminAPI.updateMember(editItem.id, payload);
      } else {
        await adminAPI.createMember(payload);
      }
      setName('');
      setDesignation('');
      setPhone('');
      setEmail('');
      setBio('');
      setImage('');
      setInstagramId('');
      setShowModal(false);
      setEditItem(null);
      await fetchMembers();
    } catch {
      fetchMembers();
    }
  };


  const [deleteTarget, setDeleteTarget] = useState<MemberItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (m: MemberItem) => {
    setDeleteTarget(m);
  };

  const handleConfirmDeleteMember = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      setMembers(members.filter((m) => m.id !== deleteTarget.id));
      await adminAPI.deleteMember(deleteTarget.id);
      fetchMembers();
    } catch {
      fetchMembers();
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
            Committee Executive Leadership CMS
          </h2>
          <p className="text-xs text-[#2A1710]/70 font-semibold">
            Manage official office bearers, designated trustees, bios, and executive panel details.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Executive</span>
        </button>
      </div>

      {/* Search & Header Control */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search member by name, designation, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3.5 pl-9 text-xs text-[#2A1710] focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#D4A72C] absolute left-3 top-2.5" />
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">Loading executive members from database...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-xs font-semibold text-[#2A1710]/70">
            No executive members found matching your search criteria.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedMembers.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl p-5 shadow-md space-y-3 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#F4B942] shadow"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#5A0F16] border-2 border-[#F4B942] flex items-center justify-center text-[#F4B942] font-black text-lg">
                            {m.name.charAt(0) || 'V'}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-[#F4B942] leading-tight">{m.name}</h4>
                          <p className="text-[11px] text-[#FFF7E8]/70 font-semibold uppercase">{m.designation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors"
                          title="Edit Member"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(m)}
                          className="p-1.5 rounded-lg bg-red-900/60 hover:bg-red-700 text-red-200 text-xs font-bold transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {m.bio && (
                      <div className="bg-[#170204] p-2.5 rounded-xl border border-[#D4A72C]/20 text-xs text-[#FFF7E8]/80 italic">
                        <p className="line-clamp-2">"{m.bio}"</p>
                      </div>
                    )}

                    <div className="text-xs space-y-1.5 border-t border-[#D4A72C]/30 pt-3">
                      <div className="flex items-center gap-2 text-[#FFF7E8]/80">
                        <Phone className="w-3.5 h-3.5 text-[#D4A72C]" />
                        <span>{m.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#FFF7E8]/80">
                        <Mail className="w-3.5 h-3.5 text-[#D4A72C]" />
                        <span>{m.email}</span>
                      </div>
                      {m.instagramId && (
                        <div className="flex items-center gap-2 text-[#E87516] font-semibold">
                          <InstagramIcon className="w-3.5 h-3.5 text-[#E87516]" />
                          <a
                            href={
                              m.instagramId.startsWith('http')
                                ? m.instagramId
                                : `https://instagram.com/${m.instagramId.replace('@', '')}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {m.instagramId.startsWith('@') ? m.instagramId : `@${m.instagramId}`}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-[#E87516] border-t border-[#D4A72C]/30 pt-2 mt-2">
                    <span>Role: {m.roleType}</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              isDark={false}
            />
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-6 w-full max-w-md text-[#FFF7E8] space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-cinzel text-xl font-black text-[#F4B942] uppercase tracking-wider">
              {editItem ? 'Edit Executive Member' : 'Add Committee Executive'}
            </h3>

            <form onSubmit={handleSaveMember} className="space-y-3">
              {/* Profile Photo Upload / URL Field */}
              <div>
                <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center gap-3 bg-[#170204] p-3 rounded-xl border border-[#D4A72C]/40">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border border-[#F4B942]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#5A0F16] border border-[#F4B942] flex items-center justify-center text-[#F4B942]">
                      <Camera className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-[11px] text-[#FFF7E8]/80 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-[#5A0F16] file:text-[#F4B942] hover:file:bg-[#32070B] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Or paste photo image URL..."
                      className="w-full bg-black/40 border border-[#D4A72C]/30 rounded-lg py-1 px-2 text-[11px] text-[#FFF7E8]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sri Ramesh Patnaik"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Cultural Program In-Charge"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Executive Role</label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#F4B942] font-bold"
                >
                  <option value="PRESIDENT">President / Founder</option>
                  <option value="VICE_PRESIDENT">Vice President</option>
                  <option value="SECRETARY">General Secretary</option>
                  <option value="TREASURER">Treasurer / Finance Head</option>
                  <option value="MEMBER">Executive Member</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                  Instagram Handle / ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                    placeholder="e.g. @ramesh_patnaik or instagram username"
                    className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 pl-8 text-xs text-[#E87516] font-semibold"
                  />
                  <InstagramIcon className="w-4 h-4 text-[#E87516] absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Description / Biography</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe member responsibilities, background, or contributions..."
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98000 12345"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. member@vighnaharta.org"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

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
                  className="flex-1 py-2.5 rounded-xl bg-[#F4B942] text-[#32070B] text-xs font-black uppercase tracking-wider"
                >
                  {editItem ? 'Update Member' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Remove Committee Member"
        itemTitle={deleteTarget?.name}
        message={`Are you sure you want to remove executive member "${deleteTarget?.name}" (${deleteTarget?.designation})?`}
        confirmText="Yes, Remove Member"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteMember}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
