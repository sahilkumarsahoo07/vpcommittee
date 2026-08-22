import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Edit2,
  Plus,
  Trash2,
  Download,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { STANDARD_EXPENSE_CATEGORIES } from './AdminExpensesPage';

export interface CategoryItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
}

export const AdminBudgetPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'cards' | 'table'>('cards');

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryItem | null>(null);

  const [categoryName, setCategoryName] = useState('');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [spentAmount, setSpentAmount] = useState('0');

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBudgetAndExpenses = async () => {
    try {
      setLoading(true);
      const [budgetRes, expensesRes] = await Promise.all([
        adminAPI.getBudget().catch(() => null),
        adminAPI.getExpenses().catch(() => null),
      ]);

      const expensesList =
        expensesRes?.success && Array.isArray(expensesRes.data) ? expensesRes.data : [];

      // Calculate actual spending per category from expenses
      const spentByCategory: Record<string, number> = {};
      expensesList.forEach((e: any) => {
        const catKey = (e.category || 'Miscellaneous & Other').toLowerCase().trim();
        spentByCategory[catKey] = (spentByCategory[catKey] || 0) + (Number(e.amount) || 0);
      });

      if (budgetRes?.success && budgetRes?.data && Array.isArray(budgetRes.data.categories)) {
        const mapped: CategoryItem[] = budgetRes.data.categories.map((c: any) => {
          const catKey = (c.category || '').toLowerCase().trim();
          const autoSpentFromExpenses = spentByCategory[catKey] || 0;

          return {
            id: c._id || c.id || String(c.category),
            category: c.category,
            allocated: Number(c.allocated || c.allocatedAmount || 0),
            spent: Number(c.spent !== undefined ? c.spent : autoSpentFromExpenses),
          };
        });

        setCategories(mapped);
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetAndExpenses();
  }, []);

  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const totalRemaining = Math.max(0, totalAllocated - totalSpent);
  const overallPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const handleOpenAdd = () => {
    setEditCategory(null);
    setCategoryName(STANDARD_EXPENSE_CATEGORIES[0]);
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setAllocatedAmount('');
    setSpentAmount('0');
    setShowModal(true);
  };

  const handleOpenEdit = (item: CategoryItem) => {
    setEditCategory(item);
    if (STANDARD_EXPENSE_CATEGORIES.includes(item.category)) {
      setCategoryName(item.category);
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    } else {
      setCategoryName('CUSTOM');
      setIsCustomCategory(true);
      setCustomCategoryInput(item.category);
    }
    setAllocatedAmount(String(item.allocated));
    setSpentAmount(String(item.spent));
    setShowModal(true);
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedName = isCustomCategory
      ? customCategoryInput.trim() || 'Miscellaneous & Other'
      : categoryName;

    if (!resolvedName || !allocatedAmount) return;

    const parsedAllocated = Number(allocatedAmount) || 0;
    const parsedSpent = Number(spentAmount) || 0;

    let updatedList = [...categories];
    if (editCategory) {
      const remaining = updatedList.filter((c) => c.category !== editCategory.category);
      const updatedItem: CategoryItem = {
        id: editCategory.id,
        category: resolvedName,
        allocated: parsedAllocated,
        spent: parsedSpent,
      };
      updatedList = [updatedItem, ...remaining];
    } else {
      const newItem: CategoryItem = {
        id: `temp_${Date.now()}`,
        category: resolvedName,
        allocated: parsedAllocated,
        spent: parsedSpent,
      };
      updatedList = [newItem, ...updatedList];
    }

    setCategories(updatedList);
    setShowModal(false);

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
      await fetchBudgetAndExpenses();
    } catch {
      // Silent error fallback
    }
  };

  const handleDeleteCategoryClick = (catId: string) => {
    setDeleteTarget(catId);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget && c.category !== deleteTarget));
    try {
      await adminAPI.deleteBudgetCategory(deleteTarget);
      await fetchBudgetAndExpenses();
    } catch {
      fetchBudgetAndExpenses();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleConfirmResetAll = async () => {
    setIsDeleting(true);
    setCategories([]);
    try {
      await adminAPI.deleteBudget();
    } catch {
      fetchBudgetAndExpenses();
    } finally {
      setIsDeleting(false);
      setShowResetModal(false);
    }
  };

  // Auto-seed Standard Budget Heads
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

    const presetList: CategoryItem[] = Object.entries(defaultAllocations).map(([cat, alloc], idx) => ({
      id: `preset_${idx}`,
      category: cat,
      allocated: alloc,
      spent: 0,
    }));

    setCategories(presetList);

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
      await fetchBudgetAndExpenses();
    } catch {
      // Fallback
    }
  };

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      await adminAPI.exportBudgetPDF();
    } catch (err) {
      console.error('Failed to download budget variance PDF', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Excel Download Handler
  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      await adminAPI.exportBudgetExcel();
    } catch (err) {
      console.error('Failed to download budget variance Excel', err);
    } finally {
      setDownloadingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-7 h-7 text-[#E87516]" />
            <span>Festival Budget vs Actual Variance</span>
          </h2>
          <p className="text-xs text-[#2A1710]/80 font-medium mt-1">
            Annual budget allocation versus actual expenses incurred across all operational heads in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="px-3.5 py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/60 font-bold text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-1.5 shadow disabled:opacity-50"
            title="Download PDF Variance Audit Statement"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingPdf ? 'Generating PDF...' : 'PDF Variance'}</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="px-3.5 py-2 rounded-xl bg-[#120204] text-emerald-400 border border-emerald-500/40 font-bold text-xs uppercase tracking-wider hover:bg-[#240407] transition-all flex items-center gap-1.5 shadow disabled:opacity-50"
            title="Download Excel Variance Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{downloadingExcel ? 'Exporting...' : 'Excel Sheet'}</span>
          </button>

          {categories.length > 0 && (
            <button
              onClick={() => setShowResetModal(true)}
              className="px-3 py-2 rounded-xl bg-red-100 text-red-700 border border-red-300 font-bold text-xs uppercase tracking-wider hover:bg-red-200 transition-all flex items-center gap-1.5 shadow-sm"
              title="Reset all budget categories"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Budget Head</span>
          </button>
        </div>
      </div>

      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Allocated Budget</span>
            <DollarSign className="w-4 h-4 text-[#F4B942]" />
          </div>
          <div className="text-2xl font-black text-[#F4B942] mt-1">
            ₹{totalAllocated.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">
            {categories.length} operational budget heads
          </div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Actual Spent</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-300 mt-1">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">
            Synced from recorded expense vouchers
          </div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Unspent Balance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ₹{totalRemaining.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">Remaining committee funds</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Utilization %</span>
            <Layers className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">
            {overallPercentage}% Used
          </div>
          <div className="text-[11px] text-[#FFF7E8]/60 mt-1">
            {overallPercentage > 100 ? (
              <span className="text-rose-400 font-bold">⚠️ Budget Overdrawn</span>
            ) : overallPercentage > 85 ? (
              <span className="text-amber-400 font-bold">⚠️ High Spending</span>
            ) : (
              <span className="text-emerald-400 font-bold">✓ Within Budget</span>
            )}
          </div>
        </div>
      </div>

      {/* View Switcher & Actions */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4A72C]/20 pb-4">
          <div>
            <h3 className="font-cinzel text-lg font-black text-[#32070B] uppercase tracking-wider">
              Category Utilization & Variance Breakdown
            </h3>
            <p className="text-xs text-[#2A1710]/70">
              Real-time variance calculation based on recorded expense vouchers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FFF7E8] p-1 rounded-xl border border-[#D4A72C]/40">
              <button
                onClick={() => setActiveView('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'cards'
                    ? 'bg-[#32070B] text-[#F4B942] shadow'
                    : 'text-[#32070B] hover:bg-[#FBE9CE]'
                }`}
              >
                Progress Cards
              </button>
              <button
                onClick={() => setActiveView('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'table'
                    ? 'bg-[#32070B] text-[#F4B942] shadow'
                    : 'text-[#32070B] hover:bg-[#FBE9CE]'
                }`}
              >
                Variance Table
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">
            Loading budget data...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="text-gray-500 text-xs font-semibold">
              No budget heads allocated yet. You can create custom heads or auto-load standard festival heads.
            </div>
            <button
              onClick={handleAutoSeedPresets}
              className="px-4 py-2.5 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] text-xs font-bold uppercase tracking-wider hover:bg-[#32070B] transition-all inline-flex items-center gap-2 shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>Auto-load Standard Festival Heads</span>
            </button>
          </div>
        ) : activeView === 'cards' ? (
          /* Cards View */
          <div className="space-y-4">
            {categories.map((cat, idx) => {
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
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors shadow-sm"
                          title="Edit Budget Allocation"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategoryClick(cat.id)}
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
                {categories.map((cat) => {
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
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors"
                            title="Edit Head"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategoryClick(cat.id)}
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

      {/* Budget Head Modal (Add / Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-5 sm:p-6 w-full max-w-md text-[#FFF7E8] space-y-4 shadow-2xl relative my-6">
            <button
              onClick={() => setShowModal(false)}
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
                  {editCategory ? 'Edit Budget Head' : 'Add Budget Head'}
                </h3>
                <p className="text-xs text-[#FFF7E8]/70">
                  Assign financial allocation limits for operational festival categories.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold uppercase text-[#F4B942] block mb-1">
                  Budget Category Head *
                </label>
                <select
                  value={isCustomCategory ? 'CUSTOM' : categoryName}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setIsCustomCategory(true);
                    } else {
                      setIsCustomCategory(false);
                      setCategoryName(e.target.value);
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

              {isCustomCategory && (
                <div>
                  <label className="text-xs font-bold uppercase text-amber-300 block mb-1">
                    Custom Head Name *
                  </label>
                  <input
                    type="text"
                    required={isCustomCategory}
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
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
                  value={allocatedAmount}
                  onChange={(e) => setAllocatedAmount(e.target.value)}
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
                  value={spentAmount}
                  onChange={(e) => setSpentAmount(e.target.value)}
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
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#120204] border border-[#D4A72C]/30 text-xs font-bold uppercase hover:bg-[#32070B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A72C] to-[#E87516] text-[#1F0407] text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-lg"
                >
                  {editCategory ? 'Update Head' : 'Save Head'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Budget Head"
        itemTitle={deleteTarget || undefined}
        message={`Are you sure you want to delete the budget allocation head "${deleteTarget}"?`}
        confirmText="Yes, Remove Head"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteCategory}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Clear All Categories Modal */}
      <ConfirmDeleteModal
        isOpen={showResetModal}
        title="Clear All Budget Categories"
        itemTitle="All Budget Heads"
        message="Are you sure you want to delete ALL budget allocation categories? This will reset the budget matrix."
        confirmText="Yes, Clear All Data"
        isLoading={isDeleting}
        onConfirm={handleConfirmResetAll}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
};
