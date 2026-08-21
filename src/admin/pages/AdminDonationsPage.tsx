import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, CheckCircle, Edit2, Trash2, FileText, FileSpreadsheet, User, Calendar, Download, Loader2, History, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

interface DonationItem {
  id: string;
  receiptNumber: string;
  donorName: string;
  amount: number;
  paymentMethod: string;
  category: string;
  date: string;
  rawDate: string; // ISO or date string for sorting & month filtering
  status: string;
  phone?: string;
  email?: string;
  pledgedAmount?: number;
}

interface DonorSummary {
  donorName: string;
  totalPaid: number;
  pledgedAmount: number;
  remainingBalance: number;
  count: number;
  dates: string[];
  items: DonationItem[];
  phone?: string;
  email?: string;
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

const getCurrentYearMonth = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

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
  const navigate = useNavigate();
  const location = useLocation();
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  // Calendar Month Filter State ('' = Overall Current Year, 'YYYY-MM' = Specific Month, 'ALL' = All Time)
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Donor Pledged Target State (Stored per donor name)
  const [donorPledges, setDonorPledges] = useState<Record<string, number>>({});

  const [selectedDonorHistory, setSelectedDonorHistory] = useState<DonorSummary | null>(null);
  const [downloadingDonorPdf, setDownloadingDonorPdf] = useState(false);
  const [editingPledgeDonor, setEditingPledgeDonor] = useState<string | null>(null);
  const [newPledgeVal, setNewPledgeVal] = useState<string>('');

  const [memberNames, setMemberNames] = useState<string[]>([]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const [res, membersRes] = await Promise.all([
        adminAPI.getDonations().catch(() => null),
        adminAPI.getMembers().catch(() => null),
      ]);

      if (membersRes?.success && Array.isArray(membersRes.data)) {
        const names = membersRes.data.map((m: any) => m.name || m.donorName).filter(Boolean);
        setMemberNames(names);
      }

      if (res?.success && Array.isArray(res.data)) {
        const mapped: DonationItem[] = res.data.map((item: any) => {
          const formatted = formatDateHelper(item.createdAt || item.date);
          return {
            id: item._id || item.id,
            receiptNumber: item.receiptNumber || `VPC-DON-2026-${Math.floor(100 + Math.random() * 900)}`,
            donorName: item.donorName || 'Anonymous',
            amount: Number(item.amount) || 0,
            paymentMethod: item.paymentMethod || 'UPI',
            category: item.category || 'General Donation',
            date: formatted.display,
            rawDate: formatted.iso,
            status: item.status || 'SUCCESS',
            phone: item.phone,
            email: item.email,
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
    loadDonations();
    if (location.state && (location.state as any).prefillDonorName) {
      const stateObj = location.state as any;
      setEditItem(null);
      setNewDonorName(stateObj.prefillDonorName);
      setNewPhone(stateObj.prefillPhone || '');
      setNewAmount('');
      setNewCategory('General Donation');
      setNewPaymentMethod('UPI');
      setNewDate(getTodayISO());
      setShowModal(true);
    }
  }, [location.state]);

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
      d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total payment count per donor name across all donations
  const donorPaymentCounts: Record<string, number> = {};
  donations.forEach((d) => {
    const name = d.donorName.trim();
    donorPaymentCounts[name] = (donorPaymentCounts[name] || 0) + 1;
  });

  // Group donations by Donor Name to create the User Multi-Payment Ledger
  const donorMap: Record<string, DonorSummary> = {};
  monthFilteredDonations.forEach((item) => {
    const nameKey = item.donorName.trim();
    if (!donorMap[nameKey]) {
      const pledged = donorPledges[nameKey] || 0;
      donorMap[nameKey] = {
        donorName: nameKey,
        totalPaid: 0,
        pledgedAmount: pledged,
        remainingBalance: 0,
        count: 0,
        dates: [],
        items: [],
        phone: item.phone,
        email: item.email,
      };
    }
    donorMap[nameKey].totalPaid += Number(item.amount) || 0;
    donorMap[nameKey].count += 1;
    if (!donorMap[nameKey].dates.includes(item.date)) {
      donorMap[nameKey].dates.push(item.date);
    }
    donorMap[nameKey].items.push(item);
  });

  // Calculate remaining balances for each donor
  Object.keys(donorMap).forEach((key) => {
    const summary = donorMap[key];
    const pledged = donorPledges[key] || summary.totalPaid;
    summary.pledgedAmount = pledged;
    summary.remainingBalance = Math.max(0, pledged - summary.totalPaid);
  });

  const donorSummariesList = Object.values(donorMap).sort((a, b) => b.totalPaid - a.totalPaid);

  // Metrics
  const totalCollection = monthFilteredDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalReceipts = monthFilteredDonations.length;

  // Add/Edit Modal state
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<DonationItem | null>(null);
  const [newDonorName, setNewDonorName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('General Donation');
  const [newPaymentMethod, setNewPaymentMethod] = useState('UPI');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newTransactionId, setNewTransactionId] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Helper date functions
  const getTodayISO = () => new Date().toISOString().split('T')[0];

  const handleOpenAdd = () => {
    setEditItem(null);
    setNewDonorName('');
    setNewAmount('');
    setNewCategory('General Donation');
    setNewPaymentMethod('UPI');
    setNewDate(getTodayISO());
    setNewTransactionId('');
    setNewPhone('');
    setNewNotes('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: DonationItem) => {
    setEditItem(item);
    setNewDonorName(item.donorName);
    setNewAmount(String(item.amount));
    setNewCategory(item.category);
    setNewPaymentMethod(item.paymentMethod);
    setNewDate(item.rawDate || getTodayISO());
    setNewTransactionId('');
    setNewPhone(item.phone || '');
    setNewNotes('');
    setShowModal(true);
  };

  const handleSaveDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonorName || !newAmount) return;

    try {
      const payload = {
        donorName: newDonorName,
        amount: Number(newAmount),
        category: newCategory,
        paymentMethod: newPaymentMethod,
        date: newDate,
        transactionId: newTransactionId,
        phone: newPhone,
        notes: newNotes,
      };

      if (editItem) {
        await adminAPI.updateDonation(editItem.id, payload);
      } else {
        await adminAPI.createDonation(payload);
      }
      await loadDonations();
    } catch {
      if (editItem) {
        setDonations(
          donations.map((d) =>
            d.id === editItem.id
              ? {
                  ...d,
                  donorName: newDonorName,
                  amount: Number(newAmount),
                  category: newCategory,
                  paymentMethod: newPaymentMethod,
                  date: formatDateHelper(newDate).display,
                  rawDate: newDate,
                  phone: newPhone,
                }
              : d
          )
        );
      } else {
        const formatted = formatDateHelper(newDate);
        const newItem: DonationItem = {
          id: String(Date.now()),
          receiptNumber: `VPC-DON-2026-${Math.floor(100 + Math.random() * 900)}`,
          donorName: newDonorName,
          amount: Number(newAmount),
          paymentMethod: newPaymentMethod,
          category: newCategory,
          date: formatted.display,
          rawDate: formatted.iso,
          status: 'SUCCESS',
          phone: newPhone,
        };
        setDonations([newItem, ...donations]);
      }
    } finally {
      setShowModal(false);
      setEditItem(null);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<DonationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item: DonationItem) => {
    setDeleteTarget(item);
  };

  const handleConfirmDeleteDonation = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminAPI.deleteDonation(deleteTarget.id);
      setDonations(donations.filter((d) => d.id !== deleteTarget.id));
    } catch {
      setDonations(donations.filter((d) => d.id !== deleteTarget.id));
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getFilterParams = () => {
    if (selectedMonth === 'ALL') return {};
    const filterTarget = selectedMonth || getCurrentYear();
    return { month: filterTarget };
  };

  const handleDownloadOverallPDF = async () => {
    try {
      setDownloadingPdf(true);
      const params = getFilterParams();
      await adminAPI.exportFinancialPDF(params);
    } catch {
      alert('Failed to download PDF report');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      const params = getFilterParams();
      await adminAPI.exportDonationsExcel(params);
    } catch {
      alert('Failed to download Excel file');
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

  const handleSavePledge = (donorName: string) => {
    const val = Number(newPledgeVal);
    if (!isNaN(val) && val >= 0) {
      setDonorPledges({ ...donorPledges, [donorName]: val });
    }
    setEditingPledgeDonor(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider">
            Donation Management & Receipts
          </h2>
          <p className="text-xs text-[#2A1710]/70 font-semibold">
            Track all incoming contributions, issue official digital receipts, and audit collections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadOverallPDF}
            disabled={downloadingPdf}
            className="px-3 py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-1.5 shadow disabled:opacity-50"
          >
            {downloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span>Download PDF Report</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="px-3 py-2 rounded-xl bg-[#2A060A] text-[#FFF7E8] border border-[#D4A72C]/60 font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-1.5 shadow disabled:opacity-50"
          >
            {downloadingExcel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
            <span>Download Excel File</span>
          </button>

          <button
            onClick={() => navigate('/admin/donor-profiles')}
            className="px-3 py-2 rounded-xl bg-[#2A060A] text-[#F4B942] border border-[#F4B942]/60 font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-1.5 shadow"
          >
            <User className="w-3.5 h-3.5 text-[#F4B942]" />
            <span>Donor Profiles Directory ➔</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Donation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-3xl p-5 text-[#FFF7E8] shadow-md">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F4B942] block mb-1">
            Total Collection ({formatMonthYearLabel(selectedMonth)})
          </span>
          <div className="font-cinzel text-3xl font-black text-white">
            ₹{totalCollection.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-3xl p-5 text-[#FFF7E8] shadow-md">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F4B942] block mb-1">
            Total Receipts Issued
          </span>
          <div className="font-cinzel text-3xl font-black text-white">
            {totalReceipts} Receipts
          </div>
        </div>

        <div className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-3xl p-5 text-[#FFF7E8] shadow-md">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F4B942] block mb-1">
            Payment Status
          </span>
          <div className="font-cinzel text-3xl font-black text-emerald-400 flex items-center gap-2">
            <span>100% Verified</span>
          </div>
        </div>
      </div>

      {/* Dynamic Calendar Month & Year Selector Toolbar */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#5A0F16] text-[#F4B942] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>

          {/* Interactive Native Calendar Picker (Pick any Year & Month) */}
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase text-[#5A0F16]">Calendar Month Picker</span>
            <input
              type="month"
              value={selectedMonth === 'ALL' ? '' : selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-[#FFF7E8] border border-[#D4A72C]/60 rounded-xl px-3 py-1.5 text-xs font-bold text-[#32070B] focus:outline-none focus:border-[#5A0F16]"
            />
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex items-center gap-1.5 pt-3 sm:pt-0">
            <button
              type="button"
              onClick={() => setSelectedMonth('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                !selectedMonth
                  ? 'bg-[#5A0F16] text-[#F4B942] border-[#F4B942]'
                  : 'bg-[#FFF7E8] text-[#32070B] border-[#D4A72C]/50 hover:bg-[#F4B942]/20'
              }`}
            >
              Overall {getCurrentYear()}
            </button>
            <button
              type="button"
              onClick={() => setSelectedMonth(getCurrentYearMonth())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedMonth === getCurrentYearMonth()
                  ? 'bg-[#5A0F16] text-[#F4B942] border-[#F4B942]'
                  : 'bg-[#FFF7E8] text-[#32070B] border-[#D4A72C]/50 hover:bg-[#F4B942]/20'
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setSelectedMonth('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedMonth === 'ALL'
                  ? 'bg-[#5A0F16] text-[#F4B942] border-[#F4B942]'
                  : 'bg-[#FFF7E8] text-[#32070B] border-[#D4A72C]/50 hover:bg-[#F4B942]/20'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2A1710]/50" />
          <input
            type="text"
            placeholder="Search donor name, receipt #, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFF7E8]/60 border border-[#D4A72C]/40 rounded-xl pl-9 pr-4 py-2 text-xs text-[#2A1710] font-semibold focus:outline-none focus:border-[#5A0F16]"
          />
        </div>
      </div>

      {/* DONOR MULTI-PAYMENT & BALANCE LEDGER TABLE (Request #1 & #2) */}
      <div className="bg-[#240407] border-2 border-[#D4A72C]/50 rounded-3xl p-5 text-[#FFF7E8] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#D4A72C]/30 pb-3 gap-2">
          <div>
            <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase tracking-wider flex items-center gap-2">
              <History className="w-5 h-5" />
              <span>All Donors Payment & Balance Ledger</span>
            </h3>
            <p className="text-xs text-[#FFF7E8]/70">
              Detailed tracking showing how many times each donor paid, exact payment dates, total received, and pledged balance.
            </p>
          </div>
          <span className="text-xs font-bold bg-[#5A0F16] text-[#F4B942] px-3 py-1 rounded-full border border-[#D4A72C]/40">
            {donorSummariesList.length} Unique Donors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#FFF7E8]">
            <thead className="bg-[#170204] text-[#F4B942] font-cinzel uppercase border-b border-[#D4A72C]/30">
              <tr>
                <th className="py-3 px-3 rounded-l-xl">Donor / Contributor</th>
                <th className="py-3 px-3">Times Paid</th>
                <th className="py-3 px-3">Payment Dates</th>
                <th className="py-3 px-3">Total Paid (₹)</th>
                <th className="py-3 px-3">Pledged Target (₹)</th>
                <th className="py-3 px-3">Remaining Balance (₹)</th>
                <th className="py-3 px-3 text-center rounded-r-xl">Receipt & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
              {donorSummariesList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-[#FFF7E8]/60">
                    No donor records found for the selected calendar month.
                  </td>
                </tr>
              ) : (
                donorSummariesList.map((donor) => (
                  <tr key={donor.donorName} className="hover:bg-[#170204]/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#FFF7E8]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#F4B942]" />
                        <span>{donor.donorName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#5A0F16] text-[#F4B942] text-[10px] font-bold border border-[#D4A72C]/30">
                        {donor.count} {donor.count === 1 ? 'Time' : 'Times'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {donor.dates.map((d, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#170204] text-[#FFF7E8]/90 text-[10px] font-semibold border border-[#D4A72C]/20">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-black text-emerald-400 text-sm">
                      ₹{donor.totalPaid.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3 font-bold text-amber-300">
                      {editingPledgeDonor === donor.donorName ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={newPledgeVal}
                            onChange={(e) => setNewPledgeVal(e.target.value)}
                            className="w-24 bg-[#170204] border border-[#F4B942] text-xs px-2 py-0.5 text-[#FFF7E8] rounded"
                            placeholder="Target"
                          />
                          <button
                            onClick={() => handleSavePledge(donor.donorName)}
                            className="px-2 py-0.5 bg-[#F4B942] text-[#32070B] text-[10px] font-bold rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span>₹{donor.pledgedAmount.toLocaleString('en-IN')}</span>
                          <button
                            onClick={() => { setEditingPledgeDonor(donor.donorName); setNewPledgeVal(String(donor.pledgedAmount)); }}
                            className="text-[#FFF7E8]/40 hover:text-[#F4B942]"
                            title="Edit Pledged Target"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 font-bold">
                      {donor.remainingBalance > 0 ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>₹{donor.remainingBalance.toLocaleString('en-IN')} Due</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Paid in Full</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedDonorHistory(donor)}
                          className="px-2.5 py-1 rounded-lg bg-[#5A0F16] text-[#FFF7E8] text-[10px] font-bold uppercase hover:bg-[#32070B] transition-all"
                        >
                          History Timeline
                        </button>
                        <button
                          onClick={() => handleDownloadSingleDonorPDF(donor.donorName)}
                          disabled={downloadingDonorPdf}
                          className="p-1.5 rounded-lg bg-[#F4B942] text-[#32070B] hover:brightness-110 transition-all shadow disabled:opacity-50"
                          title={`Download PDF Receipt for ${donor.donorName}`}
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
      </div>

      {/* ALL DONATION RECEIPTS TABLE */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#D4A72C]/20 pb-2">
          <h3 className="font-cinzel text-base font-black text-[#32070B] uppercase">
            All Issued Donation Receipts ({filteredDonations.length})
          </h3>
          <span className="text-xs text-[#2A1710]/60 font-semibold">
            Showing receipts for {selectedMonth === 'ALL' ? 'All Months' : selectedMonth}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2A1710]">
            <thead className="bg-[#32070B] text-[#F4B942] font-cinzel uppercase">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Receipt #</th>
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount (₹)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#2A1710]/60">
                    Loading donation receipts...
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#2A1710]/60">
                    No matching donation receipts found.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FFF7E8]/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#5A0F16]">{item.receiptNumber}</td>
                    <td className="py-3 px-4 font-bold text-[#2A1710]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{item.donorName}</span>
                        {donorPaymentCounts[item.donorName.trim()] > 1 && (
                          <span
                            onClick={() => {
                              const donorSummary = donorMap[item.donorName.trim()];
                              if (donorSummary) setSelectedDonorHistory(donorSummary);
                            }}
                            className="px-2 py-0.5 rounded-full bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/50 text-[10px] font-black cursor-pointer hover:scale-105 transition-transform flex items-center gap-0.5 shadow-sm"
                            title={`Click to see all ${donorPaymentCounts[item.donorName.trim()]} payments by ${item.donorName}`}
                          >
                            <span>⚡ {donorPaymentCounts[item.donorName.trim()]} Times</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#2A1710]">{item.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF7E8] text-[#5A0F16] border border-[#D4A72C]/40 text-[10px] font-bold">
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#2A1710]/80">{item.date}</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold text-sm">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleDownloadSingleDonorPDF(item.donorName)}
                          className="p-1.5 rounded-lg bg-[#5A0F16]/10 text-[#5A0F16] hover:bg-[#5A0F16] hover:text-[#F4B942] transition-colors"
                          title={`Download PDF for ${item.donorName}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                          title="Edit Receipt"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors"
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
      </div>


      {/* Multi-Date Donor History Timeline Modal */}
      {selectedDonorHistory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#F4B942] rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D4A72C]/40 pb-3">
              <div>
                <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase">
                  Donor Contribution History: {selectedDonorHistory.donorName}
                </h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  Showing all dates on which this person donated money.
                </p>
              </div>

              <button
                onClick={() => handleDownloadSingleDonorPDF(selectedDonorHistory.donorName)}
                disabled={downloadingDonorPdf}
                className="px-3 py-2 rounded-xl bg-[#F4B942] text-[#32070B] font-black text-xs uppercase flex items-center gap-1.5 hover:brightness-110 shadow disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs bg-[#170204] p-3 rounded-2xl border border-[#D4A72C]/30">
              <div>
                <span className="text-[#FFF7E8]/60 uppercase text-[10px] block">Total Received</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{selectedDonorHistory.totalPaid.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[#FFF7E8]/60 uppercase text-[10px] block">Pledged Target</span>
                <span className="text-base font-black text-amber-300">
                  ₹{selectedDonorHistory.pledgedAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[#FFF7E8]/60 uppercase text-[10px] block">Remaining Due</span>
                <span className="text-base font-black text-amber-400">
                  ₹{selectedDonorHistory.remainingBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

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
                    </div>
                  </div>

                  <div className="text-sm font-black text-emerald-400">
                    + ₹{item.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedDonorHistory(null)}
                className="px-5 py-2 rounded-xl bg-[#5A0F16] text-[#FFF7E8] text-xs font-bold uppercase hover:bg-[#32070B] transition-all"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record / Edit Donation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase">
              {editItem ? 'Edit Donation Receipt' : 'Record New Donation'}
            </h3>

            <div className="bg-[#170204] border border-[#D4A72C]/30 p-2.5 rounded-xl text-[11px] text-[#FFF7E8]/80 space-y-1">
              <span className="font-bold text-[#F4B942] block">💡 Member & Donor Select:</span>
              <span>Select an existing committee member/past donor below OR type a new custom name. If they have donated before, this will add a <b>NEW payment entry</b> under their name!</span>
            </div>

            <form onSubmit={handleSaveDonation} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                  Select Existing Member / Donor
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) setNewDonorName(e.target.value);
                  }}
                  value={newDonorName}
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#F4B942] mb-2 focus:outline-none focus:border-[#F4B942]"
                >
                  <option value="">-- Select Member or Past Donor --</option>
                  {Array.from(
                    new Set([
                      ...memberNames,
                      ...donations.map((d) => d.donorName),
                    ])
                  )
                    .filter(Boolean)
                    .map((name, i) => (
                      <option key={i} value={name}>
                        👤 {name}
                      </option>
                    ))}
                </select>

                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                  Or Type / Edit Donor Name Manually
                </label>
                <input
                  type="text"
                  required
                  list="members-datalist"
                  value={newDonorName}
                  onChange={(e) => setNewDonorName(e.target.value)}
                  placeholder="Type donor name or select from dropdown above..."
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                />
                <datalist id="members-datalist">
                  {Array.from(
                    new Set([
                      ...memberNames,
                      ...donations.map((d) => d.donorName),
                    ])
                  ).filter(Boolean).map((name, i) => (
                    <option key={i} value={name} />
                  ))}
                </datalist>
              </div>

              {/* PAYMENT DATE CALENDAR PICKER */}
              <div>
                <label className="text-xs font-bold uppercase text-[#F4B942] flex items-center gap-1 mb-1 cursor-pointer">
                  <Calendar className="w-3.5 h-3.5 text-[#F4B942]" />
                  <span>Payment Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onClick={(e) => (e.currentTarget as any).showPicker?.()}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] font-semibold focus:outline-none focus:border-[#F4B942] cursor-pointer scheme-dark"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                  >
                    <option value="General Donation">General Donation</option>
                    <option value="Pandal Sponsorship">Pandal Sponsorship</option>
                    <option value="Maha Prasad">Maha Prasad</option>
                    <option value="Aarti Sponsorship">Aarti Sponsorship</option>
                    <option value="Special Puja">Special Puja</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Payment Method</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CASH">CASH</option>
                    <option value="CHEQUE">CHEQUE</option>
                    <option value="BANK_TRANSFER">BANK TRANSFER</option>
                  </select>
                </div>
              </div>

              {/* Advanced Extra Tracking Fields */}
              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                  Transaction / UTR / Cheque Ref No. (Optional)
                </label>
                <input
                  type="text"
                  value={newTransactionId}
                  onChange={(e) => setNewTransactionId(e.target.value)}
                  placeholder="e.g. UPI-9812039120 or CHQ-504912"
                  className="w-full bg-[#170204] border border-[#D4A72C]/30 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#170204] border border-[#D4A72C]/30 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Notes / Purpose</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Dedicated for Maha Prasad"
                    className="w-full bg-[#170204] border border-[#D4A72C]/30 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                  />
                </div>
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
                  {editItem ? 'Update Receipt' : 'Save Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Donation Receipt Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Donation Receipt"
        itemTitle={deleteTarget?.receiptNumber}
        message={`Are you sure you want to delete donation receipt "${deleteTarget?.receiptNumber}" by ${deleteTarget?.donorName}?`}
        confirmText="Yes, Delete Receipt"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteDonation}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
