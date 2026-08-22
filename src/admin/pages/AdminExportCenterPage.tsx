import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Download, Loader2, Receipt, PieChart, Layers } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const AdminExportCenterPage: React.FC = () => {
  const [downloadingFinancialPdf, setDownloadingFinancialPdf] = useState(false);
  const [downloadingDonationsExcel, setDownloadingDonationsExcel] = useState(false);
  const [downloadingExpensesPdf, setDownloadingExpensesPdf] = useState(false);
  const [downloadingExpensesExcel, setDownloadingExpensesExcel] = useState(false);
  const [downloadingBudgetPdf, setDownloadingBudgetPdf] = useState(false);
  const [downloadingBudgetExcel, setDownloadingBudgetExcel] = useState(false);

  const handleFinancialPDF = async () => {
    try {
      setDownloadingFinancialPdf(true);
      await adminAPI.exportFinancialPDF();
    } catch {
      alert('Failed to download Financial PDF report.');
    } finally {
      setDownloadingFinancialPdf(false);
    }
  };

  const handleDonationsExcel = async () => {
    try {
      setDownloadingDonationsExcel(true);
      await adminAPI.exportDonationsExcel();
    } catch {
      alert('Failed to download Donations Excel report.');
    } finally {
      setDownloadingDonationsExcel(false);
    }
  };

  const handleExpensesPDF = async () => {
    try {
      setDownloadingExpensesPdf(true);
      await adminAPI.exportExpensesPDF();
    } catch {
      alert('Failed to download Expenses PDF report.');
    } finally {
      setDownloadingExpensesPdf(false);
    }
  };

  const handleExpensesExcel = async () => {
    try {
      setDownloadingExpensesExcel(true);
      await adminAPI.exportExpensesExcel();
    } catch {
      alert('Failed to download Expenses Excel report.');
    } finally {
      setDownloadingExpensesExcel(false);
    }
  };

  const handleBudgetPDF = async () => {
    try {
      setDownloadingBudgetPdf(true);
      await adminAPI.exportBudgetPDF();
    } catch {
      alert('Failed to download Budget Variance PDF report.');
    } finally {
      setDownloadingBudgetPdf(false);
    }
  };

  const handleBudgetExcel = async () => {
    try {
      setDownloadingBudgetExcel(true);
      await adminAPI.exportBudgetExcel();
    } catch {
      alert('Failed to download Budget Variance Excel report.');
    } finally {
      setDownloadingBudgetExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4A72C]/40 pb-3">
        <h2 className="font-cinzel text-lg sm:text-2xl font-black text-[#32070B] uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-5 h-5 sm:w-7 sm:h-7 text-[#E87516]" />
          <span>Export & Reporting Center</span>
        </h2>
        <p className="text-[11px] sm:text-xs text-[#2A1710]/70 font-semibold mt-0.5">
          Export official committee audit documents, watermarked PDF statements, and formatted Excel sheets for all accounting heads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6">
        {/* Financial Summary Card */}
        <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3.5">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-[#5A0F16] border border-[#F4B942] flex items-center justify-center text-[#F4B942]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-sm sm:text-base font-black text-[#F4B942] uppercase">
              Financial Summary Statement (PDF)
            </h3>
            <p className="text-[11px] sm:text-xs text-[#FFF7E8]/80 leading-relaxed font-medium">
              Includes total collection metrics, vendor expenses breakdown, category utilization, net surplus balance, and official committee watermark.
            </p>
          </div>

          <button
            onClick={handleFinancialPDF}
            disabled={downloadingFinancialPdf}
            className="w-full py-2.5 rounded-xl bg-[#F4B942] text-[#32070B] font-black uppercase text-[11px] sm:text-xs tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow disabled:opacity-50"
          >
            {downloadingFinancialPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Financial PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Donations Register Excel Card */}
        <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3.5">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-sm sm:text-base font-black text-emerald-400 uppercase">
              Donations Register (Excel)
            </h3>
            <p className="text-[11px] sm:text-xs text-[#FFF7E8]/80 leading-relaxed font-medium">
              Formatted Microsoft Excel (.xlsx) spreadsheet containing all donor receipts, contributor accounts, payment modes, and amounts.
            </p>
          </div>

          <button
            onClick={handleDonationsExcel}
            disabled={downloadingDonationsExcel}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-black uppercase text-[11px] sm:text-xs tracking-wider hover:bg-emerald-500 transition-all flex items-center justify-center gap-1.5 shadow disabled:opacity-50"
          >
            {downloadingDonationsExcel ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting Excel...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Donations Excel</span>
              </>
            )}
          </button>
        </div>

        {/* Expenses Tracker & Vouchers Card */}
        <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3.5">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500 flex items-center justify-center text-rose-400">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-sm sm:text-base font-black text-rose-300 uppercase">
              Expenses & Vouchers Ledger
            </h3>
            <p className="text-[11px] sm:text-xs text-[#FFF7E8]/80 leading-relaxed font-medium">
              Complete outgoing expenditure ledger itemized with invoice numbers, vendor details, categories, payment methods, and timestamps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExpensesPDF}
              disabled={downloadingExpensesPdf}
              className="py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/50 font-bold uppercase text-[10.5px] sm:text-xs hover:bg-[#32070B] transition-all flex items-center justify-center gap-1 shadow disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingExpensesPdf ? 'PDF...' : 'PDF Audit'}</span>
            </button>
            <button
              onClick={handleExpensesExcel}
              disabled={downloadingExpensesExcel}
              className="py-2 rounded-xl bg-emerald-700 text-white font-bold uppercase text-[10.5px] sm:text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-1 shadow disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{downloadingExpensesExcel ? 'Excel...' : 'Excel Sheet'}</span>
            </button>
          </div>
        </div>

        {/* Budget vs Actual Variance Card */}
        <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-3.5">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-400">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-sm sm:text-base font-black text-amber-300 uppercase">
              Budget vs Actual Variance Report
            </h3>
            <p className="text-[11px] sm:text-xs text-[#FFF7E8]/80 leading-relaxed font-medium">
              Comprehensive budget head variance audit containing allocated funds, actual spent amounts, unspent balance, and percentage utilization.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleBudgetPDF}
              disabled={downloadingBudgetPdf}
              className="py-2 rounded-xl bg-[#5A0F16] text-[#F4B942] border border-[#F4B942]/50 font-bold uppercase text-[10.5px] sm:text-xs hover:bg-[#32070B] transition-all flex items-center justify-center gap-1 shadow disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingBudgetPdf ? 'PDF...' : 'PDF Variance'}</span>
            </button>
            <button
              onClick={handleBudgetExcel}
              disabled={downloadingBudgetExcel}
              className="py-2 rounded-xl bg-emerald-700 text-white font-bold uppercase text-[10.5px] sm:text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-1 shadow disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{downloadingBudgetExcel ? 'Excel...' : 'Excel Sheet'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
