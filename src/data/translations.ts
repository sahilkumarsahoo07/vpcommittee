import type { Language } from '../context/LanguageContext';

export interface TranslationSchema {
  // Nav
  nav: {
    home: string;
    about: string;
    events: string;
    gallery: string;
    donate: string;
    contact: string;
    joinUs: string;
    adminLogin: string;
  };
  // Hero
  hero: {
    shloka: string;
    titleLine1: string;
    titleLine2: string;
    slogan: string;
    subtitle: string;
    exploreBtn: string;
    donateBtn: string;
  };
  // Countdown
  countdown: {
    title: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  // About
  about: {
    tag: string;
    title: string;
    quote: string;
    desc: string;
    btn: string;
  };
  // Timeline / Schedule
  timeline: {
    tag: string;
    liveBadge: string;
    liveTitle: string;
    liveTime: string;
    pandalLocTag: string;
    pandalName: string;
    viewLocBtn: string;
  };
  // Feature Cards
  featureCards: {
    galleryTitle: string;
    gallerySubtitle: string;
    galleryBtn: string;
    donateTitle: string;
    donateSubtitle: string;
    donateBtn: string;
    joinTitle: string;
    joinSubtitle: string;
    joinBtn: string;
    updatesTitle: string;
    updatesSubtitle: string;
    updatesBtn: string;
  };
  // Action Row
  actionRow: {
    supportTitle: string;
    supportDesc: string;
    customPlaceholder: string;
    donateBtn: string;
    secureText: string;
    stayConnectedTitle: string;
    stayConnectedDesc: string;
    emailPlaceholder: string;
    subscribeBtn: string;
    subscribingBtn: string;
    privacyText: string;
    volunteerTitle: string;
    wantToVolunteer: string;
    volunteerList: string[];
    joinUsBtn: string;
  };
  // Location & Stats
  location: {
    tag: string;
    pandalTitle: string;
    address: string;
    landmark: string;
    directionsBtn: string;
    communityTitle: string;
    stats: {
      years: string;
      devotees: string;
      activities: string;
      volunteers: string;
    };
  };
  // Announcements
  announcements: {
    tag: string;
    title: string;
    modalTag: string;
    closeBtn: string;
    dontShowAgain: string;
    activeFor: string;
    days: string;
    postedJustNow: string;
    postedHoursAgo: string;
    postedDaysAgo: string;
    categories: Record<string, string>;
  };
  // Gallery
  gallery: {
    tag: string;
    title: string;
    categories: {
      All: string;
      Idol: string;
      Aarti: string;
      Prasad: string;
      Cultural: string;
      Visarjan: string;
    };
  };
  // Devotional Floating
  devotional: {
    chantBtn: string;
    toastShloka: string;
    toastMsg: string;
  };
  // Footer
  footer: {
    slogan: string;
    desc: string;
    quickLinksTitle: string;
    contactTitle: string;
    scanDonateTitle: string;
    address: string;
    rights: string;
    madeWith: string;
  };
  // Donation Modal
  donationModal: {
    title: string;
    subtitle: string;
    selectAmount: string;
    customAmount: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    paymentMethod: string;
    upiMethod: string;
    cardMethod: string;
    payBtn: string;
    processingBtn: string;
    securityBadge: string;
    successBadge: string;
    successShloka: string;
    thankYou: string;
    blessingMsg: string;
    receiptNo: string;
    doneBtn: string;
  };
  // Volunteer Modal
  volunteerModal: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    areaLabel: string;
    areaPlaceholder: string;
    helpLabel: string;
    interests: string[];
    msgLabel: string;
    msgPlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    welcomeMsg: string;
    contactNote: string;
    closeBtn: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  hi: {
    nav: {
      home: 'मुख्य पृष्ठ',
      about: 'हमारे बारे में',
      events: 'कार्यक्रम',
      gallery: 'गैलरी',
      donate: 'दान करें',
      contact: 'संपर्क करें',
      joinUs: 'हमारे साथ जुड़ें',
      adminLogin: 'एडमिन लॉगिन',
    },
    hero: {
      shloka: '॥ श्री गणेशाय नमः ॥',
      titleLine1: 'विघ्नहर्ता',
      titleLine2: 'पूजा समिति',
      slogan: 'गणपति बप्पा मोरया!',
      subtitle: 'श्रद्धा, एकता और परंपरा का पावन उत्सव',
      exploreBtn: 'उत्सव देखें',
      donateBtn: 'दान करें',
    },
    countdown: {
      title: 'गणेश उत्सव २०२६',
      days: 'दिन',
      hours: 'घंटे',
      minutes: 'मिनट',
      seconds: 'सेकंड',
    },
    about: {
      tag: 'हमारी कहानी',
      title: 'विघ्नहर्ता पूजा समिति',
      quote: '“समुदाय द्वारा, समुदाय के लिए आयोजित एक भव्य उत्सव।”',
      desc: 'हर साल हम भक्ति, संस्कृति, संगीत और एकजुटता के साथ भगवान गणेश का उत्सव मनाने के लिए एक साथ आते हैं। एकता, सेवा और समृद्ध भारतीय वैदिक विरासत के संरक्षण के आदर्शों पर स्थापित, विघ्नहर्ता पूजा समिति परिवारों और भक्तों को बाप्पा की दिव्य उपस्थिति का अनुभव कराने के लिए एक साथ लाती है।',
      btn: 'हमारी कहानी पढ़ें',
    },
    timeline: {
      tag: 'उत्सव अनुसूची',
      liveBadge: 'लाइव / आज',
      liveTitle: 'महा आरती',
      liveTime: 'आज • शाम ०७:३० बजे',
      pandalLocTag: 'पंडाल स्थान',
      pandalName: 'विघ्नहर्ता पूजा मुख्य मण्डप',
      viewLocBtn: 'स्थान देखें',
    },
    featureCards: {
      galleryTitle: 'गैलरी',
      gallerySubtitle: 'भक्ति और आस्था के दिव्य क्षण',
      galleryBtn: 'गैलरी देखें',
      donateTitle: 'दान करें',
      donateSubtitle: 'उत्सव और समाज सेवा का समर्थन करें',
      donateBtn: 'दान करें',
      joinTitle: 'जुड़ें',
      joinSubtitle: 'हमारे मिशन का हिस्सा बनें',
      joinBtn: 'अभी जुड़ें',
      updatesTitle: 'अपडेट्स',
      updatesSubtitle: 'नवीनतम समाचार और घोषणाएं',
      updatesBtn: 'सभी देखें',
    },
    actionRow: {
      supportTitle: 'विघ्नहर्ता का सहयोग करें',
      supportDesc: 'आपका योगदान हमें भव्य उत्सव और सामुदायिक सेवा गतिविधियों का आयोजन करने में मदद करता है।',
      customPlaceholder: 'कस्टम राशि दर्ज करें',
      donateBtn: 'दान करें',
      secureText: 'सुरक्षित • सरल • पारदर्शी',
      stayConnectedTitle: 'जुड़े रहें',
      stayConnectedDesc: 'उत्सव की जानकारी, कार्यक्रम का समय, घोषणाएं और समाचार तुरंत प्राप्त करें।',
      emailPlaceholder: 'अपना ईमेल दर्ज करें',
      subscribeBtn: 'सदस्यता लें',
      subscribingBtn: 'सदस्यता ली जा रही है...',
      privacyText: 'हम आपकी गोपनीयता का पूर्ण सम्मान करते हैं।',
      volunteerTitle: 'उत्सव का हिस्सा बनें',
      wantToVolunteer: 'क्या आप स्वयंसेवक बनना चाहते हैं?',
      volunteerList: [
        'स्वयंसेवक सेवा',
        'सजावट और पंडाल',
        'फोटोग्राफी और मीडिया',
        'सांस्कृतिक कार्यक्रम',
        'कार्यक्रम प्रबंधन',
      ],
      joinUsBtn: 'हमारे साथ जुड़ें',
    },
    location: {
      tag: 'हमारा पंडाल खोजें',
      pandalTitle: 'विघ्नहर्ता मुख्य पूजा पंडाल',
      address: 'At:- Kadua, Post:- Bhagirathipur, Kamakhyanagar, Dhenkanal, Odisha',
      landmark: 'लैंडमार्क: शिव मंदिर के पास • पार्किंग की उचित व्यवस्था',
      directionsBtn: 'दिशा-निर्देश प्राप्त करें',
      communityTitle: 'हमारा समुदाय',
      stats: {
        years: 'उत्सव के वर्ष',
        devotees: 'भक्तजन',
        activities: 'सामुदायिक गतिविधियां',
        volunteers: 'स्वयंसेवक',
      },
    },
    announcements: {
      tag: 'सूचनाएं और अपडेट',
      title: 'नवीनतम घोषणाएं',
      modalTag: 'आधिकारिक घोषणा',
      closeBtn: 'बंद करें',
      dontShowAgain: 'आज फिर न दिखाएं',
      activeFor: 'सक्रिय',
      days: 'दिन',
      postedJustNow: 'अभी-अभी पोस्ट किया गया',
      postedHoursAgo: 'घंटे पहले पोस्ट किया गया',
      postedDaysAgo: 'दिन पहले पोस्ट किया गया',
      categories: {
        Aarti: 'आरती',
        Volunteer: 'स्वयंसेवक',
        General: 'सामान्य',
        Urgent: 'अति आवश्यक',
        Event: 'कार्यक्रम',
      },
    },
    gallery: {
      tag: 'भक्ति के क्षण',
      title: 'हमारे उत्सव की पावन यादें',
      categories: {
        All: 'सभी',
        Idol: 'प्रतिमा',
        Aarti: 'आरती',
        Prasad: 'प्रसाद',
        Cultural: 'सांस्कृतिक',
        Visarjan: 'विसर्जन',
      },
    },
    devotional: {
      chantBtn: 'गणपती बप्पा मोरया!',
      toastShloka: '॥ ॐ गं गणपतये नमः ॥',
      toastMsg: 'गणपति बप्पा मोरया! बाप्पा आपको आनंद, उत्तम स्वास्थ्य और समृद्धि का आशीर्वाद दें।',
    },
    footer: {
      slogan: 'श्रद्धा • एकता • उत्सव',
      desc: 'भक्ति, वैदिक अनुष्ठानों, सांस्कृतिक कार्यक्रमों और सामुदायिक सेवा से भरपूर भव्य एवं पर्यावरण-अनुकूल गणेश उत्सव का आयोजन।',
      quickLinksTitle: 'त्वरित लिंक',
      contactTitle: 'संपर्क करें',
      scanDonateTitle: 'दान के लिए स्कैन करें',
      address: 'At:- Kadua, Post:- Bhagirathipur, Kamakhyanagar, Dhenkanal, Odisha',
      rights: '© २०२६ विघ्नहर्ता पूजा समिति। सर्वाधिकार सुरक्षित।',
      madeWith: 'Made by Sahil Kumar Sahoo',
    },
    donationModal: {
      title: 'विघ्नहर्ता का सहयोग करें',
      subtitle: 'गणेश उत्सव २०२६ और समाज सेवा में अपना पावन योगदान दें',
      selectAmount: 'दान राशि चुनें',
      customAmount: 'अन्य राशि दर्ज करें',
      nameLabel: 'आपका नाम',
      namePlaceholder: 'भक्त का नाम',
      phoneLabel: 'मोबाइल नंबर',
      phonePlaceholder: '१०-अंकीय फोन नंबर',
      paymentMethod: 'भुगतान विधि चुनें',
      upiMethod: 'UPI / QR स्कैन',
      cardMethod: 'कार्ड / नेटबैंकिंग',
      payBtn: 'भुगतान के लिए आगे बढ़ें',
      processingBtn: 'प्रोसेसिंग हो रही है...',
      securityBadge: '२५६-बिट एन्क्रिप्टेड • रसीद आपके फोन पर भेजी जाएगी',
      successBadge: 'दान सफलतापूर्वक प्राप्त हुआ',
      successShloka: '॥ ॐ गं गणपतये नमः ॥',
      thankYou: 'धन्यवाद!',
      blessingMsg: 'भगवान गणेश आप और आपके परिवार पर अपनी असीम कृपा, सुख और समृद्धि बनाए रखें!',
      receiptNo: 'रसीद संख्या:',
      doneBtn: 'संपन्न',
    },
    volunteerModal: {
      title: 'उत्सव का हिस्सा बनें',
      subtitle: 'गणेश उत्सव २०२६ के लिए स्वयंसेवक पंजीकरण करें',
      nameLabel: 'पूरा नाम *',
      namePlaceholder: 'अपना नाम दर्ज करें',
      phoneLabel: 'फोन नंबर *',
      phonePlaceholder: '१०-अंकीय मोबाइल',
      emailLabel: 'ईमेल पता',
      areaLabel: 'क्षेत्र / इलाका',
      areaPlaceholder: 'उदा. गणेश नगर',
      helpLabel: 'आप किस प्रकार सहायता करना चाहेंगे?',
      interests: [
        'स्वयंसेवक सेवा',
        'सजावट और पंडाल',
        'फोटोग्राफी और मीडिया',
        'सांस्कृतिक कार्यक्रम',
        'कार्यक्रम प्रबंधन',
        'महाप्रसाद वितरण',
      ],
      msgLabel: 'अतिरिक्त संदेश / उपलब्धता',
      msgPlaceholder: 'अपनी उपलब्धता या पूर्व स्वयंसेवक अनुभव के बारे में बताएं...',
      submitBtn: 'स्वयंसेवक आवेदन जमा करें',
      submittingBtn: 'पंजीकरण हो रहा है...',
      successTitle: 'पंजीकरण सफल!',
      welcomeMsg: 'विघ्नहर्ता सेवा टीम में आपका स्वागत है!',
      contactNote: 'हमारी समिति के स्वयंसेवक समन्वयक जल्द ही आपसे संपर्क करेंगे।',
      closeBtn: 'बंद करें',
    },
  },

  or: {
    nav: {
      home: 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
      about: 'ଆମ ବିଷୟରେ',
      events: 'କାର୍ଯ୍ୟକ୍ରମ',
      gallery: 'ଗ୍ୟାଲେରୀ',
      donate: 'ଦାନ କରନ୍ତୁ',
      contact: 'ସମ୍ପର୍କ କରନ୍ତୁ',
      joinUs: 'ଆମ ସହ ଯୋଡ଼ିହୁଅନ୍ତୁ',
      adminLogin: 'ଅଡମିନ୍ ଲଗଇନ୍',
    },
    hero: {
      shloka: '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥',
      titleLine1: 'ବିଘ୍ନହର୍ତ୍ତା',
      titleLine2: 'ପୂଜା କମିଟି',
      slogan: 'ଗଣପତି ବାପ୍ପା ମୋରିଆ!',
      subtitle: 'ଶ୍ରଦ୍ଧା, ଏକତା ଓ ପରମ୍ପରାର ପବିତ୍ର ମହାଉତ୍ସବ',
      exploreBtn: 'ଉତ୍ସବ ଦେଖନ୍ତୁ',
      donateBtn: 'ଦାନ କରନ୍ତୁ',
    },
    countdown: {
      title: 'ଗଣେଶ ଉତ୍ସବ ୨୦୨୬',
      days: 'ଦିନ',
      hours: 'ଘଣ୍ଟା',
      minutes: 'ମିନିଟ୍',
      seconds: 'ସେକେଣ୍ଡ',
    },
    about: {
      tag: 'ଆମର କାହାଣୀ',
      title: 'ବିଘ୍ନହର୍ତ୍ତା ପୂଜା କମିଟି',
      quote: '“ସମାଜ ଦ୍ୱାରା, ସମାଜ ପାଇଁ ଆୟୋଜିତ ଏକ ଭବ୍ୟ ମହାଉତ୍ସବ।”',
      desc: 'ପ୍ରତିବର୍ଷ ଆମେ ଭକ୍ତି, ସଂସ୍କୃତି, ସଙ୍ଗୀତ ଓ ଭ୍ରାତୃଭାବ ସହିତ ପ୍ରଭୁ ଗଣେଶଙ୍କ ପୂଜା ମହାଉତ୍ସବ ପାଳନ କରିବା ପାଇଁ ଏକାଠି ହୋଇଥାଉ। ଏକତା, ସେବା ଓ ସନାତନ ବୈଦିକ ସଂସ୍କୃତିର ସୁରକ୍ଷା ଉଦ୍ଦେଶ୍ୟରେ ଗଠିତ ବିଘ୍ନହର୍ତ୍ତା ପୂଜା କମିଟି ସମସ୍ତ ଭକ୍ତ ଓ ପରିବାରବର୍ଗଙ୍କୁ ପ୍ରଭୁଙ୍କ ଦିବ୍ୟ ଆଶୀର୍ବାଦ ପ୍ରାପ୍ତ କରିବାରେ ଏକତ୍ରିତ କରେ।',
      btn: 'ଆମ ବିଷୟରେ ଜାଣନ୍ତୁ',
    },
    timeline: {
      tag: 'ଉତ୍ସବ ସୂଚୀ',
      liveBadge: 'ଲାଇଭ୍ / ଆଜି',
      liveTitle: 'ମହା ଆରତୀ',
      liveTime: 'ଆଜି • ସନ୍ଧ୍ୟା ୦୭:୩୦',
      pandalLocTag: 'ମଣ୍ଡପ ସ୍ଥାନ',
      pandalName: 'ବିଘ୍ନହର୍ତ୍ତା ପୂଜା ମୁଖ୍ୟ ମଣ୍ଡପ',
      viewLocBtn: 'ସ୍ଥାନ ଦେଖନ୍ତୁ',
    },
    featureCards: {
      galleryTitle: 'ଗ୍ୟାଲେରୀ',
      gallerySubtitle: 'ଭକ୍ତି ଓ ବିଶ୍ୱାସର ପବିତ୍ର ମୁହୂର୍ତ୍ତ',
      galleryBtn: 'ଗ୍ୟାଲେରୀ ଦେଖନ୍ତୁ',
      donateTitle: 'ଦାନ କରନ୍ତୁ',
      donateSubtitle: 'ଉତ୍ସବ ଓ ସମାଜ ସେବାକୁ ସହଯୋଗ କରନ୍ତୁ',
      donateBtn: 'ଦାନ କରନ୍ତୁ',
      joinTitle: 'ଯୋଡ଼ିହୁଅନ୍ତୁ',
      joinSubtitle: 'ଆମ ପବିତ୍ର ସେବାର ଅଂଶ ହୁଅନ୍ତୁ',
      joinBtn: 'ଏବେ ଯୋଡ଼ିହୁଅନ୍ତୁ',
      updatesTitle: 'ଅପଡେଟ୍',
      updatesSubtitle: 'ସଦ୍ୟତମ ଖବର ଓ ଘୋଷଣା',
      updatesBtn: 'ସମସ୍ତ ଦେଖନ୍ତୁ',
    },
    actionRow: {
      supportTitle: 'ବିଘ୍ନହର୍ତ୍ତାଙ୍କୁ ସହଯୋଗ କରନ୍ତୁ',
      supportDesc: 'ଆପଣଙ୍କର ସହଯୋଗ ଆମକୁ ଏହି ମହାଉତ୍ସବ ଓ ସମାଜସେବା କାର୍ଯ୍ୟ ସଫଳ କରିବାରେ ସାହାଯ୍ୟ କରେ।',
      customPlaceholder: 'ଇଚ୍ଛାଧୀନ ପରିମାଣ ଲେଖନ୍ତୁ',
      donateBtn: 'ଦାନ କରନ୍ତୁ',
      secureText: 'ସୁରକ୍ଷିତ • ସରଳ • ସ୍ୱଚ୍ଛ',
      stayConnectedTitle: 'ଯୋଡ଼ି ହୋଇ ରୁହନ୍ତୁ',
      stayConnectedDesc: 'ଉତ୍ସବ ଅପଡେଟ୍, ସମୟସୂଚୀ, ଘୋଷଣା ଓ ସମାଚାର ତୁରନ୍ତ ପାଆନ୍ତୁ।',
      emailPlaceholder: 'ଆପଣଙ୍କ ଇମେଲ୍ ଦିଅନ୍ତୁ',
      subscribeBtn: 'ସବସ୍କ୍ରାଇବ୍ କରନ୍ତୁ',
      subscribingBtn: 'ସବସ୍କ୍ରାଇବ୍ ହେଉଛି...',
      privacyText: 'ଆମେ ଆପଣଙ୍କ ଗୋପନୀୟତାକୁ ସମ୍ମାନ ଦେଉ।',
      volunteerTitle: 'ଉତ୍ସବର ଅଂଶଗ୍ରହଣକାରୀ ହୁଅନ୍ତୁ',
      wantToVolunteer: 'ସ୍ୱେଚ୍ଛାସେବୀ ହେବାକୁ ଚାହାନ୍ତି କି?',
      volunteerList: [
        'ସ୍ୱେଚ୍ଛାସେବୀ ସେବା',
        'ସଜାବଟ ଓ ମଣ୍ଡପ',
        'ଫୋଟୋଗ୍ରାଫି ଓ ମିଡିଆ',
        'ସାଂସ୍କୃତିକ କାର୍ଯ୍ୟକ୍ରମ',
        'ଇଭେଣ୍ଟ ମ୍ୟାନେଜମେଣ୍ଟ',
      ],
      joinUsBtn: 'ଆମ ସହ ଯୋଡ଼ିହୁଅନ୍ତୁ',
    },
    location: {
      tag: 'ଆମର ମଣ୍ଡପ ଖୋଜନ୍ତୁ',
      pandalTitle: 'ବିଘ୍ନହର୍ତ୍ତା ମୁଖ୍ୟ ପୂଜା ମଣ୍ଡପ',
      address: 'At:- Kadua, Post:- Bhagirathipur, Kamakhyanagar, Dhenkanal, Odisha',
      landmark: 'ସ୍ଥଳचिହ୍ନ: ଶିବ ମନ୍ଦିର ନିକଟରେ • ପାର୍କିଂ ସୁବିଧା ଅଛି',
      directionsBtn: 'ରାସ୍ତା ଦେଖନ୍ତୁ',
      communityTitle: 'ଆମ ସମାଜ',
      stats: {
        years: 'ଉତ୍ସବର ବର୍ଷ',
        devotees: 'ଶ୍ରଦ୍ଧାଳୁ',
        activities: 'ସାମାଜିକ କାର୍ଯ୍ୟକ୍ରମ',
        volunteers: 'ସ୍ୱେଚ୍ଛାସେବୀ',
      },
    },
    announcements: {
      tag: 'ସୂଚନା ଓ ଅପଡେଟ୍',
      title: 'ସଦ୍ୟତମ ଘୋଷଣା',
      modalTag: 'ଅଫିସିଆଲ୍ ଘୋଷଣା',
      closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
      dontShowAgain: 'ଆଜି ଆଉ ଦେଖାନ୍ତୁ ନାହିଁ',
      activeFor: 'ସକ୍ରିୟ',
      days: 'ଦିନ',
      postedJustNow: 'ସଦ୍ୟ ପୋଷ୍ଟ୍ ହୋଇଛି',
      postedHoursAgo: 'ଘଣ୍ଟା ପୂର୍ବରୁ ପୋଷ୍ଟ୍ ହୋଇଛି',
      postedDaysAgo: 'ଦିନ ପୂର୍ବରୁ ପୋଷ୍ଟ୍ ହୋଇଛି',
      categories: {
        Aarti: 'ଆରତୀ',
        Volunteer: 'ସ୍ୱେଚ୍ଛାସେବୀ',
        General: 'ସାଧାରଣ',
        Urgent: 'ଜରୁରୀ',
        Event: 'କାର୍ଯ୍ୟକ୍ରମ',
      },
    },
    gallery: {
      tag: 'ଭକ୍ତିର ସୁବର୍ଣ୍ଣ ମୁହୂର୍ତ୍ତ',
      title: 'ଆମ ଉତ୍ସବର ମଧୁର ସ୍ମୃତି',
      categories: {
        All: 'ସମସ୍ତ',
        Idol: 'ମୂର୍ତ୍ତି',
        Aarti: 'ଆରତୀ',
        Prasad: 'ପ୍ରସାଦ',
        Cultural: 'ସାଂସ୍କୃତିକ',
        Visarjan: 'ବିସର୍ଜନ',
      },
    },
    devotional: {
      chantBtn: 'ଗଣପତି ବାପ୍ପା ମୋରିଆ!',
      toastShloka: '॥ ଓଁ ଗଂ ଗଣପତୟେ ନମଃ ॥',
      toastMsg: 'ଗଣପତି ବାପ୍ପା ମୋରିଆ! ପ୍ରଭୁ ଆପଣଙ୍କୁ ସୁଖ, ସମୃଦ୍ଧି ଓ ଉତ୍ତମ ସ୍ୱାସ୍ଥ୍ୟର ଆଶୀର୍ବାଦ ଦିଅନ୍ତୁ।',
    },
    footer: {
      slogan: 'ଶ୍ରଦ୍ଧା • ଏକତା • ଉତ୍ସବ',
      desc: 'ଭକ୍ତି, ବୈଦିକ ନୀତିକାନ୍ତି, ସାଂସ୍କୃତିକ କାର୍ଯ୍ୟକ୍ରମ ଓ ସମାଜସେବାରେ ପରିପୂର୍ଣ୍ଣ ସୁନ୍ଦର ଗଣେଶ ପୂଜା ମହାଉତ୍ସବ।',
      quickLinksTitle: 'ଲିଙ୍କ୍‌ସ',
      contactTitle: 'ସମ୍ପର୍କ କରନ୍ତୁ',
      scanDonateTitle: 'ଦାନ ପାଇଁ ସ୍କାନ୍ କରନ୍ତୁ',
      address: 'At:- Kadua, Post:- Bhagirathipur, Kamakhyanagar, Dhenkanal, Odisha',
      rights: '© ୨୦୨୬ ବିଘ୍ନହର୍ତ୍ତା ପୂଜା କମିଟି। ସମସ୍ତ ଅଧିକାର ସୁରକ୍ଷିତ।',
      madeWith: 'Made by Sahil Kumar Sahoo',
    },
    donationModal: {
      title: 'ବିଘ୍ନହର୍ତ୍ତାଙ୍କୁ ସହଯୋଗ କରନ୍ତୁ',
      subtitle: 'ଗଣେଶ ଉତ୍ସବ ୨୦୨୬ ଓ ସମାଜସେବାରେ ପବିତ୍ର ସହଯୋଗ କରନ୍ତୁ',
      selectAmount: 'ଦାନ ପରିମାଣ ବାଛନ୍ତୁ',
      customAmount: 'ଇଚ୍ଛାଧୀନ ପରିମାଣ ଲେଖନ୍ତୁ',
      nameLabel: 'ଆପଣଙ୍କ ନାମ',
      namePlaceholder: 'ଭକ୍ତଙ୍କ ନାମ',
      phoneLabel: 'ମୋବାଇଲ୍ ନମ୍ବର',
      phonePlaceholder: '୧୦-ଅଙ୍କ ବିଶିଷ୍ଟ ଫୋନ୍',
      paymentMethod: 'ପେମେଣ୍ଟ ପ୍ରଣାଳୀ ବାଛନ୍ତୁ',
      upiMethod: 'UPI / QR ସ୍କାନ୍',
      cardMethod: 'କାର୍ଡ / ନେଟ୍‌ବ୍ୟାଙ୍କିଂ',
      payBtn: 'ପେମେଣ୍ଟ କରନ୍ତୁ',
      processingBtn: 'ପେମେଣ୍ଟ ପ୍ରକ୍ରିୟା ଚାଲିଛି...',
      securityBadge: '୨୫୬-ବିଟ୍ ଏନକ୍ରିପ୍ଟେଡ୍ • ରସିଦ୍ ଫୋନ୍‌କୁ ପଠାଯିବ',
      successBadge: 'ଦାନ ସଫଳତାର ସହ ପ୍ରାପ୍ତ ହେଲା',
      successShloka: '॥ ଓଁ ଗଂ ଗଣପତୟେ ନମଃ ॥',
      thankYou: 'ଧନ୍ୟବାଦ!',
      blessingMsg: 'ପ୍ରଭୁ ଶ୍ରୀ ଗଣେଶ ଆପଣଙ୍କୁ ଓ ଆପଣଙ୍କ ପରିବାରକୁ ଅଶେଷ କୃପା, ଆରୋଗ୍ୟ ଓ ସମୃଦ୍ଧି ପ୍ରଦାନ କରନ୍ତୁ!',
      receiptNo: 'ରସିଦ୍ ନମ୍ବର:',
      doneBtn: 'ସମ୍ପୂର୍ଣ୍ଣ',
    },
    volunteerModal: {
      title: 'ଉତ୍ସବର ଅଂଶଗ୍ରହଣକାରୀ ହୁଅନ୍ତୁ',
      subtitle: 'ଗଣେଶ ଉତ୍ସବ ୨୦୨୬ ପାଇଁ ସ୍ୱେଚ୍ଛାସେବୀ ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
      nameLabel: 'ପୂରା ନାମ *',
      namePlaceholder: 'ଆପଣଙ୍କ ନାମ ଲେଖନ୍ତୁ',
      phoneLabel: 'ଫୋନ୍ ନମ୍ବର *',
      phonePlaceholder: '୧୦-ଅଙ୍କ ବିଶିଷ୍ଟ ମୋବାଇଲ୍',
      emailLabel: 'ଇମେଲ୍ ଠିକଣା',
      areaLabel: 'ଅଞ୍ଚଳ / ସ୍ଥାନ',
      areaPlaceholder: 'ଯଥା: ଗଣେଶ ନଗର',
      helpLabel: 'ଆପଣ କିପରି ସହାୟତା କରିବାକୁ ଚାହାନ୍ତି?',
      interests: [
        'ସ୍ୱେଚ୍ଛାସେବୀ ସେବା',
        'ସଜାବଟ ଓ ମଣ୍ଡପ',
        'ଫୋଟୋଗ୍ରାଫି ଓ ମିଡିଆ',
        'ସାଂସ୍କୃତିକ କାର୍ଯ୍ୟକ୍ରମ',
        'ଇଭେଣ୍ଟ ମ୍ୟାନେଜମେଣ୍ଟ',
        'ମହାପ୍ରସାଦ ସେବା',
      ],
      msgLabel: 'ଅତିରିକ୍ତ ସୂଚନା / ଉପଲବ୍ଧତା',
      msgPlaceholder: 'ଆପଣଙ୍କ ଉପଲବ୍ଧ ସମୟ କିମ୍ବା ପୂର୍ବ ସେବା ଅଭିଜ୍ଞତା ବିଷୟରେ ଲେଖନ୍ତୁ...',
      submitBtn: 'ସ୍ୱେଚ୍ଛାସେବୀ ଆବେଦନ ପଠାନ୍ତୁ',
      submittingBtn: 'ପଞ୍ଜୀକରଣ ହେଉଛି...',
      successTitle: 'ପଞ୍ଜୀକରଣ ସଫଳ!',
      welcomeMsg: 'ବିଘ୍ନହର୍ତ୍ତା ସେବା ଦଳକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ!',
      contactNote: 'ଆମ କମିଟିର ସ୍ୱେଚ୍ଛାସେବୀ ସଂଯୋଜକ ଶୀଘ୍ର ଆପଣଙ୍କ ସହ ସମ୍ପର୍କ କରିବେ।',
      closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
    },
  },

  en: {
    nav: {
      home: 'Home',
      about: 'About',
      events: 'Events',
      gallery: 'Gallery',
      donate: 'Donate',
      contact: 'Contact',
      joinUs: 'Join Us',
      adminLogin: 'Admin Login',
    },
    hero: {
      shloka: '॥ Shri Ganeshaya Namah ॥',
      titleLine1: 'VIGHNAHARTA',
      titleLine2: 'PUJA COMMITTEE',
      slogan: 'Ganpati Bappa Morya!',
      subtitle: 'Celebrating Faith, Unity & Tradition',
      exploreBtn: 'Explore Celebration',
      donateBtn: 'Donate Now',
    },
    countdown: {
      title: 'GANESH UTSAV 2026',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
      seconds: 'SECONDS',
    },
    about: {
      tag: 'OUR STORY',
      title: 'Vighnaharta Puja Committee',
      quote: '“A celebration created by the community, for the community.”',
      desc: 'Every year we come together to celebrate Lord Ganesha with devotion, culture, music and togetherness. Founded on the ideals of unity, service, and preserving rich Indian Vedic heritage, Vighnaharta Puja Committee brings families and devotees together to experience the divine presence of Bappa.',
      btn: 'Our Story',
    },
    timeline: {
      tag: 'FESTIVAL SCHEDULE',
      liveBadge: 'Live / Today',
      liveTitle: 'MAHA AARTI',
      liveTime: 'Today • 7:30 PM',
      pandalLocTag: 'Pandal Location',
      pandalName: 'Vighnaharta Puja Pandal',
      viewLocBtn: 'View Location',
    },
    featureCards: {
      galleryTitle: 'Gallery',
      gallerySubtitle: 'Moments of Devotion',
      galleryBtn: 'View Gallery',
      donateTitle: 'Donate',
      donateSubtitle: 'Support the Celebration',
      donateBtn: 'Donate Now',
      joinTitle: 'Join Us',
      joinSubtitle: 'Be a Part of Our Mission',
      joinBtn: 'Join Now',
      updatesTitle: 'Updates',
      updatesSubtitle: 'Latest News & Announcements',
      updatesBtn: 'View All',
    },
    actionRow: {
      supportTitle: 'SUPPORT VIGHNAHARTA',
      supportDesc: 'Your contribution helps us organize the celebration and community activities.',
      customPlaceholder: 'Enter Custom Amount',
      donateBtn: 'Donate Now',
      secureText: 'Secure • Simple • Transparent',
      stayConnectedTitle: 'STAY CONNECTED',
      stayConnectedDesc: 'Get festival updates, event timings, announcements and celebrations.',
      emailPlaceholder: 'Enter your email',
      subscribeBtn: 'Subscribe',
      subscribingBtn: 'Subscribing...',
      privacyText: 'We respect your privacy.',
      volunteerTitle: 'BE PART OF THE CELEBRATION',
      wantToVolunteer: 'Want to volunteer?',
      volunteerList: [
        'Volunteer Service',
        'Decorations & Pandal',
        'Photography & Media',
        'Cultural Events',
        'Event Management',
      ],
      joinUsBtn: 'Join Us',
    },
    location: {
      tag: 'FIND OUR PANDAL',
      pandalTitle: 'Vighnaharta Main Pandal',
      address: 'At:- Kadua, Post:- Bhagirathipur, Kamakhyanagar, Dhenkanal, Odisha',
      landmark: 'Landmark: Near Shiv Temple • Parking Available',
      directionsBtn: 'Get Directions',
      communityTitle: 'Our Community',
      stats: {
        years: 'Years of Celebration',
        devotees: 'Devotees',
        activities: 'Community Activities',
        volunteers: 'Volunteers',
      },
    },
    announcements: {
      tag: 'NOTIFICATIONS & UPDATES',
      title: 'LATEST ANNOUNCEMENTS',
      modalTag: 'Official Announcement',
      closeBtn: 'Close',
      dontShowAgain: "Don't show again today",
      activeFor: 'Active for',
      days: 'Days',
      postedJustNow: 'Posted less than an hour ago',
      postedHoursAgo: 'Posted hours ago',
      postedDaysAgo: 'Posted days ago',
      categories: {
        Aarti: 'Aarti',
        Volunteer: 'Volunteer',
        General: 'General',
        Urgent: 'Urgent',
        Event: 'Event',
      },
    },
    gallery: {
      tag: 'MOMENTS OF BHAKTI',
      title: 'Memories From Our Celebrations',
      categories: {
        All: 'All',
        Idol: 'Idol',
        Aarti: 'Aarti',
        Prasad: 'Prasad',
        Cultural: 'Cultural',
        Visarjan: 'Visarjan',
      },
    },
    devotional: {
      chantBtn: 'Ganpati Bappa Morya!',
      toastShloka: '॥ Om Gam Ganapataye Namah ॥',
      toastMsg: 'Ganpati Bappa Morya! Bappa blesses you with joy, health and prosperity.',
    },
    footer: {
      slogan: 'Faith • Unity • Celebration',
      desc: 'Organizing grand, safe, eco-friendly Ganesh Utsav celebrations filled with devotion, Vedic rituals, cultural programs, and community service.',
      quickLinksTitle: 'Quick Links',
      contactTitle: 'Contact Us',
      scanDonateTitle: 'Scan to Donate',
      address: 'At:- Kadua, Post:- Bhagirathipur, Kamakhyanagar, Dhenkanal, Odisha',
      rights: '© 2026 Vighnaharta Puja Committee. All Rights Reserved.',
      madeWith: 'Made by Sahil Kumar Sahoo',
    },
    donationModal: {
      title: 'SUPPORT VIGHNAHARTA',
      subtitle: 'Contribute to Ganesh Utsav 2026 & Community Service',
      selectAmount: 'Select Donation Amount',
      customAmount: 'Enter Custom Amount',
      nameLabel: 'Your Name',
      namePlaceholder: 'Devotee Name',
      phoneLabel: 'Mobile Number',
      phonePlaceholder: '10-digit Phone',
      paymentMethod: 'Payment Method',
      upiMethod: 'UPI / QR Scan',
      cardMethod: 'Card / NetBanking',
      payBtn: 'Proceed to Pay',
      processingBtn: 'Processing Donation...',
      securityBadge: '256-bit Encrypted • Tax Exemption Receipt Sent to Phone',
      successBadge: 'Donation Successful',
      successShloka: '॥ Om Gam Ganapataye Namah ॥',
      thankYou: 'Thank You!',
      blessingMsg: 'May Lord Ganesha shower endless health, prosperity & happiness upon you and your family!',
      receiptNo: 'Receipt No:',
      doneBtn: 'Done',
    },
    volunteerModal: {
      title: 'BE PART OF THE CELEBRATION',
      subtitle: 'Register as a Volunteer for Ganesh Utsav 2026',
      nameLabel: 'Full Name *',
      namePlaceholder: 'Enter Your Name',
      phoneLabel: 'Phone Number *',
      phonePlaceholder: '10-digit Mobile',
      emailLabel: 'Email Address',
      areaLabel: 'Area / Locality',
      areaPlaceholder: 'e.g. Ganesh Nagar',
      helpLabel: 'How would you like to help?',
      interests: [
        'Volunteer Service',
        'Decorations & Pandal',
        'Photography & Media',
        'Cultural Events',
        'Event Management',
        'Prasad Distribution',
      ],
      msgLabel: 'Additional Message / Availability',
      msgPlaceholder: 'Tell us about your availability or prior volunteer experience...',
      submitBtn: 'Submit Volunteer Application',
      submittingBtn: 'Registering...',
      successTitle: 'Registration Successful!',
      welcomeMsg: 'Welcome to the Vighnaharta Seva Team!',
      contactNote: 'Our committee volunteer coordinator will contact you shortly.',
      closeBtn: 'Close',
    },
  },
};
