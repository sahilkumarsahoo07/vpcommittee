import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  FileSpreadsheet,
  Receipt,
  DollarSign,
  X,
  TrendingUp,
  PieChart,
  CheckCircle2,
  Layers,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Pagination } from '../components/Pagination';

export const STANDARD_EXPENSE_CATEGORIES = [
  'Pandal & Mandap',
  'Idol & Sculpting',
  'Illumination & Lighting',
  'Sound & Music Setup',
  'Maha Prasad & Food',
  'Decoration & Flowers',
  'Cultural Program & Stage',
  'Marketing & Printing',
  'Transportation & Logistics',
  'Security & Cleaning',
  'Puja Samagri & Rituals',
  'Miscellaneous & Other',
];

export interface ExpenseItem {
  id: string;
  expenseName: string;
  category: string;
  amount: number;
  date: string;
  vendor: string;
  paidBy: string;
  paymentMethod: string;
  invoiceNumber: string;
  description?: string;
}

export interface CategoryBudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
}

export const AdminExpensesPage: React.FC = () => {
  // Active Main Tab: 'vouchers' | 'budget'
  const [activeTab, setActiveTab] = useState<'vouchers' | 'budget'>('vouchers');

  // Budget Sub-view: 'cards' | 'table'
  const [budgetViewMode, setBudgetViewMode] = useState<'cards' | 'table'>('cards');

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<CategoryBudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('ALL');

  // Export Loading States
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Expense Modal State
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editExpenseItem, setEditExpenseItem] = useState<ExpenseItem | null>(null);

  // Expense Form State
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Pandal & Mandap');
  const [customExpenseCategory, setCustomExpenseCategory] = useState('');
  const [isCustomExpenseCategory, setIsCustomExpenseCategory] = useState(false);
  const [vendor, setVendor] = useState('');
  const [paidBy, setPaidBy] = useState('Treasurer');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseDescription, setExpenseDescription] = useState('');

  // Budget Head Modal State
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editBudgetItem, setEditBudgetItem] = useState<CategoryBudgetItem | null>(null);
  const [budgetCategoryName, setBudgetCategoryName] = useState('Pandal & Mandap');
  const [customBudgetCategory, setCustomBudgetCategory] = useState('');
  const [isCustomBudgetCategory, setIsCustomBudgetCategory] = useState(false);
  const [allocatedBudgetAmount, setAllocatedBudgetAmount] = useState('');
  const [manualSpentAmount, setManualSpentAmount] = useState('0');

  // Delete Modals
  const [deleteExpenseTarget, setDeleteExpenseTarget] = useState<ExpenseItem | null>(null);
  const [deleteBudgetCategoryTarget, setDeleteBudgetCategoryTarget] = useState<string | null>(null);
  const [showResetBudgetModal, setShowResetBudgetModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchExpensesAndBudget = async () => {
    try {
      setLoading(true);
      const [expRes, budgetRes] = await Promise.all([
        adminAPI.getExpenses().catch(() => null),
        adminAPI.getBudget().catch(() => null),
      ]);

      let parsedExpenses: ExpenseItem[] = [];
      if (expRes?.success && Array.isArray(expRes.data)) {
        parsedExpenses = expRes.data.map((item: any, idx: number) => ({
          id: item._id || item.id || String(idx),
          expenseName: item.title || item.expenseName || 'Expense Item',
          category: item.category || 'Miscellaneous & Other',
          amount: Number(item.amount || 0),
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          vendor: item.vendor || 'Local Vendor',
          paidBy: item.paidBy || 'Treasurer',
          paymentMethod: item.paymentMethod || 'UPI',
          invoiceNumber: item.receiptNumber || item.invoiceNumber || `INV-2026-${100 + idx}`,
          description: item.description || '',
        }));
        setExpenses(parsedExpenses);
      }

      // Calculate actual spending per category from expenses
      const spentByCategory: Record<string, number> = {};
      parsedExpenses.forEach((e) => {
        const catKey = (e.category || 'Miscellaneous & Other').toLowerCase().trim();
        spentByCategory[catKey] = (spentByCategory[catKey] || 0) + e.amount;
      });

      if (budgetRes?.success && budgetRes?.data && Array.isArray(budgetRes.data.categories)) {
        const mappedBudget: CategoryBudgetItem[] = budgetRes.data.categories.map((c: any) => {
          const catKey = (c.category || '').toLowerCase().trim();
          const autoSpent = spentByCategory[catKey] || 0;
          return {
            id: c._id || c.id || String(c.category),
            category: c.category,
            allocated: Number(c.allocated || c.allocatedAmount || 0),
            spent: Number(c.spent !== undefined ? c.spent : autoSpent),
          };
        });
        setBudgetCategories(mappedBudget);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesAndBudget();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoryFilter, selectedMonthFilter]);

  // Combined list of all category names
  const allCategoryNames = Array.from(
    new Set([
      ...STANDARD_EXPENSE_CATEGORIES,
      ...budgetCategories.map((b) => b.category),
      ...expenses.map((e) => e.category),
    ])
  ).filter(Boolean);

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.expenseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'ALL' ||
      e.category.toLowerCase().trim() === selectedCategoryFilter.toLowerCase().trim();

    const matchesMonth =
      selectedMonthFilter === 'ALL' || e.date.startsWith(selectedMonthFilter);

    return matchesSearch && matchesCategory && matchesMonth;
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage) || 1;
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Overall Financial Metrics
  const totalOutgoingExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalAllocatedBudget = budgetCategories.reduce((sum, c) => sum + c.allocated, 0);
  const totalRemainingBudget = Math.max(0, totalAllocatedBudget - totalOutgoingExpenses);
  const overallUtilizationPct =
    totalAllocatedBudget > 0 ? Math.round((totalOutgoingExpenses / totalAllocatedBudget) * 100) : 0;

  // --- EXPENSE ACTIONS ---
  const handleOpenAddExpense = () => {
    setEditExpenseItem(null);
    setExpenseName('');
    setExpenseAmount('');
    setExpenseCategory('Pandal & Mandap');
    setCustomExpenseCategory('');
    setIsCustomExpenseCategory(false);
    setVendor('');
    setPaidBy('Treasurer');
    setPaymentMethod('UPI');
    setInvoiceNumber(`INV-2026-${Math.floor(100 + Math.random() * 900)}`);
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setExpenseDescription('');
    setShowExpenseModal(true);
  };

  const handleOpenEditExpense = (item: ExpenseItem) => {
    setEditExpenseItem(item);
    setExpenseName(item.expenseName);
    setExpenseAmount(String(item.amount));
    if (allCategoryNames.includes(item.category)) {
      setExpenseCategory(item.category);
      setIsCustomExpenseCategory(false);
      setCustomExpenseCategory('');
    } else {
      setExpenseCategory('CUSTOM');
      setIsCustomExpenseCategory(true);
      setCustomExpenseCategory(item.category);
    }
    setVendor(item.vendor);
    setPaidBy(item.paidBy);
    setPaymentMethod(item.paymentMethod);
    setInvoiceNumber(item.invoiceNumber);
    setExpenseDate(item.date);
    setExpenseDescription(item.description || '');
    setShowExpenseModal(true);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;

    const resolvedCategory = isCustomExpenseCategory
      ? customExpenseCategory.trim() || 'Miscellaneous & Other'
      : expenseCategory;

    const payload = {
      title: expenseName,
      expenseName,
      category: resolvedCategory,
      amount: Number(expenseAmount),
      vendor: vendor || 'Local Vendor',
      paidBy: paidBy || 'Treasurer',
      paymentMethod,
      invoiceNumber: invoiceNumber || `INV-2026-${expenses.length + 101}`,
      date: expenseDate ? new Date(expenseDate).toISOString() : new Date().toISOString(),
      description: expenseDescription,
    };

    try {
      if (editExpenseItem) {
        await adminAPI.updateExpense(editExpenseItem.id, payload);
      } else {
        await adminAPI.createExpense(payload);
      }
      await fetchExpensesAndBudget();
    } catch {
      // Optimistic update
      await fetchExpensesAndBudget();
    } finally {
      setShowExpenseModal(false);
      setEditExpenseItem(null);
    }
  };

  const handleConfirmDeleteExpense = async () => {
    if (!deleteExpenseTarget) return;
    setIsDeleting(true);
    try {
      setExpenses((prev) => prev.filter((e) => e.id !== deleteExpenseTarget.id));
      await adminAPI.deleteExpense(deleteExpenseTarget.id);
      await fetchExpensesAndBudget();
    } catch {
      // Done
    } finally {
      setIsDeleting(false);
      setDeleteExpenseTarget(null);
    }
  };

  // --- BUDGET ACTIONS ---
  const handleOpenAddBudget = () => {
    setEditBudgetItem(null);
    setBudgetCategoryName(STANDARD_EXPENSE_CATEGORIES[0]);
    setIsCustomBudgetCategory(false);
    setCustomBudgetCategory('');
    setAllocatedBudgetAmount('');
    setManualSpentAmount('0');
    setShowBudgetModal(true);
  };

  const handleOpenEditBudget = (item: CategoryBudgetItem) => {
    setEditBudgetItem(item);
    if (STANDARD_EXPENSE_CATEGORIES.includes(item.category)) {
      setBudgetCategoryName(item.category);
      setIsCustomBudgetCategory(false);
      setCustomBudgetCategory('');
    } else {
      setBudgetCategoryName('CUSTOM');
      setIsCustomBudgetCategory(true);
      setCustomBudgetCategory(item.category);
    }
    setAllocatedBudgetAmount(String(item.allocated));
    setManualSpentAmount(String(item.spent));
    setShowBudgetModal(true);
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedName = isCustomBudgetCategory
      ? customBudgetCategory.trim() || 'Miscellaneous & Other'
      : budgetCategoryName;

    if (!resolvedName || !allocatedBudgetAmount) return;

    const parsedAllocated = Number(allocatedBudgetAmount) || 0;
    const parsedSpent = Number(manualSpentAmount) || 0;

    let updatedList = [...budgetCategories];
    if (editBudgetItem) {
      const remaining = updatedList.filter((c) => c.category !== editBudgetItem.category);
      const updatedItem: CategoryBudgetItem = {
        id: editBudgetItem.id,
        category: resolvedName,
        allocated: parsedAllocated,
        spent: parsedSpent,
      };
      updatedList = [updatedItem, ...remaining];
    } else {
      const newItem: CategoryBudgetItem = {
        id: `temp_${Date.now()}`,
        category: resolvedName,
        allocated: parsedAllocated,
        spent: parsedSpent,
      };
      updatedList = [newItem, ...updatedList];
    }

    setBudgetCategories(updatedList);
    setShowBudgetModal(false);

    try {
      const payload = {
        totalAllocatedBudget: updatedList.reduce((sum, c) => sum + c.allocated, 0),
        categories: updatedList.map((c) => ({
          category: c.category,
          allocatedAmount: c.allocated,
          spent: c.spent,
        })),
      };
      await adminAPI.updateBudget(payload);
      await fetchExpensesAndBudget();
    } catch {
      // Fallback
    }
  };

  const handleConfirmDeleteBudgetCategory = async () => {
    if (!deleteBudgetCategoryTarget) return;
    setIsDeleting(true);
    setBudgetCategories((prev) =>
      prev.filter((c) => c.id !== deleteBudgetCategoryTarget && c.category !== deleteBudgetCategoryTarget)
    );
    try {
      await adminAPI.deleteBudgetCategory(deleteBudgetCategoryTarget);
      await fetchExpensesAndBudget();
    } catch {
      fetchExpensesAndBudget();
    } finally {
      setIsDeleting(false);
      setDeleteBudgetCategoryTarget(null);
    }
  };

  const handleConfirmResetAllBudget = async () => {
    setIsDeleting(true);
    setBudgetCategories([]);
    try {
      await adminAPI.deleteBudget();
      await fetchExpensesAndBudget();
    } catch {
      // Done
    } finally {
      setIsDeleting(false);
      setShowResetBudgetModal(false);
    }
  };

  const handleAutoSeedPresets = async () => {
    const defaultAllocations: Record<string, number> = {
      'Pandal & Mandap': 150000,
      'Idol & Sculpting': 75000,
      'Illumination & Lighting': 50000,
      'Sound & Music Setup': 35000,
      'Maha Prasad & Food': 80000,
      'Decoration & Flowers': 40000,
      'Cultural Program & Stage': 30000,
      'Marketing & Printing': 15000,
      'Transportation & Logistics': 15000,
      'Security & Cleaning': 10000,
    };

    const presetList: CategoryBudgetItem[] = Object.entries(defaultAllocations).map(([cat, alloc], idx) => ({
      id: `preset_${idx}`,
      category: cat,
      allocated: alloc,
      spent: 0,
    }));

    setBudgetCategories(presetList);

    try {
      const payload = {
        totalAllocatedBudget: presetList.reduce((sum, c) => sum + c.allocated, 0),
        categories: presetList.map((c) => ({
          category: c.category,
          allocatedAmount: c.allocated,
          spent: 0,
        })),
      };
      await adminAPI.updateBudget(payload);
      await fetchExpensesAndBudget();
    } catch {
      // Fallback
    }
  };

  // --- EXPORT DOWNLOADS ---
  const handleDownloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      if (activeTab === 'budget') {
        await adminAPI.exportBudgetPDF();
      } else {
        await adminAPI.exportExpensesPDF({
          category: selectedCategoryFilter !== 'ALL' ? selectedCategoryFilter : undefined,
          month: selectedMonthFilter !== 'ALL' ? selectedMonthFilter : undefined,
        });
      }
    } catch (err) {
      console.error('Failed to download PDF', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      if (activeTab === 'budget') {
        await adminAPI.exportBudgetExcel();
      } else {
        await adminAPI.exportExpensesExcel({
          category: selectedCategoryFilter !== 'ALL' ? selectedCategoryFilter : undefined,
          month: selectedMonthFilter !== 'ALL' ? selectedMonthFilter : undefined,
        });
      }
    } catch (err) {
      console.error('Failed to download Excel', err);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border border-[#D4A72C]/40 bg-[#32070B] text-[#F4B942]">
        {cat}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-7 h-7 text-[#E87516]" />
            <span>Expense Tracker & Festival Budget</span>
          </h2>
          <p className="text-xs text-[#2A1710]/80 font-medium mt-1">
            Manage outgoing expenses, vendor vouchers, operational budget allocation, and track live category variances.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="px-3.5 py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/60 font-bold text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-1.5 shadow disabled:opacity-50"
            title="Download PDF Statement"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingPdf ? 'Generating PDF...' : activeTab === 'budget' ? 'PDF Variance' : 'PDF Statement'}</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="px-3.5 py-2 rounded-xl bg-[#120204] text-emerald-400 border border-emerald-500/40 font-bold text-xs uppercase tracking-wider hover:bg-[#240407] transition-all flex items-center gap-1.5 shadow disabled:opacity-50"
            title="Download Excel Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{downloadingExcel ? 'Exporting...' : 'Excel Sheet'}</span>
          </button>

          {activeTab === 'budget' ? (
            <button
              onClick={handleOpenAddBudget}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Budget Head</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddExpense}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 4 Key Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Allocated Budget</span>
            <DollarSign className="w-4 h-4 text-[#F4B942]" />
          </div>
          <div className="text-2xl font-black text-[#F4B942] mt-1">
            ₹{totalAllocatedBudget.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">
            {budgetCategories.length} operational budget heads
          </div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Total Expenses Incurred</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-300 mt-1">
            ₹{totalOutgoingExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">
            {expenses.length} recorded voucher bills
          </div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Unspent Balance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ₹{totalRemainingBudget.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">Remaining committee funds</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Budget Utilization %</span>
            <Layers className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">
            {overallUtilizationPct}% Used
          </div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">
            {overallUtilizationPct > 100 ? (
              <span className="text-rose-400 font-bold">⚠️ Budget Overdrawn</span>
            ) : overallUtilizationPct >= 85 ? (
              <span className="text-amber-400 font-bold">⚠️ High Spending</span>
            ) : (
              <span className="text-emerald-400 font-bold">✓ Within Budget</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Dual Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-b-2 border-[#D4A72C]/30 pb-2">
        <button
          onClick={() => setActiveTab('vouchers')}
          className={`flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-cinzel font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-sm ${
            activeTab === 'vouchers'
              ? 'bg-[#32070B] text-[#F4B942] border-2 border-[#F4B942]'
              : 'bg-white text-[#32070B] border border-[#D4A72C]/40 hover:bg-[#FFF7E8]'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-[#E87516]" />
          <span>Expense Vouchers ({expenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-cinzel font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-sm ${
            activeTab === 'budget'
              ? 'bg-[#32070B] text-[#F4B942] border-2 border-[#F4B942]'
              : 'bg-white text-[#32070B] border border-[#D4A72C]/40 hover:bg-[#FFF7E8]'
          }`}
        >
          <PieChart className="w-3.5 h-3.5 text-[#E87516]" />
          <span>Budget Allocation & Variance ({budgetCategories.length} Heads)</span>
        </button>
      </div>

      {/* TAB 1: RECORDED EXPENSE VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="bg-white border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#D4A72C] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search description, invoice #, vendor, category..."
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
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <span className="text-[11px] font-bold text-[#32070B] whitespace-nowrap">Category:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-1.5 px-2.5 text-[11px] sm:text-xs text-[#32070B] font-bold focus:outline-none focus:border-[#5A0F16] w-full sm:w-auto max-w-[140px] truncate"
                >
                  <option value="ALL">All Categories ({expenses.length})</option>
                  {allCategoryNames.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <span className="text-[11px] font-bold text-[#32070B] whitespace-nowrap">Month:</span>
                <select
                  value={selectedMonthFilter}
                  onChange={(e) => setSelectedMonthFilter(e.target.value)}
                  className="bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-1.5 px-2.5 text-[11px] sm:text-xs text-[#32070B] font-bold focus:outline-none focus:border-[#5A0F16] w-full sm:w-auto"
                >
                  <option value="ALL">All Months</option>
                  <option value="2026-08">Aug 2026</option>
                  <option value="2026-09">Sep 2026</option>
                  <option value="2026-10">Oct 2026</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-gray-600 border-t border-[#D4A72C]/20 pt-2.5">
            <span>
              Showing <strong className="text-[#32070B]">{filteredExpenses.length}</strong> of{' '}
              <strong className="text-[#32070B]">{expenses.length}</strong> expense records
            </span>
            <span className="text-emerald-700 font-bold">
              Filtered Total: ₹{filteredExpenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Table & Card List */}
          {loading ? (
            <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">
              Loading expense vouchers...
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="block md:hidden divide-y divide-[#D4A72C]/20">
                {paginatedExpenses.length === 0 ? (
                  <div className="py-10 text-center text-xs text-gray-500 font-semibold">
                    No expense records match your search criteria.
                  </div>
                ) : (
                  paginatedExpenses.map((item) => (
                    <div key={item.id} className="py-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] text-[#5A0F16] font-bold block">
                            {item.invoiceNumber}
                          </span>
                          <h4 className="font-bold text-xs text-[#32070B]">{item.expenseName}</h4>
                        </div>
                        <span className="font-black text-sm text-rose-700">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getCategoryBadge(item.category)}
                        <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {item.paymentMethod}
                        </span>
                        <span className="text-[10px] text-gray-600">Vendor: {item.vendor}</span>
                        <span className="text-[10px] text-gray-500">• {item.date}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] border-t border-gray-100">
                        <span className="text-gray-500 italic truncate max-w-[200px]">
                          Paid by: {item.paidBy}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditExpense(item)}
                            className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B]"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteExpenseTarget(item)}
                            className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                            title="Delete Expense"
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
                      <th className="py-3 px-3.5 rounded-l-xl">Inv #</th>
                      <th className="py-3 px-3.5">Expense Description</th>
                      <th className="py-3 px-3.5">Category</th>
                      <th className="py-3 px-3.5">Vendor</th>
                      <th className="py-3 px-3.5">Paid By</th>
                      <th className="py-3 px-3.5">Method</th>
                      <th className="py-3 px-3.5">Date</th>
                      <th className="py-3 px-3.5 text-right">Amount (₹)</th>
                      <th className="py-3 px-3.5 text-center rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-[#2A1710]/60">
                          No expense records found matching your search.
                        </td>
                      </tr>
                    ) : (
                      paginatedExpenses.map((item) => (
                        <tr key={item.id} className="hover:bg-[#FFF7E8]/80 transition-colors">
                          <td className="py-3 px-3.5 font-bold font-mono text-[#5A0F16]">
                            {item.invoiceNumber}
                          </td>
                          <td className="py-3 px-3.5 font-bold text-[#32070B] max-w-[200px]">
                            <div>{item.expenseName}</div>
                            {item.description && (
                              <div className="text-[10px] text-gray-500 font-normal italic truncate">
                                {item.description}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3.5">{getCategoryBadge(item.category)}</td>
                          <td className="py-3 px-3.5 text-gray-700">{item.vendor}</td>
                          <td className="py-3 px-3.5 text-gray-600">{item.paidBy}</td>
                          <td className="py-3 px-3.5">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[10px] font-bold border border-gray-200">
                              {item.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-gray-600">{item.date}</td>
                          <td className="py-3 px-3.5 text-right font-black text-rose-700 text-sm">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditExpense(item)}
                                className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors shadow-sm"
                                title="Edit Expense"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteExpenseTarget(item)}
                                className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors shadow-sm"
                                title="Delete Expense"
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
                totalItems={filteredExpenses.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                isDark={false}
              />
            </>
          )}
        </div>
      )}

      {/* TAB 2: BUDGET ALLOCATION & LIVE VARIANCE */}
      {activeTab === 'budget' && (
        <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4A72C]/20 pb-4">
            <div>
              <h3 className="font-cinzel text-lg font-black text-[#32070B] uppercase tracking-wider">
                Category Utilization & Variance Breakdown
              </h3>
              <p className="text-xs text-[#2A1710]/70">
                Live calculation of spent amounts directly mapped from recorded expense vouchers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#FFF7E8] p-1 rounded-xl border border-[#D4A72C]/40">
                <button
                  onClick={() => setBudgetViewMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    budgetViewMode === 'cards'
                      ? 'bg-[#32070B] text-[#F4B942] shadow'
                      : 'text-[#32070B] hover:bg-[#FBE9CE]'
                  }`}
                >
                  Progress Cards
                </button>
                <button
                  onClick={() => setBudgetViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    budgetViewMode === 'table'
                      ? 'bg-[#32070B] text-[#F4B942] shadow'
                      : 'text-[#32070B] hover:bg-[#FBE9CE]'
                  }`}
                >
                  Variance Table
                </button>
              </div>

              {budgetCategories.length > 0 && (
                <button
                  onClick={() => setShowResetBudgetModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 font-bold text-xs uppercase hover:bg-red-200 transition-all flex items-center gap-1"
                  title="Clear all budget categories"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">
              Loading budget data...
            </div>
          ) : budgetCategories.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-gray-500 text-xs font-semibold">
                No budget heads allocated yet. Auto-load standard festival heads or add custom heads.
              </div>
              <button
                onClick={handleAutoSeedPresets}
                className="px-4 py-2.5 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] text-xs font-bold uppercase tracking-wider hover:bg-[#32070B] transition-all inline-flex items-center gap-2 shadow"
              >
                <Sparkles className="w-4 h-4" />
                <span>Auto-load Standard Festival Heads</span>
              </button>
            </div>
          ) : budgetViewMode === 'cards' ? (
            /* Progress Cards View */
            <div className="space-y-4">
              {budgetCategories.map((cat, idx) => {
                const pct = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
                const remaining = Math.max(0, cat.allocated - cat.spent);
                const isOver = pct > 100;
                const isHigh = pct >= 85 && pct <= 100;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isOver
                        ? 'bg-rose-50/70 border-rose-300'
                        : isHigh
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-[#FFF7E8] border-[#D4A72C]/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#32070B]">{cat.category}</span>
                        {isOver ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Over Budget
                          </span>
                        ) : isHigh ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> High Utilization
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                            On Track
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-xs font-black text-[#5A0F16]">
                          Spent: ₹{cat.spent.toLocaleString('en-IN')} / Allocated: ₹{cat.allocated.toLocaleString('en-IN')}
                          <span
                            className={`ml-2 font-bold ${
                              isOver ? 'text-rose-600' : isHigh ? 'text-amber-600' : 'text-emerald-700'
                            }`}
                          >
                            ({pct}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditBudget(cat)}
                            className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors shadow-sm"
                            title="Edit Budget Allocation"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteBudgetCategoryTarget(cat.id)}
                            className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors shadow-sm"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white rounded-full h-3.5 border border-[#D4A72C]/40 overflow-hidden mt-2.5">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isOver ? 'bg-rose-600' : isHigh ? 'bg-amber-500' : 'bg-gradient-to-r from-[#D4A72C] to-[#E87516]'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-gray-600 font-semibold flex justify-between pt-1">
                      <span>
                        {isOver ? (
                          <strong className="text-rose-600">
                            Exceeded by ₹{(cat.spent - cat.allocated).toLocaleString('en-IN')}
                          </strong>
                        ) : (
                          <span>Available Balance: ₹{remaining.toLocaleString('en-IN')}</span>
                        )}
                      </span>
                      <span>{Math.max(0, 100 - pct)}% Unutilized</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A1710]">
                <thead className="bg-[#32070B] text-[#F4B942] font-cinzel uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Budget Head</th>
                    <th className="py-3 px-4 text-right">Allocated Budget (₹)</th>
                    <th className="py-3 px-4 text-right">Actual Spent (₹)</th>
                    <th className="py-3 px-4 text-right">Variance / Remaining (₹)</th>
                    <th className="py-3 px-4 text-center">Utilization %</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
                  {budgetCategories.map((cat) => {
                    const pct = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
                    const remaining = Math.max(0, cat.allocated - cat.spent);
                    const isOver = pct > 100;
                    const isHigh = pct >= 85 && pct <= 100;

                    return (
                      <tr key={cat.id} className="hover:bg-[#FFF7E8]/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#32070B]">{cat.category}</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-800">
                          ₹{cat.allocated.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-rose-700">
                          ₹{cat.spent.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">
                          ₹{remaining.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">{pct}%</td>
                        <td className="py-3 px-4 text-center">
                          {isOver ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
                              OVER
                            </span>
                          ) : isHigh ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                              HIGH
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                              ON TRACK
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditBudget(cat)}
                              className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors"
                              title="Edit Head"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteBudgetCategoryTarget(cat.id)}
                              className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                              title="Delete Head"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EXPENSE MODAL (Add / Edit) */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-5 sm:p-6 w-full max-w-lg text-[#FFF7E8] space-y-4 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowExpenseModal(false)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#D4A72C]/30 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4A72C] to-[#E87516] flex items-center justify-center text-[#1F0407] shadow shrink-0 font-bold">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase tracking-wider">
                  {editExpenseItem ? 'Edit Expense Voucher' : 'Record New Expense Voucher'}
                </h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  Fill in the vendor and bill details to record outgoing committee expenses.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  placeholder="e.g. Grand Pandal Iron Structure & Fabric"
                  className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3 text-xs text-[#FFF7E8] font-semibold focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3 text-xs text-emerald-400 font-bold focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Category Head *
                  </label>
                  <select
                    value={isCustomExpenseCategory ? 'CUSTOM' : expenseCategory}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomExpenseCategory(true);
                      } else {
                        setIsCustomExpenseCategory(false);
                        setExpenseCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3 text-xs text-[#F4B942] font-bold focus:outline-none focus:border-[#F4B942]"
                  >
                    {allCategoryNames.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Add Custom Category...</option>
                  </select>
                </div>
              </div>

              {isCustomExpenseCategory && (
                <div>
                  <label className="text-xs font-bold uppercase text-amber-300 block mb-1">
                    Enter Custom Category Name *
                  </label>
                  <input
                    type="text"
                    required={isCustomExpenseCategory}
                    value={customExpenseCategory}
                    onChange={(e) => setCustomExpenseCategory(e.target.value)}
                    placeholder="e.g. Drone Videography & Live Stream"
                    className="w-full bg-[#120204] border border-amber-400/60 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Vendor / Supplier
                  </label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Royal Decorators & Mandap"
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Invoice / Voucher #
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="e.g. INV-2026-101"
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3 text-xs text-[#FFF7E8] font-mono focus:outline-none focus:border-[#F4B942]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Paid By
                  </label>
                  <input
                    type="text"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    placeholder="e.g. Treasurer"
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-2.5 text-xs text-[#FFF7E8]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-2.5 text-xs text-[#FFF7E8] font-bold"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-2.5 text-xs text-[#FFF7E8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="Optional bill breakdown or remarks..."
                  className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#120204] border border-[#D4A72C]/30 text-xs font-bold uppercase hover:bg-[#32070B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-lg"
                >
                  {editExpenseItem ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUDGET HEAD MODAL (Add / Edit) */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-5 sm:p-6 w-full max-w-md text-[#FFF7E8] space-y-4 shadow-2xl relative my-6">
            <button
              onClick={() => setShowBudgetModal(false)}
              className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#FFF7E8] rounded-full hover:bg-[#32070B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#D4A72C]/30 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4A72C] to-[#E87516] flex items-center justify-center text-[#1F0407] shadow shrink-0 font-bold">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase tracking-wider">
                  {editBudgetItem ? 'Edit Budget Head' : 'Add Budget Head'}
                </h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  Assign financial allocation limits for festival operational heads.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                  Budget Category Head *
                </label>
                <select
                  value={isCustomBudgetCategory ? 'CUSTOM' : budgetCategoryName}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setIsCustomBudgetCategory(true);
                    } else {
                      setIsCustomBudgetCategory(false);
                      setBudgetCategoryName(e.target.value);
                    }
                  }}
                  className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3 text-xs text-[#F4B942] font-bold focus:outline-none focus:border-[#F4B942]"
                >
                  {STANDARD_EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Add Custom Category Head...</option>
                </select>
              </div>

              {isCustomBudgetCategory && (
                <div>
                  <label className="text-xs font-bold uppercase text-amber-300 block mb-1">
                    Custom Head Name *
                  </label>
                  <input
                    type="text"
                    required={isCustomBudgetCategory}
                    value={customBudgetCategory}
                    onChange={(e) => setCustomBudgetCategory(e.target.value)}
                    placeholder="e.g. VIP Hospitality & Refreshments"
                    className="w-full bg-[#120204] border border-amber-400/60 rounded-xl py-2.5 px-3 text-xs text-[#FFF7E8] focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                  Allocated Budget Limit (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={allocatedBudgetAmount}
                  onChange={(e) => setAllocatedBudgetAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3 text-xs text-emerald-400 font-bold focus:outline-none focus:border-[#F4B942]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                  Spent Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={manualSpentAmount}
                  onChange={(e) => setManualSpentAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#120204] border border-[#D4A72C]/40 rounded-xl py-2.5 px-3 text-xs text-[#FFF7E8]"
                />
                <p className="text-[10px] text-[#FFF7E8]/60 mt-1">
                  Leave at 0 or current value to auto-calculate from live recorded expense vouchers.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#120204] border border-[#D4A72C]/30 text-xs font-bold uppercase hover:bg-[#32070B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-lg"
                >
                  {editBudgetItem ? 'Update Head' : 'Save Head'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Expense Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteExpenseTarget}
        title="Delete Expense Record"
        itemTitle={deleteExpenseTarget ? `${deleteExpenseTarget.expenseName} (${deleteExpenseTarget.invoiceNumber})` : undefined}
        message={`Are you sure you want to delete the expense record of ₹${deleteExpenseTarget?.amount?.toLocaleString('en-IN')} for "${deleteExpenseTarget?.expenseName}"?`}
        confirmText="Yes, Delete Expense"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteExpense}
        onClose={() => setDeleteExpenseTarget(null)}
      />

      {/* Delete Budget Category Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteBudgetCategoryTarget}
        title="Delete Budget Head"
        itemTitle={deleteBudgetCategoryTarget || undefined}
        message={`Are you sure you want to delete the budget allocation head "${deleteBudgetCategoryTarget}"?`}
        confirmText="Yes, Remove Head"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteBudgetCategory}
        onClose={() => setDeleteBudgetCategoryTarget(null)}
      />

      {/* Clear All Categories Modal */}
      <ConfirmDeleteModal
        isOpen={showResetBudgetModal}
        title="Clear All Budget Categories"
        itemTitle="All Budget Heads"
        message="Are you sure you want to delete ALL budget allocation categories? This will reset the budget matrix."
        confirmText="Yes, Clear All Data"
        isLoading={isDeleting}
        onConfirm={handleConfirmResetAllBudget}
        onClose={() => setShowResetBudgetModal(false)}
      />
    </div>
  );
};
