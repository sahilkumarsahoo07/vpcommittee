import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Pagination } from '../components/Pagination';

interface ExpenseItem {
  id: string;
  expenseName: string;
  category: string;
  amount: number;
  date: string;
  vendor: string;
  paidBy: string;
  paymentMethod: string;
  invoiceNumber: string;
}

export const AdminExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ExpenseItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Pandal');
  const [vendor, setVendor] = useState('');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getExpenses();
      if (res.success && Array.isArray(res.data)) {
        const mapped: ExpenseItem[] = res.data.map((item: any, idx: number) => ({
          id: item._id || item.id || String(idx),
          expenseName: item.title || item.expenseName || 'Expense Item',
          category: item.category || 'General',
          amount: Number(item.amount || 0),
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          vendor: item.vendor || 'Local Supplier',
          paidBy: item.paidBy || 'Treasurer',
          paymentMethod: item.paymentMethod || 'UPI',
          invoiceNumber: item.receiptNumber || item.invoiceNumber || `INV-2026-${100 + idx}`,
        }));
        setExpenses(mapped.reverse());
      }
    } catch {
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filtered = expenses.filter(
    (e) =>
      e.expenseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedExpenses = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditItem(null);
    setExpenseName('');
    setAmount('');
    setCategory('Pandal');
    setVendor('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: ExpenseItem) => {
    setEditItem(item);
    setExpenseName(item.expenseName);
    setAmount(String(item.amount));
    setCategory(item.category);
    setVendor(item.vendor);
    setShowModal(true);
  };

  const handleSaveExpense = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!expenseName || !amount) return;

    try {
      const payload = {
        title: expenseName,
        expenseName,
        category,
        amount: Number(amount),
        vendor: vendor || 'Local Vendor',
        paymentMethod: 'UPI',
        date: new Date().toISOString(),
      };

      if (editItem) {
        await adminAPI.updateExpense(editItem.id, payload);
      } else {
        await adminAPI.createExpense(payload);
      }
      await fetchExpenses();
    } catch {
      if (editItem) {
        setExpenses(
          expenses.map((e) =>
            e.id === editItem.id
              ? { ...e, expenseName, category, amount: Number(amount), vendor: vendor || 'Local Vendor' }
              : e
          )
        );
      } else {
        const newItem: ExpenseItem = {
          id: String(Date.now()),
          expenseName,
          category,
          amount: Number(amount),
          date: new Date().toISOString().split('T')[0],
          vendor: vendor || 'Local Vendor',
          paidBy: 'Treasurer',
          paymentMethod: 'UPI',
          invoiceNumber: `INV-2026-${expenses.length + 101}`,
        };
        setExpenses([newItem, ...expenses]);
      }
    } finally {
      setShowModal(false);
      setEditItem(null);
      setExpenseName('');
      setAmount('');
      setVendor('');
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<ExpenseItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item: ExpenseItem) => {
    setDeleteTarget(item);
  };

  const handleConfirmDeleteExpense = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      setExpenses(expenses.filter((e) => e.id !== deleteTarget.id));
      await adminAPI.deleteExpense(deleteTarget.id);
      await fetchExpenses();
    } catch {
      // Done
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider">
            Expense Tracker & Vouchers
          </h2>
          <p className="text-xs text-[#2A1710]/70 font-semibold">
            Track all outgoing committee payments, vendor bills, pandal expenses, and invoice attachments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40">
          <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Total Outgoing Expense</div>
          <div className="text-2xl font-black mt-1">₹{totalExpense.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40">
          <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Recorded Invoices</div>
          <div className="text-2xl font-black mt-1">{expenses.length} Vouchers</div>
        </div>
        <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-2xl border-2 border-[#D4A72C]/40">
          <div className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Main Expense Head</div>
          <div className="text-2xl font-black mt-1 text-[#F4B942]">Pandal & Iron Frame</div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search expense description, category, vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFF7E8] border border-[#D4A72C]/50 rounded-xl py-2 px-3.5 pl-9 text-xs text-[#2A1710] focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#D4A72C] absolute left-3 top-2.5" />
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">Loading expenses from database...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A1710]">
                <thead className="bg-[#32070B] text-[#F4B942] font-cinzel uppercase">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Inv #</th>
                    <th className="py-3 px-4">Expense Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#2A1710]/60">
                        No expense records found matching your search.
                      </td>
                    </tr>
                  ) : (
                    paginatedExpenses.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FFF7E8]/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#5A0F16]">{item.invoiceNumber}</td>
                        <td className="py-3 px-4 font-bold">{item.expenseName}</td>
                        <td className="py-3 px-4 font-semibold text-[#E87516]">{item.category}</td>
                        <td className="py-3 px-4 text-gray-700">{item.vendor}</td>
                        <td className="py-3 px-4 text-gray-600">{item.date}</td>
                        <td className="py-3 px-4 text-right font-black text-[#32070B]">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg bg-[#5A0F16] text-[#F4B942] hover:bg-[#32070B] transition-colors"
                              title="Edit Expense"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              isDark={false}
            />
          </>
        )}
      </div>

      {/* Expense Modal (Add / Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#240407] border-2 border-[#F4B942] rounded-3xl p-6 w-full max-w-md text-[#FFF7E8] space-y-4 shadow-2xl">
            <h3 className="font-cinzel text-xl font-black text-[#F4B942] uppercase tracking-wider">
              {editItem ? 'Edit Expense Voucher' : 'Record New Expense Voucher'}
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  placeholder="e.g. Flower Decoration & Garlands"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#FFF7E8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#170204] border border-[#D4A72C]/40 rounded-xl py-2 px-3 text-xs text-[#F4B942] font-bold"
                >
                  <option value="Pandal">Pandal & Construction</option>
                  <option value="Decoration">Decoration & Idols</option>
                  <option value="Lighting">Lighting & Illumination</option>
                  <option value="Music">Sound & Cultural Stage</option>
                  <option value="Food">Maha Prasad & Catering</option>
                  <option value="Security">Security & Cleaning</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#FFF7E8]/80 block mb-1">Vendor Name</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. Royal Decorators"
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
                  {editItem ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Expense Record"
        itemTitle={deleteTarget ? `${deleteTarget.expenseName} (${deleteTarget.invoiceNumber})` : undefined}
        message={`Are you sure you want to delete the expense record of ₹${deleteTarget?.amount?.toLocaleString('en-IN')} for ${deleteTarget?.expenseName}?`}
        confirmText="Yes, Delete Expense"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteExpense}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
