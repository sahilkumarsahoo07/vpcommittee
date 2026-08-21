import type { EventItem, GalleryItem, AnnouncementItem, CommunityStat } from '../types';

export const FESTIVAL_EVENTS: EventItem[] = [
  {
    id: '1',
    date: '2026-08-25',
    dayMonth: '25 AUG',
    title: 'Ganesh Sthapana',
    time: '08:00 AM',
    location: 'Main Vighnaharta Pandal',
    description: 'Grand Vedic Pran Pratishtha rituals and welcoming of Lord Ganesha idol with Dhol Tasha beating.',
    category: 'Pooja'
  },
  {
    id: '2',
    date: '2026-08-26',
    dayMonth: '26 AUG',
    title: 'Morning Aarti',
    time: '07:30 AM',
    location: 'Main Vighnaharta Pandal',
    description: 'Divine morning Aarti, chanting of Ganesha Stotram, and offering of fresh Modaks.',
    category: 'Aarti'
  },
  {
    id: '3',
    date: '2026-08-26',
    dayMonth: '26 AUG',
    title: 'Cultural Program',
    time: '07:00 PM',
    location: 'Pandal Open Air Stage',
    description: 'Classical devotional music concerts, Lavani & folk dance performances by renowned community artists.',
    category: 'Cultural'
  },
  {
    id: '4',
    date: '2026-08-27',
    dayMonth: '27 AUG',
    title: 'Maha Prasad',
    time: '12:30 PM',
    location: 'Bhog Dining Hall',
    description: 'Grand community feast serving traditional pure sattvic Maha Prasad & sweet Ukadiche Modak to 10,000+ devotees.',
    category: 'Prasad'
  },
  {
    id: '5',
    date: '2026-08-29',
    dayMonth: '29 AUG',
    title: 'Visarjan',
    time: '04:00 PM',
    location: 'Visarjan Ghat Procession',
    description: 'Grand farewell procession with Gulal, flowers, Dhol Tasha pathak, and Eco-friendly Ganesha Visarjan ceremony.',
    category: 'Visarjan'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Vighnaharta Divine Idol',
    category: 'Idol',
    imageUrl: '/assets/main-ganesha.png',
    caption: 'The majestic 15-foot eco-friendly Ganesha idol installed at Vighnaharta Pandal.'
  },
  {
    id: 'g2',
    title: 'Grand Evening Maha Aarti',
    category: 'Aarti',
    imageUrl: '/assets/maha-aarti.png',
    caption: 'Devotees illuminating 108 golden brass diyas during the evening Maha Aarti.'
  },
  {
    id: 'g3',
    title: 'Community Maha Prasad Bhog',
    category: 'Prasad',
    imageUrl: '/assets/mahaprasad.png',
    caption: 'Freshly prepared traditional Ukadiche Modaks offered during Mahaprasad.'
  },
  {
    id: 'g4',
    title: 'Cultural Music Night',
    category: 'Cultural',
    imageUrl: '/assets/cultural-night.png',
    caption: 'Enchanting classical dance performance on the illuminated pandal stage.'
  },
  {
    id: 'g5',
    title: 'Visarjan Miravand & Gulal',
    category: 'Visarjan',
    imageUrl: '/assets/visarjan.png',
    caption: 'Joyous celebration and drum beats during the Ganesha Visarjan procession.'
  },
  {
    id: 'g6',
    title: 'Ornamental Shrine Sanctum',
    category: 'Pandal',
    imageUrl: '/assets/circular-ganesha.png',
    caption: 'Intricate golden carving & marigold decorations surrounding Bappa.'
  }
];

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'a1',
    title: 'Visarjan timing and route map announced',
    timeAgo: '2 hours ago',
    isRedBadge: true,
    content: 'The final Visarjan procession will begin at 4:00 PM from Main Gate via Central Road toward Lake Ghat. Volunteers please report at 3:00 PM.',
    date: 'Aug 21, 2026'
  },
  {
    id: 'a2',
    title: 'Maha Aarti starts at 7:30 PM today',
    timeAgo: 'Yesterday',
    isRedBadge: false,
    content: 'Join us tonight for the special 108-Diya Maha Aarti accompanied by live Shehnai and Dhol performance. All devotees are welcome.',
    date: 'Aug 20, 2026'
  },
  {
    id: 'a3',
    title: 'Cultural night registrations open for children',
    timeAgo: '2 days ago',
    isRedBadge: false,
    content: 'Registrations for the Kids Fancy Dress and Devotional Singing Contest are open till 25th August. Fill out the volunteer form or visit the Help Desk.',
    date: 'Aug 19, 2026'
  }
];

export const COMMUNITY_STATS: CommunityStat[] = [
  {
    id: 's1',
    value: 5,
    suffix: '+',
    label: 'Years of Celebration',
    iconName: 'Award'
  },
  {
    id: 's2',
    value: 10,
    suffix: 'K+',
    label: 'Devotees Welcomed',
    iconName: 'Users'
  },
  {
    id: 's3',
    value: 25,
    suffix: '+',
    label: 'Community Activities',
    iconName: 'HeartHandshake'
  },
  {
    id: 's4',
    value: 100,
    suffix: '+',
    label: 'Active Volunteers',
    iconName: 'Sparkles'
  }
];
