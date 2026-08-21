import ExcelJS from 'exceljs';
import { Response } from 'express';

interface DonationExportItem {
  receiptNumber: string;
  donorName: string;
  phone?: string;
  email?: string;
  amount: number;
  paymentMethod: string;
  category: string;
  date: Date;
  status: string;
}

export const generateDonationsExcelReport = async (res: Response, donations: DonationExportItem[], festivalYear: number) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Vighnaharta Puja Committee';
  workbook.lastModifiedBy = 'Admin System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(`Donations ${festivalYear}`);

  // Title Rows
  worksheet.mergeCells('A1:I1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `VIGHNAHARTA PUJA COMMITTEE — DONATIONS REPORT (${festivalYear})`;
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFF7E8' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF32070B' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.getRow(1).height = 35;

  worksheet.mergeCells('A2:I2');
  const subTitleCell = worksheet.getCell('A2');
  subTitleCell.value = `CONFIDENTIAL COMMITTEE REPORT — GENERATED ON ${new Date().toLocaleDateString('en-IN')}`;
  subTitleCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FFD4A72C' } };
  subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5A0F16' } };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.getRow(2).height = 22;

  // Blank row
  worksheet.addRow([]);

  // Table Headers
  const headerRow = worksheet.addRow([
    'Receipt No',
    'Payment Date',
    'Donor Name',
    'Phone',
    'Email',
    'Amount (Rs.)',
    'Payment Method',
    'Category',
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

  // Data Rows
  let totalAmount = 0;
  donations.forEach((d) => {
    totalAmount += d.amount;
    const dateFormatted = d.date
      ? new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : (d as any).rawDate || 'N/A';

    const row = worksheet.addRow([
      d.receiptNumber,
      dateFormatted,
      d.donorName,
      d.phone || 'N/A',
      d.email || 'N/A',
      d.amount,
      d.paymentMethod,
      d.category,
      d.status,
    ]);

    row.getCell(6).numFmt = '₹#,##0.00';
    row.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE5E5E5' } },
      };
    });
  });

  // Summary Row
  const totalRow = worksheet.addRow(['TOTAL', '', '', '', '', totalAmount, '', '', '']);
  totalRow.height = 25;
  totalRow.getCell(1).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(6).font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF5A0F16' } };
  totalRow.getCell(6).numFmt = '₹#,##0.00';

  // Column Widths
  worksheet.columns = [
    { width: 20 },
    { width: 15 },
    { width: 25 },
    { width: 16 },
    { width: 25 },
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
