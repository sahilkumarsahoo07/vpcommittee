import ExcelJS from 'exceljs';
import { Response } from 'express';

// Universal Date Formatter Helper for Excel (e.g., "22-Aug-2026")
const formatDateForExcel = (raw: any): string => {
  if (!raw) {
    return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  }
  const d = new Date(raw);
  if (isNaN(d.getTime())) {
    return String(raw);
  }
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
};

// Month Grouping Helper for Excel (e.g., "August 2026")
const getMonthForExcel = (raw: any): string => {
  if (!raw) {
    return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }
  const d = new Date(raw);
  if (isNaN(d.getTime())) {
    return 'Festival Period 2026';
  }
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};

export interface DonationExportItem {
  receiptNumber: string;
  donorName: string;
  phone?: string;
  email?: string;
  amount: number;
  paymentMethod: string;
  category: string;
  date?: Date | string;
  createdAt?: Date | string;
  rawDate?: string;
  status?: string;
}

export const generateDonationsExcelReport = async (
  res: Response,
  donations: DonationExportItem[],
  festivalYear: number
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Vighnaharta Puja Committee';
  workbook.lastModifiedBy = 'Admin System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(`Donations ${festivalYear}`);

  // Title Rows
  worksheet.mergeCells('A1:J1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `VIGHNAHARTA PUJA COMMITTEE — DONATIONS REGISTER (${festivalYear})`;
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFF7E8' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF32070B' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 35;

  worksheet.mergeCells('A2:J2');
  const subTitleCell = worksheet.getCell('A2');
  subTitleCell.value = `MONTH-BY-MONTH OFFICIAL AUDIT STATEMENT — GENERATED ON ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`;
  subTitleCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FFD4A72C' } };
  subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5A0F16' } };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 22;

  worksheet.addRow([]);

  // 1. MONTH BREAKDOWN SUMMARY TABLE AT THE TOP
  const summaryHeaderRow = worksheet.addRow(['MONTH BREAKDOWN SUMMARY', '', '', '', '']);
  summaryHeaderRow.height = 22;
  summaryHeaderRow.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF32070B' } };

  const summaryColsRow = worksheet.addRow(['Month', 'Receipts Count', 'Total Collection (Rs.)', '% of Total', '']);
  summaryColsRow.height = 20;
  summaryColsRow.eachCell((cell, colNumber) => {
    if (colNumber <= 4) {
      cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFF7E8' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF32070B' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  });

  // Calculate Month Totals
  const monthMap: Record<string, { count: number; total: number }> = {};
  let grandTotal = 0;

  donations.forEach((d) => {
    const rawDate = d.createdAt || d.date || d.rawDate;
    const m = getMonthForExcel(rawDate);
    if (!monthMap[m]) monthMap[m] = { count: 0, total: 0 };
    monthMap[m].count += 1;
    monthMap[m].total += Number(d.amount || 0);
    grandTotal += Number(d.amount || 0);
  });

  Object.entries(monthMap).forEach(([m, stat]) => {
    const pct = grandTotal > 0 ? Math.round((stat.total / grandTotal) * 100) : 0;
    const row = worksheet.addRow([m, stat.count, stat.total, `${pct}%`]);
    row.getCell(3).numFmt = '₹#,##0.00';
    row.getCell(1).font = { name: 'Arial', size: 9.5, bold: true };
    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(4).alignment = { horizontal: 'center' };
  });

  worksheet.addRow([]);

  // 2. DETAILED DONATION RECEIPTS TABLE (GROUPED BY MONTH)
  const detailTitleRow = worksheet.addRow(['DETAILED TRANSACTION RECEIPTS LEDGER', '', '', '', '', '', '', '', '', '']);
  detailTitleRow.height = 22;
  detailTitleRow.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF32070B' } };

  // Main Headers
  const headerRow = worksheet.addRow([
    'Receipt No',
    'Payment Date',
    'Month',
    'Contributor / Donor Name',
    'Phone',
    'Email',
    'Amount (Rs.)',
    'Payment Method',
    'Category',
    'Status',
  ]);

  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10.5, bold: true, color: { argb: 'FFFFF7E8' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5A0F16' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD4A72C' } },
      bottom: { style: 'medium', color: { argb: 'FFD4A72C' } },
    };
  });

  // Group donations by month for section headers
  const donationsByMonth: Record<string, DonationExportItem[]> = {};
  donations.forEach((d) => {
    const rawDate = d.createdAt || d.date || d.rawDate;
    const m = getMonthForExcel(rawDate);
    if (!donationsByMonth[m]) donationsByMonth[m] = [];
    donationsByMonth[m].push(d);
  });

  Object.entries(donationsByMonth).forEach(([month, items]) => {
    const monthSubtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    // Month Section Header Row
    const sectionRow = worksheet.addRow([
      `✦ MONTH: ${month.toUpperCase()} (${items.length} RECEIPTS)`,
      '',
      '',
      '',
      '',
      '',
      monthSubtotal,
      '',
      '',
      '',
    ]);
    sectionRow.height = 22;
    sectionRow.getCell(1).font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFD4A72C' } };
    sectionRow.getCell(7).font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFF7E8' } };
    sectionRow.getCell(7).numFmt = '₹#,##0.00';
    sectionRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF240407' } };
    });

    items.forEach((d) => {
      const formattedDate = formatDateForExcel(d.createdAt || d.date || d.rawDate);

      const row = worksheet.addRow([
        d.receiptNumber,
        formattedDate,
        month,
        d.donorName || 'Devotee Contributor',
        d.phone || 'N/A',
        d.email || 'N/A',
        Number(d.amount || 0),
        d.paymentMethod || 'UPI',
        d.category || 'General Donation',
        d.status || 'SUCCESS',
      ]);

      row.getCell(7).numFmt = '₹#,##0.00';
      row.eachCell((cell) => {
        cell.font = { name: 'Arial', size: 9.5 };
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE5E5E5' } },
        };
      });
    });
  });

  // Summary Row
  const totalRow = worksheet.addRow(['GRAND TOTAL', '', '', '', '', '', grandTotal, '', '', '']);
  totalRow.height = 28;
  totalRow.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(7).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(7).numFmt = '₹#,##0.00';
  totalRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF5A0F16' } },
      bottom: { style: 'double', color: { argb: 'FF5A0F16' } },
    };
  });

  // Column Widths
  worksheet.columns = [
    { width: 22 },
    { width: 16 },
    { width: 18 },
    { width: 26 },
    { width: 18 },
    { width: 26 },
    { width: 18 },
    { width: 18 },
    { width: 22 },
    { width: 14 },
  ];

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=Donations_Report_${festivalYear}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
};

export interface ExpenseExportItem {
  invoiceNumber?: string;
  expenseName: string;
  category: string;
  vendor?: string;
  paidBy?: string;
  paymentMethod?: string;
  amount: number;
  date?: Date | string;
  createdAt?: Date | string;
  description?: string;
}

export const generateExpensesExcelReport = async (
  res: Response,
  expenses: ExpenseExportItem[],
  festivalYear: number
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Vighnaharta Puja Committee';
  workbook.lastModifiedBy = 'Admin System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(`Expenses ${festivalYear}`);

  // Title Rows
  worksheet.mergeCells('A1:I1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `VIGHNAHARTA PUJA COMMITTEE — EXPENSES & VOUCHERS REPORT (${festivalYear})`;
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFF7E8' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF32070B' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 35;

  worksheet.mergeCells('A2:I2');
  const subTitleCell = worksheet.getCell('A2');
  subTitleCell.value = `MONTH-BY-MONTH EXPENSE AUDIT STATEMENT — GENERATED ON ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`;
  subTitleCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FFD4A72C' } };
  subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5A0F16' } };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 22;

  worksheet.addRow([]);

  // 1. MONTH BREAKDOWN SUMMARY TABLE
  const summaryHeaderRow = worksheet.addRow(['MONTH-WISE EXPENSE BREAKDOWN', '', '', '', '']);
  summaryHeaderRow.height = 22;
  summaryHeaderRow.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF32070B' } };

  const summaryColsRow = worksheet.addRow(['Month', 'Vouchers Count', 'Total Expense (Rs.)', '% of Total', '']);
  summaryColsRow.height = 20;
  summaryColsRow.eachCell((cell, colNumber) => {
    if (colNumber <= 4) {
      cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFFFF7E8' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF32070B' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  });

  const monthMap: Record<string, { count: number; total: number }> = {};
  let grandTotal = 0;

  expenses.forEach((e) => {
    const rawDate = e.date || e.createdAt;
    const m = getMonthForExcel(rawDate);
    if (!monthMap[m]) monthMap[m] = { count: 0, total: 0 };
    monthMap[m].count += 1;
    monthMap[m].total += Number(e.amount || 0);
    grandTotal += Number(e.amount || 0);
  });

  Object.entries(monthMap).forEach(([m, stat]) => {
    const pct = grandTotal > 0 ? Math.round((stat.total / grandTotal) * 100) : 0;
    const row = worksheet.addRow([m, stat.count, stat.total, `${pct}%`]);
    row.getCell(3).numFmt = '₹#,##0.00';
    row.getCell(1).font = { name: 'Arial', size: 9.5, bold: true };
    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(4).alignment = { horizontal: 'center' };
  });

  worksheet.addRow([]);

  // 2. DETAILED EXPENSES TABLE (GROUPED BY MONTH)
  const detailTitleRow = worksheet.addRow(['DETAILED VOUCHERS LEDGER', '', '', '', '', '', '', '', '']);
  detailTitleRow.height = 22;
  detailTitleRow.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF32070B' } };

  const headerRow = worksheet.addRow([
    'Invoice / Voucher #',
    'Expense Date',
    'Month',
    'Expense Description',
    'Category Head',
    'Vendor / Supplier',
    'Paid By',
    'Payment Method',
    'Amount (Rs.)',
  ]);

  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10.5, bold: true, color: { argb: 'FFFFF7E8' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5A0F16' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD4A72C' } },
      bottom: { style: 'medium', color: { argb: 'FFD4A72C' } },
    };
  });

  const expensesByMonth: Record<string, ExpenseExportItem[]> = {};
  expenses.forEach((e) => {
    const rawDate = e.date || e.createdAt;
    const m = getMonthForExcel(rawDate);
    if (!expensesByMonth[m]) expensesByMonth[m] = [];
    expensesByMonth[m].push(e);
  });

  Object.entries(expensesByMonth).forEach(([month, items]) => {
    const monthSubtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const sectionRow = worksheet.addRow([
      `✦ MONTH: ${month.toUpperCase()} (${items.length} VOUCHERS)`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      monthSubtotal,
    ]);
    sectionRow.height = 22;
    sectionRow.getCell(1).font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFD4A72C' } };
    sectionRow.getCell(9).font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFF7E8' } };
    sectionRow.getCell(9).numFmt = '₹#,##0.00';
    sectionRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF240407' } };
    });

    items.forEach((e, idx) => {
      const formattedDate = formatDateForExcel(e.date || e.createdAt);

      const row = worksheet.addRow([
        e.invoiceNumber || `INV-${idx + 1}`,
        formattedDate,
        month,
        e.expenseName,
        e.category,
        e.vendor || 'N/A',
        e.paidBy || 'Treasurer',
        e.paymentMethod || 'UPI',
        Number(e.amount || 0),
      ]);

      row.getCell(9).numFmt = '₹#,##0.00';
      row.eachCell((cell) => {
        cell.font = { name: 'Arial', size: 9.5 };
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE5E5E5' } },
        };
      });
    });
  });

  // Total Row
  const totalRow = worksheet.addRow(['GRAND TOTAL EXPENSES', '', '', '', '', '', '', '', grandTotal]);
  totalRow.height = 28;
  totalRow.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(9).font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(9).numFmt = '₹#,##0.00';
  totalRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF5A0F16' } },
      bottom: { style: 'double', color: { argb: 'FF5A0F16' } },
    };
  });

  worksheet.columns = [
    { width: 22 },
    { width: 16 },
    { width: 18 },
    { width: 30 },
    { width: 24 },
    { width: 22 },
    { width: 16 },
    { width: 18 },
    { width: 20 },
  ];

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=Expenses_Report_${festivalYear}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
};

export interface BudgetVarianceExportItem {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}

export const generateBudgetVarianceExcelReport = async (
  res: Response,
  categories: BudgetVarianceExportItem[],
  totalAllocated: number,
  totalSpent: number,
  festivalYear: number
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Vighnaharta Puja Committee';
  workbook.lastModifiedBy = 'Admin System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(`Budget vs Actual ${festivalYear}`);

  worksheet.mergeCells('A1:F1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `VIGHNAHARTA PUJA COMMITTEE — BUDGET VS ACTUAL VARIANCE (${festivalYear})`;
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFF7E8' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF32070B' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 35;

  worksheet.mergeCells('A2:F2');
  const subTitleCell = worksheet.getCell('A2');
  subTitleCell.value = `ANNUAL OPERATIONAL VARIANCE AUDIT — GENERATED ON ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`;
  subTitleCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FFD4A72C' } };
  subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5A0F16' } };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 22;

  worksheet.addRow([]);

  const headerRow = worksheet.addRow([
    'Budget Category Head',
    'Allocated Budget (Rs.)',
    'Actual Spent (Rs.)',
    'Variance / Remaining (Rs.)',
    'Utilization %',
    'Status',
  ]);

  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFF7E8' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5A0F16' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD4A72C' } },
      bottom: { style: 'medium', color: { argb: 'FFD4A72C' } },
    };
  });

  categories.forEach((cat) => {
    const isOver = cat.percentageUsed > 100;
    const isHigh = cat.percentageUsed >= 85 && cat.percentageUsed <= 100;
    const status = isOver ? 'OVER BUDGET' : isHigh ? 'HIGH UTILIZATION' : 'ON TRACK';

    const row = worksheet.addRow([
      cat.category,
      cat.allocated,
      cat.spent,
      cat.remaining,
      `${cat.percentageUsed}%`,
      status,
    ]);

    row.getCell(2).numFmt = '₹#,##0.00';
    row.getCell(3).numFmt = '₹#,##0.00';
    row.getCell(4).numFmt = '₹#,##0.00';

    row.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE5E5E5' } },
      };
    });
  });

  const totalRemaining = Math.max(0, totalAllocated - totalSpent);
  const overallPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
  const overallStatus = overallPercentage > 100 ? 'OVER BUDGET' : 'WITHIN BUDGET';

  const totalRow = worksheet.addRow([
    'TOTAL OVERALL',
    totalAllocated,
    totalSpent,
    totalRemaining,
    `${overallPercentage}%`,
    overallStatus,
  ]);
  totalRow.height = 25;
  totalRow.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(2).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(3).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(4).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(2).numFmt = '₹#,##0.00';
  totalRow.getCell(3).numFmt = '₹#,##0.00';
  totalRow.getCell(4).numFmt = '₹#,##0.00';

  worksheet.columns = [
    { width: 28 },
    { width: 22 },
    { width: 22 },
    { width: 24 },
    { width: 16 },
    { width: 20 },
  ];

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=Budget_vs_Actual_Variance_${festivalYear}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
};
