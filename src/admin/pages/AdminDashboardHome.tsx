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

export const AdminDashboardHome: React.FC = () => {
  const { user } = useAuth();
  const isFinanceAllowed = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN';

  const [totalDonations, setTotalDonations] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [allocatedBudget, setAllocatedBudget] = useState<number>(500000);
  const [donationCount, setDonationCount] = useState<number>(0);
  const [expenseCount, setExpenseCount] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        if (isFinanceAllowed) {
          const [summaryRes, donRes, expRes, memRes] = await Promise.allSettled([
            adminAPI.getFinancialSummary(),
            adminAPI.getDonations(),
            adminAPI.getExpenses(),
            publicAPI.getMembers(),
          ]);

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
      <div className="bg-gradient-to-r from-[#32070B] via-[#4A0A10] to-[#240407] rounded-3xl p-6 sm:p-8 text-[#FFF7E8] border-2 border-[#D4A72C]/40 shadow-lg relative overflow-hidden">
        <img
          src="/assets/3rdbgimage.png"
          alt="Lotus"
          className="absolute right-0 top-0 w-80 opacity-20 pointer-events-none object-contain"
        />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A0F16] border border-[#F4B942]/60 text-[#F4B942] text-[11px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role: {user?.role}</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-[#F4B942] tracking-wider uppercase">
            Jai Ganesh, {user?.name || 'Committee Member'}!
          </h2>
          <p className="text-xs sm:text-sm text-[#FFF7E8]/80 leading-relaxed font-semibold">
            Welcome to the Vighnaharta Puja Committee Enterprise Management Suite. Control real-time donations, festival expenses, budget allocations, events, media, and volunteer workflows.
          </p>
        </div>
      </div>

      {/* Financial Metrics Cards (Visible for SUPERADMIN & ADMIN) */}
      {isFinanceAllowed ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Collections */}
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Total Collection</span>
              <div className="p-2 rounded-xl bg-[#5A0F16] text-[#F4B942]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-[#FFF7E8]">
                {loading ? '...' : `₹${totalDonations.toLocaleString('en-IN')}`}
              </div>
              <p className="text-[11px] text-[#FFF7E8]/70 mt-1 font-medium">{donationCount} Recorded Donations</p>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Total Expenses</span>
              <div className="p-2 rounded-xl bg-[#5A0F16] text-[#F4B942]">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-[#FFF7E8]">
                {loading ? '...' : `₹${totalExpenses.toLocaleString('en-IN')}`}
              </div>
              <p className="text-[11px] text-[#FFF7E8]/70 mt-1 font-medium">{expenseCount} Vendor Payments</p>
            </div>
          </div>

          {/* Allocated Budget */}
          <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Allocated Budget</span>
              <div className="p-2 rounded-xl bg-[#5A0F16] text-[#F4B942]">
                <PieChart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-[#FFF7E8]">₹{allocatedBudget.toLocaleString('en-IN')}</div>
              <div className="w-full bg-[#170204] rounded-full h-2 mt-2 border border-[#D4A72C]/30 overflow-hidden">
                <div className="bg-[#F4B942] h-full" style={{ width: `${budgetUtilization}%` }} />
              </div>
              <p className="text-[11px] text-[#F4B942] font-extrabold mt-1">{budgetUtilization}% Budget Utilized</p>
            </div>
          </div>

          {/* Committee Members */}
          <Link to="/admin/members" className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 hover:border-[#F4B942] rounded-2xl p-5 shadow-md flex flex-col justify-between transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider group-hover:underline">Executive Leadership</span>
              <div className="p-2 rounded-xl bg-[#5A0F16] text-[#F4B942]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-[#FFF7E8]">{memberCount || 4} Executives</div>
              <p className="text-[11px] text-[#FFF7E8]/70 mt-1 font-medium">President, VP, Sec, Treas →</p>
            </div>
          </Link>

        </div>
      ) : (
        <div className="bg-[#FFF7E8] border-2 border-[#D4A72C]/50 rounded-2xl p-4 text-xs font-bold text-[#5A0F16] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#E87516]" />
          <span>Notice: Financial dashboards & reports are restricted to Admin & Superadmin roles.</span>
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div className="bg-white border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-cinzel text-lg font-black text-[#32070B] uppercase tracking-wider">
          Quick Operations & Export Center
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {isFinanceAllowed && (
            <>
              <Link
                to="/admin/donations"
                className="p-3.5 rounded-2xl bg-[#FFF7E8] border border-[#D4A72C]/60 hover:bg-[#FBE9CE] text-[#32070B] font-bold text-xs flex flex-col items-center gap-2 text-center transition-all shadow-sm"
              >
                <PlusCircle className="w-5 h-5 text-[#E87516]" />
                <span>+ Record Donation</span>
              </Link>
              <Link
                to="/admin/expenses"
                className="p-3.5 rounded-2xl bg-[#FFF7E8] border border-[#D4A72C]/60 hover:bg-[#FBE9CE] text-[#32070B] font-bold text-xs flex flex-col items-center gap-2 text-center transition-all shadow-sm"
              >
                <PlusCircle className="w-5 h-5 text-[#5A0F16]" />
                <span>+ Record Expense</span>
              </Link>
              <Link
                to="/admin/exports"
                className="p-3.5 rounded-2xl bg-[#FFF7E8] border border-[#D4A72C]/60 hover:bg-[#FBE9CE] text-[#32070B] font-bold text-xs flex flex-col items-center gap-2 text-center transition-all shadow-sm"
              >
                <FileText className="w-5 h-5 text-[#D4A72C]" />
                <span>Export PDF/Excel</span>
              </Link>
            </>
          )}

          <Link
            to="/admin/events"
            className="p-3.5 rounded-2xl bg-[#FFF7E8] border border-[#D4A72C]/60 hover:bg-[#FBE9CE] text-[#32070B] font-bold text-xs flex flex-col items-center gap-2 text-center transition-all shadow-sm"
          >
            <TrendingUp className="w-5 h-5 text-[#32070B]" />
            <span>Manage Events</span>
          </Link>
        </div>
      </div>

      {/* Budget Breakdown & Category Utilization */}
      {isFinanceAllowed && (
        <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4A72C]/30 pb-3">
            <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase tracking-wider">
              Budget vs Actual Category Utilization
            </h3>
            <Link to="/admin/budget" className="text-xs font-bold text-[#F4B942] hover:underline">
              View Detailed Budget →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { category: 'Pandal & Iron Framework', allocated: 150000, spent: 120000 },
              { category: 'Eco Idol Crafting & Sculpting', allocated: 100000, spent: 65000 },
              { category: 'Illumination & LED Lighting Grid', allocated: 60000, spent: 45000 },
              { category: 'Sound System & Cultural Stage', allocated: 40000, spent: 30000 },
            ].map((item, idx) => {
              const pct = Math.round((item.spent / item.allocated) * 100);
              return (
                <div key={idx} className="space-y-1 bg-[#170204] p-3 rounded-xl border border-[#D4A72C]/20">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#FFF7E8]">{item.category}</span>
                    <span className="text-[#F4B942]">
                      ₹{item.spent.toLocaleString('en-IN')} / ₹{item.allocated.toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#240407] rounded-full h-2 border border-[#D4A72C]/30 overflow-hidden">
                    <div className="bg-[#E87516] h-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
