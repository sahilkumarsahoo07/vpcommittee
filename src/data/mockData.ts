import type { EventItem, GalleryItem, AnnouncementItem, CommunityStat } from '../types';
import type { Language } from '../context/LanguageContext';

export const FESTIVAL_EVENTS_DATA: Record<Language, EventItem[]> = {
  hi: [
    {
      id: '1',
      date: '2026-08-25',
      dayMonth: '25 अगस्त',
      title: 'गणेश स्थापना',
      time: 'प्रातः 08:00 बजे',
      location: 'मुख्य विघ्नहर्ता पंडाल',
      description: 'भव्य वैदिक प्राण प्रतिष्ठा अनुष्ठान एवं ढोल ताशा के साथ भगवान गणेश की मूर्ति का भव्य स्वागत।',
      category: 'Pooja'
    },
    {
      id: '2',
      date: '2026-08-26',
      dayMonth: '26 अगस्त',
      title: 'प्रातः महा आरती',
      time: 'प्रातः 07:30 बजे',
      location: 'मुख्य विघ्नहर्ता पंडाल',
      description: 'दिव्य सुबह की आरती, गणेश स्तोत्रम पाठ, और ताजा उकडीचे मोदक का भोग।',
      category: 'Aarti'
    },
    {
      id: '3',
      date: '2026-08-26',
      dayMonth: '26 अगस्त',
      title: 'सांस्कृतिक संध्या',
      time: 'सायं 07:00 बजे',
      location: 'पंडाल ओपन एयर स्टेज',
      description: 'शास्त्रीय भक्ति संगीत संध्या, लावणी एवं प्रसिद्ध लोक कलाकारों द्वारा सांस्कृतिक प्रस्तुतियां।',
      category: 'Cultural'
    },
    {
      id: '4',
      date: '2026-08-27',
      dayMonth: '27 अगस्त',
      title: 'महाप्रसाद महाभोज',
      time: 'दोपहर 12:30 बजे',
      location: 'भोग भोजन कक्ष',
      description: '१०,०००+ श्रद्धालुओं के लिए पारंपरिक शुद्ध सात्विक महाप्रसाद एवं मोदक का विशाल वितरण।',
      category: 'Prasad'
    },
    {
      id: '5',
      date: '2026-08-29',
      dayMonth: '29 अगस्त',
      title: 'भव्य विसर्जन यात्रा',
      time: 'सायं 04:00 बजे',
      location: 'विसर्जन घाट शोभायात्रा',
      description: 'गुलाल, पुष्पवर्षा, ढोल ताशा पथक और पर्यावरण-अनुकूल बाप्पा विसर्जन विदाई यात्रा।',
      category: 'Visarjan'
    }
  ],

  or: [
    {
      id: '1',
      date: '2026-08-25',
      dayMonth: '୨୫ ଅଗଷ୍ଟ',
      title: 'ଗଣେଶ ସ୍ଥାପନା',
      time: 'ସକାଳ ୦୮:୦୦',
      location: 'ମୁଖ୍ୟ ବିଘ୍ନହର୍ତ୍ତା ମଣ୍ଡପ',
      description: 'ବୈଦିକ ମନ୍ତ୍ରୋଚାରଣ, ପ୍ରାଣ ପ୍ରତିଷ୍ଠା ନୀତି ଓ ଘଣ୍ଟ ତୂରୀ ସହ ପ୍ରଭୁ ଗଣେଶଙ୍କ ମୂର୍ତ୍ତି ସ୍ଥାପନ।',
      category: 'Pooja'
    },
    {
      id: '2',
      date: '2026-08-26',
      dayMonth: '୨୬ ଅଗଷ୍ଟ',
      title: 'ପ୍ରାତଃ ମହା ଆରତୀ',
      time: 'ସକାଳ ୦୭:୩୦',
      location: 'ମୁଖ୍ୟ ବିଘ୍ନହର୍ତ୍ତା ମଣ୍ଡପ',
      description: 'ପ୍ରଭୁଙ୍କ ମଞ୍ଜୁଳ ଆରତୀ, ଗଣେଶ ଷ୍ଟୋତ୍ର ପାଠ ଓ ସଜ ତିଆରି ମୋଦକ ଭୋଗ ଅର୍ପଣ।',
      category: 'Aarti'
    },
    {
      id: '3',
      date: '2026-08-26',
      dayMonth: '୨୬ ଅଗଷ୍ଟ',
      title: 'ସାଂସ୍କୃତିକ ସନ୍ଧ୍ୟା',
      time: 'ସନ୍ଧ୍ୟା ୦୭:୦୦',
      location: 'ମଣ୍ଡପ ମୁକ୍ତାକାଶ ମଞ୍ଚ',
      description: 'ଶାସ୍ତ୍ରୀୟ ଭକ୍ତି ସଙ୍ଗୀତ, ଓଡ଼ିଶୀ ଓ ଲୋକନୃତ୍ୟର ମନୋରମ ସାଂସ୍କୃତିକ କାର୍ଯ୍ୟକ୍ରମ।',
      category: 'Cultural'
    },
    {
      id: '4',
      date: '2026-08-27',
      dayMonth: '୨୭ ଅଗଷ୍ଟ',
      title: 'ମହାପ୍ରସାଦ ସେବନ',
      time: 'ମଧ୍ୟାହ୍ନ ୧୨:୩୦',
      location: 'ମହାପ୍ରସାଦ ଭୋଜନାଳୟ',
      description: '୧୦,୦୦୦ରୁ ଉର୍ଦ୍ଧ୍ୱ ଶ୍ରଦ୍ଧାଳୁଙ୍କ ପାଇଁ ଶୁଦ୍ଧ ସାତ୍ତ୍ୱିକ ମହାପ୍ରସାଦ ଓ ମୋଦକ ବଣ୍ଟନ।',
      category: 'Prasad'
    },
    {
      id: '5',
      date: '2026-08-29',
      dayMonth: '୨୯ ଅଗଷ୍ଟ',
      title: 'ଭବ୍ୟ ବିସର୍ଜନ ଶୋଭାଯାତ୍ରା',
      time: 'ଅପରାହ୍ନ ୦୪:୦୦',
      location: 'ବିସର୍ଜନ ଘାଟ ଶୋଭାଯାତ୍ରା',
      description: 'ଅବୀର ଖେଳ, ପୁଷ୍ପବୃଷ୍ଟି, ନାମ ସଙ୍କୀର୍ତ୍ତନ ଓ ପରିବେଶ ଅନୁକୂଳ ଗଣେଶ ବିସର୍ଜନ।',
      category: 'Visarjan'
    }
  ],

  en: [
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
      description: 'Classical devotional music concerts, dance performances by renowned community artists.',
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
  ]
};

export const GALLERY_ITEMS_DATA: Record<Language, GalleryItem[]> = {
  hi: [
    {
      id: 'g1',
      title: 'विघ्नहर्ता दिव्य प्रतिमा',
      category: 'Idol',
      imageUrl: '/assets/main-ganesha.png',
      caption: 'विघ्नहर्ता पंडाल में स्थापित १५ फीट की भव्य पर्यावरण-अनुकूल गणेश प्रतिमा।'
    },
    {
      id: 'g2',
      title: 'संध्या महा आरती',
      category: 'Aarti',
      imageUrl: '/assets/maha-aarti.png',
      caption: 'संध्या महा आरती के दौरान १०८ पीतल के दीयों से जगमगाते श्रद्धालु।'
    },
    {
      id: 'g3',
      title: 'महाप्रसाद भोग',
      category: 'Prasad',
      imageUrl: '/assets/mahaprasad.png',
      caption: 'महाप्रसाद वितरण के दौरान अर्पित ताजे उकडीचे मोदक।'
    },
    {
      id: 'g4',
      title: 'सांस्कृतिक संगीत संध्या',
      category: 'Cultural',
      imageUrl: '/assets/cultural-night.png',
      caption: 'रोशन मंच पर कलाकारों द्वारा शास्त्रीय नृत्य की दिव्य प्रस्तुति।'
    },
    {
      id: 'g5',
      title: 'विसर्जन शोभायात्रा एवं गुलाल',
      category: 'Visarjan',
      imageUrl: '/assets/visarjan.png',
      caption: 'गणेश विसर्जन यात्रा के दौरान ढोल-नगाड़ों और गुलाल संग उत्सव।'
    },
    {
      id: 'g6',
      title: 'स्वर्ण अलंकृत गर्भगृह',
      category: 'Pandal',
      imageUrl: '/assets/circular-ganesha.png',
      caption: 'बाप्पा के चारों ओर सुंदर गेंदे के फूलों और स्वर्ण नक्काशीदार सजावट।'
    }
  ],

  or: [
    {
      id: 'g1',
      title: 'ବିଘ୍ନହର୍ତ୍ତା ଦିବ୍ୟ ମୂର୍ତ୍ତି',
      category: 'Idol',
      imageUrl: '/assets/main-ganesha.png',
      caption: 'ବିଘ୍ନହର୍ତ୍ତା ମଣ୍ଡପରେ ବିରାଜିତ ୧୫ ଫୁଟ ଉଚ୍ଚର ମନୋରମ ପରିବେଶ-ଅନୁକୂଳ ଗଣେଶ ପ୍ରତିମା।'
    },
    {
      id: 'g2',
      title: 'ସନ୍ଧ୍ୟା ମହା ଆରତୀ',
      category: 'Aarti',
      imageUrl: '/assets/maha-aarti.png',
      caption: 'ସନ୍ଧ୍ୟା ମହା ଆରତୀ ସମୟରେ ୧୦୮ ଦୀପରେ ଆଲୋକିତ ମଣ୍ଡପ ଓ ଭକ୍ତଗଣ।'
    },
    {
      id: 'g3',
      title: 'ମହାପ୍ରସାଦ ସେବନ',
      category: 'Prasad',
      imageUrl: '/assets/mahaprasad.png',
      caption: 'ପ୍ରଭୁଙ୍କ ନିକଟରେ ସଜ ଅର୍ପିତ ସ୍ୱାଦିଷ୍ଟ ମୋଦକ ଓ ମହାପ୍ରସାଦ।'
    },
    {
      id: 'g4',
      title: 'ସାଂସ୍କୃତିକ ନୃତ୍ୟ ସନ୍ଧ୍ୟା',
      category: 'Cultural',
      imageUrl: '/assets/cultural-night.png',
      caption: 'ଝଲସୁଥିବା ରଙ୍ଗମଞ୍ଚରେ କଳାକାରମାନଙ୍କ ଦ୍ୱାରା ଶାସ୍ତ୍ରୀୟ ନୃତ୍ୟ ପରିବେଷଣ।'
    },
    {
      id: 'g5',
      title: 'ବିସର୍ଜନ ଶୋଭାଯାତ୍ରା',
      category: 'Visarjan',
      imageUrl: '/assets/visarjan.png',
      caption: 'ବାଜା, ରଙ୍ଗ-ଅବୀର ଓ ଆନନ୍ଦ ଉଲ୍ଲାସ ସହ ପ୍ରଭୁଙ୍କ ବିସର୍ଜନ ଶୋଭାଯାତ୍ରା।'
    },
    {
      id: 'g6',
      title: 'ସୁବର୍ଣ୍ଣ ଆଲୋକିତ ମଣ୍ଡପ',
      category: 'Pandal',
      imageUrl: '/assets/circular-ganesha.png',
      caption: 'ପ୍ରଭୁ ଗଣେଶଙ୍କ ସୁନ୍ଦର ଗେଣ୍ଡୁ ଫୁଲ ମାଳ ଓ ସ୍ୱର୍ଣ୍ଣିମ ସଜାବଟ।'
    }
  ],

  en: [
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
  ]
};

export const ANNOUNCEMENTS_DATA: Record<Language, AnnouncementItem[]> = {
  hi: [
    {
      id: 'a1',
      title: 'विसर्जन का समय और मार्ग घोषित',
      timeAgo: '२ घंटे पहले',
      isRedBadge: true,
      content: 'अंतिम विसर्जन यात्रा सायं ४:०० बजे मुख्य द्वार से सेंट्रल रोड होते हुए झील घाट की ओर शुरू होगी। स्वयंसेवक कृपया ३:०० बजे रिपोर्ट करें।',
      date: '२१ अगस्त २०२६'
    },
    {
      id: 'a2',
      title: 'महा आरती आज सायं ७:३० बजे',
      timeAgo: 'कल',
      isRedBadge: false,
      content: 'विशेष १०८-दीपक महा आरती में शामिल हों। शहनाई और ढोल की प्रस्तुतियां रहेंगी। सभी श्रद्धालुओं का स्वागत है।',
      date: '२० अगस्त २०२६'
    },
    {
      id: 'a3',
      title: 'बच्चों के लिए सांस्कृतिक प्रतियोगिता पंजीकरण खुला',
      timeAgo: '२ दिन पहले',
      isRedBadge: false,
      content: 'फैंसी ड्रेस एवं भक्ति गायन प्रतियोगिता का पंजीकरण २५ अगस्त तक खुला है। फॉर्म भरें या हेल्प डेस्क पर आएं।',
      date: '१९ अगस्त २०२६'
    }
  ],

  or: [
    {
      id: 'a1',
      title: 'ବିସର୍ଜନ ସମୟ ଓ ରାସ୍ତା ସୂଚୀ ଘୋଷଣା',
      timeAgo: '୨ ଘଣ୍ଟା ପୂର୍ବରୁ',
      isRedBadge: true,
      content: 'ଚୂଡ଼ାନ୍ତ ବିସର୍ଜନ ଶୋଭାଯାତ୍ରା ଅପରାହ୍ନ ୪:୦୦ରେ ମୁଖ୍ୟ ଗେଟ୍‌ରୁ ବାହାରି ନଦୀ / ପୁଷ୍କରିଣୀ ଘାଟ ଅଭିମୁଖେ ଯିବ। ସ୍ୱେଚ୍ଛାସେବୀମାନେ ୩:୦୦ରେ ଉପସ୍ଥିତ ରହନ୍ତୁ।',
      date: '୨୧ ଅଗଷ୍ଟ ୨୦୨୬'
    },
    {
      id: 'a2',
      title: 'ମହା ଆରତୀ ଆଜି ସନ୍ଧ୍ୟା ୭:୩୦ରେ',
      timeAgo: 'ଗତକାଲି',
      isRedBadge: false,
      content: 'ଆଜି ସନ୍ଧ୍ୟାରେ ୧୦୮ ଦୀପ ମହା ଆରତୀ ଓ ମନୋଜ୍ଞ ବାଜା-ସଙ୍କୀର୍ତ୍ତନରେ ଯୋଗଦିଅନ୍ତୁ। ସମସ୍ତ ଶ୍ରଦ୍ଧାଳୁଙ୍କୁ ସ୍ୱାଗତ।',
      date: '୨୦ ଅଗଷ୍ଟ ୨୦୨୬'
    },
    {
      id: 'a3',
      title: 'ଶିଶୁ ସାଂସ୍କୃତିକ ପ୍ରତିଯୋଗିତା ପଞ୍ଜୀକରଣ ଚାଲିଛି',
      timeAgo: '୨ ଦିନ ପୂର୍ବରୁ',
      isRedBadge: false,
      content: 'ଶିଶୁମାନଙ୍କ ଭକ୍ତି ସଙ୍ଗୀତ ଓ ବେଶଭୂଷା ପ୍ରତିଯୋଗିତା ପାଇଁ ପଞ୍ଜୀକରଣ ୨୫ ଅଗଷ୍ଟ ପର୍ଯ୍ୟନ୍ତ ଖୋଲା ଅଛି।',
      date: '୧୯ ଅଗଷ୍ଟ ୨୦୨୬'
    }
  ],

  en: [
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
  ]
};

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
    label: 'Devotees',
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
    label: 'Volunteers',
    iconName: 'Sparkles'
  }
];

// Helper export fallback for static references
export const FESTIVAL_EVENTS = FESTIVAL_EVENTS_DATA.hi;
export const GALLERY_ITEMS = GALLERY_ITEMS_DATA.hi;
export const ANNOUNCEMENTS = ANNOUNCEMENTS_DATA.hi;
