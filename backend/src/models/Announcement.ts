import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  description: string;
  content?: string;
  title_hi?: string;
  description_hi?: string;
  content_hi?: string;
  title_or?: string;
  description_or?: string;
  content_or?: string;
  category: 'General' | 'Important' | 'Event' | 'Aarti' | 'Visarjan' | 'Volunteer' | 'Donation' | 'Emergency';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isImportant: boolean;
  showPopup: boolean;
  popupDurationDays: number;
  popupUntil?: Date;
  imageUrl?: string;
  published: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  image?: string;
  festivalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String },
    title_hi: { type: String },
    description_hi: { type: String },
    content_hi: { type: String },
    title_or: { type: String },
    description_or: { type: String },
    content_or: { type: String },
    category: {
      type: String,
      enum: ['General', 'Important', 'Event', 'Aarti', 'Visarjan', 'Volunteer', 'Donation', 'Emergency'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    isImportant: { type: Boolean, default: false },
    showPopup: { type: Boolean, default: false },
    popupDurationDays: { type: Number, default: 3 },
    popupUntil: { type: Date },
    imageUrl: { type: String },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    image: { type: String },
    festivalYear: { type: Number, default: 2026 },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
