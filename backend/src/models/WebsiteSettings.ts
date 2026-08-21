import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsiteSettings extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  festivalYear: number;
  countdownDate: Date;
  upiId: string;
  qrCodeUrl: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
  };
  instagramHandle?: string;
  yearsOfCelebration: number;
  annualDevotees: string;
  communityActivities: number;
  activeVolunteers: number;
  updatedAt: Date;
}

const WebsiteSettingsSchema: Schema = new Schema(
  {
    heroTitle: { type: String, default: 'VIGHNAHARTA PUJA COMMITTEE' },
    heroSubtitle: { type: String, default: 'GRAND GANESH UTSAV 2026' },
    heroDescription: {
      type: String,
      default: 'Join us in celebrating devotion, unity, and divine blessings at our annual Ganesh Mahotsav.',
    },
    festivalYear: { type: Number, default: 2026 },
    countdownDate: { type: Date, default: new Date('2026-09-07T00:00:00Z') },
    upiId: { type: String, default: 'vighnaharta@upi' },
    qrCodeUrl: { type: String, default: '/assets/bannerimage.png' },
    contactAddress: { type: String, default: 'Main Mandap Grounds, Sector 4, City Center' },
    contactPhone: { type: String, default: '+91 98765 43210' },
    contactEmail: { type: String, default: 'info@vighnahartapujacommittee.org' },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com' },
      facebook: { type: String, default: 'https://facebook.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      whatsapp: { type: String, default: 'https://wa.me/919876543210' },
    },
    instagramHandle: { type: String, default: 'vighnaharta_puja' },
    yearsOfCelebration: { type: Number, default: 12 },
    annualDevotees: { type: String, default: '50K' },
    communityActivities: { type: Number, default: 25 },
    activeVolunteers: { type: Number, default: 100 },
  },
  { timestamps: true }
);

export const WebsiteSettings = mongoose.model<IWebsiteSettings>('WebsiteSettings', WebsiteSettingsSchema);
