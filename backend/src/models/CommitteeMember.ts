import mongoose, { Schema, Document } from 'mongoose';

export interface ICommitteeMember extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  galleryImage?: string;
  designation: string;
  roleType?: string;
  displayPhone?: string;
  bio?: string;
  instagram?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  displayOrder: number;
  isVisible: boolean;
  isActive: boolean;
  festivalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommitteeMemberSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    image: { type: String },
    galleryImage: { type: String },
    designation: { type: String, required: true, trim: true, default: 'Committee Member' },
    roleType: { type: String, default: 'MEMBER' },
    displayPhone: { type: String, trim: true },
    bio: { type: String, trim: true },
    instagram: { type: String, trim: true },
    socialLinks: {
      instagram: { type: String },
      facebook: { type: String },
      whatsapp: { type: String },
    },
    displayOrder: { type: Number, default: 1 },
    isVisible: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    festivalYear: { type: Number, default: 2026 },
  },
  { timestamps: true }
);

export const CommitteeMember = mongoose.model<ICommitteeMember>('CommitteeMember', CommitteeMemberSchema);
