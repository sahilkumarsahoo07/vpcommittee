import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  ArrowUp,
  ArrowDown,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Tag,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';
import { InstagramIcon } from '../../components/SocialIcons';
import { publicAPI, adminAPI, userAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Pagination } from '../components/Pagination';
import { getMonogramInitial } from '../../utils/translationHelper';

export const STANDARD_DESIGNATIONS = [
  'Founder',
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Committee Member',
  'Volunteer',
];

export interface MemberItem {
  id: string;
  _id?: string;
  userId?: any;
  name: string;
  email?: string;
  phone?: string;
  displayPhone?: string;
  profilePhoto?: string;
  image?: string;
  galleryImage?: string;
  designation: string;
  roleType?: string;
  bio?: string;
  instagram?: string;
  instagramId?: string;
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  userRole?: string;
}

export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'VISIBLE' | 'HIDDEN'>('ALL');
  const [selectedDesignationFilter, setSelectedDesignationFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<MemberItem | null>(null);

  // User Selection in Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Showcase Form Fields
  const [designation, setDesignation] = useState('President');
  const [customDesignation, setCustomDesignation] = useState('');
  const [isCustomDesignation, setIsCustomDesignation] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [email, setEmail] = useState('');
  const [displayPhone, setDisplayPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [bio, setBio] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isVisible, setIsVisible] = useState(true);

  // View Profile Modal
  const [viewProfileItem, setViewProfileItem] = useState<MemberItem | null>(null);

  // Remove Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<MemberItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMembersAndUsers = async () => {
    try {
      setLoading(true);
      const [membersRes, usersRes] = await Promise.all([
        publicAPI.getMembers().catch(() => null),
        userAPI.getUsers().catch(() => null),
      ]);

      if (membersRes?.success && Array.isArray(membersRes.data)) {
        const mapped: MemberItem[] = membersRes.data.map((item: any, idx: number) => {
          const u = item.userId;
          const resolvedName = item.name || (u && typeof u === 'object' ? u.name : null) || 'Committee Member';
          const resolvedEmail = item.email !== undefined ? item.email : '';
          const resolvedPhone = item.displayPhone !== undefined ? item.displayPhone : (item.phone !== undefined ? item.phone : '');
          const resolvedPhoto = item.profilePhoto || item.image || (u && typeof u === 'object' ? u.profilePhoto : null) || '';
          const resolvedRole = (u && typeof u === 'object' ? u.role : null) || item.userRole || item.roleType || 'MEMBER';
          const resolvedInsta = item.instagram || item.instagramId || item.socialLinks?.instagram || '';

          return {
            id: item._id ? item._id.toString() : item.id ? item.id.toString() : String(idx),
            _id: item._id ? item._id.toString() : item.id,
            userId: u?._id || u?.id || u || item.userId,
            name: resolvedName,
            email: resolvedEmail,
            phone: resolvedPhone,
            displayPhone: item.displayPhone || resolvedPhone,
            profilePhoto: resolvedPhoto,
            image: resolvedPhoto,
            galleryImage: item.galleryImage || '',
            designation: item.designation || 'Committee Member',
            roleType: resolvedRole,
            userRole: resolvedRole,
            bio: item.bio || '',
            instagram: resolvedInsta,
            instagramId: resolvedInsta,
            displayOrder: Number(item.displayOrder) || idx + 1,
            isVisible: item.isVisible !== false && item.isActive !== false,
            isActive: item.isActive !== false && item.isVisible !== false,
          };
        });
        setMembers(mapped);
      }

      if (usersRes?.success && Array.isArray(usersRes.data)) {
        setExistingUsers(usersRes.data);
      }
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembersAndUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatusFilter, selectedDesignationFilter]);

  // Combined designations for filter dropdown
  const allDesignations = Array.from(
    new Set([...STANDARD_DESIGNATIONS, ...members.map((m) => m.designation)])
  ).filter(Boolean);

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.phone || '').includes(searchTerm) ||
      (m.instagram || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'VISIBLE' && m.isVisible) ||
      (selectedStatusFilter === 'HIDDEN' && !m.isVisible);

    const matchesDesignation =
      selectedDesignationFilter === 'ALL' ||
      m.designation.toLowerCase().trim() === selectedDesignationFilter.toLowerCase().trim();

    return matchesSearch && matchesStatus && matchesDesignation;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // KPI Metrics
  const totalCount = members.length;
  const visibleCount = members.filter((m) => m.isVisible).length;
  const hiddenCount = members.filter((m) => !m.isVisible).length;

  // Filter users for search dropdown
  const searchedUsers = existingUsers.filter((u) => {
    const q = userSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = async () => {
    setEditItem(null);
    setSelectedUser(null);
    setUserSearchQuery('');
    setShowUserDropdown(true);
    setDuplicateWarning(null);
    setDesignation('Founder');
    setCustomDesignation('');
    setIsCustomDesignation(false);
    setProfilePhoto('');
    setEmail('');
    setDisplayPhone('');
    setInstagram('');
    setBio('');
    setDisplayOrder(members.length + 1);
    setIsVisible(true);
    setShowModal(true);

    try {
      const uRes = await userAPI.getUsers();
      if (uRes?.success && Array.isArray(uRes.data)) {
        setExistingUsers(uRes.data);
      }
    } catch {}
  };

  const handleOpenEdit = (item: MemberItem) => {
    setEditItem(item);
    setDuplicateWarning(null);

    // Find linked user from existingUsers
    const linked = existingUsers.find(
      (u) =>
        (item.userId && (u.id === item.userId || u._id === item.userId || u.id === item.userId?._id || u._id === item.userId?._id)) ||
        (u.email && item.email && u.email.toLowerCase() === item.email.toLowerCase())
    );

    setSelectedUser(linked || {
      name: item.name,
      email: item.email,
      phone: item.phone,
      profilePhoto: item.profilePhoto,
      role: item.userRole || item.roleType || 'MEMBER',
    });

    setUserSearchQuery('');
    setShowUserDropdown(false);

    if (STANDARD_DESIGNATIONS.includes(item.designation)) {
      setDesignation(item.designation);
      setIsCustomDesignation(false);
      setCustomDesignation('');
    } else {
      setDesignation('OTHER');
      setIsCustomDesignation(true);
      setCustomDesignation(item.designation);
    }

    setProfilePhoto(item.profilePhoto || '');
    setEmail(item.email || '');
    setDisplayPhone(item.displayPhone || item.phone || '');
    setInstagram(item.instagram || item.instagramId || '');
    setBio(item.bio || '');
    setDisplayOrder(item.displayOrder || 1);
    setIsVisible(item.isVisible);
    setShowModal(true);
  };

  const handleSelectUser = (user: any) => {
    // Check if user is already added to members showcase
    const userId = user.id || user._id;
    const isAlreadyMember = members.some(
      (m) =>
        (m.userId && (m.userId === userId || m.userId?._id === userId || m.userId?.id === userId)) ||
        (m.email && user.email && m.email.toLowerCase() === user.email.toLowerCase())
    );

    if (isAlreadyMember) {
      setDuplicateWarning(`${user.name} is already added to the Members section. Please edit their existing entry.`);
    } else {
      setDuplicateWarning(null);
    }

    setSelectedUser(user);
    setProfilePhoto(user.profilePhoto || '');
    setEmail(user.email || '');
    setDisplayPhone(user.phone || '');
    setUserSearchQuery('');
    setShowUserDropdown(false);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Please select an existing user account.');
      return;
    }

    if (!editItem && duplicateWarning) {
      alert(duplicateWarning);
      return;
    }

    const resolvedDesignation = isCustomDesignation
      ? customDesignation.trim() || 'Committee Member'
      : designation;

    const payload = {
      userId: selectedUser.id || selectedUser._id,
      name: selectedUser.name,
      email: email.trim(),
      phone: displayPhone.trim(),
      displayPhone: displayPhone.trim(),
      profilePhoto: profilePhoto.trim() || selectedUser.profilePhoto || '',
      designation: resolvedDesignation,
      roleType: selectedUser.role || 'MEMBER',
      bio: bio.trim(),
      instagram: instagram.trim(),
      instagramId: instagram.trim(),
      displayOrder: Number(displayOrder) || 1,
      isVisible,
      isActive: isVisible,
    };

    try {
      if (editItem) {
        await adminAPI.updateMember(editItem.id, payload);
      } else {
        await adminAPI.createMember(payload);
      }
      await fetchMembersAndUsers();
    } catch {
      await fetchMembersAndUsers();
    } finally {
      setShowModal(false);
      setEditItem(null);
    }
  };

  // Quick Visibility Toggle (Hide ≠ Delete)
  const handleToggleVisibility = async (item: MemberItem) => {
    const newStatus = !item.isVisible;
    // Optimistic UI update
    setMembers((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, isVisible: newStatus, isActive: newStatus } : m))
    );

    try {
      await adminAPI.updateMember(item.id, { isVisible: newStatus, isActive: newStatus });
      await fetchMembersAndUsers();
    } catch {
      await fetchMembersAndUsers();
    }
  };

  // Quick Reorder (Move Up / Down)
  const handleMoveOrder = async (item: MemberItem, direction: 'UP' | 'DOWN') => {
    const currentOrder = item.displayOrder;
    const newOrder = direction === 'UP' ? Math.max(1, currentOrder - 1) : currentOrder + 1;

    setMembers((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, displayOrder: newOrder } : m))
    );

    try {
      await adminAPI.updateMember(item.id, { displayOrder: newOrder });
      await fetchMembersAndUsers();
    } catch {
      await fetchMembersAndUsers();
    }
  };

  const handleRemoveClick = (item: MemberItem) => {
    setDeleteTarget(item);
  };

  const handleConfirmRemove = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      await adminAPI.deleteMember(deleteTarget.id);
      await fetchMembersAndUsers();
    } catch {
      // Done
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">Super Admin</span>;
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">Admin</span>;
      case 'COMMITTEE_MEMBER':
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Committee Member</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">Member</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider flex items-center gap-2">
            <Users className="w-7 h-7 text-[#E87516]" />
            <span>Members & Leadership Management</span>
          </h2>
          <p className="text-xs text-[#2A1710]/80 font-medium mt-1">
            Showcase organizational leaders (Founders, Presidents, Secretaries, etc.) on the homepage by linking their existing user accounts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Total Members</span>
            <Users className="w-4 h-4 text-[#F4B942]" />
          </div>
          <div className="text-2xl font-black text-[#F4B942] mt-1">{totalCount}</div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">Featured leadership roster</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Visible on Homepage</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-1">{visibleCount}</div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">Live on website homepage</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Hidden Members</span>
            <EyeOff className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">{hiddenCount}</div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">Preserved in dashboard (Unpublished)</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#D4A72C] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search member name, designation, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-1.5 px-3 pl-9 text-[11px] sm:text-xs text-[#2A1710] font-semibold focus:outline-none focus:border-[#5A0F16]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-[10px]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Visibility Status Filter */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <span className="text-[11px] font-bold text-[#32070B] whitespace-nowrap">Status:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-1.5 px-2.5 text-[11px] sm:text-xs text-[#32070B] font-bold focus:outline-none focus:border-[#5A0F16] w-full sm:w-auto"
              >
                <option value="ALL">All Status ({members.length})</option>
                <option value="VISIBLE">● Visible ({visibleCount})</option>
                <option value="HIDDEN">○ Hidden ({hiddenCount})</option>
              </select>
            </div>

            {/* Designation Filter */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <span className="text-[11px] font-bold text-[#32070B] whitespace-nowrap">Role:</span>
              <select
                value={selectedDesignationFilter}
                onChange={(e) => setSelectedDesignationFilter(e.target.value)}
                className="bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-1.5 px-2.5 text-[11px] sm:text-xs text-[#32070B] font-bold focus:outline-none focus:border-[#5A0F16] w-full sm:w-auto max-w-[150px] truncate"
              >
                <option value="ALL">All Designations</option>
                {allDesignations.map((desig) => (
                  <option key={desig} value={desig}>
                    {desig}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results summary note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-gray-600 border-t border-[#D4A72C]/20 pt-2.5">
          <span>
            Showing <strong className="text-[#32070B]">{filteredMembers.length}</strong> of{' '}
            <strong className="text-[#32070B]">{members.length}</strong> member records
          </span>
          <span className="text-[10px] text-gray-500 italic">
            * Showcase profile only. User account remains untouched.
          </span>
        </div>

        {/* Members Table */}
        {loading ? (
          <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-xs">
            Loading member leadership records...
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden divide-y divide-[#D4A72C]/20">
              {paginatedMembers.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-500 font-semibold">
                  No members found matching your search.
                </div>
              ) : (
                paginatedMembers.map((m) => (
                  <div key={m.id} className="py-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {m.profilePhoto ? (
                          <img
                            src={m.profilePhoto}
                            alt={m.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#D4A72C] shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#5A0F16] text-[#F4B942] font-black text-xs flex items-center justify-center font-cinzel border border-[#D4A72C] shrink-0">
                            {getMonogramInitial(m.name)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#32070B] flex flex-wrap items-center gap-1 leading-tight">
                            <span className="truncate">{m.name}</span>
                            {getRoleBadge(m.userRole)}
                          </h4>
                          <span className="text-[10.5px] text-[#E87516] font-bold block truncate">{m.designation}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleVisibility(m)}
                        className={`px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase flex items-center gap-1 transition-all shrink-0 ${
                          m.isVisible
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        {m.isVisible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                        <span>{m.isVisible ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-gray-600">
                      <span className="truncate">{m.displayPhone || m.phone || 'No phone'}</span>
                      {m.instagram && (
                        <span className="text-pink-600 font-semibold flex items-center gap-1 text-[10.5px] truncate">
                          <InstagramIcon className="w-3 h-3 shrink-0" />
                          <span className="truncate">{m.instagram.replace('https://instagram.com/', '@')}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(m, 'UP')}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(m, 'DOWN')}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <span className="text-[10px] text-gray-500 font-mono ml-0.5">#{m.displayOrder}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewProfileItem(m)}
                          className="px-2 py-1 rounded-lg bg-[#32070B] text-[#F4B942] text-[10px] font-bold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942]"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveClick(m)}
                          className="p-1.5 rounded-lg bg-red-100 text-red-700"
                          title="Remove From Homepage"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A1710]">
                <thead className="bg-[#32070B] text-[#F4B942] font-cinzel uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-3.5 rounded-l-xl">Member Account</th>
                    <th className="py-3 px-3.5">Organization Designation</th>
                    <th className="py-3 px-3.5">Contact Number</th>
                    <th className="py-3 px-3.5">Instagram</th>
                    <th className="py-3 px-3.5 text-center">Order</th>
                    <th className="py-3 px-3.5 text-center">Homepage Status</th>
                    <th className="py-3 px-3.5 text-center rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#2A1710]/60">
                        No member records found matching your search.
                      </td>
                    </tr>
                  ) : (
                    paginatedMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-[#FFF7E8]/80 transition-colors">
                        {/* Member */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-3">
                            {m.profilePhoto ? (
                              <img
                                src={m.profilePhoto}
                                alt={m.name}
                                className="w-10 h-10 rounded-xl object-cover border border-[#D4A72C] bg-[#240407]"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-[#5A0F16] text-[#F4B942] font-black text-sm flex items-center justify-center font-cinzel border border-[#D4A72C]">
                                {getMonogramInitial(m.name)}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-[#32070B] flex items-center gap-1.5">
                                <span>{m.name}</span>
                                {getRoleBadge(m.userRole)}
                              </div>
                              <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                                {m.email && <span>{m.email}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Designation */}
                        <td className="py-3 px-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border border-[#D4A72C]/40 bg-[#32070B] text-[#F4B942]">
                            {m.designation}
                          </span>
                          {m.bio && (
                            <p className="text-[10px] text-gray-500 italic truncate max-w-[200px] mt-1" title={m.bio}>
                              "{m.bio}"
                            </p>
                          )}
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-3.5">
                          {m.displayPhone || m.phone ? (
                            <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-[#E87516]" />
                              <span>{m.displayPhone || m.phone}</span>
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Instagram */}
                        <td className="py-3 px-3.5">
                          {m.instagram ? (
                            <a
                              href={
                                m.instagram.startsWith('http')
                                  ? m.instagram
                                  : `https://instagram.com/${m.instagram.replace('@', '')}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-800 font-semibold flex items-center gap-1 transition-colors"
                            >
                              <InstagramIcon className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[120px]">
                                {m.instagram.replace('https://instagram.com/', '@')}
                              </span>
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Display Order */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="inline-flex items-center gap-1 bg-[#FFF7E8] px-2 py-0.5 rounded-lg border border-[#D4A72C]/40">
                            <span className="font-mono font-bold text-xs text-[#32070B]">
                              #{m.displayOrder}
                            </span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleMoveOrder(m, 'UP')}
                                className="text-gray-500 hover:text-[#5A0F16] leading-none"
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                onClick={() => handleMoveOrder(m, 'DOWN')}
                                className="text-gray-500 hover:text-[#5A0F16] leading-none"
                                title="Move Down"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Status (Hide ≠ Delete) */}
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={() => handleToggleVisibility(m)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all mx-auto ${
                              m.isVisible
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-400 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                            }`}
                            title={m.isVisible ? 'Click to Hide from Homepage' : 'Click to Show on Homepage'}
                          >
                            {m.isVisible ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewProfileItem(m)}
                              className="p-1.5 rounded-lg bg-[#32070B] text-[#F4B942] hover:bg-[#5A0F16] transition-colors shadow-sm"
                              title="View Preview Card"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(m)}
                              className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors shadow-sm"
                              title="Edit Member Showcase"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveClick(m)}
                              className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors shadow-sm"
                              title="Remove From Homepage"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredMembers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              isDark={false}
            />
          </>
        )}
      </div>

      {/* ADD / EDIT MEMBER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-5 sm:p-6 w-full max-w-lg text-[#FFF7E8] space-y-4 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-3 border-b border-[#D4A72C]/30 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4A72C] to-[#E87516] flex items-center justify-center text-[#1F0407] shadow shrink-0 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase tracking-wider">
                  {editItem ? 'Edit Member Showcase' : 'Add Homepage Member'}
                </h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  Select an existing user account and assign their organizational leadership position.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              {/* STEP 1: SELECT EXISTING USER */}
              {!editItem ? (
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-bold uppercase text-[#F4B942] block">
                    1. Select Existing User Account *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#D4A72C] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search existing user by name, email, phone, role..."
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setShowUserDropdown(true);
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      className="w-full bg-[#120204] border border-[#D4A72C]/50 rounded-xl py-2.5 px-3 pl-9 text-xs text-[#FFF7E8] font-semibold focus:outline-none focus:border-[#F4B942]"
                    />
                  </div>

                  {/* Dropdown list */}
                  {showUserDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#1A0306] border-2 border-[#D4A72C] rounded-2xl max-h-48 overflow-y-auto z-50 shadow-2xl divide-y divide-[#D4A72C]/20">
                      {searchedUsers.length === 0 ? (
                        <div className="p-3 text-center text-xs text-gray-400 font-semibold">
                          No matching user accounts found.
                        </div>
                      ) : (
                        searchedUsers.map((u) => (
                          <div
                            key={u.id || u._id}
                            onClick={() => handleSelectUser(u)}
                            className="p-2.5 hover:bg-[#32070B] cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              {u.profilePhoto ? (
                                <img
                                  src={u.profilePhoto}
                                  alt={u.name}
                                  className="w-8 h-8 rounded-lg object-cover border border-[#D4A72C]"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-[#5A0F16] text-[#F4B942] font-black text-xs flex items-center justify-center font-cinzel">
                                  {getMonogramInitial(u.name)}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-xs text-[#F4B942] block">{u.name}</span>
                                <span className="text-[10px] text-gray-400">{u.email || u.phone}</span>
                              </div>
                            </div>
                            {getRoleBadge(u.role)}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : null}

              {/* DUPLICATE WARNING */}
              {duplicateWarning && !editItem && (
                <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/60 flex items-start gap-2.5 text-xs text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-300">Duplicate User Detected</span>
                    <span>{duplicateWarning}</span>
                  </div>
                </div>
              )}

              {/* AUTO-LOADED USER PROFILE CARD */}
              {selectedUser && (
                <div className="p-3.5 rounded-2xl bg-[#120204] border border-[#D4A72C]/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {selectedUser.profilePhoto ? (
                      <img
                        src={selectedUser.profilePhoto}
                        alt={selectedUser.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#F4B942]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#5A0F16] text-[#F4B942] font-black text-lg flex items-center justify-center font-cinzel border border-[#F4B942]">
                        {getMonogramInitial(selectedUser.name)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#F4B942]">{selectedUser.name}</span>
                        {getRoleBadge(selectedUser.role)}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {selectedUser.email && <span>{selectedUser.email}</span>}
                        {selectedUser.phone && <span> • {selectedUser.phone}</span>}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                        🔒 Profile Auto-Loaded (Read-Only)
                      </span>
                    </div>
                  </div>

                  {!editItem && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUser(null);
                        setDuplicateWarning(null);
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                    >
                      Change
                    </button>
                  )}
                </div>
              )}

              {/* STEP 2: MEMBER SHOWCASE INFORMATION */}
              <div className="space-y-3 pt-1 border-t border-[#D4A72C]/30">
                <span className="text-xs font-bold uppercase text-[#E87516] tracking-wider block">
                  2. Member Showcase Details
                </span>

                {/* Designation / Position */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                      Organization Designation *
                    </label>
                    <select
                      value={isCustomDesignation ? 'OTHER' : designation}
                      onChange={(e) => {
                        if (e.target.value === 'OTHER') {
                          setIsCustomDesignation(true);
                        } else {
                          setIsCustomDesignation(false);
                          setDesignation(e.target.value);
                        }
                      }}
                      className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#F4B942] font-bold focus:outline-none focus:border-[#F4B942]"
                    >
                      {STANDARD_DESIGNATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                      <option value="OTHER">Other (Custom Designation)...</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                      Display Order on Homepage
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value))}
                      className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-amber-300 font-bold"
                    />
                  </div>
                </div>

                {isCustomDesignation && (
                  <div>
                    <label className="text-xs font-bold uppercase text-amber-300 block mb-1">
                      Custom Designation Title *
                    </label>
                    <input
                      type="text"
                      required={isCustomDesignation}
                      value={customDesignation}
                      onChange={(e) => setCustomDesignation(e.target.value)}
                      placeholder="e.g. Chief Coordinator / Cultural Lead"
                      className="w-full bg-[#120204] border border-amber-400/60 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                    />
                  </div>
                )}

                {/* Member Portrait Photo (Clean Uploader Card) */}
                <div className="p-3.5 rounded-2xl bg-[#120204] border border-[#D4A72C]/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-[#F4B942] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E87516]" />
                      Member Portrait Photo (Optional)
                    </label>
                    {profilePhoto ? (
                      <button
                        type="button"
                        onClick={() => {
                          setProfilePhoto('');
                          setShowUrlInput(false);
                        }}
                        className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Remove Photo
                      </button>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3.5">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Portrait Preview"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F4B942] bg-[#1A0306] shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-[#5A0F16] text-[#F4B942] font-black text-2xl flex items-center justify-center font-cinzel border-2 border-[#D4A72C] shadow shrink-0">
                        {getMonogramInitial(selectedUser?.name || 'M')}
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-[#D4A72C] hover:bg-[#F4B942] text-[#1A0306] font-bold text-xs flex items-center gap-1.5 transition-colors shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (reader.result) setProfilePhoto(reader.result.toString());
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setShowUrlInput(!showUrlInput)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF7E8] font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/20"
                        >
                          <LinkIcon className="w-3.5 h-3.5 text-[#D4A72C]" />
                          <span>{showUrlInput ? 'Hide URL' : 'Paste URL'}</span>
                        </button>
                      </div>

                      {showUrlInput && (
                        <input
                          type="text"
                          value={profilePhoto}
                          onChange={(e) => setProfilePhoto(e.target.value)}
                          placeholder="Paste image URL (https://...)"
                          className="w-full bg-[#1A0306] border border-[#D4A72C]/50 rounded-xl py-1.5 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                        />
                      )}

                      <p className="text-[10.5px] text-[#FFF7E8]/65 font-medium">
                        {profilePhoto ? '✓ Custom portrait image loaded' : 'Default: Uses golden monogram initials medallion.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional Contact Fields with Quick Clear Actions */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#FFF7E8]/70">
                    <span className="font-bold text-[#F4B942] uppercase text-xs">Contact Details (100% Optional)</span>
                    <span className="italic text-[10px] text-gray-400">* Leave blank to hide from homepage</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Email */}
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                        Email
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rahul@example.com"
                          className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 pr-7 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                        />
                        {email ? (
                          <button
                            type="button"
                            onClick={() => setEmail('')}
                            className="absolute right-2 text-gray-400 hover:text-white p-0.5"
                            title="Clear email"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                        Phone Number
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={displayPhone}
                          onChange={(e) => setDisplayPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 pr-7 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                        />
                        {displayPhone ? (
                          <button
                            type="button"
                            onClick={() => setDisplayPhone('')}
                            className="absolute right-2 text-gray-400 hover:text-white p-0.5"
                            title="Clear phone"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Instagram Account */}
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                        Instagram Account
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          placeholder="e.g. @rahul_kumar"
                          className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 pr-7 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                        />
                        {instagram ? (
                          <button
                            type="button"
                            onClick={() => setInstagram('')}
                            className="absolute right-2 text-gray-400 hover:text-white p-0.5"
                            title="Clear instagram"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Short Bio */}
                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Short Bio / Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. Dedicated to serving the community and supporting organizational initiatives."
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#120204] border border-[#D4A72C]/30">
                  <div>
                    <span className="text-xs font-bold text-[#F4B942] block">Homepage Visibility</span>
                    <span className="text-[10px] text-gray-400">
                      {isVisible ? '● Visible on website homepage' : '○ Hidden from website homepage'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isVisible
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {isVisible ? '● Visible' : '○ Hidden'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#120204] border border-[#D4A72C]/30 text-xs font-bold uppercase hover:bg-[#32070B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedUser || (!editItem && !!duplicateWarning)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-lg disabled:opacity-50"
                >
                  {editItem ? 'Update Showcase' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PROFILE MODAL */}
      {viewProfileItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1F0407] border-2 border-[#F4B942] rounded-3xl p-6 w-full max-w-md text-[#FFF7E8] space-y-4 shadow-2xl relative my-6">
            <button
              onClick={() => setViewProfileItem(null)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#D4A72C]/30 pb-3">
              {viewProfileItem.profilePhoto ? (
                <img
                  src={viewProfileItem.profilePhoto}
                  alt={viewProfileItem.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F4B942] shadow-xl bg-[#240407]"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#5A0F16] text-[#F4B942] font-black text-xl flex items-center justify-center font-cinzel border-2 border-[#F4B942]">
                  {getMonogramInitial(viewProfileItem.name)}
                </div>
              )}
              <div>
                <h3 className="font-cinzel text-base font-black text-[#F4B942] leading-tight">
                  {viewProfileItem.name}
                </h3>
                <span className="text-xs text-[#E87516] font-bold block">{viewProfileItem.designation}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {getRoleBadge(viewProfileItem.userRole)}
                </div>
              </div>
            </div>

            {viewProfileItem.bio && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#F4B942] uppercase tracking-wider">Bio / Description</span>
                <p className="text-xs text-[#FFF7E8]/85 italic bg-[#120204] p-3 rounded-xl border border-[#D4A72C]/30">
                  "{viewProfileItem.bio}"
                </p>
              </div>
            )}

            <div className="space-y-2 border-t border-[#D4A72C]/20 pt-3 text-xs">
              {(viewProfileItem.displayPhone || viewProfileItem.phone) && (
                <div className="flex items-center gap-2 text-[#FFF7E8]/80">
                  <Phone className="w-3.5 h-3.5 text-[#E87516]" />
                  <span>{viewProfileItem.displayPhone || viewProfileItem.phone}</span>
                </div>
              )}
              {viewProfileItem.instagram && (
                <div className="flex items-center gap-2 text-pink-400">
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>{viewProfileItem.instagram.replace('https://instagram.com/', '@')}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#D4A72C]/20">
              <span className="text-gray-400">Display Order: #{viewProfileItem.displayOrder}</span>
              <span className="font-bold text-emerald-400">
                {viewProfileItem.isVisible ? '● Live on Homepage' : '○ Hidden'}
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewProfileItem(null)}
                className="w-full py-2.5 rounded-xl bg-[#F4B942] text-[#32070B] font-bold text-xs uppercase hover:brightness-110"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE CONFIRMATION MODAL */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Remove From Homepage?"
        itemTitle={deleteTarget ? `${deleteTarget.name} (${deleteTarget.designation})` : undefined}
        message={`Are you sure you want to remove ${deleteTarget?.name} from the Members section? ${deleteTarget?.name} will no longer appear in the Members section. The user's account will NOT be deleted.`}
        confirmText="Yes, Remove Member"
        isLoading={isDeleting}
        onConfirm={handleConfirmRemove}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
