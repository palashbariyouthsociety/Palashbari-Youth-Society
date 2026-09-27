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

export function parseEventDate(dateStr: string): {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  bn: string;
  en: string;
  isValid: boolean;
} {
  if (!dateStr) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      timestamp: now.getTime(),
      bn: '',
      en: '',
      isValid: false,
    };
  }

  // Strip time part if present e.g. "9/30/2026 12:00:00"
  const cleanDateStr = dateStr.trim().split(/[ T]/)[0];
  const parts = cleanDateStr.split(/[/.-]/);

  let year = 2026;
  let month = 1;
  let day = 1;
  let isValid = false;

  if (parts.length === 3) {
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    const p2 = parseInt(parts[2], 10);

    if (!isNaN(p0) && !isNaN(p1) && !isNaN(p2)) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        year = p0;
        month = p1;
        day = p2;
        isValid = true;
      } else {
        // Either MM/DD/YYYY or DD/MM/YYYY
        year = p2 < 100 ? 2000 + p2 : p2;
        if (p0 > 12 && p1 <= 12) {
          // DD/MM/YYYY
          day = p0;
          month = p1;
          isValid = true;
        } else if (p1 > 12 && p0 <= 12) {
          // MM/DD/YYYY
          month = p0;
          day = p1;
          isValid = true;
        } else {
          // Standard Google Sheets / US format: MM/DD/YYYY
          month = p0;
          day = p1;
          isValid = true;
        }
      }
    }
  }

  // Bound check month and day
  if (month < 1 || month > 12) month = 1;
  if (day < 1 || day > 31) day = 1;

  const bnMonth = BN_MONTHS[month - 1] || '';
  const enMonth = EN_MONTHS[month - 1] || '';
  const bnDay = toBengaliNumerals(day);
  const bnYear = toBengaliNumerals(year);

  // Set timestamp to noon on that date to avoid timezone shift issues
  const dateObj = new Date(year, month - 1, day, 12, 0, 0);
  const timestamp = isNaN(dateObj.getTime()) ? Date.now() : dateObj.getTime();

  return {
    year,
    month,
    day,
    timestamp,
    bn: `${bnDay} ${bnMonth}, ${bnYear}`,
    en: `${enMonth} ${day}, ${year}`,
    isValid,
  };
}

export function formatDate(dateStr: string): { bn: string; en: string } {
  const details = parseEventDate(dateStr);
  return {
    bn: details.bn || toBengaliNumerals(dateStr),
    en: details.en || dateStr,
  };
}

export function determineActivityStatus(
  dateTimestamp: number,
  title: string,
  desc: string
): { isFuture: boolean; status: 'ongoing' | 'completed' } {
  const now = new Date();
  // Today at midnight
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const isDateFuture = dateTimestamp >= todayMidnight;
  const combined = `${title} ${desc}`.toLowerCase();

  const hasOngoingKeywords =
    combined.includes('উদ্যোগ গ্রহণ করা হয়েছে') ||
    combined.includes('উদ্যোগ নেওয়া হয়েছে') ||
    combined.includes('উদ্যোগ গ্রহণ') ||
    combined.includes('চলমান') ||
    combined.includes('চলছে') ||
    combined.includes('অনুদান চলছে') ||
    combined.includes('তহবিল সংগ্রহ');

  const isOngoing = isDateFuture || hasOngoingKeywords;

  return {
    isFuture: isOngoing,
    status: isOngoing ? 'ongoing' : 'completed',
  };
}

export function isFutureOrOngoingDate(dateStr: string): boolean {
  const details = parseEventDate(dateStr);
  return determineActivityStatus(details.timestamp, '', '').isFuture;
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

export interface ColumnIndices {
  timestamp: number;
  title: number;
  date: number;
  description: number;
  media: number;
  category: number;
}

export function resolveColumnIndices(headerRow: string[]): ColumnIndices {
  const indices: ColumnIndices = {
    timestamp: -1,
    title: -1,
    date: -1,
    description: -1,
    media: -1,
    category: -1,
  };

  headerRow.forEach((rawHeader, idx) => {
    const h = rawHeader.toLowerCase().trim();

    // 1. Title
    if (
      indices.title === -1 &&
      (h.includes('শিরোনাম') || h.includes('title') || h.includes('headline') || h.includes('কার্যক্রমের নাম'))
    ) {
      indices.title = idx;
    }
    // 2. Submission timestamp
    else if (
      indices.timestamp === -1 &&
      (h.includes('timestamp') || h.includes('টাইমস্ট্যাম্প') || h.includes('সময়কাল') || h.includes('submission'))
    ) {
      indices.timestamp = idx;
    }
    // 3. Event Date (explicitly exclude submission timestamp)
    else if (
      indices.date === -1 &&
      (h.includes('তারিখ') || h.includes('date of event') || h.includes('event date') || (h.includes('date') && !h.includes('timestamp')))
    ) {
      indices.date = idx;
    }
    // 4. Description
    else if (
      indices.description === -1 &&
      (h.includes('বিবরণ') || h.includes('desc') || h.includes('report') || h.includes('story') || h.includes('বিস্তারিত'))
    ) {
      indices.description = idx;
    }
    // 5. Media
    else if (
      indices.media === -1 &&
      (h.includes('মিডিয়া') || h.includes('মিডিয়া') || h.includes('media') || h.includes('ডকুমেন্টেশন') || h.includes('ছবি') || h.includes('image') || h.includes('drive'))
    ) {
      indices.media = idx;
    }
    // 6. Category
    else if (
      indices.category === -1 &&
      (h.includes('ধরন') || h.includes('ধরণ') || h.includes('ক্যাটেগরি') || h.includes('category') || h.includes('type') || h.includes('বিভাগ'))
    ) {
      indices.category = idx;
    }
  });

  // Fallbacks matching standard Google Form response sheet order:
  // Col 0: Timestamp, Col 1: Title, Col 2: Event Date, Col 3: Description, Col 4: Media, Col 5: Category
  if (indices.title === -1) indices.title = 1;
  if (indices.date === -1) indices.date = 2;
  if (indices.description === -1) indices.description = 3;
  if (indices.media === -1) indices.media = 4;
  if (indices.category === -1) indices.category = 5;

  return indices;
}

export function transformRowsToActivities(rows: string[][]): ActivityItem[] {
  if (!rows || rows.length <= 1) return [];

  const headerRow = rows[0];
  const cols = resolveColumnIndices(headerRow);
  const dataRows = rows.slice(1);

  const activities = dataRows
    .map((row, idx) => {
      const title = row[cols.title]?.trim() || '';
      const date = row[cols.date]?.trim() || '';
      const submissionTimestamp = cols.timestamp !== -1 ? row[cols.timestamp]?.trim() : undefined;
      const description = row[cols.description]?.trim() || '';
      const mediaStr = row[cols.media]?.trim() || '';
      const rawCategory = row[cols.category]?.trim() || '';

      if (!title) return null;

      const dateDetails = parseEventDate(date);
      const category = resolveCategory(rawCategory, title, description);
      const images = parseDriveImages(mediaStr);
      const { isFuture, status } = determineActivityStatus(
        dateDetails.timestamp,
        title,
        description
      );

      return {
        id: `activity-${idx + 1}`,
        title,
        date,
        timestamp: submissionTimestamp,
        eventDateTimestamp: dateDetails.timestamp,
        year: dateDetails.year,
        month: dateDetails.month,
        day: dateDetails.day,
        formattedDateBn: dateDetails.bn,
        formattedDateEn: dateDetails.en,
        description,
        category: category.en,
        categoryBn: category.bn,
        images,
        isFuture,
        status,
      } as ActivityItem;
    })
    .filter((item): item is ActivityItem => item !== null);

  // "aikhhane date onujaye order hobe" -> Sort by Event Date descending (newest first)
  activities.sort((a, b) => b.eventDateTimestamp - a.eventDateTimestamp);

  return activities;
}

// Reliable fallback data representing the current live Google Sheet responses
export const FALLBACK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'activity-5',
    title: 'পলাশবাড়ী বড় জামে মসজিদের মুসল্লীদের জুতা রাখা জন্য স্টিলের রেক বানানোর উদ্যোগ গ্রহণ করা হয়েছে।',
    date: '10/15/2026',
    timestamp: '9/27/2026 1:09:30',
    eventDateTimestamp: new Date(2026, 9, 15, 12, 0, 0).getTime(),
    year: 2026,
    month: 10,
    day: 15,
    formattedDateBn: '১৫ অক্টোবর, ২০২৬',
    formattedDateEn: 'Oct 15, 2026',
    description:
      '🕌 পলাশবাড়ী বড় জামে মসজিদ\n📢 স্টিলের জুতা রাখার রেক নির্মাণের উদ্যোগ\n\nআলহামদুলিল্লাহ। পলাশবাড়ী বড় জামে মসজিদের সম্মানিত মুসল্লিদের জুতা-স্যান্ডেল সুন্দর ও সুশৃঙ্খলভাবে রাখার সুবিধার্থে স্টিলের জুতা রাখার রেক নির্মাণের উদ্যোগ গ্রহণ করা হয়েছে।\n\nমসজিদের পরিবেশকে আরও পরিচ্ছন্ন, সুন্দর, গুছানো ও দৃষ্টিনন্দন করার লক্ষ্যে এই উদ্যোগ নেওয়া হয়েছে। আপনার সামান্য সহযোগিতাও মসজিদের সুন্দর ও সুশৃঙ্খল পরিবেশ তৈরিতে গুরুত্বপূর্ণ ভূমিকা রাখতে পারে।',
    category: 'Infrastructure & Social Work',
    categoryBn: 'অবকাঠামো ও সমাজসেবা',
    isFuture: true,
    status: 'ongoing',
    images: parseDriveImages(
      'https://drive.google.com/open?id=1boW_c6AbAhmnqHp5cz9vNXIL1SVwe6tQ, https://drive.google.com/open?id=1M716e8Wsrqw5RMtjnqrDWFEBN6iRJbmo'
    ),
  },
  {
    id: 'activity-1',
    title: 'বৃক্ষরোপণ ও এলাকা পরিচ্ছন্নতা অভিযান',
    date: '9/30/2026',
    timestamp: '9/26/2026 12:57:07',
    eventDateTimestamp: new Date(2026, 8, 30, 12, 0, 0).getTime(),
    year: 2026,
    month: 9,
    day: 30,
    formattedDateBn: '৩০ সেপ্টেম্বর, ২০২৬',
    formattedDateEn: 'Sep 30, 2026',
    description:
      'পরিবেশ সংরক্ষণ ও সামাজিক দায়বদ্ধতার অংশ হিসেবে পলাশবাড়ী বড় মসজিদ প্রাঙ্গণে পলাশবাড়ী ইয়াং সোসাইটির উদ্যোগে পরিচ্ছন্নতা ও বৃক্ষরোপণ কার্যক্রম পরিচালিত হয়। এই কর্মসূচির আওতায় চারপাশের ময়লা-আবর্জনা পরিষ্কার করা হয় এবং ৫০টি ফলজ ও ঔষধি গাছের চারা রোপণ করা হয়।',
    category: 'Environment & Afforestation',
    categoryBn: 'পরিবেশ ও বৃক্ষরোপণ',
    isFuture: true,
    status: 'ongoing',
    images: parseDriveImages(
      'https://drive.google.com/open?id=1LDQd1V0CF7Ab5j91YMu1ylanpDqQVeyv, https://drive.google.com/open?id=1ghjOOKPSBLUmfP1h1WMmy1lzBVRlUmeM, https://drive.google.com/open?id=12zZfzXlUiOUlzrytPUEERMqycHXHp7Fv'
    ),
  },
  {
    id: 'activity-2',
    title: 'রাস্তা উন্নয়ন ও সংস্কার কাজের প্রতিবেদন',
    date: '9/15/2026',
    timestamp: '9/26/2026 13:12:58',
    eventDateTimestamp: new Date(2026, 8, 15, 12, 0, 0).getTime(),
    year: 2026,
    month: 9,
    day: 15,
    formattedDateBn: '১৫ সেপ্টেম্বর, ২০২৬',
    formattedDateEn: 'Sep 15, 2026',
    description:
      'পলাশবাড়ী ইয়াং সোসাইটির উদ্যোগ এবং স্থানীয় যুবসমাজের সার্বিক সহায়তায় এলাকার খানাখন্দে ভরা রাস্তার সংস্কার ও উন্নয়ন কাজ সফলভাবে সম্পন্ন হয়েছে। আমাদের স্বেচ্ছাসেবী দলের কঠোর পরিশ্রমে রাস্তার বড় বড় গর্তগুলো ইট ও মাটি দিয়ে ভরাট করা হয়। এই উন্নয়নমূলক কাজের ফলে এলাকার প্রায় ২৫০ সাধারণ পথচারী ও যানবাহন এখন নিরাপদে চলাচল করতে পারবেন।',
    category: 'Infrastructure & Social Work',
    categoryBn: 'অবকাঠামো ও সমাজসেবা',
    isFuture: false,
    status: 'completed',
    images: parseDriveImages(
      'https://drive.google.com/open?id=1sAFikUaKbDhi8knS4LNrwNK2xZXtdvAE, https://drive.google.com/open?id=1afd3nnnn5-EP-Hc6RTP4t1H81gsim2zw, https://drive.google.com/open?id=11OwzA6TgkPJdpx-wY00VwNfW90LRaj82'
    ),
  },
  {
    id: 'activity-3',
    title: 'পলাশবাড়ী ইয়াং সোসাইটির সাধারণ আলোচনা বৈঠক',
    date: '5/20/2026',
    timestamp: '9/26/2026 13:43:02',
    eventDateTimestamp: new Date(2026, 4, 20, 12, 0, 0).getTime(),
    year: 2026,
    month: 5,
    day: 20,
    formattedDateBn: '২০ মে, ২০২৬',
    formattedDateEn: 'May 20, 2026',
    description:
      'সম্প্রতি সম্পন্ন হওয়া সামাজিক কাজসমূহ নিয়ে আলোচনা। বিগত কাজের সফলতা এবং কোথায় আরও ভালো করা যেত সে বিষয়ে মতামত গ্রহণ। আসন্ন কোনো ইভেন্ট বা সামাজিক কর্মসূচির খসড়া পরিকল্পনা এবং নতুন ফান্ড রাইজিং বা অনুদান সংগ্রহের কৌশল নিয়ে আলোচনা।',
    category: 'Meeting & General Assembly',
    categoryBn: 'সংগঠনিক ও সাধারণ সভা',
    isFuture: false,
    status: 'completed',
    images: parseDriveImages(
      'https://drive.google.com/open?id=1VLORq8nRieiTM0nDIfa0UgomnJJI6WQn, https://drive.google.com/open?id=14G4IMzlcmQUSSfk-2qPV8q3CqAVC184Z'
    ),
  },
  {
    id: 'activity-4',
    title: 'পলাশবাড়ী গ্রামের অসহায় শীতার্ত মানুষের মাঝে শীতবস্ত্র বিতরণ',
    date: '11/7/2025',
    timestamp: '9/26/2026 14:56:20',
    eventDateTimestamp: new Date(2025, 10, 7, 12, 0, 0).getTime(),
    year: 2025,
    month: 11,
    day: 7,
    formattedDateBn: '৭ নভেম্বর, ২০২৫',
    formattedDateEn: 'Nov 7, 2025',
    description:
      'শীতবস্ত্র বিতরণ কার্যক্রমের প্রধান উদ্দেশ্য ছিল অসহায় ও শীতার্ত মানুষের পাশে দাঁড়ানো এবং শীতের কষ্ট কিছুটা লাঘব করা। পলাশবাড়ী ইয়াং সোসাইটির মানবিক ও সামাজিক দায়িত্ব পালনের একটি উল্লেখযোগ্য উদ্যোগ হিসেবে সুবিধাবঞ্চিত মানুষের মাঝে শীতবস্ত্র ও লেপ বিতরণ সফলভাবে সম্পন্ন হয়।',
    category: 'Infrastructure & Social Work',
    categoryBn: 'অবকাঠামো ও সমাজসেবা',
    isFuture: false,
    status: 'completed',
    images: parseDriveImages('https://drive.google.com/open?id=1P2Ml7wNmvw-DOb_63bM25NFnF3bbXN89'),
  },
];

