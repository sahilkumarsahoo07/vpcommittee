import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Receipt,
  PieChart,
  Users,
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { adminAPI, publicAPI } from '../../services/api';

import { MemberRestrictedHome } from './MemberRestrictedHome';

export const AdminDashboardHome: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;
  const userPerms = user?.permissions || [];

  const hasDashboardAccess =
    role === 'SUPERADMIN' ||
    role === 'ADMIN' ||
    role === 'COMMITTEE_MEMBER' ||
    userPerms.includes('DASHBOARD') ||
    userPerms.includes('ALL');

  if (!hasDashboardAccess) {
    return <MemberRestrictedHome />;
  }

  const isFinanceAllowed =
    role === 'SUPERADMIN' ||
    role === 'ADMIN' ||
    userPerms.includes('FINANCE') ||
    userPerms.includes('ALL');

  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [allocatedBudget, setAllocatedBudget] = useState<number>(500000);
  const [donationCount, setDonationCount] = useState<number>(0);
  const [expenseCount, setExpenseCount] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [budgetCategories, setBudgetCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        if (isFinanceAllowed) {
          const [summaryRes, donRes, expRes, memRes, budgetRes] = await Promise.allSettled([
            adminAPI.getFinancialSummary(),
            adminAPI.getDonations(),
            adminAPI.getExpenses(),
            publicAPI.getMembers(),
            adminAPI.getBudget(),
          ]);

          if (budgetRes.status === 'fulfilled' && budgetRes.value?.success && Array.isArray(budgetRes.value?.data?.categories)) {
            setBudgetCategories(budgetRes.value.data.categories);
          }

          if (summaryRes.status === 'fulfilled' && summaryRes.value.success) {
            setTotalDonations(summaryRes.value.data.totalDonations || 0);
            setTotalExpenses(summaryRes.value.data.totalExpenses || 0);
            if (summaryRes.value.data.allocatedBudget) setAllocatedBudget(summaryRes.value.data.allocatedBudget);
          } else {
            if (donRes.status === 'fulfilled' && donRes.value.success && Array.isArray(donRes.value.data)) {
              const sum = donRes.value.data.reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0);
              setTotalDonations(sum);
              setDonationCount(donRes.value.data.length);
            }
            if (expRes.status === 'fulfilled' && expRes.value.success && Array.isArray(expRes.value.data)) {
              const sum = expRes.value.data.reduce((acc: number, e: any) => acc + Number(e.amount || 0), 0);
              setTotalExpenses(sum);
              setExpenseCount(expRes.value.data.length);
            }
          }

          if (memRes.status === 'fulfilled' && memRes.value.success && Array.isArray(memRes.value.data)) {
            setMemberCount(memRes.value.data.length);
          }
        }
      } catch {
        // Fallback state
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [isFinanceAllowed]);

  const budgetUtilization = allocatedBudget > 0 ? Math.round((totalExpenses / allocatedBudget) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#32070B] via-[#4A0A10] to-[#240407] rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-[#FFF7E8] border-2 border-[#D4A72C]/40 shadow-sm relative overflow-hidden">
        <img
          src="/assets/3rdbgimage.png"
          alt="Lotus"
          className="absolute right-0 top-0 w-60 opacity-15 pointer-events-none object-contain"
        />
        <div className="relative z-10 max-w-2xl space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5A0F16] border border-[#F4B942]/60 text-[#F4B942] text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            <span>Role: {user?.role}</span>
          </div>
          <h2 className="font-cinzel text-lg sm:text-2xl font-black text-[#F4B942] tracking-wider uppercase">
            Jai Ganesh, {user?.name || 'Committee Member'}!
          </h2>
          <p className="text-[11px] sm:text-xs text-[#FFF7E8]/80 leading-relaxed font-semibold">
            Welcome to the Vighnaharta Puja Committee Management Suite. Control donations, expenses, budget allocations, events, media, and volunteer workflows.
          </p>
        </div>
      </div>

      {/* Financial Metrics Cards (Visible for SUPERADMIN & ADMIN) */}
      {isFinanceAllowed ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          
          {/* Total Collections */}
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl p-3.5 sm:p-5 shadow-sm flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-[#F4B942] uppercase tracking-wider truncate">Total Collection</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-[#5A0F16] text-[#F4B942] shrink-0">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-base sm:text-2xl font-black text-[#FFF7E8] truncate">
                {loading ? '...' : `₹${totalDonations.toLocaleString('en-IN')}`}
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#FFF7E8]/70 mt-0.5 font-medium truncate">{donationCount} Donations</p>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl p-3.5 sm:p-5 shadow-sm flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-[#F4B942] uppercase tracking-wider truncate">Total Expenses</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-[#5A0F16] text-[#F4B942] shrink-0">
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-base sm:text-2xl font-black text-[#FFF7E8] truncate">
                {loading ? '...' : `₹${totalExpenses.toLocaleString('en-IN')}`}
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#FFF7E8]/70 mt-0.5 font-medium truncate">{expenseCount} Payments</p>
            </div>
          </div>

          {/* Allocated Budget */}
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl p-3.5 sm:p-5 shadow-sm flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-[#F4B942] uppercase tracking-wider truncate">Allocated Budget</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-[#5A0F16] text-[#F4B942] shrink-0">
                <PieChart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-base sm:text-2xl font-black text-[#FFF7E8] truncate">₹{allocatedBudget.toLocaleString('en-IN')}</div>
              <div className="w-full bg-[#170204] rounded-full h-1.5 mt-1.5 border border-[#D4A72C]/30 overflow-hidden">
                <div className="bg-[#F4B942] h-full" style={{ width: `${budgetUtilization}%` }} />
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#F4B942] font-extrabold mt-0.5 truncate">{budgetUtilization}% Utilized</p>
            </div>
          </div>

          {/* Committee Members */}
          <Link to="/admin/members" className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 hover:border-[#F4B942] rounded-2xl p-3.5 sm:p-5 shadow-sm flex flex-col justify-between transition-all group min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-[#F4B942] uppercase tracking-wider group-hover:underline truncate">Leadership</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-[#5A0F16] text-[#F4B942] shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-base sm:text-2xl font-black text-[#FFF7E8] truncate">{memberCount || 4} Executives</div>
              <p className="text-[10px] sm:text-[11px] text-[#FFF7E8]/70 mt-0.5 font-medium truncate">Showcase →</p>
            </div>
          </Link>

        </div>
      ) : (
        <div className="bg-[#FFF7E8] border-2 border-[#D4A72C]/50 rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold text-[#5A0F16] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#E87516] shrink-0" />
          <span>Notice: Financial dashboards & reports are restricted to Admin & Superadmin roles.</span>
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
        <h3 className="font-cinzel text-sm sm:text-base font-black text-[#32070B] uppercase tracking-wider">
          Quick Operations & Export Center
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {isFinanceAllowed && (
            <>
              <Link
                to="/admin/donations"
                className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFF7E8] border border-[#D4A72C]/60 hover:bg-[#FBE9CE] text-[#32070B] font-bold text-[11px] sm:text-xs flex flex-col items-center gap-1.5 text-center transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#E87516]" />
                <span>+ Donation</span>
              </Link>
              <Link
                to="/admin/expenses"
                className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFF7E8] border border-[#D4A72C]/60 hover:bg-[#FBE9CE] text-[#32070B] font-bold text-[11px] sm:text-xs flex flex-col items-center gap-1.5 text-center transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A0F16]" />
                <span>+ Expense</span>
              </Link>
              <Link
                to="/admin/exports"
                className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFF7E8] border border-[#D4A72C]/60 hover:bg-[#FBE9CE] text-[#32070B] font-bold text-[11px] sm:text-xs flex flex-col items-center gap-1.5 text-center transition-all shadow-sm"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A72C]" />
                <span>Export Reports</span>
              </Link>
            </>
          )}

          <Link
            to="/admin/events"
            className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFF7E8] border border-[#D4A72C]/60 hover:bg-[#FBE9CE] text-[#32070B] font-bold text-[11px] sm:text-xs flex flex-col items-center gap-1.5 text-center transition-all shadow-sm"
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#32070B]" />
            <span>Events</span>
          </Link>
        </div>
      </div>

      {/* Budget Breakdown & Category Utilization */}
      {isFinanceAllowed && (
        <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#D4A72C]/30 pb-2.5">
            <h3 className="font-cinzel text-sm sm:text-base font-black text-[#F4B942] uppercase tracking-wider">
              Budget vs Actual Category Utilization
            </h3>
            <Link to="/admin/expenses" className="text-[11px] font-bold text-[#F4B942] hover:underline">
              View Expense Tracker & Budget →
            </Link>
          </div>

          <div className="space-y-2.5">
            {budgetCategories.length === 0 ? (
              <div className="text-center py-4 text-xs font-semibold text-[#FFF7E8]/60">
                No budget categories allocated yet.
              </div>
            ) : (
              budgetCategories.map((item, idx) => {
                const allocated = item.allocated || item.allocatedAmount || 0;
                const spent = item.spent || 0;
                const pct = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1 bg-[#170204] p-2.5 sm:p-3 rounded-xl border border-[#D4A72C]/20">
                    <div className="flex justify-between text-[11px] sm:text-xs font-bold gap-2">
                      <span className="text-[#FFF7E8] truncate">{item.category}</span>
                      <span className="text-[#F4B942] shrink-0">
                        ₹{spent.toLocaleString('en-IN')} / ₹{allocated.toLocaleString('en-IN')} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#240407] rounded-full h-1.5 border border-[#D4A72C]/30 overflow-hidden">
                      <div className="bg-[#E87516] h-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
};
