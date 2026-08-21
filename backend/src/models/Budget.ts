import mongoose, { Schema, Document } from 'mongoose';

export interface IBudgetCategory {
  category: string;
  allocatedAmount: number;
}

export interface IBudget extends Document {
  festivalYear: number;
  totalAllocatedBudget: number;
  categories: IBudgetCategory[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema = new Schema(
  {
    festivalYear: { type: Number, required: true, unique: true, default: 2026 },
    totalAllocatedBudget: { type: Number, required: true, default: 500000 },
    categories: [
      {
        category: { type: String, required: true },
        allocatedAmount: { type: Number, required: true, default: 0 },
      },
    ],
    notes: { type: String },
  },
  { timestamps: true }
);

export const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);
