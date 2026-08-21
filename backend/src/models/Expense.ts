import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  expenseName: string;
  category:
    | 'Decoration'
    | 'Pandal'
    | 'Food'
    | 'Prasad'
    | 'Music'
    | 'Lighting'
    | 'Electricity'
    | 'Transportation'
    | 'Marketing'
    | 'Printing'
    | 'Security'
    | 'Cleaning'
    | 'Cultural Program'
    | 'Other';
  amount: number;
  date: Date;
  vendor?: string;
  paidBy?: string;
  paymentMethod: 'UPI' | 'CASH' | 'BANK_TRANSFER' | 'CHEQUE';
  invoiceNumber?: string;
  description?: string;
  attachment?: string;
  festivalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    expenseName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Decoration',
        'Pandal',
        'Food',
        'Prasad',
        'Music',
        'Lighting',
        'Electricity',
        'Transportation',
        'Marketing',
        'Printing',
        'Security',
        'Cleaning',
        'Cultural Program',
        'Other',
      ],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    vendor: { type: String, trim: true },
    paidBy: { type: String, trim: true },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'CASH', 'BANK_TRANSFER', 'CHEQUE'],
      default: 'CASH',
    },
    invoiceNumber: { type: String, trim: true },
    description: { type: String },
    attachment: { type: String },
    festivalYear: { type: Number, default: 2026 },
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);
