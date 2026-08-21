import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { CommitteeMember } from '../models/CommitteeMember';
import { Event } from '../models/Event';
import { Announcement } from '../models/Announcement';
import { Gallery } from '../models/Gallery';
import { Volunteer } from '../models/Volunteer';
import { NewsletterSubscriber } from '../models/NewsletterSubscriber';
import { WebsiteSettings } from '../models/WebsiteSettings';
import { logAudit } from '../middleware/auditLog';

// In-Memory Fallback Store
let mockMembers = [
  {
    id: 'mem_1',
    name: 'Sri Rajesh Kumar Sahoo',
    designation: 'President & Founder',
    roleType: 'PRESIDENT',
    phone: '+91 98765 43210',
    email: 'president@vighnaharta.org',
    image: '/assets/navlogo.png',
    bio: 'Leading Ganesh Puja celebrations with devotion for over 10 years.',
    socialLinks: { instagram: 'https://instagram.com' },
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'mem_2',
    name: 'Sri Amitava Patnaik',
    designation: 'Vice President',
    roleType: 'VICE_PRESIDENT',
    phone: '+91 94370 11223',
    email: 'vp@vighnaharta.org',
    image: '/assets/navlogo.png',
    bio: 'Overseeing pandal construction and cultural events.',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'mem_3',
    name: 'Sri Subhasis Mohanty',
    designation: 'General Secretary',
    roleType: 'SECRETARY',
    phone: '+91 91234 88990',
    email: 'secretary@vighnaharta.org',
    image: '/assets/navlogo.png',
    bio: 'Coordinating volunteer teams and public relations.',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'mem_4',
    name: 'Sri Bikash Swain',
    designation: 'Treasurer / Financial Head',
    roleType: 'TREASURER',
    phone: '+91 99381 44556',
    email: 'treasurer@vighnaharta.org',
    image: '/assets/navlogo.png',
    bio: 'Managing committee budget and transparent financial records.',
    displayOrder: 4,
    isActive: true,
  },
];

let mockEvents = [
  {
    id: 'evt_1',
    title: 'Ganesh Sthapana & Shobha Yatra',
    description: 'Grand holy procession bringing Lord Ganesha idol to main mandap with dhols and devotional chanting.',
    title_hi: 'गणेश स्थापना एवं शोभा यात्रा',
    description_hi: 'ढोल-नगाड़ों एवं भक्तिमय जयकारों के साथ भगवान गणेश की प्रतिमा को मुख्य मण्डप में लाने की भव्य शोभा यात्रा।',
    title_or: 'ଗଣେଶ ସ୍ଥାପନା ଓ ଶୋଭାଯାତ୍ରା',
    description_or: 'ବାଜା, ରୋଷଣୀ ଓ ହରିବୋଲ ଧ୍ୱନି ସହ ପ୍ରଭୁ ଗଣେଶଙ୍କ ମୂର୍ତ୍ତିଙ୍କୁ ମୁଖ୍ୟ ମଣ୍ଡପକୁ ଆଣିବାର ପବିତ୍ର ଶୋଭାଯାତ୍ରା।',
    date: '2026-09-07',
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    location: 'Main Mandap Grounds, Sector 4',
    status: 'LIVE',
    isHighlight: true,
  },
  {
    id: 'evt_2',
    title: 'Maha Sandhya Aarti & Bhajan Evening',
    description: 'Special 108 lamp Maha Aarti followed by devotional bhajans by traditional artists.',
    title_hi: 'महा संध्या आरती एवं भजन संध्या',
    description_hi: 'पारंपरिक कलाकारों द्वारा १०८ दीपों की विशेष महा आरती एवं भक्तिमय भजनों का भव्य आयोजन।',
    title_or: 'ମହା ସନ୍ଧ୍ୟା ଆରତୀ ଓ ଭଜନ ସନ୍ଧ୍ୟା',
    description_or: '୧୦୮ ଦୀପର ବିଶେଷ ମହା ଆରତୀ ଓ ପାରମ୍ପରିକ କଳାକାରଙ୍କ ଦ୍ୱାରା ଚିତ୍ତାକର୍ଷକ ଭଜନ ସନ୍ଧ୍ୟା।',
    date: '2026-09-08',
    startTime: '06:30 PM',
    endTime: '09:30 PM',
    location: 'Central Aarti Hall',
    status: 'UPCOMING',
    isHighlight: true,
  },
  {
    id: 'evt_3',
    title: 'Maha Prasad & Anna Daan Distribution',
    description: 'Community feast serving pure traditional Mahaprasad to thousands of devotees.',
    title_hi: 'महाप्रसाद एवं अन्नदान वितरण',
    description_hi: 'हजारों भक्तों के लिए शुद्ध पारंपरिक महाप्रसाद एवं अन्नदान का भव्य सामुदायिक आयोजन।',
    title_or: 'ମହାପ୍ରସାଦ ଓ ଅନ୍ନଦାନ ସେବା',
    description_or: 'ହଜାର ହଜାର ଶ୍ରଦ୍ଧାଳୁଙ୍କ ପାଇଁ ପବିତ୍ର ପାରମ୍ପରିକ ମହାପ୍ରସାଦ ସେବନ ଓ ଅନ୍ନଦାନ।',
    date: '2026-09-09',
    startTime: '12:30 PM',
    endTime: '04:00 PM',
    location: 'Prasad Mandap Hall B',
    status: 'UPCOMING',
    isHighlight: false,
  },
  {
    id: 'evt_4',
    title: 'Grand Visarjan & Balaram Procession',
    description: 'Immersion procession of Lord Ganesha with traditional music and dance.',
    title_hi: 'भव्य विसर्जन एवं शोभा यात्रा',
    description_hi: 'पारंपरिक संगीत, नृत्य एवं जयकारों के साथ भगवान गणेश की भव्य विसर्जन यात्रा।',
    title_or: 'ଭବ୍ୟ ବିସର୍ଜନ ଓ ବଳରାମ ଶୋଭାଯାତ୍ରା',
    description_or: 'ପାରମ୍ପରିକ ବାଜା ଓ ନୃତ୍ୟ ଗୀତ ସହ ପ୍ରଭୁ ଗଣେଶଙ୍କ ପବିତ୍ର ବିସର୍ଜନ ଶୋଭାଯାତ୍ରା।',
    date: '2026-09-11',
    startTime: '03:00 PM',
    endTime: '09:00 PM',
    location: 'Ghat Riverside Mandap',
    status: 'UPCOMING',
    isHighlight: true,
  },
];

let mockAnnouncements = [
  {
    id: 'ann_1',
    title: 'Maha Aarti Timings Update for Day 2',
    title_hi: 'दिन 2 महा आरती समय सारणी अद्यतन',
    title_or: 'ଦ୍ୱିତୀୟ ଦିନ ମହା ଆରତୀ ସମୟ ସୂଚନା',
    description: 'Sandhya Aarti will begin at exactly 07:00 PM sharp. All devotees are requested to be seated by 06:45 PM.',
    description_hi: 'संध्या आरती ठीक शाम 07:00 बजे शुरू होगी। सभी भक्तों से निवेदन है कि 06:45 तक स्थान ग्रहण करें।',
    description_or: 'ସନ୍ଧ୍ୟା ଆରତୀ ଠିକ୍ ସନ୍ଧ୍ୟା ୦୭:୦୦ ଟାରେ ଆରମ୍ଭ ହେବ। ସମସ୍ତ ଶ୍ରଦ୍ଧାଳୁଙ୍କୁ ୦୬:୪୫ ସୁଦ୍ଧା ଆସନ ଗ୍ରହଣ କରିବାକୁ ଅନୁରୋଧ।',
    content: 'Sandhya Aarti will begin at exactly 07:00 PM sharp. All devotees are requested to be seated by 06:45 PM.',
    content_hi: 'संध्या आरती ठीक शाम 07:00 बजे शुरू होगी। सभी भक्तों से निवेदन है कि 06:45 तक स्थान ग्रहण करें।',
    content_or: 'ସନ୍ଧ୍ୟା ଆରତୀ ଠିକ୍ ସନ୍ଧ୍ୟା ୦୭:୦୦ ଟାରେ ଆରମ୍ଭ ହେବ। ସମସ୍ତ ଶ୍ରଦ୍ଧାଳୁଙ୍କୁ ୦୬:୪୫ ସୁଦ୍ଧା ଆସନ ଗ୍ରହଣ କରିବାକୁ ଅନୁରୋଧ।',
    category: 'Aarti',
    priority: 'HIGH',
    isImportant: true,
    showPopup: true,
    popupDurationDays: 3,
    popupUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    imageUrl: '/assets/bannerimage.png',
    published: true,
    publishDate: new Date(),
  },
  {
    id: 'ann_2',
    title: 'Volunteer Meeting Today Evening',
    title_hi: 'आज शाम स्वयंसेवक बैठक',
    title_or: 'ଆଜି ସନ୍ଧ୍ୟାରେ ସ୍ୱେଚ୍ଛାସେବୀ ବୈଠକ',
    description: 'All registered volunteers are requested to attend the security & crowd management briefing at 05:00 PM.',
    description_hi: 'सभी पंजीकृत स्वयंसेवकों से अनुरोध है कि शाम 05:00 बजे सुरक्षा और भीड़ प्रबंधन की बैठक में भाग लें।',
    description_or: 'ସମସ୍ତ ପଞ୍ଜୀକୃତ ସ୍ୱେଚ୍ଛାସେବୀଙ୍କୁ ସନ୍ଧ୍ୟା ୦୫:୦୦ ଟାରେ ସୁରକ୍ଷା ଓ ଭିଡ଼ ନିୟନ୍ତ୍ରଣ ଆଲୋଚନାରେ ଯୋଗଦେବାକୁ ଅନୁରୋଧ।',
    content: 'All registered volunteers are requested to attend the security & crowd management briefing at 05:00 PM.',
    content_hi: 'सभी पंजीकृत स्वयंसेवकों से अनुरोध है कि शाम 05:00 बजे सुरक्षा और भीड़ प्रबंधन की बैठक में भाग लें।',
    content_or: 'ସମସ୍ତ ପଞ୍ଜୀକୃତ ସ୍ୱେଚ୍ଛାସେବୀଙ୍କୁ ସନ୍ଧ୍ୟା ୦୫:୦୦ ଟାରେ ସୁରକ୍ଷା ଓ ଭିଡ଼ ନିୟନ୍ତ୍ରଣ ଆଲୋଚନାରେ ଯୋଗଦେବାକୁ ଅନୁରୋଧ।',
    category: 'Volunteer',
    priority: 'MEDIUM',
    isImportant: false,
    showPopup: false,
    popupDurationDays: 1,
    popupUntil: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    imageUrl: '',
    published: true,
    publishDate: new Date(),
  },
];

let mockGallery = [
  {
    id: 'gal_1',
    title: 'Divine Eco-Friendly Ganesha Idol',
    category: 'Puja',
    mediaType: 'IMAGE',
    mediaUrl: '/assets/bannerimage.png',
    imageUrl: '/assets/bannerimage.png',
    caption: '14ft handcrafted eco-friendly Ganesha idol.',
    albumName: 'Ganesh Utsav 2026',
    published: true,
  },
  {
    id: 'gal_2',
    title: 'Golden Lotus Mandap Illumination',
    category: 'Decorations',
    mediaType: 'IMAGE',
    mediaUrl: '/assets/3rdbgimage.png',
    imageUrl: '/assets/3rdbgimage.png',
    caption: 'Custom handcrafted 3D golden lotus archways.',
    albumName: 'Ganesh Utsav 2026',
    published: true,
  },
  {
    id: 'gal_3',
    title: 'Maha Aarti Celebrations 2026',
    category: 'Reels',
    mediaType: 'REEL',
    mediaUrl: 'https://www.instagram.com/p/C-0XpTxy_2A/',
    imageUrl: '/assets/maha-aarti.png',
    embedUrl: 'https://www.instagram.com/p/C-0XpTxy_2A/embed/',
    caption: 'Divine Evening Aarti & Lamp offerings at Vighnaharta Ganesh Utsav.',
    albumName: 'Ganesh Utsav 2026',
    published: true,
  },
  {
    id: 'gal_4',
    title: 'Cultural Dance & Dhol Performance',
    category: 'Reels',
    mediaType: 'REEL',
    mediaUrl: 'https://www.instagram.com/p/C-0XpTxy_2A/',
    imageUrl: '/assets/cultural-night.png',
    embedUrl: 'https://www.instagram.com/p/C-0XpTxy_2A/embed/',
    caption: 'Youth troupe traditional dance performance dedicated to Lord Ganesha.',
    albumName: 'Ganesh Utsav 2026',
    published: true,
  },
  {
    id: 'gal_5',
    title: 'Grand Community Mahaprasad Seva',
    category: 'Reels',
    mediaType: 'REEL',
    mediaUrl: 'https://www.instagram.com/p/C-x15W-y811/',
    imageUrl: '/assets/mahaprasad.png',
    embedUrl: 'https://www.instagram.com/p/C-x15W-y811/embed/',
    caption: 'Serving thousands of devotees with divine Mahaprasad bhog.',
    albumName: 'Ganesh Utsav 2026',
    published: true,
  },
  {
    id: 'gal_6',
    title: 'Visarjan Shobhayatra Highlights',
    category: 'Reels',
    mediaType: 'REEL',
    mediaUrl: 'https://www.instagram.com/p/C-vK-N3y5K-/',
    imageUrl: '/assets/visarjan.png',
    embedUrl: 'https://www.instagram.com/p/C-vK-N3y5K-/embed/',
    caption: 'Grand immersion procession with traditional Dhol Tasha Pathak.',
    albumName: 'Ganesh Utsav 2026',
    published: true,
  },
];

let mockVolunteers = [
  {
    id: 'vol_1',
    name: 'Amit Kumar Sen',
    phone: '+91 98765 11111',
    email: 'amit.sen@example.com',
    areaOfInterest: 'Crowd Management',
    availability: 'Full Time (All 5 Days)',
    message: 'Eager to serve Lord Ganesha.',
    status: 'NEW',
    createdAt: new Date(),
  },
];

let mockAuditLogs = [
  {
    id: 'log_1',
    user: 'demo_superadmin',
    userName: 'Main SuperAdmin',
    role: 'SUPERADMIN',
    action: 'SETTINGS_UPDATE',
    entity: 'WebsiteSettings',
    details: 'Updated festival countdown date to Sept 7, 2026',
    createdAt: new Date(),
  },
];

let mockWebsiteSettings = {
  heroTitle: 'VIGHNAHARTA PUJA COMMITTEE',
  heroSubtitle: 'GRAND GANESH UTSAV 2026',
  heroDescription: 'Join us in celebrating devotion, unity, and divine blessings at our annual Ganesh Mahotsav.',
  festivalYear: 2026,
  countdownDate: '2026-09-07T00:00:00.000Z',
  upiId: 'vighnaharta@upi',
  qrCodeUrl: '/assets/bannerimage.png',
  contactAddress: 'At:- Kadua, Post:- Bhagirathipur, Kamakhyanagar, Dhenkanal, Odisha',
  contactPhone: '+91 83277 04042',
  contactEmail: 'sahilkumarsahoo001@gmail.com',
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/919876543210',
  },
  instagramHandle: 'vighnaharta_puja',
  yearsOfCelebration: 12,
  annualDevotees: '50K',
  communityActivities: 25,
  activeVolunteers: 100,
  rolePermissions: {
    ADMIN: {
      FINANCE: true,
      CMS: true,
      SYSTEM: false,
    },
    COMMITTEE_MEMBER: {
      FINANCE: false,
      CMS: true,
      SYSTEM: false,
    },
  },
};

// WEBSITE SETTINGS
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await WebsiteSettings.findOne();
    if (settings) {
      return res.json({ success: true, data: settings });
    }
  } catch {
    // fallback
  }
  res.json({ success: true, data: mockWebsiteSettings });
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    mockWebsiteSettings = { ...mockWebsiteSettings, ...req.body };
    try {
      await WebsiteSettings.findOneAndUpdate({}, req.body, { upsert: true });
    } catch {}

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'WEBSITE_SETTINGS_UPDATE',
        'WebsiteSettings',
        '1',
        'Updated website settings'
      );
    }

    res.json({ success: true, message: 'Settings updated successfully', data: mockWebsiteSettings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// INSTAGRAM API FEED CONTROLLER
export const getInstagramFeed = async (req: Request, res: Response) => {
  const handle = (req.query.handle as string) || (mockWebsiteSettings as any).instagramHandle || 'vighnaharta_puja';
  const cleanHandle = handle.replace(/^@/, '').trim();
  const token = process.env.INSTAGRAM_ACCESS_TOKEN || (req.query.token as string);

  // 1. Official Instagram Graph API (If Token Provided)
  if (token) {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`
      );
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        const posts = data.data.map((item: any) => ({
          id: item.id,
          title: item.caption ? item.caption.split('\n')[0].substring(0, 60) : `@${cleanHandle} Post`,
          category: item.media_type === 'VIDEO' ? 'Reels' : 'Photos',
          mediaType: item.media_type === 'VIDEO' ? 'REEL' : 'IMAGE',
          imageUrl: item.thumbnail_url || item.media_url,
          mediaUrl: item.permalink || item.media_url,
          embedUrl: item.permalink ? `${item.permalink.replace(/\/$/, '')}/embed/` : item.media_url,
          caption: item.caption || '',
          timestamp: item.timestamp,
        }));
        return res.json({ success: true, handle: cleanHandle, count: posts.length, isLive: true, data: posts });
      }
    } catch (err) {
      console.error('Instagram Graph API fetch error:', err);
    }
  }

  // 2. Try Web Profile Public Fetch
  try {
    const igRes = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${cleanHandle}`, {
      headers: {
        'x-ig-app-id': '936619743392459',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (igRes.ok) {
      const json = await igRes.json();
      const user = json?.data?.user;
      const edges = user?.edge_owner_to_timeline_media?.edges;

      if (edges && Array.isArray(edges) && edges.length > 0) {
        const livePosts = edges.slice(0, 8).map((edge: any, index: number) => {
          const node = edge.node;
          const shortcode = node.shortcode;
          const captionText = node.edge_media_to_caption?.edges?.[0]?.node?.text || '';
          const isVideo = node.is_video;
          const imgUrl = node.display_url || node.thumbnail_src || '/assets/bannerimage.png';

          return {
            id: node.id || `ig_live_${shortcode}_${index}`,
            title: captionText ? captionText.split('\n')[0].substring(0, 60) : `@${cleanHandle} Post #${index + 1}`,
            category: isVideo ? 'Reels' : 'Photos',
            mediaType: isVideo ? 'REEL' : 'IMAGE',
            imageUrl: imgUrl,
            mediaUrl: `https://www.instagram.com/p/${shortcode}/`,
            embedUrl: `https://www.instagram.com/p/${shortcode}/embed/`,
            caption: captionText || `Latest post from @${cleanHandle} on Instagram.`,
            timestamp: node.taken_at_timestamp,
          };
        });

        return res.json({
          success: true,
          handle: cleanHandle,
          count: livePosts.length,
          isLive: true,
          data: livePosts,
        });
      }
    }
  } catch (err) {
    console.log('Public Instagram fetch note:', err);
  }

  // 3. Check MongoDB Gallery collection for admin added gallery reels/posts
  try {
    const dbItems = await Gallery.find({
      $or: [
        { category: 'Reels' },
        { mediaType: 'REEL' },
        { mediaUrl: { $regex: 'instagram.com', $options: 'i' } },
        { url: { $regex: 'instagram.com', $options: 'i' } }
      ]
    }).limit(8);

    if (dbItems && dbItems.length > 0) {
      const customPosts = dbItems.map((item: any) => {
        const rawUrl = item.mediaUrl || item.url || item.imageUrl || '';
        const isActualPost = /\/(p|reel|reels|tv)\/[A-Za-z0-9_-]+/.test(rawUrl);
        const postUrl = isActualPost
          ? rawUrl.split('?')[0].replace(/\/$/, '')
          : 'https://www.instagram.com/p/C-0XpTxy_2A';
        const embedUrl = item.embedUrl && /\/(p|reel|reels|tv)\//.test(item.embedUrl)
          ? item.embedUrl
          : `${postUrl}/embed/`;

        return {
          id: item._id || item.id,
          title: item.title || `@${cleanHandle} Festival Reel`,
          category: item.category || 'Reels',
          mediaType: item.mediaType || 'REEL',
          imageUrl: item.imageUrl || '/assets/cultural-night.png',
          mediaUrl: postUrl,
          embedUrl,
          caption: item.caption || item.title,
        };
      });
      return res.json({ success: true, handle: cleanHandle, count: customPosts.length, data: customPosts });
    }
  } catch (err) {
    console.error('Database gallery fetch error:', err);
  }

  // 4. Return dynamic mock reels from mockGallery
  const mockReels = mockGallery
    .filter((g) => g.mediaType === 'REEL' || g.category === 'Reels')
    .map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      mediaType: g.mediaType,
      imageUrl: g.imageUrl,
      mediaUrl: g.mediaUrl,
      embedUrl: g.embedUrl,
      caption: g.caption,
    }));

  return res.json({ success: true, handle: cleanHandle, count: mockReels.length, data: mockReels });
};

export const resetSettings = async (req: AuthRequest, res: Response) => {
  try {
    mockWebsiteSettings = {
      heroTitle: 'VIGHNAHARTA PUJA COMMITTEE',
      heroSubtitle: 'GRAND GANESH UTSAV 2026',
      heroDescription: 'Join us in celebrating devotion, unity, and divine blessings at our annual Ganesh Mahotsav.',
      festivalYear: 2026,
      countdownDate: '2026-09-07T00:00:00.000Z',
      upiId: 'vighnaharta@upi',
      qrCodeUrl: '/assets/bannerimage.png',
      contactAddress: 'Main Mandap Grounds, Sector 4, City Center',
      contactPhone: '+91 98765 43210',
      contactEmail: 'info@vighnahartapujacommittee.org',
      socialLinks: {
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        youtube: 'https://youtube.com',
        whatsapp: 'https://wa.me/919876543210',
      },
      yearsOfCelebration: 12,
      annualDevotees: '50K',
      communityActivities: 25,
      activeVolunteers: 100,
    };
    try {
      await WebsiteSettings.deleteMany({});
    } catch {}

    if (req.user) {
      await logAudit(
        req.user.id,
        req.user.name,
        req.user.role,
        'WEBSITE_SETTINGS_RESET',
        'WebsiteSettings',
        '1',
        'Reset website settings to default'
      );
    }

    res.json({ success: true, message: 'Website settings reset to default', data: mockWebsiteSettings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// MEMBERS
export const getMembers = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const members = await CommitteeMember.find().sort({ displayOrder: 1 });
      return res.json({ success: true, data: members });
    }
  } catch {}
  res.json({ success: true, data: mockMembers });
};

export const createMember = async (req: AuthRequest, res: Response) => {
  const instagramId = req.body.instagramId || req.body.instagram || req.body.socialLinks?.instagram || '';
  const memberData = {
    ...req.body,
    image: req.body.image || req.body.photoUrl || '',
    instagramId,
    socialLinks: {
      ...(req.body.socialLinks || {}),
      instagram: instagramId,
    },
  };

  const newMember = {
    id: `mem_${Date.now()}`,
    ...memberData,
    displayOrder: mockMembers.length + 1,
    isActive: true,
  };

  try {
    const dbMember = await CommitteeMember.create(memberData);
    mockMembers.push(dbMember.toObject());
  } catch {
    mockMembers.push(newMember);
  }

  if (req.user) {
    await logAudit(
      req.user.id,
      req.user.name,
      req.user.role,
      'MEMBER_ADDED',
      'CommitteeMember',
      newMember.id,
      `Added member ${req.body.name}`
    );
  }

  res.status(201).json({ success: true, message: 'Committee member added', data: newMember });
};

export const deleteMember = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await CommitteeMember.findByIdAndDelete(id);
    }
    await CommitteeMember.deleteMany({ id });
  } catch {}
  mockMembers = mockMembers.filter((m) => m.id !== id && (m as any)._id !== id);

  if (req.user) {
    await logAudit(req.user.id, req.user.name, req.user.role, 'MEMBER_DELETED', 'CommitteeMember', id, `Deleted member ${id}`);
  }
  res.json({ success: true, message: 'Member deleted successfully' });
};

// EVENTS
export const getEvents = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const events = await Event.find().sort({ date: 1 });
      return res.json({ success: true, data: events });
    }
  } catch {}
  res.json({ success: true, data: mockEvents });
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  let createdId = `evt_${Date.now()}`;
  const newEvent = {
    id: createdId,
    ...req.body,
    status: req.body.status || 'UPCOMING',
  };

  try {
    const dbEvent = await Event.create(req.body);
    if (dbEvent && dbEvent._id) {
      createdId = dbEvent._id.toString();
      newEvent.id = createdId;
    }
    mockEvents.push(dbEvent.toObject());
  } catch {
    mockEvents.push(newEvent);
  }

  if (req.user) {
    await logAudit(
      req.user.id,
      req.user.name,
      req.user.role,
      'EVENT_CREATED',
      'Event',
      createdId,
      `Created event ${req.body.title}`
    );
  }

  res.status(201).json({ success: true, message: 'Event created successfully', data: newEvent });
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Event.findByIdAndUpdate(id, updateData, { new: true });
    }
  } catch {}

  const index = mockEvents.findIndex((e) => e.id === id || (e as any)._id === id);
  if (index !== -1) {
    mockEvents[index] = { ...mockEvents[index], ...updateData };
  }

  if (req.user) {
    await logAudit(req.user.id, req.user.name, req.user.role, 'EVENT_UPDATED', 'Event', id, `Updated event ${id}`);
  }

  res.json({ success: true, message: 'Event updated successfully', data: updateData });
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Event.findByIdAndDelete(id);
    }
    await Event.deleteMany({ id });
  } catch {}
  mockEvents = mockEvents.filter((e) => e.id !== id && (e as any)._id !== id);

  if (req.user) {
    await logAudit(req.user.id, req.user.name, req.user.role, 'EVENT_DELETED', 'Event', id, `Deleted event ${id}`);
  }
  res.json({ success: true, message: 'Event deleted successfully' });
};

// ANNOUNCEMENTS
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const annList = await Announcement.find({ published: true }).sort({ publishDate: -1 });
      return res.json({ success: true, data: annList });
    }
  } catch {}
  res.json({ success: true, data: mockAnnouncements });
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  const popupDays = Number(req.body.popupDurationDays || 3);
  const popupUntil = new Date(Date.now() + popupDays * 24 * 60 * 60 * 1000);
  let createdId = `ann_${Date.now()}`;

  const newAnn = {
    id: createdId,
    title: req.body.title,
    content: req.body.content || req.body.description || '',
    description: req.body.description || req.body.content || '',
    title_hi: req.body.title_hi || '',
    description_hi: req.body.description_hi || req.body.content_hi || '',
    content_hi: req.body.content_hi || req.body.description_hi || '',
    title_or: req.body.title_or || '',
    description_or: req.body.description_or || req.body.content_or || '',
    content_or: req.body.content_or || req.body.description_or || '',
    category: req.body.category || 'General',
    priority: req.body.priority || 'HIGH',
    isImportant: req.body.priority === 'HIGH' || req.body.isImportant === true,
    showPopup: req.body.showPopup === true,
    popupDurationDays: popupDays,
    popupUntil,
    imageUrl: req.body.imageUrl || req.body.image || '',
    published: true,
    publishDate: req.body.publishDate ? new Date(req.body.publishDate) : new Date(),
  };

  try {
    const dbAnn = await Announcement.create(newAnn);
    if (dbAnn && dbAnn._id) {
      createdId = dbAnn._id.toString();
      newAnn.id = createdId;
    }
    mockAnnouncements.unshift(dbAnn.toObject() as any);
  } catch {
    mockAnnouncements.unshift(newAnn);
  }

  if (req.user) {
    await logAudit(
      req.user.id,
      req.user.name,
      req.user.role,
      'ANNOUNCEMENT_CREATED',
      'Announcement',
      createdId,
      `Created announcement ${req.body.title}`
    );
  }

  res.status(201).json({ success: true, message: 'Announcement created successfully', data: newAnn });
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (updateData.popupDurationDays) {
    updateData.popupUntil = new Date(Date.now() + Number(updateData.popupDurationDays) * 24 * 60 * 60 * 1000);
  }

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Announcement.findByIdAndUpdate(id, updateData, { new: true });
    }
  } catch {}

  const index = mockAnnouncements.findIndex((a) => a.id === id || (a as any)._id === id);
  if (index !== -1) {
    mockAnnouncements[index] = { ...mockAnnouncements[index], ...updateData };
  }

  if (req.user) {
    await logAudit(req.user.id, req.user.name, req.user.role, 'ANNOUNCEMENT_UPDATED', 'Announcement', id, `Updated announcement ${id}`);
  }

  res.json({ success: true, message: 'Announcement updated successfully', data: updateData });
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Announcement.findByIdAndDelete(id);
    }
    await Announcement.deleteMany({ id });
  } catch {}
  mockAnnouncements = mockAnnouncements.filter((a) => a.id !== id && (a as any)._id !== id);

  if (req.user) {
    await logAudit(req.user.id, req.user.name, req.user.role, 'ANNOUNCEMENT_DELETED', 'Announcement', id, `Deleted announcement ${id}`);
  }
  res.json({ success: true, message: 'Announcement deleted successfully' });
};

// GALLERY
export const getGallery = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const gallery = await Gallery.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: gallery });
    }
  } catch (err) {
    console.error('getGallery error:', err);
  }
  res.json({ success: true, data: mockGallery });
};

export const createGalleryItem = async (req: AuthRequest, res: Response) => {
  const mediaUrl = req.body.mediaUrl || req.body.url || req.body.imageUrl || '/assets/bannerimage.png';
  const imageUrl = req.body.imageUrl || req.body.thumbnailUrl || mediaUrl;
  let createdId = `gal_${Date.now()}`;
  const newItem = {
    id: createdId,
    title: req.body.title,
    category: req.body.category || 'Puja',
    mediaType: req.body.mediaType || 'IMAGE',
    mediaUrl: mediaUrl,
    imageUrl: imageUrl,
    url: mediaUrl,
    embedUrl: req.body.embedUrl || mediaUrl,
    thumbnailUrl: imageUrl,
    caption: req.body.caption || req.body.title || '',
    albumName: req.body.albumName || 'Ganesh Utsav 2026',
    published: true,
  };

  let savedItem: any = newItem;

  try {
    const dbItem = await Gallery.create(newItem);
    if (dbItem && dbItem._id) {
      createdId = dbItem._id.toString();
      savedItem = dbItem.toObject();
      savedItem.id = createdId;
    }
    mockGallery.unshift(savedItem);
  } catch (err: any) {
    console.error('Gallery.create error:', err);
    mockGallery.unshift(newItem);
  }

  if (req.user) {
    await logAudit(
      req.user.id,
      req.user.name,
      req.user.role,
      'GALLERY_UPLOAD',
      'Gallery',
      createdId,
      `Uploaded media ${req.body.title}`
    );
  }

  res.status(201).json({ success: true, message: 'Media added to gallery', data: savedItem });
};

export const deleteGalleryItem = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Gallery.findByIdAndDelete(id);
    }
  } catch {}
  mockGallery = mockGallery.filter((g) => g.id !== id && (g as any)._id !== id);

  if (req.user) {
    await logAudit(req.user.id, req.user.name, req.user.role, 'GALLERY_DELETED', 'Gallery', id, `Deleted gallery item ${id}`);
  }
  res.json({ success: true, message: 'Media item deleted successfully' });
};

// INSTAGRAM / MEDIA THUMBNAIL PROXY
export const getProxyThumbnail = async (req: Request, res: Response) => {
  const { shortcode, url } = req.query;
  try {
    let targetShortcode = shortcode as string;
    if (!targetShortcode && url) {
      const match = (url as string).match(/\/(?:reel|reels|p|tv|share\/reel)\/([A-Za-z0-9_-]+)/);
      if (match) targetShortcode = match[1];
    }

    if (!targetShortcode) {
      return res.status(400).send('Shortcode or URL required');
    }

    const igUrl = `https://www.instagram.com/p/${targetShortcode}/media/?size=l`;
    const response = await fetch(igUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch Instagram thumbnail');
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24 hours

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (err: any) {
    console.error('getProxyThumbnail error:', err);
    return res.status(500).send('Error fetching thumbnail');
  }
};

// VOLUNTEERS
export const getVolunteers = async (req: AuthRequest, res: Response) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    if (volunteers && volunteers.length > 0) {
      return res.json({ success: true, data: volunteers });
    }
  } catch {}
  res.json({ success: true, data: mockVolunteers });
};

export const createVolunteer = async (req: Request, res: Response) => {
  let createdId = `vol_${Date.now()}`;
  const newVol = {
    id: createdId,
    ...req.body,
    status: 'NEW',
    createdAt: new Date(),
  };

  try {
    const dbVol = await Volunteer.create(newVol);
    if (dbVol && dbVol._id) {
      createdId = dbVol._id.toString();
      newVol.id = createdId;
    }
    mockVolunteers.unshift(dbVol.toObject() as any);
  } catch {
    mockVolunteers.unshift(newVol);
  }

  res.status(201).json({ success: true, message: 'Volunteer registration submitted!', data: newVol });
};

export const deleteVolunteer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Volunteer.findByIdAndDelete(id);
    }
  } catch {}
  mockVolunteers = mockVolunteers.filter((v) => v.id !== id && (v as any)._id !== id);
  res.json({ success: true, message: 'Volunteer deleted successfully' });
};

export const updateMember = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const instagramId = req.body.instagramId || req.body.instagram || req.body.socialLinks?.instagram || '';
  const updateData = {
    ...req.body,
    image: req.body.image || req.body.photoUrl || '',
    instagramId,
    socialLinks: {
      ...(req.body.socialLinks || {}),
      instagram: instagramId,
    },
  };

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await CommitteeMember.findByIdAndUpdate(id, updateData, { new: true });
    }
  } catch {}
  mockMembers = mockMembers.map((m) => (m.id === id || (m as any)._id === id ? { ...m, ...updateData } : m));
  res.json({ success: true, message: 'Member updated successfully', data: updateData });
};

export const updateGalleryItem = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const mediaUrl = req.body.mediaUrl || req.body.imageUrl || req.body.url;
  const updateData = {
    ...req.body,
    ...(mediaUrl ? { mediaUrl, imageUrl: mediaUrl, url: mediaUrl, embedUrl: req.body.embedUrl || mediaUrl } : {}),
  };

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Gallery.findByIdAndUpdate(id, updateData, { new: true });
    }
  } catch {}
  mockGallery = mockGallery.map((g) => (g.id === id || (g as any)._id === id ? { ...g, ...updateData } : g));

  if (req.user) {
    await logAudit(req.user.id, req.user.name, req.user.role, 'GALLERY_UPDATED', 'Gallery', id, `Updated media ${id}`);
  }

  res.json({ success: true, message: 'Gallery item updated successfully', data: updateData });
};

export const updateVolunteer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Volunteer.findByIdAndUpdate(id, req.body);
    }
  } catch {}
  mockVolunteers = mockVolunteers.map((v) => (v.id === id || (v as any)._id === id ? { ...v, ...req.body } : v));
  res.json({ success: true, message: 'Volunteer updated successfully' });
};

// NEWSLETTER SUBSCRIBERS
let mockSubscribers: any[] = [
  { id: 'sub_1', email: 'devotee.rahul@gmail.com', isActive: true, subscribedAt: new Date('2026-08-01') },
  { id: 'sub_2', email: 'sharma.pujari@yahoo.in', isActive: true, subscribedAt: new Date('2026-08-10') },
  { id: 'sub_3', email: 'anita.dash@hotmail.com', isActive: true, subscribedAt: new Date('2026-08-18') },
];

export const getSubscribers = async (req: AuthRequest, res: Response) => {
  try {
    const list = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    if (list && list.length > 0) {
      return res.json({ success: true, data: list });
    }
  } catch {}
  res.json({ success: true, data: mockSubscribers });
};

export const createSubscriber = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }

  let createdId = `sub_${Date.now()}`;
  const newSub = {
    id: createdId,
    email: email.toLowerCase().trim(),
    isActive: true,
    subscribedAt: new Date(),
  };

  try {
    const dbSub = await NewsletterSubscriber.create(newSub);
    if (dbSub && dbSub._id) {
      createdId = dbSub._id.toString();
      newSub.id = createdId;
    }
    mockSubscribers.unshift(dbSub.toObject() as any);
  } catch {
    const existing = mockSubscribers.find((s) => s.email === newSub.email);
    if (!existing) {
      mockSubscribers.unshift(newSub);
    }
  }

  res.status(201).json({ success: true, message: 'Subscribed successfully to festival updates!', data: newSub });
};

export const deleteSubscriber = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await NewsletterSubscriber.findByIdAndDelete(id);
    }
  } catch {}
  mockSubscribers = mockSubscribers.filter((s) => s.id !== id && (s as any)._id !== id);

  if (req.user) {
    await logAudit(req.user.id, req.user.name, req.user.role, 'SUBSCRIBER_DELETED', 'NewsletterSubscriber', id, `Removed subscriber ${id}`);
  }
  res.json({ success: true, message: 'Subscriber deleted successfully' });
};

// AUDIT LOGS
export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: mockAuditLogs });
};
