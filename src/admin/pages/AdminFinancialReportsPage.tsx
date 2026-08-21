import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, FileText, Download, Wallet, DollarSign, PieChart, Loader2, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { adminAPI } from '../../services/api';

interface FinancialMetrics {
  totalDonations: number;
  totalExpenses: number;
  currentBalance: number;
  allocatedBudget: number;
  remainingBudget: number;
  utilizationPercentage: number;
  donationCount: number;
  expenseCount: number;
}

interface ExpenseCategorySummary {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
}

export const AdminFinancialReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalDonations: 0,
    totalExpenses: 0,
    currentBalance: 0,
    allocatedBudget: 0,
    remainingBudget: 0,
    utilizationPercentage: 0,
    donationCount: 0,
    expenseCount: 0,
  });

  const [categoriesSummary, setCategoriesSummary] = useState<ExpenseCategorySummary[]>([]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const [donationsRes, expensesRes, budgetRes] = await Promise.all([
        adminAPI.getDonations().catch(() => null),
        adminAPI.getExpenses().catch(() => null),
        adminAPI.getBudget().catch(() => null),
      ]);

      const donationsList = donationsRes?.success && Array.isArray(donationsRes.data) ? donationsRes.data : [];
      const expensesList = expensesRes?.success && Array.isArray(expensesRes.data) ? expensesRes.data : [];
      const budgetData = budgetRes?.success && budgetRes.data ? budgetRes.data : { totalAllocatedBudget: 500000, categories: [] };

      const totalDonations = donationsList.reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0);
      const totalExpenses = expensesList.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
      const currentBalance = totalDonations - totalExpenses;
      const allocatedBudget = budgetData.totalAllocatedBudget || 500000;
      const remainingBudget = Math.max(0, allocatedBudget - totalExpenses);
      const utilizationPercentage = allocatedBudget > 0 ? Math.round((totalExpenses / allocatedBudget) * 100) : 0;

      setMetrics({
        totalDonations,
        totalExpenses,
        currentBalance,
        allocatedBudget,
        remainingBudget,
        utilizationPercentage,
        donationCount: donationsList.length,
        expenseCount: expensesList.length,
      });

      // Build Category Breakdown
      const catMap: Record<string, { allocated: number; spent: number }> = {};
      
      if (Array.isArray(budgetData.categories)) {
        budgetData.categories.forEach((cat: any) => {
          catMap[cat.category] = {
            allocated: Number(cat.allocatedAmount) || 0,
            spent: 0,
          };
        });
      }

      expensesList.forEach((e: any) => {
        const cat = e.category || 'Other';
        if (!catMap[cat]) {
          catMap[cat] = { allocated: 0, spent: 0 };
        }
        catMap[cat].spent += Number(e.amount) || 0;
      });

      const catSummaryList: ExpenseCategorySummary[] = Object.keys(catMap).map((catKey) => ({
        category: catKey,
        allocated: catMap[catKey].allocated,
        spent: catMap[catKey].spent,
        remaining: catMap[catKey].allocated - catMap[catKey].spent,
      }));

      setCategoriesSummary(catSummaryList);
    } catch {
      // Fallback state handled gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const downloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      const params: any = {};
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      await adminAPI.exportFinancialPDF(params);
    } catch {
      alert('Failed to download PDF report. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const downloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      const params: any = {};
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      await adminAPI.exportDonationsExcel(params);
    } catch {
      alert('Failed to download Excel sheet. Please try again.');
    } finally {
      setDownloadingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4A72C]/40 pb-4">
        <div>
          <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider">
            Financial Ledger & Balance Tracker
          </h2>
          <p className="text-xs text-[#2A1710]/70 font-semibold">
            Track total collections, expenses incurred, remaining net balance, and download overall or date-filtered PDF & Excel statements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Picker inputs */}
          <div className="flex items-center gap-1.5 bg-white border border-[#D4A72C]/40 rounded-xl p-1.5 shadow-sm text-xs">
            <span className="text-[10px] font-bold text-[#5A0F16] uppercase px-1">Dates:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#FFF7E8] text-[#2A1710] font-semibold text-[11px] rounded-lg px-2 py-1 border border-[#D4A72C]/30 focus:outline-none"
              title="Start Date"
            />
            <span className="text-xs text-[#2A1710]/50 font-bold">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#FFF7E8] text-[#2A1710] font-semibold text-[11px] rounded-lg px-2 py-1 border border-[#D4A72C]/30 focus:outline-none"
              title="End Date"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-[10px] font-bold text-rose-700 underline px-1"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={downloadPDF}
            disabled={downloadingPdf}
            className="px-4 py-2.5 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow disabled:opacity-50"
          >
            {downloadingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>{downloadingPdf ? 'Exporting PDF...' : 'Download PDF Report'}</span>
          </button>
          
          <button
            onClick={downloadExcel}
            disabled={downloadingExcel}
            className="px-4 py-2.5 rounded-xl bg-[#2A060A] text-[#FFF7E8] border border-[#D4A72C]/60 font-black text-xs uppercase tracking-wider hover:bg-[#32070B] transition-all flex items-center gap-2 shadow disabled:opacity-50"
          >
            {downloadingExcel ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            )}
            <span>{downloadingExcel ? 'Exporting Excel...' : 'Download Excel File'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">
          Computing financial calculations and balance metrics...
        </div>
      ) : (
        <>
          {/* Main Financial KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Money Collected */}
            <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-3xl border-2 border-emerald-500/50 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total Money Collected</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mt-2">
                ₹{metrics.totalDonations.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#FFF7E8]/70 mt-1 font-medium">
                From <span className="text-emerald-400 font-bold">{metrics.donationCount}</span> total donations
              </div>
            </div>

            {/* Total Expenses Incurred */}
            <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-3xl border-2 border-rose-500/50 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Total Expenses Incurred</span>
                <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mt-2">
                ₹{metrics.totalExpenses.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#FFF7E8]/70 mt-1 font-medium">
                Across <span className="text-rose-400 font-bold">{metrics.expenseCount}</span> expense vouchers
              </div>
            </div>

            {/* Remaining Money / Net Balance */}
            <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-3xl border-2 border-[#F4B942] shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Remaining Net Money</span>
                <div className="w-8 h-8 rounded-xl bg-[#5A0F16] border border-[#F4B942]/60 flex items-center justify-center text-[#F4B942]">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl font-black mt-2 ${metrics.currentBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹{metrics.currentBalance.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#FFF7E8]/70 mt-1 font-medium">
                {metrics.currentBalance >= 0 ? 'Available Surplus Balance' : 'Net Deficit (Needs Fundraiser)'}
              </div>
            </div>

            {/* Allocated Budget & Utilization */}
            <div className="bg-[#240407] text-[#FFF7E8] p-5 rounded-3xl border-2 border-[#D4A72C]/40 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Allocated Budget</span>
                <div className="w-8 h-8 rounded-xl bg-[#170204] border border-[#D4A72C]/40 flex items-center justify-center text-[#F4B942]">
                  <PieChart className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mt-2">
                ₹{metrics.allocatedBudget.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#FFF7E8]/70 mt-1 font-medium">
                <span className="text-[#F4B942] font-bold">{metrics.utilizationPercentage}%</span> budget spent
              </div>
            </div>
          </div>

          {/* Detailed Financial Calculation Box */}
          <div className="bg-gradient-to-r from-[#240407] to-[#32070B] text-[#FFF7E8] border-2 border-[#D4A72C]/50 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4A72C]/30 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#F4B942]" />
                <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase tracking-wider">
                  Committee Cashflow Calculation
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[11px] font-black uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Live Audited
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-[#170204] p-4 rounded-2xl border border-emerald-500/30 space-y-1">
                <div className="text-[#FFF7E8]/70 font-semibold uppercase text-[10px]">Step 1: Total Collections (+)</div>
                <div className="text-xl font-bold text-emerald-400">+ ₹{metrics.totalDonations.toLocaleString('en-IN')}</div>
                <p className="text-[11px] text-[#FFF7E8]/60">Sum of all donor contributions and pledges.</p>
              </div>

              <div className="bg-[#170204] p-4 rounded-2xl border border-rose-500/30 space-y-1">
                <div className="text-[#FFF7E8]/70 font-semibold uppercase text-[10px]">Step 2: Vendor Payments (-)</div>
                <div className="text-xl font-bold text-rose-400">- ₹{metrics.totalExpenses.toLocaleString('en-IN')}</div>
                <p className="text-[11px] text-[#FFF7E8]/60">Pandal, clay idol, lighting & sounds expenses.</p>
              </div>

              <div className="bg-[#170204] p-4 rounded-2xl border border-[#F4B942]/40 space-y-1">
                <div className="text-[#FFF7E8]/70 font-semibold uppercase text-[10px]">Step 3: Remaining Balance (=)</div>
                <div className={`text-xl font-black ${metrics.currentBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  = ₹{metrics.currentBalance.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-[#FFF7E8]/60">Net money currently available in treasury.</p>
              </div>
            </div>
          </div>

          {/* Category-wise Expense Breakdown Table */}
          <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#D4A72C]/30 pb-3">
              <div>
                <h3 className="font-cinzel text-lg font-black text-[#32070B] uppercase tracking-wider">
                  Category Expense & Budget Utilization
                </h3>
                <p className="text-xs text-[#2A1710]/70 font-semibold">
                  Track how much money is spent per category versus allocated budget.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A1710]">
                <thead className="bg-[#32070B] text-[#F4B942] font-cinzel uppercase">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Expense Head / Category</th>
                    <th className="py-3 px-4">Allocated Budget (₹)</th>
                    <th className="py-3 px-4">Actual Expense Spent (₹)</th>
                    <th className="py-3 px-4">Remaining Unspent (₹)</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A72C]/20 font-medium">
                  {categoriesSummary.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#2A1710]/60">
                        No expense category data recorded yet.
                      </td>
                    </tr>
                  ) : (
                    categoriesSummary.map((cat, idx) => {
                      const isOver = cat.spent > cat.allocated && cat.allocated > 0;
                      return (
                        <tr key={idx} className="hover:bg-[#FFF7E8]/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#5A0F16]">{cat.category}</td>
                          <td className="py-3 px-4 font-bold text-[#2A1710]">
                            {cat.allocated > 0 ? `₹${cat.allocated.toLocaleString('en-IN')}` : 'Unallocated'}
                          </td>
                          <td className="py-3 px-4 text-rose-700 font-bold">
                            ₹{cat.spent.toLocaleString('en-IN')}
                          </td>
                          <td className={`py-3 px-4 font-black ${cat.remaining >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            ₹{cat.remaining.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isOver ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
                                Over Budget
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                                Within Limit
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Download & Export Quick Actions Footer Box */}
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-cinzel text-base font-black text-[#F4B942] uppercase">
                Need Official Exported Audit Files?
              </h4>
              <p className="text-xs text-[#FFF7E8]/70 font-semibold">
                Generate instant watermarked PDFs or Microsoft Excel spreadsheets for committee meetings.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={downloadPDF}
                disabled={downloadingPdf}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#F4B942] text-[#32070B] font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>PDF Audit Report</span>
              </button>

              <button
                onClick={downloadExcel}
                disabled={downloadingExcel}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Excel Spreadsheet</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
