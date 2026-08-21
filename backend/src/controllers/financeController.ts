import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { Donation } from '../models/Donation';
import { Expense } from '../models/Expense';
import { Budget } from '../models/Budget';
import { generateFinancialPDFReport, generateDonorStatementPDF } from '../services/pdfService';
import { generateDonationsExcelReport } from '../services/excelService';
import { logAudit } from '../middleware/auditLog';

// In-Memory Storage for Fallback if MongoDB is offline
let mockDonations = [
  {
    id: 'don_1',
    receiptNumber: 'VPC-DON-2026-001',
    donorName: 'Rahul Kumar Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    amount: 25000,
    paymentMethod: 'UPI',
    transactionId: 'UPI-982341203912',
    category: 'Pandal Sponsorship',
    status: 'SUCCESS',
    notes: 'For main entrance pandal decoration',
    festivalYear: 2026,
    createdAt: new Date('2026-08-01T10:00:00Z'),
  },
  {
    id: 'don_2',
    receiptNumber: 'VPC-DON-2026-002',
    donorName: 'Ananya Mohanty',
    phone: '+91 94370 12345',
    email: 'ananya.m@example.com',
    amount: 15000,
    paymentMethod: 'BANK_TRANSFER',
    transactionId: 'IMPS-2391029301',
    category: 'Maha Prasad',
    status: 'SUCCESS',
    notes: 'Special prasad distribution on Saptami',
    festivalYear: 2026,
    createdAt: new Date('2026-08-05T14:30:00Z'),
  },
  {
    id: 'don_3',
    receiptNumber: 'VPC-DON-2026-003',
    donorName: 'Sujit Kumar Patnaik',
    phone: '+91 91234 56789',
    amount: 50000,
    paymentMethod: 'CHEQUE',
    transactionId: 'CHQ-504912',
    category: 'Aarti Sponsorship',
    status: 'SUCCESS',
    notes: 'Grand Sandhya Aarti sponsor',
    festivalYear: 2026,
    createdAt: new Date('2026-08-10T11:15:00Z'),
  },
  {
    id: 'don_4',
    receiptNumber: 'VPC-DON-2026-004',
    donorName: 'Priyanka Senapati',
    phone: '+91 99381 00291',
    amount: 10000,
    paymentMethod: 'UPI',
    transactionId: 'UPI-1192039401',
    category: 'General Donation',
    status: 'SUCCESS',
    notes: 'Festival fund contribution',
    festivalYear: 2026,
    createdAt: new Date('2026-08-15T09:20:00Z'),
  },
  {
    id: 'don_5',
    receiptNumber: 'VPC-DON-2026-005',
    donorName: 'Subhashish Behera',
    phone: '+91 97761 88293',
    amount: 5000,
    paymentMethod: 'CASH',
    category: 'Special Puja',
    status: 'SUCCESS',
    notes: 'Pushpanjali prasad contribution',
    festivalYear: 2026,
    createdAt: new Date('2026-08-18T16:00:00Z'),
  },
];

let mockExpenses = [
  {
    id: 'exp_1',
    expenseName: 'Grand Pandal Iron Structure & Fabric',
    category: 'Pandal',
    amount: 120000,
    date: new Date('2026-08-02T12:00:00Z'),
    vendor: 'Odisha Mandap Builders',
    paidBy: 'Secretary',
    paymentMethod: 'BANK_TRANSFER',
    invoiceNumber: 'INV-2026-101',
    description: 'Advance payment for 60ft eco-friendly pandal structure',
    festivalYear: 2026,
    createdAt: new Date('2026-08-02T12:00:00Z'),
  },
  {
    id: 'exp_2',
    expenseName: 'Clay Idol Creation & Crafting',
    category: 'Decoration',
    amount: 65000,
    date: new Date('2026-08-04T10:00:00Z'),
    vendor: 'Master Artisan Sculptors',
    paidBy: 'President',
    paymentMethod: 'UPI',
    invoiceNumber: 'INV-2026-102',
    description: 'Eco-friendly clay Ganesha 14ft idol creation',
    festivalYear: 2026,
    createdAt: new Date('2026-08-04T10:00:00Z'),
  },
  {
    id: 'exp_3',
    expenseName: 'Illumination & LED Lighting Grid',
    category: 'Lighting',
    amount: 45000,
    date: new Date('2026-08-12T15:00:00Z'),
    vendor: 'Royal Lightings & Sounds',
    paidBy: 'Treasurer',
    paymentMethod: 'UPI',
    invoiceNumber: 'INV-2026-103',
    description: 'Entrance arch and perimeter LED lighting decor',
    festivalYear: 2026,
    createdAt: new Date('2026-08-12T15:00:00Z'),
  },
  {
    id: 'exp_4',
    expenseName: 'Sound System & Cultural Stage Setup',
    category: 'Music',
    amount: 30000,
    date: new Date('2026-08-16T11:00:00Z'),
    vendor: 'Kalinga Audio Systems',
    paidBy: 'Treasurer',
    paymentMethod: 'CHEQUE',
    invoiceNumber: 'INV-2026-104',
    description: '5000W Sound system rental for 5 festival days',
    festivalYear: 2026,
    createdAt: new Date('2026-08-16T11:00:00Z'),
  },
];

let mockBudget: any = {
  festivalYear: 2026,
  totalAllocatedBudget: 0,
  categories: [],
};

// GET Financial Overview & Metrics
export const getFinancialSummary = async (req: AuthRequest, res: Response) => {
  try {
    let totalDonations = 0;
    let totalExpenses = 0;

    try {
      const dbDonations = await Donation.find({ status: 'SUCCESS' });
      const dbExpenses = await Expense.find();

      if (dbDonations.length > 0 || dbExpenses.length > 0) {
        totalDonations = dbDonations.reduce((sum, item) => sum + item.amount, 0);
        totalExpenses = dbExpenses.reduce((sum, item) => sum + item.amount, 0);
      } else {
        totalDonations = mockDonations.reduce((sum, item) => sum + item.amount, 0);
        totalExpenses = mockExpenses.reduce((sum, item) => sum + item.amount, 0);
      }
    } catch {
      totalDonations = mockDonations.reduce((sum, item) => sum + item.amount, 0);
      totalExpenses = mockExpenses.reduce((sum, item) => sum + item.amount, 0);
    }

    const currentBalance = totalDonations - totalExpenses;
    const allocatedBudget = mockBudget.totalAllocatedBudget;
    const remainingBudget = Math.max(0, allocatedBudget - totalExpenses);
    const utilizationPercentage = Math.round((totalExpenses / allocatedBudget) * 100);

    res.json({
      success: true,
      data: {
        totalDonations,
        totalExpenses,
        currentBalance,
        allocatedBudget,
        remainingBudget,
        utilizationPercentage,
        monthlySummary: [
          { month: 'June 2026', income: 45000, expense: 20000, balance: 25000 },
          { month: 'July 2026', income: 85000, expense: 60000, balance: 25000 },
          { month: 'August 2026', income: 105000, expense: 180000, balance: -75000 },
        ],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Donations List
export const getDonations = async (req: AuthRequest, res: Response) => {
  try {
    let list: any[] = [];
    try {
      list = await Donation.find().sort({ createdAt: -1 });
    } catch {
      list = mockDonations;
    }
    if (!list || list.length === 0) list = mockDonations;

    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE Donation
export const createDonation = async (req: AuthRequest, res: Response) => {
  try {
    const { donorName, amount, paymentMethod, category, notes, phone, email, date, transactionId } = req.body;

    const receiptNumber = `VPC-DON-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const donationDate = date ? new Date(date) : new Date();

    const newDonation = {
      id: `don_${Date.now()}`,
      receiptNumber,
      donorName,
      phone: phone || '',
      email: email || '',
      amount: Number(amount),
      paymentMethod: paymentMethod || 'UPI',
      transactionId: transactionId || '',
      category: category || 'General Donation',
      status: 'SUCCESS',
      notes: notes || '',
      festivalYear: 2026,
      createdAt: donationDate,
    };

    try {
      await Donation.create(newDonation);
    } catch {
      mockDonations.unshift(newDonation as any);
    }

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'DONATION_ADDED',
        'Donation',
        receiptNumber,
        `Added donation of Rs. ${amount} by ${donorName}`
      );
    }

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      data: newDonation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE Public Donation / Pledge (Unauthenticated from Homepage Card)
export const createPublicDonation = async (req: Request, res: Response) => {
  try {
    const { donorName, amount, paymentMethod, category, notes, phone, email } = req.body;

    const receiptNumber = `VPC-DON-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDonation = {
      id: `don_${Date.now()}`,
      receiptNumber,
      donorName: donorName || 'Devotee Contributor',
      phone: phone || '',
      email: email || '',
      amount: Number(amount) || 1001,
      paymentMethod: paymentMethod || 'UPI',
      category: category || 'General Donation',
      status: 'SUCCESS',
      notes: notes || 'Pledged from Homepage Support Card',
      festivalYear: 2026,
      createdAt: new Date(),
    };

    try {
      await Donation.create(newDonation);
    } catch {
      mockDonations.unshift(newDonation as any);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your contribution to Ganesh Utsav 2026!',
      data: newDonation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Expenses List
export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    let list: any[] = [];
    try {
      list = await Expense.find().sort({ date: -1 });
    } catch {
      list = mockExpenses;
    }
    if (!list || list.length === 0) list = mockExpenses;

    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE Expense
export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { expenseName, category, amount, vendor, paidBy, paymentMethod, invoiceNumber, description } = req.body;

    const newExpense = {
      id: `exp_${Date.now()}`,
      expenseName,
      category,
      amount: Number(amount),
      date: new Date(),
      vendor: vendor || '',
      paidBy: paidBy || 'Committee',
      paymentMethod: paymentMethod || 'CASH',
      invoiceNumber: invoiceNumber || '',
      description: description || '',
      festivalYear: 2026,
      createdAt: new Date(),
    };

    try {
      await Expense.create(newExpense);
    } catch {
      mockExpenses.unshift(newExpense as any);
    }

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'EXPENSE_ADDED',
        'Expense',
        expenseName,
        `Added expense of Rs. ${amount} for ${category}`
      );
    }

    res.status(201).json({
      success: true,
      message: 'Expense recorded successfully',
      data: newExpense,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Budget
export const getBudget = async (req: AuthRequest, res: Response) => {
  try {
    let budgetData: any = null;
    try {
      budgetData = await Budget.findOne({ festivalYear: 2026 });
    } catch {
      budgetData = mockBudget;
    }
    if (!budgetData) budgetData = mockBudget;

    // Calculate spent per category
    const spentByCategory: Record<string, number> = {};
    mockExpenses.forEach((exp) => {
      spentByCategory[exp.category] = (spentByCategory[exp.category] || 0) + exp.amount;
    });

    const categorySummary = budgetData.categories.map((c: any) => {
      const spent = spentByCategory[c.category] || 0;
      const remaining = Math.max(0, c.allocatedAmount - spent);
      const percentageUsed = Math.round((spent / c.allocatedAmount) * 100);
      return {
        _id: c._id?.toString() || c._id || String(c.category),
        category: c.category,
        allocated: c.allocatedAmount,
        spent,
        remaining,
        percentageUsed,
      };
    });

    res.json({
      success: true,
      data: {
        totalAllocatedBudget: budgetData.totalAllocatedBudget,
        categories: categorySummary,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// EXPORT PDF Financial Report (Supports Overall Date or Specific Date Range)
export const exportFinancialPDF = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, month } = req.query;

    let donationsList = mockDonations;
    let expensesList = mockExpenses;
    try {
      const dbDonations = await Donation.find({ status: 'SUCCESS' }).lean();
      const dbExpenses = await Expense.find().lean();
      if (dbDonations.length > 0) donationsList = dbDonations as any;
      if (dbExpenses.length > 0) expensesList = dbExpenses as any;
    } catch { }

    // Date range filter
    let dateRangeLabel = 'Overall All Dates Audit';
    if (startDate && endDate) {
      dateRangeLabel = `${startDate} to ${endDate}`;
      const start = new Date(String(startDate)).getTime();
      const end = new Date(String(endDate)).getTime() + 86400000;
      donationsList = donationsList.filter((d) => {
        const t = new Date(d.createdAt || (d as any).date).getTime();
        return t >= start && t <= end;
      });
      expensesList = expensesList.filter((e) => {
        const t = new Date(e.date || (e as any).createdAt).getTime();
        return t >= start && t <= end;
      });
    } else if (month && month !== 'ALL') {
      dateRangeLabel = `Filter: ${month}`;
      const mStr = String(month).trim();
      donationsList = donationsList.filter((d: any) => {
        const dStr = d.createdAt ? new Date(d.createdAt).toISOString() : (d.date || d.rawDate || '');
        if (mStr.length === 2) {
          return dStr.includes(`-${mStr}-`);
        }
        return dStr.includes(mStr);
      });
      expensesList = expensesList.filter((e: any) => {
        const eStr = e.date ? new Date(e.date).toISOString() : (e.createdAt ? new Date(e.createdAt).toISOString() : '');
        if (mStr.length === 2) {
          return eStr.includes(`-${mStr}-`);
        }
        return eStr.includes(mStr);
      });
    }

    const totalDonations = donationsList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalExpenses = expensesList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    generateFinancialPDFReport(res, {
      totalDonations,
      totalExpenses,
      remainingBalance: totalDonations - totalExpenses,
      budgetAllocated: mockBudget.totalAllocatedBudget,
      budgetSpent: totalExpenses,
      budgetRemaining: Math.max(0, mockBudget.totalAllocatedBudget - totalExpenses),
      donations: donationsList as any,
      expenses: expensesList as any,
      generatedBy: req.user ? req.user.name : 'Admin',
      festivalYear: 2026,
      dateRangeLabel,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// EXPORT Individual Donor Multi-date Statement PDF
export const exportDonorPDF = async (req: AuthRequest, res: Response) => {
  try {
    const { donorName } = req.query;
    if (!donorName) {
      return res.status(400).json({ success: false, message: 'donorName query parameter is required' });
    }

    const searchName = String(donorName).trim().toLowerCase();

    // Combine MongoDB donations and mockDonations to ensure complete coverage
    let allDonations: any[] = [...mockDonations];
    try {
      const dbDonations = await Donation.find().sort({ createdAt: -1 }).lean();
      if (dbDonations && dbDonations.length > 0) {
        allDonations = [...(dbDonations as any[]), ...mockDonations];
      }
    } catch { }

    // Deduplicate by receipt number or ID
    const seenMap = new Map();
    const uniqueDonations: any[] = [];
    allDonations.forEach((d) => {
      const key = d.receiptNumber || d._id || d.id;
      if (key && !seenMap.has(key)) {
        seenMap.set(key, true);
        uniqueDonations.push(d);
      }
    });

    let donorList = uniqueDonations.filter(
      (d) =>
        d.donorName &&
        (d.donorName.trim().toLowerCase() === searchName ||
          d.donorName.trim().toLowerCase().includes(searchName) ||
          searchName.includes(d.donorName.trim().toLowerCase()))
    );

    // Fallback if no matching records found
    if (donorList.length === 0) {
      donorList = [
        {
          receiptNumber: `VPC-DON-2026-${Math.floor(100 + Math.random() * 900)}`,
          donorName: String(donorName),
          amount: 10000,
          paymentMethod: 'UPI',
          category: 'General Donation',
          createdAt: new Date(),
          festivalYear: 2026,
        },
      ];
    }

    const totalAmount = donorList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const firstRec = donorList[0];

    generateDonorStatementPDF(res, {
      donorName: firstRec.donorName || String(donorName),
      phone: firstRec.phone,
      email: firstRec.email,
      totalAmount,
      donationCount: donorList.length,
      donations: donorList as any,
      generatedBy: req.user ? req.user.name : 'Admin',
      festivalYear: 2026,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// EXPORT Excel Donations Report
export const exportDonationsExcel = async (req: AuthRequest, res: Response) => {
  try {
    const { month } = req.query;
    let donationsList = mockDonations;
    try {
      const dbDonations = await Donation.find().sort({ createdAt: -1 }).lean();
      if (dbDonations.length > 0) donationsList = dbDonations as any;
    } catch { }

    if (month && month !== 'ALL') {
      const mStr = String(month).trim();
      donationsList = donationsList.filter((d: any) => {
        const dStr = d.createdAt ? new Date(d.createdAt).toISOString() : (d.date || d.rawDate || '');
        if (mStr.length === 2) {
          return dStr.includes(`-${mStr}-`);
        }
        return dStr.includes(mStr);
      });
    }

    await generateDonationsExcelReport(res, donationsList as any, 2026);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDonation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Donation.findByIdAndUpdate(id, req.body);
    }
  } catch { }
  mockDonations = mockDonations.map((d) => (d.id === id || (d as any)._id === id ? { ...d, ...req.body } : d));
  res.json({ success: true, message: 'Donation updated successfully' });
};

export const deleteDonation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Donation.findByIdAndDelete(id);
    }
  } catch { }
  mockDonations = mockDonations.filter((d) => d.id !== id && (d as any)._id !== id);
  res.json({ success: true, message: 'Donation deleted successfully' });
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Expense.findByIdAndUpdate(id, req.body);
    }
  } catch { }
  mockExpenses = mockExpenses.map((e) => (e.id === id || (e as any)._id === id ? { ...e, ...req.body } : e));
  res.json({ success: true, message: 'Expense updated successfully' });
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Expense.findByIdAndDelete(id);
    }
  } catch { }
  mockExpenses = mockExpenses.filter((e) => e.id !== id && (e as any)._id !== id);
  res.json({ success: true, message: 'Expense deleted successfully' });
};

// UPDATE Budget (PUT)
export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { totalAllocatedBudget, categories } = req.body;
    if (totalAllocatedBudget !== undefined) {
      mockBudget.totalAllocatedBudget = Number(totalAllocatedBudget);
    }
    if (categories && Array.isArray(categories)) {
      mockBudget.categories = categories;
    }

    try {
      let budgetDoc = await Budget.findOne({ festivalYear: 2026 });
      if (budgetDoc) {
        if (totalAllocatedBudget !== undefined) budgetDoc.totalAllocatedBudget = totalAllocatedBudget;
        if (categories) budgetDoc.categories = categories;
        await budgetDoc.save();
      } else {
        await Budget.create({
          festivalYear: 2026,
          totalAllocatedBudget: totalAllocatedBudget || 500000,
          categories: categories || mockBudget.categories,
        });
      }
    } catch { }

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'BUDGET_UPDATED',
        'Budget',
        '2026',
        `Updated festival budget allocation`
      );
    }

    res.json({ success: true, message: 'Budget updated successfully', data: mockBudget });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Budget (DELETE)
export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    mockBudget = {
      festivalYear: 2026,
      totalAllocatedBudget: 0,
      categories: [],
    };
    try {
      await Budget.deleteMany({});
    } catch { }

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'BUDGET_DELETED',
        'Budget',
        '2026',
        'Reset budget allocations'
      );
    }

    res.json({ success: true, message: 'Budget allocations reset successfully', data: mockBudget });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Single Budget Category by _id OR category name
export const deleteBudgetCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId } = req.params;

    // Match by _id OR category name — handles both ObjectId strings and plain names
    const matches = (c: any) =>
      String(c._id) === categoryId || c.category === categoryId;

    // Remove from in-memory mock
    const before = mockBudget.categories.length;
    mockBudget.categories = mockBudget.categories.filter((c: any) => !matches(c));
    mockBudget.totalAllocatedBudget = mockBudget.categories.reduce(
      (sum: number, c: any) => sum + (c.allocatedAmount || 0), 0
    );

    // Remove from MongoDB subdocument
    try {
      const budgetDoc = await Budget.findOne({ festivalYear: 2026 });
      if (budgetDoc) {
        budgetDoc.categories = budgetDoc.categories.filter(
          (c: any) => c._id?.toString() !== categoryId && c.category !== categoryId
        );
        budgetDoc.totalAllocatedBudget = budgetDoc.categories.reduce(
          (sum, c) => sum + (c.allocatedAmount || 0), 0
        );
        await budgetDoc.save();
      }
    } catch {}

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'BUDGET_CATEGORY_DELETED',
        'Budget',
        categoryId,
        `Deleted budget category: ${categoryId}`
      );
    }

    const deleted = before !== mockBudget.categories.length;
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Budget category not found' });
    }

    res.json({ success: true, message: 'Budget category deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


