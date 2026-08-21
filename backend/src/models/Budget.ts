import mongoose, { Schema, Document } from 'mongoose';

export interface IBudgetCategory {
  _id?: mongoose.Types.ObjectId;
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

const BudgetCategorySchema = new Schema(
  {
    category: { type: String, required: true },
    allocatedAmount: { type: Number, required: true, default: 0 },
  },
  { _id: true } // Each category gets its own ObjectId
);

const BudgetSchema: Schema = new Schema(
  {
    festivalYear: { type: Number, required: true, unique: true, default: 2026 },
    totalAllocatedBudget: { type: Number, required: true, default: 500000 },
    categories: [BudgetCategorySchema],
    notes: { type: String },
  },
  { timestamps: true }
);

export const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);

