import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';
import { adminAPI, userAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Pagination } from '../components/Pagination';

export const VOLUNTEER_CATEGORIES = [
  'Community Service',
  'Events & Pandal',
  'Puja & Rituals',
  'Maha Prasad Seva',
  'Crowd & Security',
  'Media & Cultural',
  'Medical & Emergency',
  'Youth & Logistics',
];

export interface VolunteerItem {
  id: string;
  _id?: string;
  userId?: any;
  name: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  title: string;
  bio?: string;
  category: string;
  volunteerSince: string;
  achievements?: string;
  displayOrder: number;
  isVisible: boolean;
  userRole?: string;
}

export const AdminVolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([]);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'VISIBLE' | 'HIDDEN'>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<VolunteerItem | null>(null);

  // User Selection in Modal
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Volunteer Specific Form Fields
  const [volunteerTitle, setVolunteerTitle] = useState('Community Volunteer');
  const [category, setCategory] = useState('Community Service');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [bio, setBio] = useState('');
  const [volunteerSince, setVolunteerSince] = useState('2026');
  const [achievements, setAchievements] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isVisible, setIsVisible] = useState(true);

  // View Profile Modal
  const [viewProfileItem, setViewProfileItem] = useState<VolunteerItem | null>(null);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<VolunteerItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchVolunteersAndUsers = async () => {
    try {
      setLoading(true);
      const [volRes, usersRes] = await Promise.all([
        adminAPI.getVolunteers().catch(() => null),
        userAPI.getUsers().catch(() => null),
      ]);

      if (volRes?.success && Array.isArray(volRes.data)) {
        const mapped: VolunteerItem[] = volRes.data.map((item: any, idx: number) => ({
          id: item._id || item.id || String(idx),
          _id: item._id || item.id,
          userId: item.userId,
          name: item.userId?.name || item.name || 'Volunteer Member',
          email: item.userId?.email || item.email || '',
          phone: item.userId?.phone || item.phone || '',
          profilePhoto: item.userId?.profilePhoto || item.profilePhoto || '',
          userRole: item.userId?.role || item.userRole || 'MEMBER',
          title: item.title || 'Community Volunteer',
          bio: item.bio || '',
          category: item.category || 'Community Service',
          volunteerSince: String(item.volunteerSince || '2026'),
          achievements: item.achievements || '',
          displayOrder: Number(item.displayOrder) || idx + 1,
          isVisible: item.isVisible !== false,
        }));
        setVolunteers(mapped);
      }

      if (usersRes?.success && Array.isArray(usersRes.data)) {
        setExistingUsers(usersRes.data);
      }
    } catch {
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteersAndUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatusFilter, selectedCategoryFilter]);

  // Combined categories
  const allCategories = Array.from(
    new Set([...VOLUNTEER_CATEGORIES, ...volunteers.map((v) => v.category)])
  ).filter(Boolean);

  // Filtered volunteers
  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.phone || '').includes(searchTerm);

    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'VISIBLE' && v.isVisible) ||
      (selectedStatusFilter === 'HIDDEN' && !v.isVisible);

    const matchesCategory =
      selectedCategoryFilter === 'ALL' ||
      v.category.toLowerCase().trim() === selectedCategoryFilter.toLowerCase().trim();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage) || 1;
  const paginatedVolunteers = filteredVolunteers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // KPI Metrics
  const totalVolunteersCount = volunteers.length;
  const visibleCount = volunteers.filter((v) => v.isVisible).length;
  const hiddenCount = volunteers.filter((v) => !v.isVisible).length;
  const categoriesCount = allCategories.length;

  // Filtered user accounts for selection
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

  const handleOpenAdd = () => {
    setEditItem(null);
    setSelectedUser(null);
    setUserSearchQuery('');
    setShowUserDropdown(false);
    setVolunteerTitle('Community Volunteer');
    setCategory('Community Service');
    setCustomCategoryInput('');
    setIsCustomCategory(false);
    setBio('');
    setVolunteerSince('2026');
    setAchievements('');
    setDisplayOrder(volunteers.length + 1);
    setIsVisible(true);
    setShowModal(true);
  };

  const handleOpenEdit = (item: VolunteerItem) => {
    setEditItem(item);
    // Find linked user if available
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
      role: item.userRole || 'MEMBER',
    });
    setUserSearchQuery('');
    setShowUserDropdown(false);
    setVolunteerTitle(item.title);
    if (VOLUNTEER_CATEGORIES.includes(item.category)) {
      setCategory(item.category);
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    } else {
      setCategory('CUSTOM');
      setIsCustomCategory(true);
      setCustomCategoryInput(item.category);
    }
    setBio(item.bio || '');
    setVolunteerSince(item.volunteerSince || '2026');
    setAchievements(item.achievements || '');
    setDisplayOrder(item.displayOrder || 1);
    setIsVisible(item.isVisible);
    setShowModal(true);
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setUserSearchQuery('');
    setShowUserDropdown(false);
  };

  const handleSaveVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Please select a user account to showcase.');
      return;
    }

    const resolvedCategory = isCustomCategory
      ? customCategoryInput.trim() || 'Community Service'
      : category;

    const payload = {
      userId: selectedUser.id || selectedUser._id,
      name: selectedUser.name,
      email: selectedUser.email,
      phone: selectedUser.phone,
      profilePhoto: selectedUser.profilePhoto || '',
      title: volunteerTitle.trim() || 'Community Volunteer',
      bio: bio.trim(),
      category: resolvedCategory,
      volunteerSince: volunteerSince.trim() || '2026',
      achievements: achievements.trim(),
      displayOrder: Number(displayOrder) || 1,
      isVisible,
    };

    try {
      if (editItem) {
        await adminAPI.updateVolunteer(editItem.id, payload);
      } else {
        await adminAPI.createVolunteer(payload);
      }
      await fetchVolunteersAndUsers();
    } catch {
      await fetchVolunteersAndUsers();
    } finally {
      setShowModal(false);
      setEditItem(null);
    }
  };

  // Quick Visibility Toggle (Hide ≠ Delete)
  const handleToggleVisibility = async (item: VolunteerItem) => {
    const newStatus = !item.isVisible;
    // Optimistic UI update
    setVolunteers((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, isVisible: newStatus } : v))
    );

    try {
      await adminAPI.updateVolunteer(item.id, { isVisible: newStatus });
      await fetchVolunteersAndUsers();
    } catch {
      await fetchVolunteersAndUsers();
    }
  };

  // Quick Reorder (Move Up / Move Down)
  const handleMoveOrder = async (item: VolunteerItem, direction: 'UP' | 'DOWN') => {
    const currentOrder = item.displayOrder;
    const newOrder = direction === 'UP' ? Math.max(1, currentOrder - 1) : currentOrder + 1;

    setVolunteers((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, displayOrder: newOrder } : v))
    );

    try {
      await adminAPI.updateVolunteer(item.id, { displayOrder: newOrder });
      await fetchVolunteersAndUsers();
    } catch {
      await fetchVolunteersAndUsers();
    }
  };

  const handleDeleteClick = (item: VolunteerItem) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      setVolunteers((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      await adminAPI.deleteVolunteer(deleteTarget.id);
      await fetchVolunteersAndUsers();
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
            <HeartHandshake className="w-7 h-7 text-[#E87516]" />
            <span>Volunteer Management</span>
          </h2>
          <p className="text-xs text-[#2A1710]/80 font-medium mt-1">
            Showcase outstanding volunteers on the website homepage, assign recognition titles, categories, and manage visibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Volunteer</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-[#240407] text-[#FFF7E8] p-3.5 sm:p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-[#F4B942] uppercase tracking-wider truncate">Volunteers</span>
            <HeartHandshake className="w-3.5 h-3.5 text-[#F4B942] shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#F4B942] mt-0.5">{totalVolunteersCount}</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-3.5 sm:p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-[#F4B942] uppercase tracking-wider truncate">Visible</span>
            <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-300 mt-0.5">{visibleCount}</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-3.5 sm:p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-[#F4B942] uppercase tracking-wider truncate">Hidden</span>
            <EyeOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-300 mt-0.5">{hiddenCount}</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-3.5 sm:p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-sm min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-[#F4B942] uppercase tracking-wider truncate">Categories</span>
            <Tag className="w-3.5 h-3.5 text-[#E87516] shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#E87516] mt-0.5">{categoriesCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#D4A72C] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search volunteer name, email, phone, title..."
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
                <option value="ALL">All Status ({volunteers.length})</option>
                <option value="VISIBLE">● Visible ({visibleCount})</option>
                <option value="HIDDEN">○ Hidden ({hiddenCount})</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <span className="text-[11px] font-bold text-[#32070B] whitespace-nowrap">Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-1.5 px-2.5 text-[11px] sm:text-xs text-[#32070B] font-bold focus:outline-none focus:border-[#5A0F16] w-full sm:w-auto max-w-[140px] truncate"
              >
                <option value="ALL">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-gray-600 border-t border-[#D4A72C]/20 pt-2.5">
          <span>
            Showing <strong className="text-[#32070B]">{filteredVolunteers.length}</strong> of{' '}
            <strong className="text-[#32070B]">{volunteers.length}</strong> volunteer entries
          </span>
          <span className="text-[10px] text-gray-500 italic">
            * Showcase profile only. User account remains untouched.
          </span>
        </div>

        {/* Table & Card List */}
        {loading ? (
          <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">
            Loading volunteer showcase records...
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-[#D4A72C]/20">
              {paginatedVolunteers.length === 0 ? (
                <div className="py-10 text-center text-xs text-gray-500 font-semibold">
                  No volunteers found matching your search.
                </div>
              ) : (
                paginatedVolunteers.map((vol) => (
                  <div key={vol.id} className="py-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {vol.profilePhoto ? (
                          <img
                            src={vol.profilePhoto}
                            alt={vol.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#D4A72C]"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#5A0F16] text-[#F4B942] font-black text-sm flex items-center justify-center font-cinzel border border-[#D4A72C]">
                            {vol.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-xs text-[#32070B] flex items-center gap-1.5">
                            <span>{vol.name}</span>
                            {getRoleBadge(vol.userRole)}
                          </h4>
                          <span className="text-[11px] text-[#E87516] font-semibold block">{vol.title}</span>
                        </div>
                      </div>

                      {/* Visibility Toggle Button */}
                      <button
                        onClick={() => handleToggleVisibility(vol)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
                          vol.isVisible
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        {vol.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{vol.isVisible ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-[#32070B] text-[#F4B942] font-bold">
                        {vol.category}
                      </span>
                      <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        Since {vol.volunteerSince}
                      </span>
                      <span className="text-gray-500">Order: #{vol.displayOrder}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(vol, 'UP')}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                          title="Move Up in Ordering"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(vol, 'DOWN')}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                          title="Move Down in Ordering"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setViewProfileItem(vol)}
                          className="px-2.5 py-1 rounded-lg bg-[#32070B] text-[#F4B942] text-[11px] font-bold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEdit(vol)}
                          className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942]"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(vol)}
                          className="p-1.5 rounded-lg bg-red-100 text-red-700"
                          title="Delete Showcase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A1710]">
                <thead className="bg-[#32070B] text-[#F4B942] font-cinzel uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-3.5 rounded-l-xl">Volunteer</th>
                    <th className="py-3 px-3.5">Volunteer Title & Bio</th>
                    <th className="py-3 px-3.5">Category</th>
                    <th className="py-3 px-3.5">Since</th>
                    <th className="py-3 px-3.5 text-center">Order</th>
                    <th className="py-3 px-3.5 text-center">Homepage Status</th>
                    <th className="py-3 px-3.5 text-center rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
                  {filteredVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#2A1710]/60">
                        No volunteer records found matching your search.
                      </td>
                    </tr>
                  ) : (
                    paginatedVolunteers.map((vol) => (
                      <tr key={vol.id} className="hover:bg-[#FFF7E8]/80 transition-colors">
                        {/* Volunteer Account */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-3">
                            {vol.profilePhoto ? (
                              <img
                                src={vol.profilePhoto}
                                alt={vol.name}
                                className="w-10 h-10 rounded-xl object-cover border border-[#D4A72C] bg-[#240407]"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-[#5A0F16] text-[#F4B942] font-black text-sm flex items-center justify-center font-cinzel border border-[#D4A72C]">
                                {vol.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-[#32070B] flex items-center gap-1.5">
                                <span>{vol.name}</span>
                                {getRoleBadge(vol.userRole)}
                              </div>
                              <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                                {vol.email && <span>{vol.email}</span>}
                                {vol.phone && <span>• {vol.phone}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Title & Bio */}
                        <td className="py-3 px-3.5 max-w-[220px]">
                          <div className="font-bold text-[#5A0F16] text-[11px]">{vol.title}</div>
                          {vol.bio && (
                            <div className="text-[10px] text-gray-500 italic truncate" title={vol.bio}>
                              "{vol.bio}"
                            </div>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border border-[#D4A72C]/40 bg-[#32070B] text-[#F4B942]">
                            {vol.category}
                          </span>
                        </td>

                        {/* Since */}
                        <td className="py-3 px-3.5 font-bold text-gray-700">
                          {vol.volunteerSince}
                        </td>

                        {/* Display Order */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="inline-flex items-center gap-1 bg-[#FFF7E8] px-2 py-0.5 rounded-lg border border-[#D4A72C]/40">
                            <span className="font-mono font-bold text-xs text-[#32070B]">
                              #{vol.displayOrder}
                            </span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleMoveOrder(vol, 'UP')}
                                className="text-gray-500 hover:text-[#5A0F16] leading-none"
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                onClick={() => handleMoveOrder(vol, 'DOWN')}
                                className="text-gray-500 hover:text-[#5A0F16] leading-none"
                                title="Move Down"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Status Toggle (Hide ≠ Delete) */}
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={() => handleToggleVisibility(vol)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center justify-center gap-1.5 transition-all mx-auto ${
                              vol.isVisible
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-400 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                            }`}
                            title={vol.isVisible ? 'Click to Hide from Homepage' : 'Click to Show on Homepage'}
                          >
                            {vol.isVisible ? (
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
                              onClick={() => setViewProfileItem(vol)}
                              className="p-1.5 rounded-lg bg-[#32070B] text-[#F4B942] hover:bg-[#5A0F16] transition-colors shadow-sm"
                              title="View Profile Card"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(vol)}
                              className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors shadow-sm"
                              title="Edit Volunteer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(vol)}
                              className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors shadow-sm"
                              title="Delete Volunteer Showcase"
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
              totalItems={filteredVolunteers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              isDark={false}
            />
          </>
        )}
      </div>

      {/* ADD / EDIT VOLUNTEER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-5 sm:p-6 w-full max-w-lg text-[#FFF7E8] space-y-4 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 border-b border-[#D4A72C]/30 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4A72C] to-[#E87516] flex items-center justify-center text-[#1F0407] shadow shrink-0 font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase tracking-wider">
                  {editItem ? 'Edit Volunteer Showcase' : 'Add Homepage Volunteer'}
                </h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  Select an existing user account and configure their featured homepage showcase profile.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveVolunteer} className="space-y-4">
              {/* STEP 1: USER SELECTION (If not editing) */}
              {!editItem ? (
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-bold uppercase text-[#F4B942] block">
                    1. Select User Account *
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
                          No matching users found.
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
                                  {u.name.charAt(0)}
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
                        {selectedUser.name.charAt(0)}
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
                    </div>
                  </div>

                  {!editItem && (
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                    >
                      Change
                    </button>
                  )}
                </div>
              )}

              {/* STEP 2: VOLUNTEER SPECIFIC INFORMATION */}
              <div className="space-y-3 pt-1 border-t border-[#D4A72C]/30">
                <span className="text-xs font-bold uppercase text-[#E87516] tracking-wider block">
                  2. Volunteer Showcase Details
                </span>

                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                      Volunteer Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={volunteerTitle}
                      onChange={(e) => setVolunteerTitle(e.target.value)}
                      placeholder="e.g. Senior Community Volunteer"
                      className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] font-semibold focus:outline-none focus:border-[#F4B942]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                      Volunteer Category *
                    </label>
                    <select
                      value={isCustomCategory ? 'CUSTOM' : category}
                      onChange={(e) => {
                        if (e.target.value === 'CUSTOM') {
                          setIsCustomCategory(true);
                        } else {
                          setIsCustomCategory(false);
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#F4B942] font-bold focus:outline-none focus:border-[#F4B942]"
                    >
                      {VOLUNTEER_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="CUSTOM">+ Add Custom Category...</option>
                    </select>
                  </div>
                </div>

                {isCustomCategory && (
                  <div>
                    <label className="text-xs font-bold uppercase text-amber-300 block mb-1">
                      Custom Category Name *
                    </label>
                    <input
                      type="text"
                      required={isCustomCategory}
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="e.g. Cultural & Artist Management"
                      className="w-full bg-[#120204] border border-amber-400/60 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                    />
                  </div>
                )}

                {/* Volunteer Since & Display Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                      Volunteer Since (Year)
                    </label>
                    <input
                      type="text"
                      value={volunteerSince}
                      onChange={(e) => setVolunteerSince(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                    />
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

                {/* Bio / Short Description */}
                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Short Bio / Description
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="e.g. Dedicated volunteer supporting community activities and helping organize local programs."
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                {/* Achievements */}
                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Key Achievements & Contributions
                  </label>
                  <textarea
                    rows={2}
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    placeholder="e.g. Coordinated volunteer teams for 3 consecutive Ganesh Utsavs and blood donation camp."
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#120204] border border-[#D4A72C]/30">
                  <div>
                    <span className="text-xs font-bold text-[#F4B942] block">Homepage Visibility Status</span>
                    <span className="text-[10px] text-gray-400">
                      {isVisible ? '● Published on website homepage' : '○ Hidden from website homepage'}
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

              {/* Submit Buttons */}
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
                  disabled={!selectedUser}
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
                  {viewProfileItem.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-cinzel text-base font-black text-[#F4B942] leading-tight">
                  {viewProfileItem.name}
                </h3>
                <span className="text-xs text-[#E87516] font-bold block">{viewProfileItem.title}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {getRoleBadge(viewProfileItem.userRole)}
                  <span className="text-[10px] text-gray-400">Since {viewProfileItem.volunteerSince}</span>
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

            {viewProfileItem.achievements && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Achievements</span>
                <p className="text-xs text-[#FFF7E8]/85 bg-[#120204] p-3 rounded-xl border border-amber-400/30">
                  {viewProfileItem.achievements}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#D4A72C]/20">
              <span className="text-gray-400">Category: {viewProfileItem.category}</span>
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

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Volunteer Showcase Entry"
        itemTitle={deleteTarget ? `${deleteTarget.name} (${deleteTarget.title})` : undefined}
        message={`Are you sure you want to remove ${deleteTarget?.name} from the Volunteer showcase? This will remove the volunteer showcase record. The original user account will remain safe and untouched.`}
        confirmText="Yes, Delete Showcase"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
