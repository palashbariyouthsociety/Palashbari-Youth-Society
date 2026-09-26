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

export function isFutureOrOngoingDate(dateStr: string, title?: string, desc?: string): boolean {
  const combined = `${title || ''} ${desc || ''}`.toLowerCase();
  if (
    combined.includes('আসন্ন') ||
    combined.includes('আগামী') ||
    combined.includes('চলমান') ||
    combined.includes('তহবিল') ||
    combined.includes('সাহায্য চাই') ||
    combined.includes('অনুদান')
  ) {
    return true;
  }

  if (!dateStr) return false;

  try {
    const parts = dateStr.trim().split(/[/.-]/);
    let eventDate: Date | null = null;

    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        eventDate = new Date(year, month, day, 23, 59, 59);
      } else {
        // MM/DD/YYYY or M/D/YYYY
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        eventDate = new Date(year, month, day, 23, 59, 59);
      }
    } else {
      eventDate = new Date(dateStr);
    }

    if (!eventDate || isNaN(eventDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return eventDate.getTime() >= today.getTime();
  } catch {
    return false;
  }
}

export function transformRowsToActivities(rows: string[][]): ActivityItem[] {
  if (!rows || rows.length <= 1) return [];

  // Exclude header row
  const dataRows = rows.slice(1);

  return dataRows
    .map((row, idx) => {
      const title = row[0]?.trim() || '';
      const date = row[1]?.trim() || '';
      const description = row[2]?.trim() || '';
      const mediaStr = row[3]?.trim() || '';

      if (!title) return null;

      const dateObj = formatDate(date);
      const category = detectCategory(title, description);
      const images = parseDriveImages(mediaStr);
      const isFuture = isFutureOrOngoingDate(date, title, description);

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
    category: 'Infrastructure & Welfare',
    categoryBn: 'অবকাঠামো ও সমাজসেবা',
    isFuture: false,
    images: parseDriveImages(
      'https://drive.google.com/open?id=1sAFikUaKbDhi8knS4LNrwNK2xZXtdvAE, https://drive.google.com/open?id=1afd3nnnn5-EP-Hc6RTP4t1H81gsim2zw, https://drive.google.com/open?id=11OwzA6TgkPJdpx-wY00VwNfW90LRaj82'
    ),
  },
];
