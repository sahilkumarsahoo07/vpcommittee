import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteer extends Document {
  name: string;
  phone: string;
  email?: string;
  areaOfInterest: string;
  availability: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  festivalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    areaOfInterest: { type: String, required: true },
    availability: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'APPROVED', 'REJECTED', 'COMPLETED'],
      default: 'NEW',
    },
    festivalYear: { type: Number, default: 2026 },
  },
  { timestamps: true }
);

export const Volunteer = mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);
