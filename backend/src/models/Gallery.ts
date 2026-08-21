import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  category: 'Puja' | 'Cultural' | 'Visarjan' | 'Decorations' | 'Volunteers' | 'General';
  mediaType: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnailUrl?: string;
  description?: string;
  albumName?: string;
  displayOrder: number;
  published: boolean;
  festivalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Puja', 'Cultural', 'Visarjan', 'Decorations', 'Volunteers', 'General'],
      default: 'Puja',
    },
    mediaType: {
      type: String,
      enum: ['IMAGE', 'VIDEO'],
      default: 'IMAGE',
    },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    description: { type: String },
    albumName: { type: String, default: 'Ganesh Utsav 2026' },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    festivalYear: { type: Number, default: 2026 },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);
