import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteer extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  title: string;
  bio?: string;
  category: string;
  volunteerSince: string;
  achievements?: string;
  displayOrder: number;
  isVisible: boolean;
  festivalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    profilePhoto: { type: String },
    title: { type: String, default: 'Community Volunteer', trim: true },
    bio: { type: String, trim: true },
    category: { type: String, default: 'Community Service', trim: true },
    volunteerSince: { type: String, default: '2026', trim: true },
    achievements: { type: String, trim: true },
    displayOrder: { type: Number, default: 1 },
    isVisible: { type: Boolean, default: true },
    festivalYear: { type: Number, default: 2026 },
  },
  { timestamps: true }
);

export const Volunteer = mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);
