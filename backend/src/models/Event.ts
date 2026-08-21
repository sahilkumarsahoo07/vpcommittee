import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  title_hi?: string;
  description_hi?: string;
  title_or?: string;
  description_or?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  googleMapsUrl?: string;
  image?: string;
  status: 'DRAFT' | 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  isHighlight: boolean;
  festivalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    title_hi: { type: String },
    description_hi: { type: String },
    title_or: { type: String },
    description_or: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, required: true },
    googleMapsUrl: { type: String },
    image: { type: String },
    status: {
      type: String,
      enum: ['DRAFT', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED'],
      default: 'UPCOMING',
    },
    isHighlight: { type: Boolean, default: false },
    festivalYear: { type: Number, default: 2026 },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', EventSchema);
