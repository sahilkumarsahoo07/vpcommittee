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
