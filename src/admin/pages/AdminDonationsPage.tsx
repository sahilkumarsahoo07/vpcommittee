import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  FileText,
  FileSpreadsheet,
  User,
  Calendar,
  Download,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Lock,
  ChevronDown,
  UserCheck,
  X,
} from 'lucide-react';
import { adminAPI, userAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Pagination } from '../components/Pagination';

interface UserOption {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'COMMITTEE_MEMBER' | 'MEMBER';
}

interface DonationItem {
  id: string;
  receiptNumber: string;
  userId?: UserOption;
  donorName: string;
  amount: number;
  paymentMethod: string;
  category: string;
  date: string;
  rawDate: string;
  status: string;
  phone?: string;
  email?: string;
  address?: string;
  profilePhoto?: string;
  role?: string;
  pledgedAmount?: number;
  notes?: string;
  transactionId?: string;
}

interface DonorSummary {
  key: string;
  userId?: UserOption;
  donorName: string;
  role?: string;
  profilePhoto?: string;
  phone?: string;
  email?: string;
  address?: string;
  totalPaid: number;
  pledgedAmount: number;
  remainingBalance: number;
  count: number;
  dates: string[];
  items: DonationItem[];
}

const formatDateHelper = (raw: any): { display: string; iso: string } => {
  if (!raw) {
    const d = new Date();
    return {
      display: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      iso: d.toISOString().split('T')[0],
    };
  }
  const d = new Date(raw);
  if (isNaN(d.getTime())) {
    return { display: String(raw), iso: new Date().toISOString().split('T')[0] };
  }
  return {
    display: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    iso: d.toISOString().split('T')[0],
  };
};

const getCurrentYear = () => new Date().getFullYear().toString();

const formatMonthYearLabel = (monthIso: string) => {
  if (monthIso === 'ALL') return 'All Time (Overall)';
  if (!monthIso) return `Overall ${getCurrentYear()}`;
  const parts = monthIso.split('-');
  if (parts.length < 2) return `Year ${monthIso}`;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const AdminDonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [usersList, setUsersList] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [receiptsPage, setReceiptsPage] = useState(1);
  const [receiptsPerPage, setReceiptsPerPage] = useState(10);
  const [donorsPage, setDonorsPage] = useState(1);
  const [donorsPerPage, setDonorsPerPage] = useState(5);

  const [donorPledges, setDonorPledges] = useState<Record<string, number>>({});

  const [selectedDonorHistory, setSelectedDonorHistory] = useState<DonorSummary | null>(null);
  const [downloadingDonorPdf, setDownloadingDonorPdf] = useState(false);
  const [editingPledgeDonor, setEditingPledgeDonor] = useState<string | null>(null);
  const [newPledgeVal, setNewPledgeVal] = useState<string>('');
  // Add / Edit Contribution Modal State
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<DonationItem | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [customDonorName, setCustomDonorName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [userSearchText, setUserSearchText] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Form Fields for Contribution Details
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('General Donation');
  const [newPaymentMethod, setNewPaymentMethod] = useState('UPI');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newTransactionId, setNewTransactionId] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<DonationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [res, usersRes] = await Promise.all([
        adminAPI.getDonations().catch(() => null),
        userAPI.getUsers().catch(() => null),
      ]);

      if (usersRes?.success && Array.isArray(usersRes.data)) {
        setUsersList(usersRes.data);
      }

      if (res?.success && Array.isArray(res.data)) {
        const mapped: DonationItem[] = res.data.map((item: any) => {
          const formatted = formatDateHelper(item.createdAt || item.date);
          const u = item.userId;
          return {
            id: item._id || item.id,
            receiptNumber: item.receiptNumber || `VPC-DON-2026-${Math.floor(100 + Math.random() * 900)}`,
            userId: u ? (u._id || u.id ? u : undefined) : undefined,
            donorName: u?.name || item.donorName || 'Devotee Contributor',
            amount: Number(item.amount) || 0,
            paymentMethod: item.paymentMethod || 'UPI',
            category: item.category || 'General Donation',
            date: formatted.display,
            rawDate: formatted.iso,
            status: item.status || 'SUCCESS',
            phone: u?.phone || item.phone,
            email: u?.email || item.email,
            address: u?.address || item.address,
            profilePhoto: u?.profilePhoto || item.profilePhoto,
            role: u?.role || item.role,
            notes: item.notes,
            transactionId: item.transactionId,
          };
        });
        setDonations(mapped);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter donations: '' = Overall current year, 'ALL' = All Time, 'YYYY-MM' = Specific Month
  const monthFilteredDonations = donations.filter((d) => {
    if (selectedMonth === 'ALL') return true;
    const filterTarget = selectedMonth || getCurrentYear();
    return (d.rawDate || '').startsWith(filterTarget);
  });

  // Filter by search term
  const filteredDonations = monthFilteredDonations.filter(
    (d) =>
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.phone && d.phone.includes(searchTerm)) ||
      (d.email && d.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group donations by User Account / Key to create the User Multi-Payment Ledger
  const donorMap: Record<string, DonorSummary> = {};
  monthFilteredDonations.forEach((item) => {
    const uid = item.userId?._id || item.userId?.id;
    const userKey = uid ? `user_${uid}` : `name_${item.donorName.trim().toLowerCase()}`;

    if (!donorMap[userKey]) {
      const pledged = donorPledges[userKey] || donorPledges[item.donorName.trim()] || 0;
      donorMap[userKey] = {
        key: userKey,
        userId: item.userId,
        donorName: item.donorName,
        role: item.userId?.role || item.role,
        profilePhoto: item.userId?.profilePhoto || item.profilePhoto,
        phone: item.phone,
        email: item.email,
        address: item.address,
        totalPaid: 0,
        pledgedAmount: pledged,
        remainingBalance: 0,
        count: 0,
        dates: [],
        items: [],
      };
    }
    donorMap[userKey].totalPaid += Number(item.amount) || 0;
    donorMap[userKey].count += 1;
    if (!donorMap[userKey].dates.includes(item.date)) {
      donorMap[userKey].dates.push(item.date);
    }
    donorMap[userKey].items.push(item);
  });

  // Calculate remaining balances for each donor
  Object.keys(donorMap).forEach((key) => {
    const summary = donorMap[key];
    summary.remainingBalance = Math.max(0, summary.pledgedAmount - summary.totalPaid);
  });

  const donorSummariesList = Object.values(donorMap).sort((a, b) => b.totalPaid - a.totalPaid);

  useEffect(() => {
    setReceiptsPage(1);
    setDonorsPage(1);
  }, [searchTerm, selectedMonth]);

  // Paginated data calculations
  const totalDonorsPages = Math.ceil(donorSummariesList.length / donorsPerPage) || 1;
  const paginatedDonors = donorSummariesList.slice(
    (donorsPage - 1) * donorsPerPage,
    donorsPage * donorsPerPage
  );

  const totalReceiptsPages = Math.ceil(filteredDonations.length / receiptsPerPage) || 1;
  const paginatedReceipts = filteredDonations.slice(
    (receiptsPage - 1) * receiptsPerPage,
    receiptsPage * receiptsPerPage
  );

  // Metrics
  const totalCollection = monthFilteredDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalReceipts = monthFilteredDonations.length;

  // Helper date functions
  const getTodayISO = () => new Date().toISOString().split('T')[0];

  const handleOpenAdd = () => {
    setEditItem(null);
    setSelectedUser(null);
    setCustomDonorName('');
    setCustomPhone('');
    setCustomEmail('');
    setUserSearchText('');
    setIsUserDropdownOpen(false);
    setNewAmount('');
    setNewCategory('General Donation');
    setNewPaymentMethod('UPI');
    setNewDate(getTodayISO());
    setNewTransactionId('');
    setNewNotes('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: DonationItem) => {
    setEditItem(item);
    if (item.userId) {
      setSelectedUser(item.userId);
      setCustomDonorName('');
      setCustomPhone('');
      setCustomEmail('');
    } else {
      const matched = usersList.find(
        (u) =>
          u.name.trim().toLowerCase() === item.donorName.trim().toLowerCase() ||
          (item.email && u.email.toLowerCase() === item.email.toLowerCase())
      );
      if (matched) {
        setSelectedUser(matched);
        setCustomDonorName('');
        setCustomPhone('');
        setCustomEmail('');
      } else {
        setSelectedUser(null);
        setCustomDonorName(item.donorName);
        setCustomPhone(item.phone || '');
        setCustomEmail(item.email || '');
      }
    }
    setNewAmount(String(item.amount));
    setNewCategory(item.category);
    setNewPaymentMethod(item.paymentMethod);
    setNewDate(item.rawDate || getTodayISO());
    setNewTransactionId(item.transactionId || '');
    setNewNotes(item.notes || '');
    setShowModal(true);
  };

  const handleSaveDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveDonorName = (selectedUser ? selectedUser.name : (customDonorName || userSearchText)).trim();

    if (!effectiveDonorName) {
      alert('Please enter or select a contributor name.');
      return;
    }
    if (!newAmount || Number(newAmount) <= 0) {
      alert('Please enter a valid contribution amount (minimum ₹1).');
      return;
    }

    try {
      const payload = {
        userId: selectedUser ? (selectedUser._id || selectedUser.id) : undefined,
        donorName: effectiveDonorName,
        email: selectedUser ? selectedUser.email : customEmail.trim(),
        phone: selectedUser ? selectedUser.phone : customPhone.trim(),
        amount: Number(newAmount),
        category: newCategory,
        paymentMethod: newPaymentMethod,
        date: newDate,
        transactionId: newTransactionId,
        notes: newNotes,
      };

      if (editItem) {
        await adminAPI.updateDonation(editItem.id, payload);
      } else {
        await adminAPI.createDonation(payload);
      }
      await loadData();
      setShowModal(false);
      setEditItem(null);
      setSelectedUser(null);
      setCustomDonorName('');
      setCustomPhone('');
      setCustomEmail('');
      setUserSearchText('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save contribution.');
    }
  };

  const handleDeleteClick = (item: DonationItem) => {
    setDeleteTarget(item);
  };

  const handleConfirmDeleteDonation = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminAPI.deleteDonation(deleteTarget.id);
      setDonations((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    } catch {
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleSavePledge = (targetKey: string) => {
    const val = Number(newPledgeVal) || 0;
    setDonorPledges((prev) => ({ ...prev, [targetKey]: val }));
    setEditingPledgeDonor(null);
    setNewPledgeVal('');
  };

  const handleDownloadFinancialPDF = async () => {
    try {
      setDownloadingPdf(true);
      await adminAPI.exportFinancialPDF({ month: selectedMonth || 'ALL' });
    } catch {
      alert('Failed to generate Financial PDF report.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      await adminAPI.exportDonationsExcel({ month: selectedMonth || 'ALL' });
    } catch {
      alert('Failed to generate Excel report.');
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleDownloadSingleDonorPDF = async (donorName: string) => {
    try {
      setDownloadingDonorPdf(true);
      await adminAPI.exportDonorPDF(donorName);
    } catch {
      alert(`Failed to download PDF for ${donorName}`);
    } finally {
      setDownloadingDonorPdf(false);
    }
  };

  const filteredUsersList = usersList.filter((u) => {
    const q = userSearchText.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    );
  });

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold text-[9px] uppercase tracking-wider whitespace-nowrap inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            SuperAdmin
          </span>
        );
      case 'ADMIN':
        return (
          <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 font-bold text-[9px] uppercase tracking-wider whitespace-nowrap inline-block">
            Admin
          </span>
        );
      case 'COMMITTEE_MEMBER':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold text-[9px] uppercase tracking-wider whitespace-nowrap inline-block">
            Committee Member
          </span>
        );
      case 'MEMBER':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold text-[9px] uppercase tracking-wider whitespace-nowrap inline-block">
            Member
          </span>
        );
    }
  };

  const [activeTab, setActiveTab] = useState<'contributors' | 'receipts'>('contributors');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1F0407] border-2 border-[#D4A72C]/40 p-5 sm:p-6 rounded-3xl text-[#FFF7E8] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-[#F4B942] text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#F4B942]" />
            <span>Treasury & Contributor Ledger</span>
          </div>
          <h1 className="font-cinzel text-xl sm:text-3xl font-black text-[#F4B942] tracking-wide">
            Finance & Contributor Records
          </h1>
          <p className="text-xs text-[#FFF7E8]/70">
            Link contributions to existing user accounts across all 4 roles. Live account-backed history & statement receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 z-10">
          <button
            onClick={handleDownloadFinancialPDF}
            disabled={downloadingPdf}
            className="px-3.5 py-2.5 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-[#F4B942] text-xs font-bold rounded-2xl transition-all shadow flex items-center gap-1.5 disabled:opacity-50"
          >
            {downloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span>PDF Statement</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="px-3.5 py-2.5 bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-emerald-400 text-xs font-bold rounded-2xl transition-all shadow flex items-center gap-1.5 disabled:opacity-50"
          >
            {downloadingExcel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
            <span>Excel Export</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-gradient-to-r from-[#D4A72C] to-[#E87516] hover:from-[#F4B942] hover:to-[#E87516] text-[#1F0407] font-black text-xs rounded-2xl shadow-lg shadow-[#D4A72C]/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Contribution</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-3 sm:p-4 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-[#FFF7E8]/60 tracking-wider block truncate">Total Received</span>
          <div className="text-base sm:text-2xl font-black text-emerald-400 truncate">₹{totalCollection.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-3 sm:p-4 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-[#FFF7E8]/60 tracking-wider block truncate">Receipts Issued</span>
          <div className="text-base sm:text-2xl font-black text-[#F4B942] truncate">{totalReceipts}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-3 sm:p-4 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-[#FFF7E8]/60 tracking-wider block truncate">Contributors</span>
          <div className="text-base sm:text-2xl font-black text-cyan-400 truncate">{donorSummariesList.length}</div>
        </div>

        <div className="bg-[#1F0407] border border-[#D4A72C]/30 p-3 sm:p-4 rounded-2xl space-y-0.5 min-w-0">
          <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-amber-400 tracking-wider block truncate">Target Year</span>
          <div className="text-xs sm:text-lg font-black text-amber-400 truncate leading-tight">Ganesh Utsav 2026</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between bg-[#1F0407] p-3 sm:p-4 rounded-2xl border border-[#D4A72C]/30">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#D4A72C]/60" />
          <input
            type="text"
            placeholder="Search contributor name, phone, receipt #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#120204] border border-[#D4A72C]/30 rounded-xl text-[11px] sm:text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#FFF7E8]/70 shrink-0">Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-[#120204] border border-[#D4A72C]/30 text-[11px] sm:text-xs text-[#F4B942] font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#F4B942] w-full sm:w-auto"
          >
            <option value="">Overall Year {getCurrentYear()}</option>
            <option value="ALL">All Time</option>
            <option value="2026-08">Aug 2026</option>
            <option value="2026-09">Sep 2026</option>
            <option value="2026-10">Oct 2026</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#170204] p-1.5 sm:p-2 rounded-2xl border border-[#D4A72C]/40">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('contributors')}
            className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-2 rounded-xl text-[10.5px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'contributors'
                ? 'bg-[#F4B942] text-[#32070B] shadow-md shadow-[#F4B942]/20'
                : 'bg-transparent text-[#FFF7E8]/70 hover:text-[#F4B942] hover:bg-[#2A050A]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Contributors ({donorSummariesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('receipts')}
            className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-2 rounded-xl text-[10.5px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'receipts'
                ? 'bg-[#F4B942] text-[#32070B] shadow-md shadow-[#F4B942]/20'
                : 'bg-transparent text-[#FFF7E8]/70 hover:text-[#F4B942] hover:bg-[#2A050A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Receipts ({filteredDonations.length})</span>
          </button>
        </div>

        <div className="text-[10px] text-[#FFF7E8]/60 px-2 italic text-center sm:text-right">
          {activeTab === 'contributors'
            ? '💡 Grouped by account'
            : '💡 Individual vouchers'}
        </div>
      </div>

      {activeTab === 'contributors' && (
        <div className="bg-[#1F0407] border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl space-y-3 p-3.5 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D4A72C]/20 pb-2.5">
            <div>
              <h3 className="font-cinzel text-sm sm:text-base font-black text-[#F4B942] uppercase">
                Contributor Account Summary ({donorSummariesList.length} Accounts)
              </h3>
              <p className="text-[10.5px] text-[#FFF7E8]/70">
                Each user appears once. Tapping any row opens chronological timeline.
              </p>
            </div>
            <span className="text-[11px] text-[#F4B942] font-bold">
              {formatMonthYearLabel(selectedMonth)}
            </span>
          </div>

          <div className="block md:hidden divide-y divide-[#D4A72C]/20">
            {loading ? (
              <div className="py-12 text-center text-xs text-[#FFF7E8]/60">Loading contributor ledger...</div>
            ) : paginatedDonors.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#FFF7E8]/60">No contributor records found.</div>
            ) : (
              paginatedDonors.map((donor) => (
                <div
                  key={donor.key}
                  onClick={() => setSelectedDonorHistory(donor)}
                  className="p-3.5 space-y-2.5 cursor-pointer hover:bg-[#2A050A]/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {donor.profilePhoto ? (
                        <img
                          src={donor.profilePhoto}
                          alt={donor.donorName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#F4B942] shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#32070B] border-2 border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#F4B942] text-sm shrink-0">
                          {donor.donorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-xs text-[#FFF7E8]">{donor.donorName}</div>
                        <div className="text-[10px] text-[#FFF7E8]/60">{donor.email || donor.phone || 'Account Linked'}</div>
                      </div>
                    </div>
                    {getRoleBadge(donor.role)}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#D4A72C]/15">
                    <span className="text-[10px] font-bold text-[#F4B942] bg-[#32070B] px-2 py-0.5 rounded border border-[#D4A72C]/30">
                      ⚡ {donor.count} {donor.count === 1 ? 'Payment' : 'Payments'}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-[#FFF7E8]/60 uppercase block">Total Contributed</span>
                      <span className="font-black text-sm text-emerald-400">₹{donor.totalPaid.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-[#FFF7E8]">
              <thead className="bg-[#120204] text-[#F4B942] uppercase text-[10px] tracking-wider border-b border-[#D4A72C]/30 font-bold">
                <tr>
                  <th className="py-3 px-3">User / Contributor</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Transactions</th>
                  <th className="py-3 px-3">Payment Dates</th>
                  <th className="py-3 px-3">Total Contribution</th>
                  <th className="py-3 px-3">Pledged Target</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#FFF7E8]/60">
                      Loading contributors...
                    </td>
                  </tr>
                ) : paginatedDonors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#FFF7E8]/60">
                      No contributor records found matching query.
                    </td>
                  </tr>
                ) : (
                  paginatedDonors.map((donor) => (
                    <tr
                      key={donor.key}
                      onClick={() => setSelectedDonorHistory(donor)}
                      className="hover:bg-[#2A050A]/70 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {donor.profilePhoto ? (
                            <img
                              src={donor.profilePhoto}
                              alt={donor.donorName}
                              className="w-9 h-9 rounded-full object-cover border-2 border-[#F4B942] shrink-0 group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#32070B] border-2 border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#F4B942] text-xs shrink-0 group-hover:scale-105 transition-transform">
                              {donor.donorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-xs text-[#FFF7E8] group-hover:text-[#F4B942] transition-colors">
                              {donor.donorName}
                            </div>
                            <div className="text-[11px] text-[#FFF7E8]/60">
                              {donor.email || donor.phone || 'Account Linked'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {getRoleBadge(donor.role)}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#32070B] text-[#F4B942] text-[10px] font-bold border border-[#D4A72C]/30">
                          {donor.count} {donor.count === 1 ? 'Time' : 'Times'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {donor.dates.map((d, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-[#120204] text-[#FFF7E8]/80 text-[9px] font-bold border border-[#D4A72C]/20">
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-black text-emerald-400 text-sm">
                        ₹{donor.totalPaid.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 font-bold text-amber-300" onClick={(e) => e.stopPropagation()}>
                        {editingPledgeDonor === donor.key ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={newPledgeVal}
                              onChange={(e) => setNewPledgeVal(e.target.value)}
                              className="w-24 bg-[#170204] border border-[#F4B942] text-xs px-2 py-0.5 text-[#FFF7E8] rounded"
                              placeholder="Target"
                            />
                            <button
                              onClick={() => handleSavePledge(donor.key)}
                              className="px-2 py-0.5 bg-[#F4B942] text-[#32070B] text-[10px] font-bold rounded"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span>₹{donor.pledgedAmount.toLocaleString('en-IN')}</span>
                            <button
                              onClick={() => { setEditingPledgeDonor(donor.key); setNewPledgeVal(String(donor.pledgedAmount)); }}
                              className="text-[#FFF7E8]/40 hover:text-[#F4B942]"
                              title="Edit Target"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedDonorHistory(donor)}
                            className="px-2.5 py-1 rounded-lg bg-[#32070B] hover:bg-[#5A0F16] border border-[#D4A72C]/40 text-[#F4B942] text-[10px] font-bold uppercase transition-all"
                          >
                            History Timeline
                          </button>
                          <button
                            onClick={() => handleDownloadSingleDonorPDF(donor.donorName)}
                            disabled={downloadingDonorPdf}
                            className="p-1.5 rounded-lg bg-[#F4B942] text-[#32070B] hover:brightness-110 transition-all shadow disabled:opacity-50"
                            title={`Download PDF Statement for ${donor.donorName}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={donorsPage}
            totalPages={totalDonorsPages}
            totalItems={donorSummariesList.length}
            itemsPerPage={donorsPerPage}
            onPageChange={setDonorsPage}
            onItemsPerPageChange={setDonorsPerPage}
            isDark={true}
          />
        </div>
      )}

      {activeTab === 'receipts' && (
        <div className="bg-[#1F0407] border-2 border-[#D4A72C]/40 rounded-3xl overflow-hidden shadow-xl space-y-3 p-4 text-[#FFF7E8]">
          <div className="flex items-center justify-between border-b border-[#D4A72C]/20 pb-3">
            <div>
              <h3 className="font-cinzel text-base font-black text-[#F4B942] uppercase">
                All Issued Contribution Receipts ({filteredDonations.length} Receipts)
              </h3>
              <p className="text-[11px] text-[#FFF7E8]/70">
                Detailed transaction list of every individual receipt issued with full edit & delete controls.
              </p>
            </div>
            <span className="text-xs text-[#F4B942] font-bold">
              {formatMonthYearLabel(selectedMonth)}
            </span>
          </div>

          <div className="block md:hidden divide-y divide-[#D4A72C]/20">
            {loading ? (
              <div className="py-12 text-center text-xs text-[#FFF7E8]/60">Loading receipts...</div>
            ) : paginatedReceipts.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#FFF7E8]/60">No receipts found.</div>
            ) : (
              paginatedReceipts.map((item) => (
                <div key={item.id} className="p-3.5 space-y-2 hover:bg-[#2A050A]/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-[#F4B942] font-bold block">{item.receiptNumber}</span>
                      <span className="font-bold text-xs text-[#FFF7E8]">{item.donorName}</span>
                    </div>
                    <span className="font-black text-sm text-emerald-400">₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#FFF7E8]/70 pt-1 border-t border-[#D4A72C]/10">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#120204] text-[#F4B942] font-bold border border-[#D4A72C]/30 text-[10px]">
                        {item.paymentMethod}
                      </span>
                      <span>{item.category}</span>
                      <span>• {item.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadSingleDonorPDF(item.donorName)}
                        className="p-1.5 rounded-lg bg-[#32070B] text-[#F4B942] hover:bg-[#5A0F16]"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-[#32070B] text-amber-300 hover:bg-[#5A0F16]"
                        title="Edit Receipt"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-1.5 rounded-lg bg-[#32070B] text-rose-400 hover:bg-[#5A0F16]"
                        title="Delete Receipt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-[#FFF7E8]">
              <thead className="bg-[#120204] text-[#F4B942] uppercase text-[10px] tracking-wider border-b border-[#D4A72C]/30 font-bold">
                <tr>
                  <th className="py-3 px-3">Receipt #</th>
                  <th className="py-3 px-3">Contributor / User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Amount (₹)</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#FFF7E8]/60">
                      Loading receipts...
                    </td>
                  </tr>
                ) : filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#FFF7E8]/60">
                      No matching receipts found.
                    </td>
                  </tr>
                ) : (
                  paginatedReceipts.map((item) => (
                    <tr key={item.id} className="hover:bg-[#2A050A]/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#F4B942]">{item.receiptNumber}</td>
                      <td className="py-3 px-3 font-bold text-[#FFF7E8]">
                        <div className="flex items-center gap-2">
                          {item.profilePhoto ? (
                            <img src={item.profilePhoto} alt={item.donorName} className="w-7 h-7 rounded-full object-cover border border-[#F4B942]" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#32070B] text-[#F4B942] border border-[#D4A72C]/40 flex items-center justify-center font-bold text-[10px]">
                              {item.donorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span>{item.donorName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {getRoleBadge(item.role)}
                      </td>
                      <td className="py-3 px-3 text-[#FFF7E8]/90">{item.category}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#120204] text-[#F4B942] border border-[#D4A72C]/40 text-[10px] font-bold">
                          {item.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#FFF7E8]/70">{item.date}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold text-sm">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleDownloadSingleDonorPDF(item.donorName)}
                            className="p-1.5 rounded-lg bg-[#32070B] text-[#F4B942] hover:bg-[#5A0F16] transition-colors"
                            title={`Download PDF for ${item.donorName}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg bg-[#32070B] text-amber-300 hover:bg-[#5A0F16] transition-colors"
                            title="Edit Receipt"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-1.5 rounded-lg bg-[#32070B] text-rose-400 hover:bg-[#5A0F16] transition-colors"
                            title="Delete Receipt"
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

          <Pagination
            currentPage={receiptsPage}
            totalPages={totalReceiptsPages}
            totalItems={filteredDonations.length}
            itemsPerPage={receiptsPerPage}
            onPageChange={setReceiptsPage}
            onItemsPerPageChange={setReceiptsPerPage}
            isDark={true}
          />
        </div>
      )}

      {selectedDonorHistory && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#F4B942] rounded-3xl p-5 sm:p-6 max-w-2xl w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDonorHistory(null)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between border-b border-[#D4A72C]/40 pb-4">
              <div className="flex items-center gap-3">
                {selectedDonorHistory.profilePhoto ? (
                  <img
                    src={selectedDonorHistory.profilePhoto}
                    alt={selectedDonorHistory.donorName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#F4B942] shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#32070B] border-2 border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#F4B942] text-xl">
                    {selectedDonorHistory.donorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel text-lg font-black text-[#F4B942]">
                      {selectedDonorHistory.donorName}
                    </h3>
                    {getRoleBadge(selectedDonorHistory.role)}
                  </div>
                  {selectedDonorHistory.email && (
                    <div className="text-xs text-[#FFF7E8]/70 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-[#D4A72C]" />
                      <span>{selectedDonorHistory.email}</span>
                    </div>
                  )}
                  {selectedDonorHistory.phone && (
                    <div className="text-xs text-[#FFF7E8]/70 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{selectedDonorHistory.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDownloadSingleDonorPDF(selectedDonorHistory.donorName)}
                disabled={downloadingDonorPdf}
                className="hidden sm:flex px-3 py-2 rounded-xl bg-[#F4B942] text-[#32070B] font-black text-xs uppercase items-center gap-1.5 hover:brightness-110 shadow disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Statement</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-[#170204] p-3 rounded-2xl border border-[#D4A72C]/30">
              <div>
                <span className="text-[#FFF7E8]/60 uppercase text-[10px] block">Total Contributions</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{selectedDonorHistory.totalPaid.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[#FFF7E8]/60 uppercase text-[10px] block">Number of Payments</span>
                <span className="text-base font-black text-[#F4B942]">
                  {selectedDonorHistory.count} Entries
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[#FFF7E8]/60 uppercase text-[10px] block">Target Pledge</span>
                <span className="text-base font-black text-amber-300">
                  ₹{selectedDonorHistory.pledgedAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-[#F4B942] block">Chronological Transactions</span>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {selectedDonorHistory.items.map((item, i) => (
                  <div key={i} className="bg-[#170204] border border-[#D4A72C]/20 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#F4B942] flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#FFF7E8]/70" />
                        <span>{item.date}</span>
                        <span className="text-[10px] text-[#FFF7E8]/50">({item.receiptNumber})</span>
                      </div>
                      <div className="text-[11px] text-[#FFF7E8]/80 mt-0.5">
                        {item.category} • <span className="font-bold text-amber-300">{item.paymentMethod}</span>
                        {item.transactionId && <span className="text-[#FFF7E8]/50 ml-1.5 font-mono">Ref: {item.transactionId}</span>}
                      </div>
                      {item.notes && <div className="text-[10px] text-[#FFF7E8]/60 italic mt-0.5">Note: {item.notes}</div>}
                    </div>

                    <div className="text-sm font-black text-emerald-400 shrink-0 ml-2">
                      + ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedDonorHistory(null)}
                className="px-5 py-2.5 rounded-xl bg-[#5A0F16] text-[#FFF7E8] text-xs font-bold uppercase hover:bg-[#32070B] transition-all"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-[#1F0407] text-[#FFF7E8] border-2 border-[#D4A72C]/70 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#D4A72C]/30 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4A72C] to-[#E87516] flex items-center justify-center text-[#1F0407] shadow shrink-0 font-bold">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase">
                  {editItem ? 'Edit Contribution' : 'Record New Contribution'}
                </h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  Select a registered account or type any devotee / outside contributor name.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveDonation} className="space-y-4">
              {/* STEP 1: SELECT REGISTERED ACCOUNT OR TYPE ANY CUSTOM/OUTSIDE NAME */}
              <div>
                <label className="text-xs font-bold uppercase text-[#F4B942] flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#F4B942]" />
                    <span>Contributor / Account Name *</span>
                  </span>
                  <span className="text-[10px] text-[#FFF7E8]/60 normal-case">
                    (Registered Account or Outside Devotee)
                  </span>
                </label>

                {!selectedUser && !customDonorName ? (
                  <div className="relative" ref={userDropdownRef}>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#D4A72C]/60" />
                      <input
                        type="text"
                        placeholder="Search user or type any outside name (e.g. Kalia)..."
                        value={userSearchText}
                        onFocus={() => setIsUserDropdownOpen(true)}
                        onChange={(e) => {
                          setUserSearchText(e.target.value);
                          setIsUserDropdownOpen(true);
                        }}
                        className="w-full pl-10 pr-10 py-2.5 bg-[#120204] border border-[#D4A72C]/40 rounded-xl text-xs text-[#FFF7E8] font-semibold focus:outline-none focus:border-[#F4B942]"
                      />
                      <button
                        type="button"
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="absolute right-3 top-2.5 text-[#D4A72C]"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Dropdown list of users and custom outside option */}
                    {isUserDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#170204] border-2 border-[#D4A72C]/50 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-[#D4A72C]/20">
                        {/* Quick Action: Use Typed Name */}
                        {userSearchText.trim() && (
                          <div
                            onClick={() => {
                              setCustomDonorName(userSearchText.trim());
                              setIsUserDropdownOpen(false);
                            }}
                            className="p-3 bg-[#32070B] hover:bg-[#5A0F16] cursor-pointer transition-colors flex items-center justify-between gap-2 border-b border-[#D4A72C]/40"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-[#F4B942] text-[#1F0407] flex items-center justify-center font-bold text-xs">
                                +
                              </span>
                              <div>
                                <div className="font-bold text-xs text-[#F4B942]">
                                  Use "{userSearchText.trim()}"
                                </div>
                                <div className="text-[10px] text-[#FFF7E8]/70">
                                  Save as outside / guest contributor
                                </div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-[#F4B942]/20 text-[#F4B942] text-[9px] font-black uppercase">
                              Add Outside
                            </span>
                          </div>
                        )}

                        {/* Registered Users Section */}
                        {filteredUsersList.length > 0 && (
                          <div className="py-1">
                            <div className="px-3 py-1 text-[10px] font-black uppercase text-[#F4B942]/70 tracking-wider">
                              Registered User Accounts
                            </div>
                            {filteredUsersList.map((usr) => (
                              <div
                                key={usr.id || usr._id}
                                onClick={() => {
                                  setSelectedUser(usr);
                                  setCustomDonorName('');
                                  setIsUserDropdownOpen(false);
                                  setUserSearchText('');
                                }}
                                className="p-2.5 px-3 hover:bg-[#32070B] cursor-pointer transition-colors flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {usr.profilePhoto ? (
                                    <img src={usr.profilePhoto} alt={usr.name} className="w-8 h-8 rounded-full object-cover border border-[#F4B942] shrink-0" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#32070B] border border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#F4B942] text-xs shrink-0">
                                      {usr.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className="font-bold text-xs text-[#FFF7E8] truncate">{usr.name}</div>
                                    <div className="text-[10px] text-[#FFF7E8]/60 truncate">{usr.email} {usr.phone ? `• ${usr.phone}` : ''}</div>
                                  </div>
                                </div>
                                <div className="shrink-0">
                                  {getRoleBadge(usr.role)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Past Outside Contributors */}
                        {Array.from(
                          new Set(
                            donations
                              .map((d) => d.donorName?.trim())
                              .filter((name) => name && !usersList.some((u) => u.name.trim().toLowerCase() === name.toLowerCase()))
                          )
                        )
                          .filter((name) => !userSearchText || name.toLowerCase().includes(userSearchText.toLowerCase()))
                          .map((name, i) => (
                            <div
                              key={`past-${i}`}
                              onClick={() => {
                                setCustomDonorName(name);
                                const matchPast = donations.find((d) => d.donorName.trim().toLowerCase() === name.toLowerCase());
                                if (matchPast?.phone) setCustomPhone(matchPast.phone);
                                if (matchPast?.email) setCustomEmail(matchPast.email);
                                setIsUserDropdownOpen(false);
                                setUserSearchText('');
                              }}
                              className="p-2.5 px-3 hover:bg-[#32070B] cursor-pointer transition-colors flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#1F0407] border border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#FFF7E8] text-xs">
                                  👤
                                </div>
                                <div>
                                  <div className="font-bold text-xs text-[#FFF7E8]">{name}</div>
                                  <div className="text-[10px] text-[#FFF7E8]/50">Past Contributor</div>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                                Contributor
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : selectedUser ? (
                  /* STEP 2A: REGISTERED USER PROFILE CARD (READ-ONLY) */
                  <div className="bg-[#120204] border-2 border-[#D4A72C]/50 rounded-2xl p-3.5 space-y-2.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                        <Lock className="w-3 h-3" />
                        <span>Registered Account (Auto-Linked)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(null);
                          setCustomDonorName('');
                          setUserSearchText('');
                        }}
                        className="text-[11px] font-bold text-[#F4B942] hover:underline"
                      >
                        Change / Type Custom Name
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      {selectedUser.profilePhoto ? (
                        <img
                          src={selectedUser.profilePhoto}
                          alt={selectedUser.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#F4B942] shadow shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#32070B] border-2 border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#F4B942] text-base shrink-0">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-[#FFF7E8] truncate">{selectedUser.name}</span>
                          {getRoleBadge(selectedUser.role)}
                        </div>
                        <div className="text-[11px] text-[#FFF7E8]/70 flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 text-[#D4A72C] shrink-0" />
                          <span className="truncate">{selectedUser.email}</span>
                        </div>
                        {selectedUser.phone && (
                          <div className="text-[11px] text-[#FFF7E8]/70 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{selectedUser.phone}</span>
                          </div>
                        )}
                        {selectedUser.address && (
                          <div className="text-[11px] text-[#FFF7E8]/60 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{selectedUser.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STEP 2B: OUTSIDE / CUSTOM CONTRIBUTOR CARD */
                  <div className="bg-[#120204] border-2 border-[#D4A72C]/50 rounded-2xl p-3.5 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300">
                        <span>👤 Outside / Devotee Contributor</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomDonorName('');
                          setSelectedUser(null);
                          setUserSearchText('');
                        }}
                        className="text-[11px] font-bold text-[#F4B942] hover:underline"
                      >
                        Change Contributor
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#32070B] border-2 border-[#D4A72C]/40 flex items-center justify-center font-bold text-[#F4B942] text-sm shrink-0">
                        {customDonorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-[#FFF7E8] truncate">{customDonorName}</div>
                        <div className="text-[10px] text-[#FFF7E8]/60">Saved directly to contributor ledger</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#D4A72C]/20">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#FFF7E8]/70 block mb-0.5">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="+91 98765 43210"
                          value={customPhone}
                          onChange={(e) => setCustomPhone(e.target.value)}
                          className="w-full bg-[#1F0407] border border-[#D4A72C]/30 rounded-xl py-1.5 px-2.5 text-xs text-[#FFF7E8]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#FFF7E8]/70 block mb-0.5">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="devotee@example.com"
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          className="w-full bg-[#1F0407] border border-[#D4A72C]/30 rounded-xl py-1.5 px-2.5 text-xs text-[#FFF7E8]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: FINANCIAL CONTRIBUTION DETAILS */}
              <div className="pt-2 border-t border-[#D4A72C]/20 space-y-3">
                <span className="text-xs font-bold uppercase text-[#F4B942] block">Contribution Details</span>

                {/* Amount & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 5000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full bg-[#120204] border border-[#D4A72C]/30 rounded-xl py-2 px-3 text-sm text-[#F4B942] font-black focus:outline-none focus:border-[#F4B942]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 flex items-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#F4B942]" />
                      <span>Payment Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onClick={(e) => (e.currentTarget as any).showPicker?.()}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-[#120204] border border-[#D4A72C]/30 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] font-semibold focus:outline-none focus:border-[#F4B942] cursor-pointer scheme-dark"
                    />
                  </div>
                </div>

                {/* Payment Method & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                      Payment Method
                    </label>
                    <select
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value)}
                      className="w-full bg-[#120204] border border-[#D4A72C]/30 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                    >
                      <option value="UPI">UPI</option>
                      <option value="CASH">CASH</option>
                      <option value="BANK_TRANSFER">BANK TRANSFER</option>
                      <option value="CHEQUE">CHEQUE</option>
                      <option value="CARD">CARD</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-[#120204] border border-[#D4A72C]/30 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                    >
                      <option value="General Donation">General Donation</option>
                      <option value="Pandal Sponsorship">Pandal Sponsorship</option>
                      <option value="Maha Prasad">Maha Prasad</option>
                      <option value="Aarti Sponsorship">Aarti Sponsorship</option>
                      <option value="Special Puja">Special Puja</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Transaction Reference ID */}
                <div>
                  <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                    Transaction / Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI-982341203912 or CHQ-504912"
                    value={newTransactionId}
                    onChange={(e) => setNewTransactionId(e.target.value)}
                    className="w-full bg-[#120204] border border-[#D4A72C]/30 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] font-mono focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                    Notes / Purpose (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dedicated for Maha Prasad Saptami"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-[#120204] border border-[#D4A72C]/30 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#120204] border border-[#D4A72C]/30 text-xs font-bold uppercase hover:bg-[#32070B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!(selectedUser || customDonorName || userSearchText.trim()) || !newAmount || Number(newAmount) <= 0}
                  className="flex-1 py-2.5 rounded-xl bg-[#F4B942] hover:bg-[#D4A72C] text-[#32070B] text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                >
                  {editItem ? 'Update Contribution' : 'Save Contribution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Contribution Receipt"
        itemTitle={deleteTarget?.receiptNumber}
        message={`Are you sure you want to delete receipt "${deleteTarget?.receiptNumber}" for ${deleteTarget?.donorName}?`}
        confirmText="Yes, Delete Receipt"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteDonation}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
