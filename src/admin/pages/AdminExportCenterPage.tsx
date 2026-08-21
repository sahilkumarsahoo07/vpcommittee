import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const AdminExportCenterPage: React.FC = () => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const handlePDFDownload = async () => {
    try {
      setDownloadingPdf(true);
      await adminAPI.exportFinancialPDF();
    } catch (err) {
      alert('Failed to download PDF report. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleExcelDownload = async () => {
    try {
      setDownloadingExcel(true);
      await adminAPI.exportDonationsExcel();
    } catch (err) {
      alert('Failed to download Excel report. Please try again.');
    } finally {
      setDownloadingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4A72C]/40 pb-4">
        <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider">
          Export & Reporting Center
        </h2>
        <p className="text-xs text-[#2A1710]/70 font-semibold">
          Export official committee documents, watermarked PDF audit balance sheets, and formatted Excel sheets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Card */}
        <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#5A0F16] border border-[#F4B942] flex items-center justify-center text-[#F4B942]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase">
              Financial Summary PDF Statement
            </h3>
            <p className="text-xs text-[#FFF7E8]/80 leading-relaxed font-medium">
              Includes total collection metrics, vendor expenses breakdown, category utilization, net surplus balance, and security watermark.
            </p>
          </div>

          <button
            onClick={handlePDFDownload}
            disabled={downloadingPdf}
            className="w-full py-3 rounded-xl bg-[#F4B942] text-[#32070B] font-black uppercase text-xs tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {downloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Generate Official PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Excel Card */}
        <div className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-lg font-black text-[#F4B942] uppercase">
              Full Donations Register (Excel)
            </h3>
            <p className="text-xs text-[#FFF7E8]/80 leading-relaxed font-medium">
              Formatted Microsoft Excel (.xlsx) spreadsheet containing all donor receipts, phone numbers, UPI transaction IDs, and category totals.
            </p>
          </div>

          <button
            onClick={handleExcelDownload}
            disabled={downloadingExcel}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black uppercase text-xs tracking-wider hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {downloadingExcel ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Excel...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Excel Register</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
