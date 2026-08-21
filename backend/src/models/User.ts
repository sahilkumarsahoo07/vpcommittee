import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'COMMITTEE_MEMBER';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  plainPassword?: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  mustChangePassword?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    plainPassword: { type: String, select: false },
    role: {
      type: String,
      enum: ['SUPERADMIN', 'ADMIN', 'COMMITTEE_MEMBER'],
      default: 'COMMITTEE_MEMBER',
    },
    phone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastLogin: { type: Date },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
