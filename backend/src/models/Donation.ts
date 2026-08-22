import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  userId?: mongoose.Types.ObjectId;
  donorName: string;
  phone?: string;
  email?: string;
  amount: number;
  paymentMethod: 'UPI' | 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'CHEQUE';
  transactionId?: string;
  receiptNumber: string;
  category: 'General Donation' | 'Maha Prasad' | 'Pandal Sponsorship' | 'Aarti Sponsorship' | 'Special Puja' | 'Other';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  notes?: string;
  festivalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    donorName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    amount: { type: Number, required: true, min: 1 },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'CASH', 'BANK_TRANSFER', 'CARD', 'CHEQUE'],
      default: 'UPI',
    },
    transactionId: { type: String, trim: true },
    receiptNumber: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['General Donation', 'Maha Prasad', 'Pandal Sponsorship', 'Aarti Sponsorship', 'Special Puja', 'Other'],
      default: 'General Donation',
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'SUCCESS',
    },
    notes: { type: String },
    festivalYear: { type: Number, default: 2026 },
  },
  { timestamps: true }
);

export const Donation = mongoose.model<IDonation>('Donation', DonationSchema);
