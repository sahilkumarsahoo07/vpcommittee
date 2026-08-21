import mongoose, { Schema, Document } from 'mongoose';

export interface ICommitteeMember extends Document {
  name: string;
  designation: string;
  roleType: 'PRESIDENT' | 'VICE_PRESIDENT' | 'SECRETARY' | 'TREASURER' | 'MEMBER';
  phone?: string;
  email?: string;
  image?: string;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  displayOrder: number;
  isActive: boolean;
  festivalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommitteeMemberSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    roleType: {
      type: String,
      enum: ['PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER', 'MEMBER'],
      default: 'MEMBER',
    },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    image: { type: String },
    bio: { type: String },
    socialLinks: {
      instagram: { type: String },
      facebook: { type: String },
      whatsapp: { type: String },
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    festivalYear: { type: Number, default: 2026 },
  },
  { timestamps: true }
);

export const CommitteeMember = mongoose.model<ICommitteeMember>('CommitteeMember', CommitteeMemberSchema);
