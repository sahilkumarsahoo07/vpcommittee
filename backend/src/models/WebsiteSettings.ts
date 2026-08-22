import mongoose, { Schema, Document } from 'mongoose';

export interface IRolePermissions {
  ADMIN: {
    FINANCE: boolean;
    CMS: boolean;
    SYSTEM: boolean;
  };
  COMMITTEE_MEMBER: {
    FINANCE: boolean;
    CMS: boolean;
    SYSTEM: boolean;
  };
  MEMBER: {
    FINANCE: boolean;
    CMS: boolean;
    SYSTEM: boolean;
  };
}

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
  rolePermissions?: IRolePermissions;
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
    contactAddress: { type: String, default: 'At:- Kadua, Post:- Bhagirathipur, Kamakhyanagar, Dhenkanal, Odisha' },
    contactPhone: { type: String, default: '+91 83277 04042' },
    contactEmail: { type: String, default: 'sahilkumarsahoo001@gmail.com' },
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
    rolePermissions: {
      ADMIN: {
        FINANCE: { type: Boolean, default: true },
        CMS: { type: Boolean, default: true },
        SYSTEM: { type: Boolean, default: false },
      },
      COMMITTEE_MEMBER: {
        FINANCE: { type: Boolean, default: false },
        CMS: { type: Boolean, default: true },
        SYSTEM: { type: Boolean, default: false },
      },
      MEMBER: {
        FINANCE: { type: Boolean, default: false },
        CMS: { type: Boolean, default: false },
        SYSTEM: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

export const WebsiteSettings = mongoose.model<IWebsiteSettings>('WebsiteSettings', WebsiteSettingsSchema);
