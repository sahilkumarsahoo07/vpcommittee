export interface EventItem {
  id: string;
  date: string;
  dayMonth: string;
  title: string;
  time: string;
  location: string;
  description: string;
  isLive?: boolean;
  category: 'Aarti' | 'Pooja' | 'Cultural' | 'Prasad' | 'Visarjan';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Idol' | 'Pandal' | 'Aarti' | 'Cultural' | 'Visarjan' | 'Prasad';
  imageUrl: string;
  caption: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  timeAgo: string;
  isRedBadge?: boolean;
  content: string;
  date: string;
}

export interface CommunityStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  iconName: string;
}

export interface VolunteerFormData {
  name: string;
  phone: string;
  email: string;
  area: string;
  interests: string[];
  message: string;
}

export interface DonationOption {
  amount: number;
  label: string;
}
