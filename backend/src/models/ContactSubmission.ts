import mongoose, { Schema, Document } from 'mongoose';

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['NEW', 'READ', 'IN_PROGRESS', 'RESOLVED'],
      default: 'NEW',
    },
  },
  { timestamps: true }
);

export const ContactSubmission = mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
