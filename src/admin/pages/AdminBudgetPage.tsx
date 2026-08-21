import React, { useState, useEffect } from 'react';
import { AlertTriangle, Edit2, Plus, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';

import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

interface CategoryItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
}

export const AdminBudgetPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryItem | null>(null);

  const [categoryName, setCategoryName] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [spentAmount, setSpentAmount] = useState('0');

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const [budgetRes, expensesRes] = await Promise.all([
        adminAPI.getBudget().catch(() => null),
        adminAPI.getExpenses().catch(() => null),
      ]);

      const expensesList = expensesRes?.success && Array.isArray(expensesRes.data) ? expensesRes.data : [];

      if (budgetRes?.success && budgetRes?.data && Array.isArray(budgetRes.data.categories)) {
        const mapped: CategoryItem[] = budgetRes.data.categories.map((c: any) => {
          const categoryExpenses = expensesList.filter(
            (e: any) => e.category && c.category && e.category.toLowerCase().trim() === c.category.toLowerCase().trim()
          );
          const autoSpentFromExpenses = categoryExpenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
          
          return {
            id: c._id || c.id || String(c.category),
            category: c.category,
            allocated: Number(c.allocated || c.allocatedAmount || 0),
            spent: Number(c.spent || c.spentAmount) || autoSpentFromExpenses,
          };
        });
        // Always set — even an empty array means all categories were deleted
        setCategories(mapped);
      }
    } catch {
      // API failed — keep current state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const totalRemaining = Math.max(0, totalAllocated - totalSpent);
  const overallPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const handleOpenAdd = () => {
    setEditCategory(null);
    setCategoryName('');
    setAllocatedAmount('');
    setSpentAmount('0');
    setShowModal(true);
  };

  const handleOpenEdit = (item: CategoryItem) => {
    setEditCategory(item);
    setCategoryName(item.category);
    setAllocatedAmount(String(item.allocated));
    setSpentAmount(String(item.spent));
    setShowModal(true);
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName || !allocatedAmount) return;

    const parsedAllocated = Number(allocatedAmount) || 0;
    const parsedSpent = Number(spentAmount) || 0;

    let updatedList = [...categories];
    if (editCategory) {
      const remaining = updatedList.filter((c) => c.category !== editCategory.category);
      const updatedItem: CategoryItem = {
        id: editCategory.id,
        category: categoryName,
        allocated: parsedAllocated,
        spent: parsedSpent,
      };
      updatedList = [updatedItem, ...remaining];
    } else {
      const newItem: CategoryItem = {
        id: `temp_${Date.now()}`,
        category: categoryName,
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
    } catch {
      // Silent error fallback
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCategoryClick = (catId: string) => {
    setDeleteTarget(catId);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    // Optimistically remove from UI
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget));
    try {
      await adminAPI.deleteBudgetCategory(deleteTarget);
    } catch {
      // If API fails, re-fetch to restore
      fetchBudget();
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
      fetchBudget();
    } finally {
      setIsDeleting(false);
      setShowResetModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider">
            Festival Budget vs Actual Variance
          </h2>
          <p className="text-xs text-[#2A1710]/70 font-semibold">
            Annual budget allocation versus actual expenses incurred across all operational heads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {categories.length > 0 && (
            <button
              onClick={() => setShowResetModal(true)}
              className="px-3 py-2.5 rounded-xl bg-red-100 text-red-700 border border-red-300 font-bold text-xs uppercase tracking-wider hover:bg-red-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Budget Head</span>
          </button>
        </div>
      </div>

      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40">
          <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Allocated Budget</div>
          <div className="text-2xl font-black mt-1">₹{totalAllocated.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40">
          <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Actual Spent</div>
          <div className="text-2xl font-black mt-1 text-[#E87516]">₹{totalSpent.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40">
          <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Remaining Unspent</div>
          <div className="text-2xl font-black mt-1 text-emerald-400">₹{totalRemaining.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40">
          <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Utilization %</div>
          <div className="text-2xl font-black mt-1 text-[#F4B942]">{overallPercentage}% Used</div>
        </div>
      </div>

      {/* Progress Bars List */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-sm space-y-5">
        <h3 className="font-cinzel text-lg font-black text-[#32070B] uppercase tracking-wider">
          Category Utilization & Variance Breakdown
        </h3>

        {loading ? (
          <div className="text-center py-8 text-[#32070B] font-cinzel font-bold text-sm">
            Loading budget from backend API...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs font-semibold">
            No budget heads allocated yet. Click "Add Budget Head" above.
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat, idx) => {
              const pct = cat.allocated > 0 ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100)) : 0;
              const remaining = Math.max(0, cat.allocated - cat.spent);
              const isOver = pct > 90;

              return (
                <div key={idx} className="bg-[#FFF7E8] p-4 rounded-2xl border border-[#D4A72C]/30 space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#32070B]">{cat.category}</span>
                      {isOver && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> High Utilization
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-black text-[#5A0F16]">
                        Spent: ₹{cat.spent.toLocaleString('en-IN')} / Allocated: ₹{cat.allocated.toLocaleString('en-IN')}
                        <span className="text-[#E87516] ml-2">({pct}%)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1 rounded bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors"
                          title="Edit Budget Allocation (PUT)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategoryClick(cat.id)}
                          className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          title="Delete Category (DELETE)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-white rounded-full h-3 border border-[#D4A72C]/40 overflow-hidden">
                    <div
                      className={`h-full ${isOver ? 'bg-red-500' : 'bg-[#E87516]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-gray-600 font-semibold flex justify-between">
                    <span>Available Balance: ₹{remaining.toLocaleString('en-IN')}</span>
                    <span>{100 - pct}% Unutilized</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Budget Head Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-6 w-full max-w-md text-[#FFF7E8] space-y-4 shadow-2xl">
            <h3 className="font-cinzel text-xl font-black text-[#F4B942] uppercase tracking-wider">
              {editCategory ? 'Edit Budget Head (PUT)' : 'Add Budget Head (POST)'}
            </h3>

            <form onSubmit={handleSaveBudget} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Category Head Name</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Flower Decor & Entrance Arch"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Allocated Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={allocatedAmount}
                  onChange={(e) => setAllocatedAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">
                  Spent Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={spentAmount}
                  onChange={(e) => setSpentAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
                <p className="text-[10px] text-[#FFF7E8]/60 mt-1">
                  Set spent amount directly OR let it auto-calculate when recording expenses in the Expenses page.
                </p>
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
                  {editCategory ? 'Update Allocation' : 'Save Head'}
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
        message="Are you sure you want to delete ALL budget allocation categories? This will wipe all category data from the database."
        confirmText="Yes, Clear All Data"
        isLoading={isDeleting}
        onConfirm={handleConfirmResetAll}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
};
