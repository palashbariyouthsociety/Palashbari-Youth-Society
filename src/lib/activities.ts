import { ActivityItem, ActivityImage } from '@/types/activity';

export const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRZtAif5FqNadZqp49tSKGfbKzGQgzo2eFiTPWwxblUwCNUQ1Lg9Nensm6eWN4ciH1lkCgviEzEWKW/pub?gid=920276837&single=true&output=csv';

const BN_NUMERALS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const BN_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const EN_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function toBengaliNumerals(str: string | number): string {
  return String(str).replace(/[0-9]/g, (digit) => BN_NUMERALS[digit] || digit);
}

export function formatDate(dateStr: string): { bn: string; en: string } {
  if (!dateStr) return { bn: '', en: '' };

  const parts = dateStr.trim().split(/[/.-]/);
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (!isNaN(month) && !isNaN(day) && !isNaN(year) && month >= 1 && month <= 12) {
      const bnMonth = BN_MONTHS[month - 1];
      const enMonth = EN_MONTHS[month - 1];
      const bnDay = toBengaliNumerals(day);
      const bnYear = toBengaliNumerals(year);

      return {
        bn: `${bnDay} ${bnMonth}, ${bnYear}`,
        en: `${enMonth} ${day}, ${year}`,
      };
    }
  }

  return {
    bn: toBengaliNumerals(dateStr),
    en: dateStr,
  };
}

export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];

  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];

  const driveMatch = url.match(/drive\.google\.com\/.*\/([a-zA-Z0-9_-]{25,})/);
  if (driveMatch && driveMatch[1]) return driveMatch[1];

  return null;
}

export function parseDriveImages(mediaStr: string): ActivityImage[] {
  if (!mediaStr) return [];

  // Media URLs can be comma, space or newline separated
  const rawUrls = mediaStr
    .split(/[\n,]+/)
    .map((u) => u.trim())
    .filter((u) => u.length > 0 && u.includes('drive.google.com'));

  const images: ActivityImage[] = [];

  rawUrls.forEach((driveUrl) => {
    const fileId = extractDriveFileId(driveUrl);
    if (fileId) {
      images.push({
        id: fileId,
        driveUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
        directUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
        previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      });
    }
  });

  return images;
}

export function detectCategory(title: string, desc: string): { bn: string; en: string } {
  const combined = `${title} ${desc}`.toLowerCase();
  const titleLower = title.toLowerCase();

  if (titleLower.includes('সভা') || titleLower.includes('বৈঠক') || titleLower.includes('আলোচনা')) {
    return { bn: 'সংগঠনিক ও সাধারণ সভা', en: 'Meeting & Governance' };
  }
  if (combined.includes('বৃক্ষ') || combined.includes('পরিবেশ') || combined.includes('গাছ') || combined.includes('চারা')) {
    return { bn: 'পরিবেশ ও বৃক্ষরোপণ', en: 'Environment & Afforestation' };
  }
  if (combined.includes('রাস্তা') || combined.includes('সংস্কার') || combined.includes('উন্নয়ন') || combined.includes('সেতু')) {
    return { bn: 'অবকাঠামো ও সমাজসেবা', en: 'Infrastructure & Welfare' };
  }
  if (combined.includes('চিকিৎসা') || combined.includes('রক্ত') || combined.includes('স্বাস্থ্য')) {
    return { bn: 'স্বাস্থ্য ও রক্তদান', en: 'Health & Blood Donation' };
  }
  if (combined.includes('শিক্ষা') || combined.includes('বই') || combined.includes('বিদ্যালয়') || combined.includes('ছাত্র')) {
    return { bn: 'শিক্ষা ও মেধা বিকাশ', en: 'Education & Youth' };
  }
  if (combined.includes('ত্রাণ') || combined.includes('শীতবস্ত্র') || combined.includes('সাহায্য')) {
    return { bn: 'মানবিক সহায়তা ও ত্রাণ', en: 'Relief & Humanitarian Aid' };
  }

  return { bn: 'সামাজিক কল্যাণ কর্মসূচি', en: 'Social Welfare Program' };
}

export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentVal += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentVal.trim());
      if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.length > 1 || currentRow[0] !== '') {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function isFutureOrOngoingDate(dateStr: string): boolean {
  if (!dateStr) return false;

  try {
    const parts = dateStr.trim().split(/[/.-]/);
    let eventDate: Date | null = null;

    if (parts.length === 3) {
      const p0 = parseInt(parts[0], 10);
      const p1 = parseInt(parts[1], 10);
      const p2 = parseInt(parts[2], 10);

      if (!isNaN(p0) && !isNaN(p1) && !isNaN(p2)) {
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          eventDate = new Date(p0, p1 - 1, p2, 23, 59, 59);
        } else if (p0 > 12 && p1 <= 12) {
          // DD/MM/YYYY
          const year = p2 < 100 ? 2000 + p2 : p2;
          eventDate = new Date(year, p1 - 1, p0, 23, 59, 59);
        } else {
          // MM/DD/YYYY
          const year = p2 < 100 ? 2000 + p2 : p2;
          eventDate = new Date(year, p0 - 1, p1, 23, 59, 59);
        }
      }
    } else {
      eventDate = new Date(dateStr);
    }

    if (!eventDate || isNaN(eventDate.getTime())) return false;

    // Check if event is on or after the current time
    const now = new Date();
    return eventDate.getTime() > now.getTime();
  } catch {
    return false;
  }
}

export const KNOWN_CATEGORIES: Record<string, string> = {
  'পরিবেশ ও বৃক্ষরোপণ': 'Environment & Afforestation',
  'বৃক্ষরোপণ ও পরিবেশ': 'Environment & Afforestation',
  'পরিবেশ ও জলবায়ু': 'Environment & Climate',
  'অবকাঠামো ও সমাজসেবা': 'Infrastructure & Social Work',
  'অবকাঠামো উন্নয়ন': 'Infrastructure Development',
  'রাস্তা ও জনপথ উন্নয়ন': 'Roads & Infrastructure',
  'সংগঠনিক ও সাধারণ সভা': 'Meeting & General Assembly',
  'সাধারণ সভা ও আলোচনা': 'General Meeting & Discussion',
  'সাংগঠনিক সভা': 'Organizational Meeting',
  'স্বাস্থ্য ও রক্তদান': 'Health & Blood Donation',
  'রক্তদান কর্মসূচি': 'Blood Donation Drive',
  'বিনামূল্যে চিকিৎসা ক্যাম্প': 'Free Medical Camp',
  'শিক্ষা ও মেধা বিকাশ': 'Education & Youth Development',
  'শিক্ষা ও পাঠাগার': 'Education & Library',
  'মেধাবৃত্তি ও সম্মাননা': 'Scholarship & Award',
  'মানবিক সহায়তা ও ত্রাণ': 'Humanitarian Aid & Relief',
  'শীতবস্ত্র বিতরণ': 'Winter Clothes Distribution',
  'ত্রাণ ও পুনর্বাসন': 'Relief & Rehabilitation',
  'ক্রীড়া ও সাংস্কৃতিক উৎসব': 'Sports & Culture',
  'যুব উন্নয়ন ও কর্মশালা': 'Youth Development & Workshop',
  'সামাজিক সচেতনতা': 'Social Awareness',
};

export function resolveCategory(
  rawCategory: string | undefined,
  title: string,
  desc: string
): { bn: string; en: string } {
  const trimmed = rawCategory?.trim();
  if (trimmed && trimmed.length > 0) {
    if (KNOWN_CATEGORIES[trimmed]) {
      return { bn: trimmed, en: KNOWN_CATEGORIES[trimmed] };
    }
    for (const [key, val] of Object.entries(KNOWN_CATEGORIES)) {
      if (trimmed.includes(key) || key.includes(trimmed)) {
        return { bn: trimmed, en: val };
      }
    }
    return {
      bn: trimmed,
      en: trimmed,
    };
  }

  return detectCategory(title, desc);
}

interface ColumnIndices {
  title: number;
  date: number;
  description: number;
  media: number;
  category: number;
}

export function resolveColumnIndices(headerRow: string[]): ColumnIndices {
  const indices: ColumnIndices = {
    title: -1,
    date: -1,
    description: -1,
    media: -1,
    category: -1,
  };

  headerRow.forEach((rawHeader, idx) => {
    const h = rawHeader.toLowerCase().trim();
    if (
      indices.title === -1 &&
      (h.includes('শিরোনাম') || h.includes('title') || h.includes('headline') || h.includes('কার্যক্রমের নাম'))
    ) {
      indices.title = idx;
    } else if (
      indices.date === -1 &&
      (h.includes('তারিখ') || h.includes('date') || h.includes('time'))
    ) {
      indices.date = idx;
    } else if (
      indices.description === -1 &&
      (h.includes('বিবরণ') || h.includes('desc') || h.includes('report') || h.includes('story') || h.includes('বিস্তারিত'))
    ) {
      indices.description = idx;
    } else if (
      indices.media === -1 &&
      (h.includes('মিডিয়া') || h.includes('মিডিয়া') || h.includes('media') || h.includes('ডকুমেন্টেশন') || h.includes('ছবি') || h.includes('image') || h.includes('drive'))
    ) {
      indices.media = idx;
    } else if (
      indices.category === -1 &&
      (h.includes('ধরন') || h.includes('ধরণ') || h.includes('ক্যাটেগরি') || h.includes('category') || h.includes('type') || h.includes('বিভাগ'))
    ) {
      indices.category = idx;
    }
  });

  return {
    title: indices.title !== -1 ? indices.title : 0,
    date: indices.date !== -1 ? indices.date : 1,
    description: indices.description !== -1 ? indices.description : 2,
    media: indices.media !== -1 ? indices.media : 3,
    category: indices.category !== -1 ? indices.category : 4,
  };
}

export function transformRowsToActivities(rows: string[][]): ActivityItem[] {
  if (!rows || rows.length <= 1) return [];

  const headerRow = rows[0];
  const cols = resolveColumnIndices(headerRow);
  const dataRows = rows.slice(1);

  return dataRows
    .map((row, idx) => {
      const title = row[cols.title]?.trim() || '';
      const date = row[cols.date]?.trim() || '';
      const description = row[cols.description]?.trim() || '';
      const mediaStr = row[cols.media]?.trim() || '';
      const rawCategory = row[cols.category]?.trim() || '';

      if (!title) return null;

      const dateObj = formatDate(date);
      const category = resolveCategory(rawCategory, title, description);
      const images = parseDriveImages(mediaStr);
      const isFuture = isFutureOrOngoingDate(date);

      return {
        id: `activity-${idx + 1}`,
        title,
        date,
        formattedDateBn: dateObj.bn,
        formattedDateEn: dateObj.en,
        description,
        category: category.en,
        categoryBn: category.bn,
        images,
        isFuture,
      } as ActivityItem;
    })
    .filter((item): item is ActivityItem => item !== null);
}

// Reliable fallback data based on current live CSV
export const FALLBACK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'activity-1',
    title: 'বৃক্ষরোপণ ও এলাকা পরিচ্ছন্নতা অভিযান',
    date: '9/26/2026',
    formattedDateBn: '২৬ সেপ্টেম্বর, ২০২৬',
    formattedDateEn: 'Sep 26, 2026',
    description:
      'পরিবেশ সংরক্ষণ ও সামাজিক দায়বদ্ধতার অংশ হিসেবে আজ পলাশবাড়ী বড় মসজিদ প্রাঙ্গণে পলাশবাড়ী ইয়াং সোসাইটির উদ্যোগে পরিচ্ছন্নতা ও বৃক্ষরোপণ কার্যক্রম পরিচালিত হয়। এই কর্মসূচির আওতায় পলাশবাড়ী বড় মসজিদের চারপাশের ময়লা-আবর্জনা পরিষ্কার করা হয় এবং ৫০টি ফলজ ও ঔষধি গাছের চারা রোপণ করা হয়। পরিবেশের ভারসাম্য রক্ষা ও নিজ এলাকা পরিচ্ছন্ন রাখার বার্তা দিয়ে সফলভাবে কার্যক্রমটি শেষ হয়।',
    category: 'Environment & Afforestation',
    categoryBn: 'পরিবেশ ও বৃক্ষরোপণ',
    isFuture: true,
    images: parseDriveImages(
      'https://drive.google.com/open?id=1LDQd1V0CF7Ab5j91YMu1ylanpDqQVeyv, https://drive.google.com/open?id=1ghjOOKPSBLUmfP1h1WMmy1lzBVRlUmeM, https://drive.google.com/open?id=12zZfzXlUiOUlzrytPUEERMqycHXHp7Fv'
    ),
  },
  {
    id: 'activity-2',
    title: 'রাস্তা উন্নয়ন ও সংস্কার কাজের প্রতিবেদন',
    date: '9/15/2026',
    formattedDateBn: '১৫ সেপ্টেম্বর, ২০২৬',
    formattedDateEn: 'Sep 15, 2026',
    description:
      'পলাশবাড়ী ইয়াং সোসাইটির উদ্যোগ এবং স্থানীয় যুবসমাজের সার্বিক সহায়তায় এলাকার খানাখন্দে ভরা রাস্তার সংস্কার ও উন্নয়ন কাজ সফলভাবে সম্পন্ন হয়েছে। উক্ত রাস্তাটি দীর্ঘদিন ধরে চলাচলের একদম অনুপযোগী হয়ে পড়েছিল। আমাদের স্বেচ্ছাসেবী দলের কঠোর পরিশ্রমে রাস্তার বড় বড় গর্তগুলো ইট ও মাটি দিয়ে ভরাট করা হয় এবং রাস্তার দুই পাশের ময়লা-আবর্জনা পরিষ্কার করা হয়। এই উন্নয়নমূলক কাজের ফলে এলাকার প্রায় ২৫০ সাধারণ পথচারী ও যানবাহন এখন নিরাপদে চলাচল করতে পারবেন।',
    category: 'Infrastructure & Social Work',
    categoryBn: 'অবকাঠামো ও সমাজসেবা',
    isFuture: false,
    images: parseDriveImages(
      'https://drive.google.com/open?id=1sAFikUaKbDhi8knS4LNrwNK2xZXtdvAE, https://drive.google.com/open?id=1afd3nnnn5-EP-Hc6RTP4t1H81gsim2zw, https://drive.google.com/open?id=11OwzA6TgkPJdpx-wY00VwNfW90LRaj82'
    ),
  },
  {
    id: 'activity-3',
    title: 'পলাশবাড়ী ইয়াং সোসাইটির সাধারণ আলোচনা বৈঠক',
    date: '5/20/2026',
    formattedDateBn: '২০ মে, ২০২৬',
    formattedDateEn: 'May 20, 2026',
    description:
      'সম্প্রতি সম্পন্ন হওয়া সামাজিক কাজসমূহ (যেমন: রক্তদান, রাস্তা সংস্কার, পরিচ্ছন্নতা বা সাহায্য বিতরণ) নিয়ে আলোচনা।\nবিগত কাজের সফলতা এবং কোথায় আরও ভালো করা যেত সে বিষয়ে মতামত গ্রহণ।\n\nআসন্ন কোনো ইভেন্ট বা সামাজিক কর্মসূচির (যেমন: শীতবস্ত্র বিতরণ, বৃক্ষরোপণ, সচেতনতামূলক ক্যাম্পেইন) খসড়া পরিকল্পনা।\n\nঅর্থ সম্পাদক কর্তৃক বিগত মাসের আয়-ব্যয়ের হিসাব পেশ ও অনুমোদন।\n\nনতুন ফান্ড রাইজিং বা অনুদান সংগ্রহের কৌশল নিয়ে আলোচনা।',
    category: 'Meeting & General Assembly',
    categoryBn: 'সংগঠনিক ও সাধারণ সভা',
    isFuture: false,
    images: parseDriveImages(
      'https://drive.google.com/open?id=1VLORq8nRieiTM0nDIfa0UgomnJJI6WQn, https://drive.google.com/open?id=14G4IMzlcmQUSSfk-2qPV8q3CqAVC184Z'
    ),
  },
];
