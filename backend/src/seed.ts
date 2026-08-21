import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import { User } from './models/User';
import { CommitteeMember } from './models/CommitteeMember';
import { Event } from './models/Event';
import { Announcement } from './models/Announcement';
import { Gallery } from './models/Gallery';
import { Donation } from './models/Donation';
import { Expense } from './models/Expense';
import { Budget } from './models/Budget';
import { Volunteer } from './models/Volunteer';
import { WebsiteSettings } from './models/WebsiteSettings';

dotenv.config();

export const seedDatabase = async () => {
  console.log('=======================================================');
  console.log('   VIGHNAHARTA PUJA COMMITTEE DATABASE SEEDER');
  console.log('=======================================================');

  const isConnected = await connectDB();
  if (!isConnected) {
    console.log('[Seed] Database not connected. Skipping MongoDB seeding.');
    return;
  }

  try {
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      CommitteeMember.deleteMany({}),
      Event.deleteMany({}),
      Announcement.deleteMany({}),
      Gallery.deleteMany({}),
      Donation.deleteMany({}),
      Expense.deleteMany({}),
      Budget.deleteMany({}),
      Volunteer.deleteMany({}),
      WebsiteSettings.deleteMany({}),
    ]);

    console.log('[Seed] Seeding Users...');
    const hashedSuperAdminPassword = await bcrypt.hash('123456', 10);
    const hashedAdminPassword = await bcrypt.hash('Admin@2026', 10);
    const hashedMemberPassword = await bcrypt.hash('Member@2026', 10);

    const users = await User.create([
      {
        name: 'Sahil Kumar Sahoo',
        email: 'sksahoo.dev@gmail.com',
        password: hashedSuperAdminPassword,
        plainPassword: '123456',
        role: 'SUPERADMIN',
        isActive: true,
        mustChangePassword: false,
      },
      {
        name: 'Treasurer Admin',
        email: 'admin@vighnaharta.org',
        password: hashedAdminPassword,
        plainPassword: 'Admin@2026',
        role: 'ADMIN',
        isActive: true,
        mustChangePassword: true,
      },
      {
        name: 'Committee Member',
        email: 'member@vighnaharta.org',
        password: hashedMemberPassword,
        plainPassword: 'Member@2026',
        role: 'COMMITTEE_MEMBER',
        isActive: true,
        mustChangePassword: true,
      },
    ]);
    console.log(`[Seed] Created ${users.length} default users.`);

    console.log('[Seed] Seeding Committee Executive Members...');
    const members = await CommitteeMember.create([
      {
        name: 'Sri Rajesh Kumar Sahoo',
        designation: 'President & Founder',
        roleType: 'PRESIDENT',
        phone: '+91 98765 43210',
        email: 'president@vighnaharta.org',
        displayOrder: 1,
        isActive: true,
      },
      {
        name: 'Sri Amitava Patnaik',
        designation: 'Vice President',
        roleType: 'VICE_PRESIDENT',
        phone: '+91 94370 11223',
        email: 'vp@vighnaharta.org',
        displayOrder: 2,
        isActive: true,
      },
      {
        name: 'Sri Subhasis Mohanty',
        designation: 'General Secretary',
        roleType: 'SECRETARY',
        phone: '+91 91234 88990',
        email: 'secretary@vighnaharta.org',
        displayOrder: 3,
        isActive: true,
      },
      {
        name: 'Sri Bikash Swain',
        designation: 'Treasurer / Financial Head',
        roleType: 'TREASURER',
        phone: '+91 99381 44556',
        email: 'treasurer@vighnaharta.org',
        displayOrder: 4,
        isActive: true,
      },
    ]);
    console.log(`[Seed] Created ${members.length} executive committee members.`);

    console.log('[Seed] Seeding Events & Festival Schedule...');
    const events = await Event.create([
      {
        title: 'Ganesh Sthapana & Shobha Yatra',
        description: 'Grand holy procession bringing Lord Ganesha idol to main mandap with traditional dhol & kirtan.',
        date: new Date('2026-09-07'),
        startTime: '08:00 AM',
        endTime: '12:00 PM',
        location: 'Main Mandap Grounds, Sector 4',
        status: 'UPCOMING',
      },
      {
        title: 'Maha Sandhya Aarti & Bhajan Evening',
        description: 'Special 108 lamp Maha Aarti followed by devotional bhajan performances.',
        date: new Date('2026-09-08'),
        startTime: '06:30 PM',
        endTime: '09:30 PM',
        location: 'Central Aarti Hall',
        status: 'UPCOMING',
      },
      {
        title: 'Maha Prasad Feast & Distribution',
        description: 'Grand community feast (Anna Daan) serving fresh prasad to over 5,000 devotees.',
        date: new Date('2026-09-09'),
        startTime: '12:30 PM',
        endTime: '04:30 PM',
        location: 'Community Dining Pavilion',
        status: 'UPCOMING',
      },
      {
        title: 'Grand Visarjan Shobha Yatra',
        description: 'Solemn immersion procession with floral arrangements and eco-friendly lake immersion.',
        date: new Date('2026-09-11'),
        startTime: '03:00 PM',
        endTime: '09:00 PM',
        location: 'Immersion Lake Route',
        status: 'UPCOMING',
      },
    ]);
    console.log(`[Seed] Created ${events.length} festival events.`);

    console.log('[Seed] Seeding Announcements...');
    const announcements = await Announcement.create([
      {
        title: 'Maha Aarti Timings Update for Day 2',
        title_hi: 'दिन 2 महा आरती समय सारणी अद्यतन',
        title_or: 'ଦ୍ୱିତୀୟ ଦିନ ମହା ଆରତୀ ସମୟ ସୂଚନା',
        description: 'Sandhya Aarti will begin at exactly 07:00 PM sharp. All devotees are requested to be seated by 06:45 PM.',
        description_hi: 'संध्या आरती ठीक शाम 07:00 बजे शुरू होगी। सभी भक्तों से निवेदन है कि 06:45 तक स्थान ग्रहण करें।',
        description_or: 'ସନ୍ଧ୍ୟା ଆରତୀ ଠିକ୍ ସନ୍ଧ୍ୟା ୦୭:୦୦ ଟାରେ ଆରମ୍ଭ ହେବ। ସମସ୍ତ ଶ୍ରଦ୍ଧାଳୁଙ୍କୁ ୦୬:୪୫ ସୁଦ୍ଧା ଆସନ ଗ୍ରହଣ କରିବାକୁ ଅନୁରୋଧ।',
        category: 'Aarti',
        priority: 'HIGH',
        isActive: true,
      },
      {
        title: 'Volunteer Briefing Meeting Today Evening',
        title_hi: 'आज शाम स्वयंसेवक बैठक',
        title_or: 'ଆଜି ସନ୍ଧ୍ୟାରେ ସ୍ୱେଚ୍ଛାସେବୀ ବୈଠକ',
        description: 'All registered volunteers are requested to attend the crowd management briefing at 05:00 PM.',
        description_hi: 'सभी पंजीकृत स्वयंसेवकों से अनुरोध है कि शाम 05:00 बजे सुरक्षा और भीड़ प्रबंधन की बैठक में भाग लें।',
        description_or: 'ସମସ୍ତ ପଞ୍ଜୀକୃତ ସ୍ୱେଚ୍ଛାସେବୀଙ୍କୁ ସନ୍ଧ୍ୟା ୦୫:୦୦ ଟାରେ ସୁରକ୍ଷା ଓ ଭିଡ଼ ନିୟନ୍ତ୍ରଣ ଆଲୋଚନାରେ ଯୋଗଦେବାକୁ ଅନୁରୋଧ।',
        category: 'Volunteer',
        priority: 'MEDIUM',
        isActive: true,
      },
    ]);
    console.log(`[Seed] Created ${announcements.length} announcements.`);

    console.log('[Seed] Seeding Gallery & Media...');
    const gallery = await Gallery.create([
      {
        title: 'Divine Eco-Friendly Ganesha Idol',
        description: 'Handcrafted clay idol crafted by master traditional artisans.',
        category: 'Puja',
        mediaType: 'IMAGE',
        url: '/assets/bannerimage.png',
        albumName: 'Ganesh Utsav 2026',
        isFeatured: true,
      },
      {
        title: 'Golden Lotus Mandap Illumination',
        description: 'Breathtaking LED lighting entrance gate and mandap dome.',
        category: 'Decorations',
        mediaType: 'IMAGE',
        url: '/assets/3rdbgimage.png',
        albumName: 'Ganesh Utsav 2026',
        isFeatured: true,
      },
    ]);
    console.log(`[Seed] Created ${gallery.length} gallery assets.`);

    console.log('[Seed] Seeding Donations...');
    const donations = await Donation.create([
      {
        receiptNumber: 'VPC-DON-2026-001',
        donorName: 'Rahul Kumar Sharma',
        donorPhone: '+91 98765 00001',
        donorEmail: 'rahul.sharma@example.com',
        amount: 25000,
        paymentMethod: 'UPI',
        transactionId: 'UPI-20260801-998811',
        category: 'Pandal Sponsorship',
        status: 'SUCCESS',
        date: new Date('2026-08-01'),
      },
      {
        receiptNumber: 'VPC-DON-2026-002',
        donorName: 'Ananya Mohanty',
        donorPhone: '+91 94370 00002',
        donorEmail: 'ananya.m@example.com',
        amount: 15000,
        paymentMethod: 'BANK_TRANSFER',
        transactionId: 'NFT-20260805-443322',
        category: 'Maha Prasad',
        status: 'SUCCESS',
        date: new Date('2026-08-05'),
      },
      {
        receiptNumber: 'VPC-DON-2026-003',
        donorName: 'Sujit Kumar Patnaik',
        donorPhone: '+91 91234 00003',
        amount: 50000,
        paymentMethod: 'CHEQUE',
        transactionId: 'CHQ-882910',
        category: 'Aarti Sponsorship',
        status: 'SUCCESS',
        date: new Date('2026-08-10'),
      },
    ]);
    console.log(`[Seed] Created ${donations.length} donation records.`);

    console.log('[Seed] Seeding Expenses...');
    const expenses = await Expense.create([
      {
        invoiceNumber: 'INV-2026-101',
        expenseName: 'Grand Pandal Iron Structure & Fabric',
        category: 'Pandal',
        amount: 120000,
        date: new Date('2026-08-02'),
        vendor: 'Odisha Mandap Builders',
        paidBy: 'Secretary',
        paymentMethod: 'BANK_TRANSFER',
      },
      {
        invoiceNumber: 'INV-2026-102',
        expenseName: 'Clay Idol Creation & Crafting',
        category: 'Decoration',
        amount: 65000,
        date: new Date('2026-08-04'),
        vendor: 'Master Artisan Sculptors',
        paidBy: 'President',
        paymentMethod: 'UPI',
      },
      {
        invoiceNumber: 'INV-2026-103',
        expenseName: 'Illumination & LED Lighting Grid',
        category: 'Lighting',
        amount: 45000,
        date: new Date('2026-08-12'),
        vendor: 'Royal Lightings & Sounds',
        paidBy: 'Treasurer',
        paymentMethod: 'UPI',
      },
    ]);
    console.log(`[Seed] Created ${expenses.length} expense items.`);

    console.log('[Seed] Seeding Budget Allocations...');
    await Budget.create({
      festivalYear: 2026,
      totalAllocatedBudget: 500000,
      categories: [
        { category: 'Pandal', allocatedAmount: 150000 },
        { category: 'Decoration', allocatedAmount: 100000 },
        { category: 'Food', allocatedAmount: 80000 },
        { category: 'Lighting', allocatedAmount: 60000 },
        { category: 'Music', allocatedAmount: 40000 },
        { category: 'Prasad', allocatedAmount: 30000 },
        { category: 'Security', allocatedAmount: 20000 },
        { category: 'Other', allocatedAmount: 20000 },
      ],
      notes: 'Approved budget for Ganesh Mahotsav 2026',
    });
    console.log('[Seed] Created Budget allocation document for 2026.');

    console.log('[Seed] Seeding Volunteers...');
    const volunteers = await Volunteer.create([
      {
        name: 'Amit Kumar Sen',
        phone: '+91 98765 11111',
        email: 'amit.sen@example.com',
        areaOfInterest: 'Crowd Management & Queue Control',
        availability: 'Full Time (All 5 Days)',
        status: 'APPROVED',
      },
      {
        name: 'Pooja Rani Swain',
        phone: '+91 94370 22222',
        email: 'pooja.s@example.com',
        areaOfInterest: 'Prasad Distribution & Help Desk',
        availability: 'Evening Shift (04:00 PM - 10:00 PM)',
        status: 'NEW',
      },
    ]);
    console.log(`[Seed] Created ${volunteers.length} volunteer applications.`);

    console.log('[Seed] Seeding Website Global Settings...');
    await WebsiteSettings.create({
      heroTitle: 'VIGHNAHARTA PUJA COMMITTEE',
      heroSubtitle: 'GRAND GANESH UTSAV 2026',
      heroDescription: 'Join us in celebrating devotion, unity, and divine blessings at our annual Ganesh Mahotsav.',
      festivalStartDate: new Date('2026-09-07'),
      donationUpiId: 'vighnaharta@upi',
      contactPhone: '+91 98765 43210',
      contactEmail: 'info@vighnahartapujacommittee.org',
      pandalAddress: 'Main Mandap Grounds, Sector 4, City Center',
    });
    console.log('[Seed] Created Website Settings document.');

    console.log('=======================================================');
    console.log('   DATABASE SEEDING COMPLETED SUCCESSFULLY! 🎉');
    console.log('=======================================================');
  } catch (error: any) {
    console.error('[Seed Error] Failed to seed database:', error.message);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
