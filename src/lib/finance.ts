import { Transaction, FinanceSummary, ParsedDateInfo } from '@/types/finance';
import { toBengaliNumerals } from '@/lib/activities';

export const FINANCE_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSB4fdim5C_sbtwDIY8ETZb3ir1eDBeqwROU8KXTJuLRwxfEZvCFPPje9escLRmY7Awu-ehBVsr_Qj/pub?gid=1875233711&single=true&output=csv';

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

export function parseTransactionDate(rawDate: string): ParsedDateInfo {
  const trimmed = rawDate.trim();
  let year = new Date().getFullYear();
  let month = 1;
  let day = 1;

  if (trimmed.includes('/') || trimmed.includes('-')) {
    const parts = trimmed.split(/[/ -]/).map((p) => parseInt(p, 10));
    if (parts.length === 3) {
      if (parts[0] > 1000) {
        // YYYY-MM-DD
        year = parts[0];
        month = parts[1];
        day = parts[2];
      } else if (parts[2] > 1000) {
        // Could be M/D/YYYY or D/M/YYYY. Typically Google Sheets uses M/D/YYYY
        year = parts[2];
        if (parts[0] > 12) {
          // D/M/YYYY
          day = parts[0];
          month = parts[1];
        } else {
          // M/D/YYYY
          month = parts[0];
          day = parts[1];
        }
      }
    }
  }

  // Safe bounds
  month = Math.max(1, Math.min(12, isNaN(month) ? 1 : month));
  day = Math.max(1, Math.min(31, isNaN(day) ? 1 : day));
  year = isNaN(year) ? new Date().getFullYear() : year;

  const dateObj = new Date(year, month - 1, day);
  const timestamp = dateObj.getTime();

  const formattedBn = `${toBengaliNumerals(day)} ${BN_MONTHS[month - 1]}, ${toBengaliNumerals(year)}`;
  const formattedEn = `${day} ${EN_MONTHS[month - 1]}, ${year}`;
  const rawIso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    year,
    month,
    day,
    timestamp,
    formattedBn,
    formattedEn,
    rawIso,
  };
}

export function formatCurrencyBn(amount: number): string {
  const parts = Math.abs(amount).toLocaleString('en-US');
  return `৳ ${toBengaliNumerals(parts)}`;
}

export function formatCurrencyEn(amount: number): string {
  const parts = Math.abs(amount).toLocaleString('en-US');
  return `৳ ${parts}`;
}

export function amountToBengaliWords(num: number): string {
  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'শূন্য টাকা মাত্র';

  const units = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ',
    'এগারো', 'বারো', 'তেরো', 'চোদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ', 'বিশ',
    'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ', 'ত্রিশ',
    'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ',
    'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ',
    'একান্ন', 'বায়ান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপ্পান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট', 'ষাট',
    'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর', 'সত্তর',
    'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আঠাত্তর', 'ঊনআশি', 'আশি',
    'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'অষ্টআশি', 'ঊননব্বই', 'নব্বই',
    'একানব্বই', 'বানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই', 'একশত'
  ];

  function convertChunk(val: number): string {
    if (val === 0) return '';
    if (val <= 100) return units[val];
    const h = Math.floor(val / 100);
    const rem = val % 100;
    const hWord = h === 1 ? 'একশত' : `${units[h]} শত`;
    if (rem === 0) return hWord;
    return `${hWord} ${units[rem]}`;
  }

  let crore = Math.floor(n / 10000000);
  let remainder = n % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;
  let rest = remainder;

  let words = '';
  if (crore > 0) words += `${convertChunk(crore)} কোটি `;
  if (lakh > 0) words += `${convertChunk(lakh)} লাখ `;
  if (thousand > 0) words += `${convertChunk(thousand)} হাজার `;
  if (rest > 0) words += `${convertChunk(rest)} `;

  return `${words.trim()} টাকা মাত্র`;
}

export function amountToEnglishWords(num: number): string {
  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'Zero Taka Only';

  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numToWords(val: number): string {
    if (val === 0) return '';
    if (val < 20) return a[val];
    if (val < 100) return b[Math.floor(val / 10)] + (val % 10 !== 0 ? ' ' + a[val % 10] : ' ');
    if (val < 1000) return a[Math.floor(val / 100)] + 'Hundred ' + (val % 100 !== 0 ? 'and ' + numToWords(val % 100) : '');
    if (val < 100000) return numToWords(Math.floor(val / 1000)) + 'Thousand ' + (val % 1000 !== 0 ? numToWords(val % 1000) : '');
    if (val < 10000000) return numToWords(Math.floor(val / 100000)) + 'Lakh ' + (val % 100000 !== 0 ? numToWords(val % 100000) : '');
    return numToWords(Math.floor(val / 10000000)) + 'Crore ' + (val % 10000000 !== 0 ? numToWords(val % 10000000) : '');
  }

  return `${numToWords(n).trim()} Taka Only`;
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseFinanceCSV(csvText: string): Transaction[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]).map((h) =>
    h.toLowerCase().trim().replace(/[\r\n\t]/g, '')
  );

  const getColIndex = (names: string[]): number => {
    return headers.findIndex((h) => names.some((n) => h === n || h.includes(n)));
  };

  const dateIdx = getColIndex(['date', 'তারিখ', 'সময়']);
  const idIdx = getColIndex(['transaction id', 'transaction_id', 'txnid', 'id', 'ভাউচার', 'আইডি']);
  const typeIdx = getColIndex(['transaction type', 'type', 'ধরন', 'খাত ধরন']);
  const amountIdx = getColIndex(['ammount', 'amount', 'টাকা', 'পরিমাণ', 'মূল্য']);

  // Optional columns
  const descIdx = getColIndex(['description', 'বিবরণ', 'note', 'মন্তব্য', 'উদ্দেশ্য', 'purpose']);
  const catIdx = getColIndex(['category', 'খাত', 'ক্যাটাগরি']);
  const donorIdx = getColIndex(['donor', 'payer', 'recipient', 'দাতা', 'গ্রহীতা', 'নাম', 'name']);
  const methodIdx = getColIndex(['method', 'মাধ্যম', 'পেমেন্ট মাধ্যম', 'payment method']);

  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (!row || row.length === 0) continue;

    const rawDate = dateIdx >= 0 && row[dateIdx] ? row[dateIdx] : '';
    const rawId = idIdx >= 0 && row[idIdx] ? row[idIdx] : `TXN${String(i).padStart(4, '0')}`;
    const rawType = typeIdx >= 0 && row[typeIdx] ? row[typeIdx].toLowerCase() : 'income';
    const rawAmount = amountIdx >= 0 && row[amountIdx] ? row[amountIdx] : '0';

    if (!rawDate && !rawId && !rawAmount) continue;

    // Type detection
    const isExpense =
      rawType.includes('expense') ||
      rawType.includes('ব্যয়') ||
      rawType.includes('খরচ') ||
      rawType.includes('out') ||
      rawType.includes('debit');

    const type = isExpense ? 'expense' : 'income';

    // Amount cleanup
    const cleanAmountStr = rawAmount.replace(/[৳$,\s]/g, '');
    const amount = Math.abs(parseFloat(cleanAmountStr)) || 0;

    const parsedDate = parseTransactionDate(rawDate);

    // Smart default descriptions
    let description = descIdx >= 0 && row[descIdx] ? row[descIdx] : '';
    let category = catIdx >= 0 && row[catIdx] ? row[catIdx] : '';

    if (!description) {
      description =
        type === 'income'
          ? 'সাধারণ তহবিল অনুদান ও সদস্য চাঁদা'
          : 'সাংগঠনিক ও সামাজিক উন্নয়ন ব্যয়';
    }

    if (!category) {
      category = type === 'income' ? 'অনুদান ও চাঁদা' : 'সাংগঠনিক পরিচালনা';
    }

    const donorOrRecipient =
      donorIdx >= 0 && row[donorIdx]
        ? row[donorIdx]
        : type === 'income'
        ? 'সম্মানিত সদস্য / শুভানুধ্যায়ী'
        : 'পলাশবাড়ী ইয়াং সোসাইটি কার্যনির্বাহী';

    const method = methodIdx >= 0 && row[methodIdx] ? row[methodIdx] : 'নগদ / ডিজিটাল ক্যাশ';

    transactions.push({
      id: rawId.trim(),
      date: rawDate,
      parsedDate,
      type,
      amount,
      description: description.trim(),
      category: category.trim(),
      donorOrRecipient: donorOrRecipient.trim(),
      method: method.trim(),
    });
  }

  // Sort by date descending (latest first)
  transactions.sort((a, b) => b.parsedDate.timestamp - a.parsedDate.timestamp);

  return transactions;
}

export function calculateFinanceSummary(transactions: Transaction[]): FinanceSummary {
  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += t.amount;
      incomeCount++;
    } else {
      totalExpense += t.amount;
      expenseCount++;
    }
  }

  const netBalance = totalIncome - totalExpense;
  const totalTransactions = transactions.length;
  const expenseRatio = totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0;

  return {
    totalIncome,
    totalExpense,
    netBalance,
    totalTransactions,
    incomeCount,
    expenseCount,
    expenseRatio,
  };
}

export const FALLBACK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TNX2026001',
    date: '9/27/2026',
    parsedDate: {
      year: 2026,
      month: 9,
      day: 27,
      timestamp: new Date(2026, 8, 27).getTime(),
      formattedBn: '২৭ সেপ্টেম্বর, ২০২৬',
      formattedEn: '27 Sep, 2026',
      rawIso: '2026-09-27',
    },
    type: 'income',
    amount: 100,
    description: 'সাধারণ তহবিল অনুদান ও সদস্য চাঁদা',
    category: 'সদস্য চাঁদা ও অনুদান',
    donorOrRecipient: 'সম্মানিত সদস্য / শুভানুধ্যায়ী',
    method: 'নগদ / বিকাশ',
  },
  {
    id: 'TNX2026002',
    date: '9/27/2026',
    parsedDate: {
      year: 2026,
      month: 9,
      day: 27,
      timestamp: new Date(2026, 8, 27).getTime(),
      formattedBn: '২৭ সেপ্টেম্বর, ২০২৬',
      formattedEn: '27 Sep, 2026',
      rawIso: '2026-09-27',
    },
    type: 'expense',
    amount: 80,
    description: 'মাঠপর্যায়ের কার্যক্রম ও স্টেশনারি সামগ্রী',
    category: 'কার্যক্রম ও ইভেন্ট',
    donorOrRecipient: 'বীরগঞ্জ ভেন্ডর / স্টেশনারি',
    method: 'অফিসিয়াল খরচ',
  },
  {
    id: 'TNX20260003',
    date: '9/28/2026',
    parsedDate: {
      year: 2026,
      month: 9,
      day: 28,
      timestamp: new Date(2026, 8, 28).getTime(),
      formattedBn: '২৮ সেপ্টেম্বর, ২০২৬',
      formattedEn: '28 Sep, 2026',
      rawIso: '2026-09-28',
    },
    type: 'expense',
    amount: 20,
    description: 'দাপ্তরিক ও যোগাযোগ সংক্রান্ত খরচ',
    category: 'দাপ্তরিক ও যোগাযোগ',
    donorOrRecipient: 'অফিস ব্যবস্থাপনা',
    method: 'অফিসিয়াল খরচ',
  },
];
