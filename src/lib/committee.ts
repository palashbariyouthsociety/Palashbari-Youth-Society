import { CommitteeMember } from '@/types/committee';

export const COMMITTEE_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1ZskhRaQL8oQ5_q1KcP1zvJ9cT2DgauUvX1Gf1wHpYgriMqvRYz7Xefn-A_3GPnfL2VkNWfkLvH8X/pub?gid=779964029&single=true&output=csv';

export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];

  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];

  const driveMatch = url.match(/drive\.google\.com\/.*\/([a-zA-Z0-9_-]{20,})/);
  if (driveMatch && driveMatch[1]) return driveMatch[1];

  return null;
}

export function getDrivePhotoUrls(url: string) {
  const fileId = extractDriveFileId(url);
  if (!fileId) return { photoUrl: '', directUrl: '', fileId: '' };

  return {
    fileId,
    photoUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
    directUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
  };
}

export function categorizeRole(role: string): 'leadership' | 'secretariat' | 'member' {
  const r = (role || '').trim();
  if (
    r.includes('সভাপতি') ||
    r.includes('প্রতিষ্ঠাতা') ||
    r.includes('সাধারণ সম্পাদক') ||
    r.includes('যুগ্ম সাধারণ সম্পাদক') ||
    r.includes('সাংগঠনিক সম্পাদক')
  ) {
    return 'leadership';
  }
  if (r.includes('সম্পাদক')) {
    return 'secretariat';
  }
  return 'member';
}

export function parseCommitteeCSV(csvText: string): CommitteeMember[] {
  if (!csvText) return FALLBACK_COMMITTEE;

  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return FALLBACK_COMMITTEE;

  const members: CommitteeMember[] = [];

  // Line 0 is header: নাম,পদবী,Photo
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Split by comma respecting quotes
    const row: string[] = [];
    let insideQuotes = false;
    let current = '';

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const c = line[charIdx];
      if (c === '"') {
        insideQuotes = !insideQuotes;
      } else if (c === ',' && !insideQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += c;
      }
    }
    row.push(current.trim());

    const name = (row[0] || '').replace(/^"|"$/g, '').trim();
    const role = (row[1] || '').replace(/^"|"$/g, '').trim();
    const photoDrive = (row[2] || '').replace(/^"|"$/g, '').trim();

    if (!name && !role) continue;

    const fileId = extractDriveFileId(photoDrive) || undefined;
    const photoUrl = fileId
      ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
      : '';

    members.push({
      id: `member-${i}-${name.replace(/\s+/g, '-')}`,
      name,
      role: role || 'সদস্য',
      photoUrl,
      driveUrl: photoDrive,
      fileId,
      category: categorizeRole(role),
      order: i,
    });
  }

  return members.length > 0 ? members : FALLBACK_COMMITTEE;
}

export const FALLBACK_COMMITTEE: CommitteeMember[] = [
  {
    id: 'member-1-rashed-kabir',
    name: 'হাফেজ মাওঃ মোঃ রাশেদ কবির',
    role: 'সভাপতি',
    photoUrl: 'https://drive.google.com/thumbnail?id=1CO1XD9C_qyB7P6OzK_2kBRf3XjtucXjh&sz=w800',
    driveUrl: 'https://drive.google.com/open?id=1CO1XD9C_qyB7P6OzK_2kBRf3XjtucXjh',
    fileId: '1CO1XD9C_qyB7P6OzK_2kBRf3XjtucXjh',
    category: 'leadership',
    order: 1,
  },
  {
    id: 'member-2-mehedi-hasan',
    name: 'মোঃ মেহেদী হাসান',
    role: 'সহ-সভাপতি',
    photoUrl: 'https://drive.google.com/thumbnail?id=1X4Bc4LH9B_EoiVoUH5QY246--IA5IesK&sz=w800',
    driveUrl: 'https://drive.google.com/open?id=1X4Bc4LH9B_EoiVoUH5QY246--IA5IesK',
    fileId: '1X4Bc4LH9B_EoiVoUH5QY246--IA5IesK',
    category: 'leadership',
    order: 2,
  },
  {
    id: 'member-3-abdur-rahim',
    name: 'হাফেজ মাওঃ মোঃ আব্দুর রহিম',
    role: 'প্রতিষ্ঠাতা পরিচালক',
    photoUrl: '',
    driveUrl: '',
    category: 'leadership',
    order: 3,
  },
  {
    id: 'member-4-abubakar-siddique',
    name: 'মোঃ আবুবকর সিদ্দিক',
    role: 'সাধারণ সম্পাদক',
    photoUrl: 'https://drive.google.com/thumbnail?id=1JSoH_RRuHKf1MPfSQUDWBVqvB2S4bBr7&sz=w800',
    driveUrl: 'https://drive.google.com/open?id=1JSoH_RRuHKf1MPfSQUDWBVqvB2S4bBr7',
    fileId: '1JSoH_RRuHKf1MPfSQUDWBVqvB2S4bBr7',
    category: 'leadership',
    order: 4,
  },
  {
    id: 'member-5-rayhan-rafi',
    name: 'মোঃ রায়হান রাফি',
    role: 'যুগ্ম সাধারণ সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'leadership',
    order: 5,
  },
  {
    id: 'member-6-alamin-islam-roni',
    name: 'মোঃ আলামিন ইসলাম রনি',
    role: 'সাংগঠনিক সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'leadership',
    order: 6,
  },
  {
    id: 'member-7-tuhin-islam',
    name: 'মোঃ তুহিন ইসলাম',
    role: 'সহ-সাংগঠনিক সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'leadership',
    order: 7,
  },
  {
    id: 'member-8-fahim-islam',
    name: 'মোঃ ফাহিম ইসলাম',
    role: 'অর্থ সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'secretariat',
    order: 8,
  },
  {
    id: 'member-9-bappi-islam',
    name: 'মোঃ বাপ্পি ইসলাম',
    role: 'দপ্তর সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'secretariat',
    order: 9,
  },
  {
    id: 'member-10-sourav-islam',
    name: 'মোঃ সৌরভ ইসলাম',
    role: 'প্রচার ও প্রকাশনা সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'secretariat',
    order: 10,
  },
  {
    id: 'member-11-roki-islam',
    name: 'মোঃ রকি ইসলাম',
    role: 'সমাজকল্যাণ সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'secretariat',
    order: 11,
  },
  {
    id: 'member-12-jihadi-islam',
    name: 'মোঃ জিহাদী ইসলাম',
    role: 'শিক্ষা ও সাংস্কৃতিক সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'secretariat',
    order: 12,
  },
  {
    id: 'member-13-mahid-islam',
    name: 'মোঃ মাহিদ ইসলাম',
    role: 'ক্রীড়া সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'secretariat',
    order: 13,
  },
  {
    id: 'member-14-nahid-islam',
    name: 'নাহিদ ইসলাম',
    role: 'তথ্য ও প্রযুক্তি সম্পাদক',
    photoUrl: 'https://drive.google.com/thumbnail?id=1aPrTxL8jpT1Lend-h5x5XqoSF28Dc_mB&sz=w800',
    driveUrl: 'https://drive.google.com/file/d/1aPrTxL8jpT1Lend-h5x5XqoSF28Dc_mB/view?usp=sharing',
    fileId: '1aPrTxL8jpT1Lend-h5x5XqoSF28Dc_mB',
    category: 'secretariat',
    order: 14,
  },
  {
    id: 'member-15-asaduzzaman-apu',
    name: 'মোঃ আসাদুজ্জামান অপু',
    role: 'স্বাস্থ্য বিষয়ক সম্পাদক',
    photoUrl: 'https://drive.google.com/thumbnail?id=1d7ECUwMj51Z6sUcZdw0RkM5aaeZ6kHJ7&sz=w800',
    driveUrl: 'https://drive.google.com/open?id=1d7ECUwMj51Z6sUcZdw0RkM5aaeZ6kHJ7',
    fileId: '1d7ECUwMj51Z6sUcZdw0RkM5aaeZ6kHJ7',
    category: 'secretariat',
    order: 15,
  },
  {
    id: 'member-16-masud-rana',
    name: 'মোঃ মাসুদ রানা',
    role: 'পরিবেশ বিষয়ক সম্পাদক',
    photoUrl: '',
    driveUrl: '',
    category: 'secretariat',
    order: 16,
  },
  {
    id: 'member-17-parvez-islam',
    name: 'মোঃ পারভেজ ইসলাম',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 17,
  },
  {
    id: 'member-18-abdullah-al-naeem',
    name: 'মোঃ আব্দুল্লাহ আল নাঈম',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 18,
  },
  {
    id: 'member-19-sojib-islam',
    name: 'মোঃ সজিব ইসলাম',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 19,
  },
  {
    id: 'member-20-mominur-rahman',
    name: 'মোঃ মমিনুর রহমান',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 20,
  },
  {
    id: 'member-21-abdur-razzaq',
    name: 'মোঃ আব্দুর রাজ্জাক',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 21,
  },
  {
    id: 'member-22-nurnabi-islam',
    name: 'মোঃ নুরনবী ইসলাম',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 22,
  },
  {
    id: 'member-23-suel-islam',
    name: 'মোঃ সুয়েল ইসলাম',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 23,
  },
  {
    id: 'member-24-abdul-malek',
    name: 'মোঃ আব্দুল মালেক',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 24,
  },
  {
    id: 'member-25-monir-islam',
    name: 'মোঃ মনির ইসলাম',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 25,
  },
  {
    id: 'member-26-badiuzzaman-bappi',
    name: 'মোঃ বদিউজ্জামান বাপ্পি',
    role: 'কার্যকরী সদস্য',
    photoUrl: '',
    driveUrl: '',
    category: 'member',
    order: 26,
  },
];
