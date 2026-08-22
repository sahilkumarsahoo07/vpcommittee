export type Language = 'hi' | 'or' | 'en';

// Common sentence & phrase dictionary
const HINDI_MAP: Record<string, string> = {
  'Ganesh Sthapana & Shobha Yatra': 'गणेश स्थापना एवं शोभा यात्रा',
  'Maha Sandhya Aarti & Bhajan Evening': 'महा संध्या आरती एवं भजन संध्या',
  'Maha Prasad & Anna Daan Distribution': 'महाप्रसाद एवं अन्नदान वितरण',
  'Grand Visarjan & Balaram Procession': 'भव्य विसर्जन एवं शोभा यात्रा',
  'Maha Aarti Timings Update for Day 2': 'दिन 2 महा आरती समय सारणी अद्यतन',
  'Sandhya Aarti will begin at exactly 07:00 PM sharp. All devotees are requested to be seated by 06:45 PM.':
    'संध्या आरती ठीक शाम 07:00 बजे शुरू होगी। सभी भक्तों से निवेदन है कि 06:45 तक स्थान ग्रहण करें।',
  'Volunteer Meeting Today Evening': 'आज शाम स्वयंसेवक बैठक',
  'All registered volunteers are requested to attend the security & crowd management briefing at 05:00 PM.':
    'सभी पंजीकृत स्वयंसेवकों से अनुरोध है कि शाम 05:00 बजे सुरक्षा और भीड़ प्रबंधन की बैठक में भाग लें।',
  'Grand holy procession bringing Lord Ganesha idol to main mandap with dhols and devotional chanting.':
    'भव्य पवित्र शोभा यात्रा: भगवान श्री गणेश जी की प्रतिमा को ढोल-नगाड़ों एवं भक्ति जयकारों के साथ मुख्य मंडप में लाना।',

  // Committee Leadership & Roles
  'Official Organizers': 'आधिकारिक आयोजक',
  'OFFICIAL ORGANIZERS': 'आधिकारिक आयोजक',
  'Committee Executive Leadership': 'समिति कार्यकारिणी नेतृत्व',
  'COMMITTEE EXECUTIVE LEADERSHIP': 'समिति कार्यकारिणी नेतृत्व',
  'Our Leadership & Members': 'हमारा नेतृत्व एवं सदस्य',
  'OUR LEADERSHIP & MEMBERS': 'हमारा नेतृत्व एवं सदस्य',
  'Our Members': 'हमारे सदस्य',
  'OUR MEMBERS': 'हमारे सदस्य',
  'Founder': 'संस्थापक',
  'FOUNDER': 'संस्थापक',
  'President': 'अध्यक्ष',
  'PRESIDENT': 'अध्यक्ष',
  'Vice President': 'उपाध्यक्ष',
  'VICE_PRESIDENT': 'उपाध्यक्ष',
  'VICE PRESIDENT': 'उपाध्यक्ष',
  'Secretary': 'महासचिव',
  'SECRETARY': 'महासचिव',
  'General Secretary': 'महासचिव',
  'GENERAL SECRETARY': 'महासचिव',
  'Joint Secretary': 'संयुक्त सचिव',
  'JOINT_SECRETARY': 'संयुक्त सचिव',
  'JOINT SECRETARY': 'संयुक्त सचिव',
  'Treasurer': 'कोषाध्यक्ष',
  'TREASURER': 'कोषाध्यक्ष',
  'Treasurer / Financial Head': 'कोषाध्यक्ष / वित्त प्रमुख',
  'TREASURER / FINANCIAL HEAD': 'कोषाध्यक्ष / वित्त प्रमुख',
  'President & Founder': 'अध्यक्ष एवं संस्थापक',
  'PRESIDENT & FOUNDER': 'अध्यक्ष एवं संस्थापक',
  'Cultural Head': 'सांस्कृतिक प्रमुख',
  'CULTURAL_HEAD': 'सांस्कृतिक प्रमुख',
  'CULTURAL HEAD': 'सांस्कृतिक प्रमुख',
  'Volunteer Lead': 'स्वयंसेवक प्रमुख',
  'VOLUNTEER_LEAD': 'स्वयंसेवक प्रमुख',
  'VOLUNTEER LEAD': 'स्वयंसेवक प्रमुख',
  'Committee Member': 'समिति सदस्य',
  'COMMITTEE_MEMBER': 'समिति सदस्य',
  'COMMITTEE MEMBER': 'समिति सदस्य',
  'Member': 'सदस्य',
  'MEMBER': 'कार्यकारी सदस्य',
  'Executive Member': 'कार्यकारी सदस्य',
  'EXECUTIVE MEMBER': 'कार्यकारी सदस्य',
  'Volunteer': 'स्वयंसेवक',
  'VOLUNTEER': 'स्वयंसेवक',
  'Active': 'सक्रिय',
  'ACTIVE': 'सक्रिय',

  // Volunteers Showcase
  'Best Volunteers': 'सर्वश्रेष्ठ स्वयंसेवक',
  'BEST VOLUNTEERS': 'सर्वश्रेष्ठ स्वयंसेवक',
  'Seva Ratna & Recognition': 'सेवा रत्न एवं सम्मान',
  'SEVA RATNA & RECOGNITION': 'सेवा रत्न एवं सम्मान',
  'Honoring our devoted volunteers and community heroes who selflessly serve with unwavering dedication throughout Ganesh Utsav celebrations.':
    'गणेश उत्सव के दौरान निष्ठा और समर्पण के साथ निस्वार्थ सेवा करने वाले हमारे समर्पित स्वयंसेवकों एवं समाज सेवकों का सम्मान।',
  'Active Volunteer': 'सक्रिय स्वयंसेवक',
  'View Profile': 'प्रोफ़ाइल देखें',
  'Close Profile': 'बंद करें',
  'About Volunteer & Seva': 'स्वयंसेवक एवं सेवा विवरण',
  'Key Contributions & Achievements': 'प्रमुख योगदान एवं उपलब्धियां',
  'Certified Festival Seva Volunteer': 'प्रमाणित उत्सव सेवा स्वयंसेवक',
  'Recognized by Vighnaharta Puja Executive Committee': 'विघ्नहर्ता पूजा कार्यकारिणी समिति द्वारा सम्मानित',
  'Community Service': 'सामुदायिक सेवा',
  'Events & Pandal': 'उत्सव एवं मण्डप',
  'Puja & Rituals': 'पूजा एवं अनुष्ठान',
  'Maha Prasad Seva': 'महाप्रसाद सेवा',
  'Crowd & Security': 'भीड़ एवं सुरक्षा',
  'Media & Cultural': 'मीडिया एवं सांस्कृतिक',
  'Senior Community Volunteer': 'वरिष्ठ सामुदायिक स्वयंसेवक',
  'Cultural & Stage In-charge': 'सांस्कृतिक एवं मंच प्रभारी',
  'Crowd & Queue Lead': 'भीड़ एवं कतार प्रमुख',
};

const ODIA_MAP: Record<string, string> = {
  'Ganesh Sthapana & Shobha Yatra': 'ଗଣେଶ ସ୍ଥାପନା ଓ ଶୋଭାଯାତ୍ରା',
  'Maha Sandhya Aarti & Bhajan Evening': 'ମହା ସନ୍ଧ୍ୟା ଆରତୀ ଓ ଭଜନ ସନ୍ଧ୍ୟା',
  'Maha Prasad & Anna Daan Distribution': 'ମହାପ୍ରସାଦ ଓ ଅନ୍ନଦାନ ସେବା',
  'Grand Visarjan & Balaram Procession': 'ଭବ୍ୟ ବିସର୍ଜନ ଓ ବଳରାମ ଶୋଭାଯାତ୍ରା',
  'Maha Aarti Timings Update for Day 2': 'ଦ୍ୱିତୀୟ ଦିନ ମହା ଆରତୀ ସମୟ ସୂଚନା',
  'Sandhya Aarti will begin at exactly 07:00 PM sharp. All devotees are requested to be seated by 06:45 PM.':
    'ସନ୍ଧ୍ୟା ଆରତୀ ଠିକ୍ ସନ୍ଧ୍ୟା ୦୭:୦୦ ଟାରେ ଆରମ୍ଭ ହେବ। ସମସ୍ତ ଶ୍ରଦ୍ଧାଳୁଙ୍କୁ ୦୬:୪୫ ସୁଦ୍ଧା ଆସନ ଗ୍ରହଣ କରିବାକୁ ଅନୁରୋଧ।',
  'Volunteer Meeting Today Evening': 'ଆଜି ସନ୍ଧ୍ୟାରେ ସ୍ୱେଚ୍ଛାସେବୀ ବୈଠକ',
  'All registered volunteers are requested to attend the security & crowd management briefing at 05:00 PM.':
    'ସମସ୍ତ ପଞ୍ଜୀକୃତ ସ୍ୱେଚ୍ଛାସେବୀଙ୍କୁ ସନ୍ଧ୍ୟା ୦୫:୦୦ ଟାରେ ସୁରକ୍ଷା ଓ ଭିଡ଼ ନିୟନ୍ତ୍ରଣ ଆଲୋଚନାରେ ଯୋଗଦେବାକୁ ଅନୁରୋଧ।',
  'Grand holy procession bringing Lord Ganesha idol to main mandap with dhols and devotional chanting.':
    'ଭବ୍ୟ ପବିତ୍ର ଶୋଭାଯାତ୍ରା: ଢୋଲ-ମାଦଳ ଓ ଭକ୍ତି ଜୟଗାନ ସହିତ ଭଗବାନ ଶ୍ରୀ ଗଣେଶଙ୍କ ମୂର୍ତ୍ତିକୁ ମୁଖ୍ୟ ମଣ୍ଡପକୁ ବିରାଜମାନ କରାଇବା।',

  // Committee Leadership & Roles
  'Official Organizers': 'ଅଧିକୃତ ଆୟୋଜକ',
  'OFFICIAL ORGANIZERS': 'ଅଧିକୃତ ଆୟୋଜକ',
  'Committee Executive Leadership': 'କମିଟି କାର୍ଯ୍ୟକାରିଣୀ ନେତୃତ୍ୱ',
  'COMMITTEE EXECUTIVE LEADERSHIP': 'କମିଟି କାର୍ଯ୍ୟକାରିଣୀ ନେତୃତ୍ୱ',
  'Our Leadership & Members': 'ଆମ ନେତୃତ୍ୱ ଓ ସଦସ୍ୟ',
  'OUR LEADERSHIP & MEMBERS': 'ଆମ ନେତୃତ୍ୱ ଓ ସଦସ୍ୟ',
  'Our Members': 'ଆମ ସଦସ୍ୟ',
  'OUR MEMBERS': 'ଆମ ସଦସ୍ୟ',
  'Founder': 'ପ୍ରତିଷ୍ଠାତା',
  'FOUNDER': 'ପ୍ରତିଷ୍ଠାତା',
  'President': 'ସଭାପତି',
  'PRESIDENT': 'ସଭାପତି',
  'Vice President': 'ଉପସଭାପତି',
  'VICE_PRESIDENT': 'ଉପସଭାପତି',
  'VICE PRESIDENT': 'ଉପସଭାପତି',
  'Secretary': 'ସାଧାରଣ ସମ୍ପାଦକ',
  'SECRETARY': 'ସାଧାରଣ ସମ୍ପାଦକ',
  'General Secretary': 'ସାଧାରଣ ସମ୍ପାଦକ',
  'GENERAL SECRETARY': 'ସାଧାରଣ ସମ୍ପାଦକ',
  'Joint Secretary': 'ଯୁଗ୍ମ ସମ୍ପାଦକ',
  'JOINT_SECRETARY': 'ଯୁଗ୍ମ ସମ୍ପାଦକ',
  'JOINT SECRETARY': 'ଯୁଗ୍ମ ସମ୍ପାଦକ',
  'Treasurer': 'କୋଷାଧ୍ୟକ୍ଷ',
  'TREASURER': 'କୋଷାଧ୍ୟକ୍ଷ',
  'Treasurer / Financial Head': 'କୋଷାଧ୍ୟକ୍ଷ / ଆର୍ଥିକ ମୁଖ୍ୟ',
  'TREASURER / FINANCIAL HEAD': 'କୋଷାଧ୍ୟକ୍ଷ / ଆର୍ଥିକ ମୁଖ୍ୟ',
  'President & Founder': 'ସଭାପତି ଓ ପ୍ରତିଷ୍ଠାତା',
  'PRESIDENT & FOUNDER': 'ସଭାପତି ଓ ପ୍ରତିଷ୍ଠାତା',
  'Cultural Head': 'ସାଂସ୍କୃତିକ ପ୍ରମୁଖ',
  'CULTURAL_HEAD': 'ସାଂସ୍କୃତିକ ପ୍ରମୁଖ',
  'CULTURAL HEAD': 'ସାଂସ୍କୃତିକ ପ୍ରମୁଖ',
  'Volunteer Lead': 'ସ୍ୱେଚ୍ଛାସେବୀ ପ୍ରମୁଖ',
  'VOLUNTEER_LEAD': 'ସ୍ୱେଚ୍ଛାସେବୀ ପ୍ରମୁଖ',
  'VOLUNTEER LEAD': 'ସ୍ୱେଚ୍ଛାସେବୀ ପ୍ରମୁଖ',
  'Committee Member': 'କମିଟି ସଦସ୍ୟ',
  'COMMITTEE_MEMBER': 'କମିଟି ସଦସ୍ୟ',
  'COMMITTEE MEMBER': 'କମିଟି ସଦସ୍ୟ',
  'Member': 'ସଦସ୍ୟ',
  'MEMBER': 'କାର୍ଯ୍ୟକାରୀ ସଦସ୍ୟ',
  'Executive Member': 'କାର୍ଯ୍ୟକାରୀ ସଦସ୍ୟ',
  'EXECUTIVE MEMBER': 'କାର୍ଯ୍ୟକାରୀ ସଦସ୍ୟ',
  'Volunteer': 'ସ୍ୱେଚ୍ଛାସେବୀ',
  'VOLUNTEER': 'ସ୍ୱେଚ୍ଛାସେବୀ',
  'Active': 'ସକ୍ରିୟ',
  'ACTIVE': 'ସକ୍ରିୟ',

  // Volunteers Showcase
  'Best Volunteers': 'ଶ୍ରେଷ୍ଠ ସ୍ୱେଚ୍ଛାସେବୀ',
  'BEST VOLUNTEERS': 'ଶ୍ରେଷ୍ଠ ସ୍ୱେଚ୍ଛାସେବୀ',
  'Seva Ratna & Recognition': 'ସେବା ରତ୍ନ ଓ ସମ୍ମାନ',
  'SEVA RATNA & RECOGNITION': 'ସେବା ରତ୍ନ ଓ ସମ୍ମାନ',
  'Honoring our devoted volunteers and community heroes who selflessly serve with unwavering dedication throughout Ganesh Utsav celebrations.':
    'ଗଣେଶ ପୂଜା ସମୟରେ ନିସ୍ୱାର୍ଥପର ଭାବେ ନିଷ୍ଠା ଓ ଭକ୍ତିର ସହ ସେବା ପ୍ରଦାନ କରୁଥିବା ଆମର ସମର୍ପିତ ସ୍ୱେଚ୍ଛାସେବୀ ଓ ସମାଜ ସେବକମାନଙ୍କୁ ସମ୍ମାନ।',
  'Active Volunteer': 'ସକ୍ରିୟ ସ୍ୱେଚ୍ଛାସେବୀ',
  'View Profile': 'ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ',
  'Close Profile': 'ବନ୍ଦ କରନ୍ତୁ',
  'About Volunteer & Seva': 'ସ୍ୱେଚ୍ଛାସେବୀ ଓ ସେବା ବିବରଣୀ',
  'Key Contributions & Achievements': 'ପ୍ରମୁଖ ଅବଦାନ ଓ ସଫଳତା',
  'Certified Festival Seva Volunteer': 'ପ୍ରମାଣିତ ଉତ୍ସବ ସେବା ସ୍ୱେଚ୍ଛାସେବୀ',
  'Recognized by Vighnaharta Puja Executive Committee': 'ବିଘ୍ନହର୍ତ୍ତା ପୂଜା କାର୍ଯ୍ୟକାରିଣୀ କମିଟି ଦ୍ୱାରା ସମ୍ମାନିତ',
  'Community Service': 'ସାମାଜିକ ସେବା',
  'Events & Pandal': 'ଉତ୍ସବ ଓ ମଣ୍ଡପ',
  'Puja & Rituals': 'ପୂଜା ଓ ରୀତିନୀତି',
  'Maha Prasad Seva': 'ମହାପ୍ରସାଦ ସେବା',
  'Crowd & Security': 'ଶୃଙ୍ଖଳା ଓ ସୁରକ୍ଷା',
  'Media & Cultural': 'ମିଡିଆ ଓ ସାଂସ୍କୃତିକ',
  'Senior Community Volunteer': 'ବରିଷ୍ଠ ସାମାଜିକ ସ୍ୱେଚ୍ଛାସେବୀ',
  'Cultural & Stage In-charge': 'ସାଂସ୍କୃତିକ ଓ ମଞ୍ଚ ପ୍ରଭାରୀ',
  'Crowd & Queue Lead': 'ଶୃଙ୍ଖଳା ଓ ଧାଡ଼ି ପରିଚାଳକ',
};

// Word & phrase replacements for fallback dynamic translation
const ODIA_REPLACEMENTS: [RegExp, string][] = [
  // Full phrase patterns
  [/Grand holy procession bringing Lord Ganesha idol to main mandap with dhols and devotional chanting\.?/gi, 'ଭବ୍ୟ ପବିତ୍ର ଶୋଭାଯାତ୍ରା: ଢୋଲ-ମାଦଳ ଓ ଭକ୍ତି ଜୟଗାନ ସହିତ ଭଗବାନ ଶ୍ରୀ ଗଣେଶଙ୍କ ମୂର୍ତ୍ତିକୁ ମୁଖ୍ୟ ମଣ୍ଡପକୁ ବିରାଜମାନ କରାଇବା।'],
  [/Grand holy procession/gi, 'ଭବ୍ୟ ପବିତ୍ର ଶୋଭାଯାତ୍ରା'],
  [/holy procession/gi, 'ପବିତ୍ର ଶୋଭାଯାତ୍ରା'],
  [/bringing Lord Ganesha idol to main mandap/gi, 'ଭଗବାନ ଗଣେଶଙ୍କ ମୂର୍ତ୍ତିକୁ ମୁଖ୍ୟ ମଣ୍ଡପକୁ ବିରାଜମାନ କରାଇବା'],
  [/bringing Lord Ganesha idol/gi, 'ଭଗବାନ ଗଣେଶଙ୍କ ମୂର୍ତ୍ତି ଅଣାଯିବା'],
  [/Lord Ganesha idol/gi, 'ଭଗବାନ ଶ୍ରୀ ଗଣେଶଙ୍କ ମୂର୍ତ୍ତି'],
  [/Lord Ganesha/gi, 'ଭଗବାନ ଶ୍ରୀ ଗଣେଶ'],
  [/Ganesha idol/gi, 'ଗଣେଶ ମୂର୍ତ୍ତି'],
  [/Ganesh idol/gi, 'ଗଣେଶ ମୂର୍ତ୍ତି'],
  [/with dhols and devotional chanting/gi, 'ଢୋଲ-ମାଦଳ ଓ ଭକ୍ତିଗୀତ ଜୟଗାନ ସହିତ'],
  [/dhols and devotional chanting/gi, 'ଢୋଲ ଓ ଭକ୍ତିଗୀତ'],
  [/devotional chanting/gi, 'ଭକ୍ତି ଜୟଗାନ'],
  [/main mandap/gi, 'ମୁଖ୍ୟ ମଣ୍ଡପ'],
  [/Mandap Grounds/gi, 'ମଣ୍ଡପ ପ୍ରାଙ୍ଗଣ'],
  [/Mandap/gi, 'ମଣ୍ଡପ'],
  [/procession/gi, 'ଶୋଭାଯାତ୍ରା'],
  [/bringing/gi, 'ଆଣିବା'],
  [/idol/gi, 'ମୂର୍ତ୍ତି'],
  [/dhols/gi, 'ଢୋଲ-ମାଦଳ'],
  [/Maha Aarti/gi, 'ମହା ଆରତୀ'],
  [/Sandhya Aarti/gi, 'ସନ୍ଧ୍ୟା ଆରତୀ'],
  [/Maha Prasad/gi, 'ମହାପ୍ରସାଦ'],
  [/Anna Daan/gi, 'ଅନ୍ନଦାନ'],
  [/Ganesh Sthapana/gi, 'ଗଣେଶ ସ୍ଥାପନା'],
  [/Shobha Yatra/gi, 'ଶୋଭାଯାତ୍ରା'],
  [/Visarjan/gi, 'ବିସର୍ଜନ'],
  [/Timings Update/gi, 'ସମୟ ସୂଚନା'],
  [/Timings/gi, 'ସମୟସୂଚୀ'],
  [/Update/gi, 'ସୂଚନା'],
  [/Volunteer Meeting/gi, 'ସ୍ୱେଚ୍ଛାସେବୀ ବୈଠକ'],
  [/Volunteer/gi, 'ସ୍ୱେଚ୍ଛାସେବୀ'],
  [/Volunteers/gi, 'ସ୍ୱେଚ୍ଛାସେବୀମାନେ'],
  [/Meeting/gi, 'ବୈଠକ'],
  [/Today Evening/gi, 'ଆଜି ସନ୍ଧ୍ୟାରେ'],
  [/Today/gi, 'ଆଜି'],
  [/Evening/gi, 'ସନ୍ଧ୍ୟା'],
  [/Morning/gi, 'ସକାଳ'],
  [/Night/gi, 'ରାତି'],
  [/Day 1/gi, 'ଦିନ ୧'],
  [/Day 2/gi, 'ଦିନ ୨'],
  [/Day 3/gi, 'ଦିନ ୩'],
  [/Day 4/gi, 'ଦିନ ୪'],
  [/Day 5/gi, 'ଦିନ ୫'],
  [/all devotees are requested to be seated by/gi, 'ସମସ୍ତ ଶ୍ରଦ୍ଧାଳୁଙ୍କୁ ଆସନ ଗ୍ରହଣ କରିବାକୁ ଅନୁରୋଧ'],
  [/all devotees/gi, 'ସମସ୍ତ ଶ୍ରଦ୍ଧାଳୁ'],
  [/devotees/gi, 'ଶ୍ରଦ୍ଧାଳୁମାନେ'],
  [/will begin at/gi, 'ଆରମ୍ଭ ହେବ'],
  [/exactly/gi, 'ଠିକ୍'],
  [/sharp/gi, 'ଟାରେ'],
  [/President/gi, 'ସଭାପତି'],
  [/Vice President/gi, 'ଉପସଭାପତି'],
  [/Secretary/gi, 'ସମ୍ପାଦକ'],
  [/Treasurer/gi, 'କୋଷାଧ୍ୟକ୍ଷ'],
  [/Ganesh Utsav/gi, 'ଗଣେଶ ଉତ୍ସବ'],
  [/Pandal/gi, 'ମଣ୍ଡପ'],
  [/Temple/gi, 'ମନ୍ଦିର'],
  [/\bSahil\b/gi, 'ସାହିଲ'],
  [/\bRahul\b/gi, 'ରାହୁଲ'],
  [/\bAmit\b/gi, 'ଅମିତ'],
];

const HINDI_REPLACEMENTS: [RegExp, string][] = [
  // Full phrase patterns
  [/Grand holy procession bringing Lord Ganesha idol to main mandap with dhols and devotional chanting\.?/gi, 'भव्य पवित्र शोभा यात्रा: भगवान श्री गणेश जी की प्रतिमा को ढोल-नगाड़ों एवं भक्ति जयकारों के साथ मुख्य मंडप में लाना।'],
  [/Grand holy procession/gi, 'भव्य पवित्र शोभा यात्रा'],
  [/holy procession/gi, 'पवित्र शोभा यात्रा'],
  [/bringing Lord Ganesha idol to main mandap/gi, 'भगवान गणेश की प्रतिमा मुख्य मंडप में लाना'],
  [/bringing Lord Ganesha idol/gi, 'भगवान गणेश जी की प्रतिमा लाना'],
  [/Lord Ganesha idol/gi, 'भगवान श्री गणेश जी की प्रतिमा'],
  [/Lord Ganesha/gi, 'भगवान श्री गणेश'],
  [/Ganesha idol/gi, 'गणेश प्रतिमा'],
  [/Ganesh idol/gi, 'गणेश प्रतिमा'],
  [/with dhols and devotional chanting/gi, 'ढोल-नगाड़ों और भक्ति जयकारों के साथ'],
  [/dhols and devotional chanting/gi, 'ढोल और भक्ति जयकार'],
  [/devotional chanting/gi, 'भक्ति जयकार'],
  [/main mandap/gi, 'मुख्य मंडप'],
  [/Mandap Grounds/gi, 'मंडप प्रांगण'],
  [/Mandap/gi, 'मंडप'],
  [/procession/gi, 'शोभा यात्रा'],
  [/bringing/gi, 'लाया जा रहा है'],
  [/idol/gi, 'प्रतिमा'],
  [/dhols/gi, 'ढोल-नगाड़े'],
  [/Maha Aarti/gi, 'महा आरती'],
  [/Sandhya Aarti/gi, 'संध्या आरती'],
  [/Maha Prasad/gi, 'महाप्रसाद'],
  [/Anna Daan/gi, 'अन्नदान'],
  [/Ganesh Sthapana/gi, 'गणेश स्थापना'],
  [/Shobha Yatra/gi, 'शोभा यात्रा'],
  [/Visarjan/gi, 'विसर्जन'],
  [/Timings Update/gi, 'समय अद्यतन'],
  [/Timings/gi, 'समय'],
  [/Update/gi, 'अद्यतन'],
  [/Volunteer Meeting/gi, 'स्वयंसेवक बैठक'],
  [/Volunteer/gi, 'स्वयंसेवक'],
  [/Volunteers/gi, 'स्वयंसेवक'],
  [/Meeting/gi, 'बैठक'],
  [/Today Evening/gi, 'आज शाम'],
  [/Today/gi, 'आज'],
  [/Evening/gi, 'शाम'],
  [/Morning/gi, 'सुबह'],
  [/Night/gi, 'रात'],
  [/Day 1/gi, 'दिन 1'],
  [/Day 2/gi, 'दिन 2'],
  [/Day 3/gi, 'दिन 3'],
  [/Day 4/gi, 'दिन 4'],
  [/Day 5/gi, 'दिन 5'],
  [/all devotees are requested to be seated by/gi, 'सभी भक्तों से निवेदन है कि समय पर स्थान ग्रहण करें'],
  [/all devotees/gi, 'सभी भक्त'],
  [/devotees/gi, 'भक्तजन'],
  [/will begin at/gi, 'प्रारंभ होगा'],
  [/exactly/gi, 'ठीक'],
  [/President/gi, 'अध्यक्ष'],
  [/Vice President/gi, 'उपाध्यक्ष'],
  [/Secretary/gi, 'सचिव'],
  [/Treasurer/gi, 'कोषाध्यक्ष'],
  [/Ganesh Utsav/gi, 'गणेश उत्सव'],
  [/Pandal/gi, 'पंडाल'],
  [/Temple/gi, 'मंदिर'],
  [/\bSahil\b/gi, 'साहिल'],
  [/\bRahul\b/gi, 'राहुल'],
  [/\bAmit\b/gi, 'अमित'],
];

// Dynamic Phonetic Transliterator for Hindi
function transliterateWordToHindi(word: string): string {
  if (!word || /[^\x00-\x7F]/.test(word)) return word; // Skip if already translated/non-ASCII

  const clean = word.trim();
  if (!clean) return '';

  const OVERRIDES: Record<string, string> = {
    sahil: 'साहिल',
    rahul: 'राहुल',
    amit: 'अमित',
    sumit: 'सुमित',
    priya: 'प्रिया',
    pooja: 'पूजा',
    puja: 'पूजा',
    rohan: 'रोहन',
    sahoo: 'साहू',
    vighnaharta: 'विघ्नहर्ता',
    bhubaneswar: 'भुवनेश्वर',
    cuttack: 'कटक',
    mandap: 'मंडप',
    sec: 'सेक्टर',
    sector: 'सेक्टर',
    hall: 'हॉल',
    ground: 'ग्राउंड',
    grounds: 'ग्राउंड्स',
  };

  const lower = clean.toLowerCase();
  if (OVERRIDES[lower]) return OVERRIDES[lower];

  let w = lower
    .replace(/sh/g, 'श')
    .replace(/ch/g, 'च')
    .replace(/bh/g, 'भ')
    .replace(/gh/g, 'घ')
    .replace(/jh/g, 'झ')
    .replace(/dh/g, 'ध')
    .replace(/th/g, 'थ')
    .replace(/kh/g, 'ख')
    .replace(/ph/g, 'फ')
    .replace(/ee/g, 'ी')
    .replace(/oo/g, 'ू')
    .replace(/ai/g, 'ै')
    .replace(/au/g, 'ौ')
    .replace(/ou/g, 'ौ')
    .replace(/aa/g, 'ा')
    .replace(/a/g, 'ा')
    .replace(/i/g, 'ि')
    .replace(/u/g, 'ु')
    .replace(/e/g, 'े')
    .replace(/o/g, 'ो')
    .replace(/b/g, 'ब')
    .replace(/c/g, 'क')
    .replace(/d/g, 'द')
    .replace(/f/g, 'फ')
    .replace(/g/g, 'ग')
    .replace(/h/g, 'ह')
    .replace(/j/g, 'ज')
    .replace(/k/g, 'क')
    .replace(/l/g, 'ल')
    .replace(/m/g, 'म')
    .replace(/n/g, 'न')
    .replace(/p/g, 'प')
    .replace(/q/g, 'क')
    .replace(/r/g, 'र')
    .replace(/s/g, 'स')
    .replace(/t/g, 'त')
    .replace(/v/g, 'व')
    .replace(/w/g, 'व')
    .replace(/x/g, 'क्स')
    .replace(/y/g, 'य')
    .replace(/z/g, 'ज़');

  return w;
}

// Dynamic Phonetic Transliterator for Odia
function transliterateWordToOdia(word: string): string {
  if (!word || /[^\x00-\x7F]/.test(word)) return word; // Skip if already translated

  const clean = word.trim();
  if (!clean) return '';

  const OVERRIDES: Record<string, string> = {
    sahil: 'ସାହିଲ',
    rahul: 'ରାହୁଲ',
    amit: 'ଅମିତ',
    sumit: 'ସୁମିତ',
    priya: 'ପ୍ରିୟା',
    pooja: 'ପୂଜା',
    puja: 'ପୂଜା',
    rohan: 'ରୋହନ',
    sahoo: 'ସାହୁ',
    vighnaharta: 'ବିଘ୍ନହର୍ତ୍ତା',
    bhubaneswar: 'ଭୁବନେଶ୍ୱର',
    cuttack: 'କଟକ',
    mandap: 'ମଣ୍ଡପ',
    sec: 'ସେକ୍ଟର',
    sector: 'ସେକ୍ଟର',
    hall: 'ହଲ୍',
    ground: 'ଗ୍ରାଉଣ୍ଡ',
    grounds: 'ଗ୍ରାଉଣ୍ଡସ୍',
  };

  const lower = clean.toLowerCase();
  if (OVERRIDES[lower]) return OVERRIDES[lower];

  let w = lower
    .replace(/sh/g, 'ଶ')
    .replace(/ch/g, 'ଚ')
    .replace(/bh/g, 'ଭ')
    .replace(/gh/g, 'ଘ')
    .replace(/jh/g, 'ଝ')
    .replace(/dh/g, 'ଧ')
    .replace(/th/g, 'ଥ')
    .replace(/kh/g, 'ଖ')
    .replace(/ph/g, 'ଫ')
    .replace(/ee/g, 'ୀ')
    .replace(/oo/g, 'ୂ')
    .replace(/ai/g, 'ୈ')
    .replace(/au/g, 'ୌ')
    .replace(/ou/g, 'ୌ')
    .replace(/aa/g, 'ା')
    .replace(/a/g, 'ା')
    .replace(/i/g, 'ି')
    .replace(/u/g, 'ୁ')
    .replace(/e/g, 'େ')
    .replace(/o/g, 'ୋ')
    .replace(/b/g, 'ବ')
    .replace(/c/g, 'କ')
    .replace(/d/g, 'ଦ')
    .replace(/f/g, 'ଫ')
    .replace(/g/g, 'ଗ')
    .replace(/h/g, 'ହ')
    .replace(/j/g, 'ଜ')
    .replace(/k/g, 'କ')
    .replace(/l/g, 'ଲ')
    .replace(/m/g, 'ମ')
    .replace(/n/g, 'ନ')
    .replace(/p/g, 'ପ')
    .replace(/q/g, 'କ')
    .replace(/r/g, 'ର')
    .replace(/s/g, 'ସ')
    .replace(/t/g, 'ତ')
    .replace(/v/g, 'ଵ')
    .replace(/w/g, 'ଵ')
    .replace(/x/g, 'କ୍ସ')
    .replace(/y/g, 'ଯ')
    .replace(/z/g, 'ଜ');

  return w;
}

/**
 * Auto-suggests Odia translation for given English text dynamically
 */
export function autoTranslateToOdia(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (ODIA_MAP[trimmed]) return ODIA_MAP[trimmed];

  let result = text;
  for (const [regex, replacement] of ODIA_REPLACEMENTS) {
    result = result.replace(regex, replacement);
  }

  // Transliterate any remaining English words to Odia script
  result = result.replace(/[a-zA-Z]+/g, (match) => transliterateWordToOdia(match));
  return result;
}

/**
 * Auto-suggests Hindi translation for given English text dynamically
 */
export function autoTranslateToHindi(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (HINDI_MAP[trimmed]) return HINDI_MAP[trimmed];

  let result = text;
  for (const [regex, replacement] of HINDI_REPLACEMENTS) {
    result = result.replace(regex, replacement);
  }

  // Transliterate any remaining English words to Devanagari script
  result = result.replace(/[a-zA-Z]+/g, (match) => transliterateWordToHindi(match));
  return result;
}

/**
 * Real-time API translation for unpredictable custom text (Hindi & Odia)
 * Uses free Neural Translation API with Unicode validation and local script engine fallback.
 */
export async function fetchAutoTranslation(text: string, targetLang: 'hi' | 'or'): Promise<string> {
  if (!text || !text.trim()) return '';

  if (targetLang === 'or') {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=en|or`
      );
      const data = await response.json();
      if (data && data.responseData && data.responseData.translatedText) {
        const translated = data.responseData.translatedText.trim();
        // Ensure the response contains true Odia script characters (\u0B00-\u0B7F)
        if (/[\u0B00-\u0B7F]/.test(translated)) {
          return translated;
        }
      }
    } catch (err) {
      console.warn('Odia API translation failed, using local Odia engine:', err);
    }
    // Always fall back to guaranteed Odia script engine
    return autoTranslateToOdia(text);
  }

  // Hindi translation
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=en|hi`
    );
    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText.trim();
      // Ensure the response contains Devanagari script characters (\u0900-\u097F)
      if (/[\u0900-\u097F]/.test(translated)) {
        return translated;
      }
    }
  } catch (err) {
    console.warn('Hindi API translation failed, using local Hindi engine:', err);
  }

  // Fall back to local Devanagari engine
  return autoTranslateToHindi(text);
}

/**
 * Resolves localized text with intelligent fallback & dynamic translation
 */
export function getLocalizedText(
  item: any,
  field: 'title' | 'description' | 'name' | 'bio' | 'content',
  language: Language
): string {
  if (!item) return '';

  const rawDefault = (item[field] || (field === 'content' ? item['description'] : field === 'description' ? item['content'] : '')) || '';

  if (language === 'hi') {
    const val = item[`${field}_hi`] || (field === 'content' ? item['description_hi'] : field === 'description' ? item['content_hi'] : '');
    if (val && typeof val === 'string' && val.trim() !== '') {
      return val.trim();
    }
    return autoTranslateToHindi(rawDefault);
  }

  if (language === 'or') {
    const val = item[`${field}_or`] || (field === 'content' ? item['description_or'] : field === 'description' ? item['content_or'] : '');
    if (val && typeof val === 'string' && val.trim() !== '') {
      return val.trim();
    }
    return autoTranslateToOdia(rawDefault);
  }

  return rawDefault;
}

/**
 * Universal text translator using dictionary maps and script fallback
 */
export function translateText(text: string, language: Language): string {
  if (!text) return '';
  if (language === 'en') return text;
  if (language === 'hi') {
    return HINDI_MAP[text.trim()] || autoTranslateToHindi(text);
  }
  if (language === 'or') {
    return ODIA_MAP[text.trim()] || autoTranslateToOdia(text);
  }
  return text;
}

/**
 * Role badge / title translator
 */
export function translateRole(role: string, language: Language): string {
  if (!role) return '';
  const clean = role.replace(/_/g, ' ').toUpperCase().trim();
  if (language === 'en') {
    return clean
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return translateText(clean, language);
}

/**
 * Converts English digits (0-9) to Odia (୦-୯) or Hindi (०-९) numerals
 */
export function toIndicDigits(input: string | number | undefined | null, language: Language): string {
  if (input === undefined || input === null) return '';
  const str = String(input);
  if (language === 'en') return str;

  const HINDI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const ODIA_DIGITS = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];

  const digits = language === 'hi' ? HINDI_DIGITS : ODIA_DIGITS;

  return str.replace(/[0-9]/g, (digit) => digits[parseInt(digit, 10)]);
}

/**
 * Extracts a meaningful initial for monogram avatars (skipping honorifics like Sri, Shri, Smt, Dr)
 */
export function getMonogramInitial(name: string): string {
  if (!name) return 'V';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const honorifics = ['sri', 'shri', 'smt', 'dr', 'mr', 'mrs', 'miss', 'lord', 'pandit', 'er'];
  const meaningful = parts.find((p) => !honorifics.includes(p.toLowerCase())) || parts[0];
  return meaningful ? meaningful.charAt(0).toUpperCase() : 'V';
}



