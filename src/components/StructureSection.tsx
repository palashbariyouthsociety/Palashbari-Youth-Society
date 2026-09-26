'use client';

import { useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import {
  Network,
  Landmark,
  Briefcase,
  Award,
  Layers,
  CheckCircle2,
  UserCheck,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Users,
  Compass,
  FileText,
  Megaphone,
  Heart,
  GraduationCap,
  Trophy,
  Laptop,
  Activity,
  Trees,
  UserPlus,
} from 'lucide-react';

export default function StructureSection() {
  const { t, lang } = useLang();
  const [openPos, setOpenPos] = useState<number | null>(0);

  const togglePos = (idx: number) => {
    setOpenPos(openPos === idx ? null : idx);
  };

  const toBengaliNumber = (num: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .padStart(2, '0')
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join('');
  };

  const bodies = [
    {
      icon: Landmark,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      bn: 'সাধারণ পরিষদ',
      en: 'General Council',
      role: t('সর্বোচ্চ নীতিনির্ধারণী পরিষদ (ধারা–১৩)', 'Supreme Policy-Making Assembly (Article 13)'),
      duties: [
        t('সংগঠনের গঠনতন্ত্র অনুমোদন ও যেকোনো সংশোধনী পাস করা', 'Approval and amendment of organizational constitution'),
        t('দ্বিবার্ষিক কার্যকরী পরিষদ নির্বাচন বা গঠন অনুমোদন', 'Election and ratification of biennial Executive Council'),
        t('সংগঠনের বার্ষিক কার্যক্রম ও বাজেট প্রতিবেদন পর্যালোচনা', 'Reviewing annual activity and financial budget reports'),
        t('সংগঠনের সামগ্রিক স্বার্থে যেকোনো চূড়ান্ত সিদ্ধান্ত গ্রহণ', 'Taking final binding decisions in the interest of the organization'),
      ],
    },
    {
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      bn: 'কার্যকরী পরিষদ',
      en: 'Executive Council',
      role: t('দৈনন্দিন কার্যক্রম ও সিদ্ধান্ত বাস্তবায়ন (ধারা–১৪)', 'Daily Operations & Execution (Article 14)'),
      duties: [
        t('১৬টি নির্বাচিত বা মনোনীত পদের সমন্বয়ে গঠিত পরিচালনা পর্ষদ', 'Governing board composed of 16 executive portfolios'),
        t('সাধারণ পরিষদের নীতি ও সিদ্ধান্তসমূহ নিয়মিত মাঠপর্যায়ে বাস্তবায়ন', 'Implementing policies passed by the General Council'),
        t('নিয়মিত মাসিক সভা অনুষ্ঠান এবং সার্বিক কার্যক্রম তদারকি', 'Conducting monthly meetings and overseeing projects'),
        t('নতুন সদস্যপদ আবেদন যাচাই ও অনুমোদন প্রক্রিয়া সম্পন্নকরণ', 'Scrutinizing and approving new membership applications'),
      ],
    },
    {
      icon: Award,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      bn: 'উপদেষ্টা পরিষদ',
      en: 'Advisory Council',
      role: t('অভিজ্ঞ ও বিশিষ্ট ব্যক্তিবর্গের দিকনির্দেশনা (ধারা–১৫)', 'Guidance from Respected Elders (Article 15)'),
      duties: [
        t('সমাজের বিশিষ্ট, প্রবীণ ও সম্মানিত সমাজসেবকদের নিয়ে গঠিত', 'Composed of distinguished, respected community elders'),
        t('সংগঠনকে প্রয়োজনীয় মূল্যবান পরামর্শ ও দিকনির্দেশনা প্রদান', 'Providing strategic counsel and ethical direction'),
        t('সংগঠনের সংকটময় মুহূর্তে মধ্যস্থতা ও সমাধান প্রদানে সহায়তা', 'Assisting in crisis mediation and conflict resolution'),
      ],
    },
    {
      icon: Layers,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      bn: 'উপ-কমিটিসমূহ',
      en: 'Sub-Committees',
      role: t('বিশেষ প্রকল্প ও কার্যক্রম বাস্তবায়ন সেল', 'Special Project & Execution Cells'),
      duties: [
        t('প্রয়োজন অনুসারে নির্দিষ্ট কোনো কর্মসূচি বা প্রকল্পের জন্য গঠিত', 'Formed on need basis for dedicated campaigns or events'),
        t('ত্রাণ বিতরণ, রক্তদান ক্যাম্পেইন, ক্রীড়া বা প্রকাশনা ব্যবস্থাপনা', 'Relief distribution, blood camps, sports or publications'),
        t('সরাসরি কার্যকরী পরিষদের দিকনির্দেশনায় কাজ সম্পাদন', 'Executing tasks directly under the Executive Council'),
      ],
    },
  ];

  const executiveRoles = [
    {
      icon: Compass,
      bn: 'সভাপতি',
      en: 'President',
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      duties: [
        t('সংগঠনের সার্বিক নেতৃত্ব ও তদারকি করবেন।', 'Provide overall leadership and supervision of the organization.'),
        t('গুরুত্বপূর্ণ সিদ্ধান্ত গ্রহণে নেতৃত্ব দেবেন।', 'Lead critical decision-making processes.'),
        t('সকল সভায় সভাপতিত্ব করবেন।', 'Preside over all official meetings.'),
        t('সংগঠনের শৃঙ্খলা ও কার্যক্রম সঠিকভাবে পরিচালিত হচ্ছে কি না তা তদারকি করবেন।', 'Ensure discipline and proper execution of all activities.'),
        t('সংগঠনের লক্ষ্য ও উদ্দেশ্য বাস্তবায়নে দিকনির্দেশনা প্রদান করবেন।', 'Provide strategic direction to fulfill organizational vision.'),
      ],
    },
    {
      icon: ShieldCheck,
      bn: 'সহ-সভাপতি',
      en: 'Vice President',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200',
      duties: [
        t('সভাপতিকে সংগঠনের কাজে সার্বিক সহযোগিতা করবেন।', 'Assist the President comprehensively in organizational affairs.'),
        t('সভাপতির অনুপস্থিতিতে তাঁর দায়িত্ব পালন করবেন।', 'Assume presidential duties during the President\'s absence.'),
        t('বিভিন্ন কার্যক্রম বাস্তবায়নে সমন্বয় করবেন।', 'Coordinate execution across various programs.'),
        t('সংগঠনের গুরুত্বপূর্ণ কর্মসূচিতে নেতৃত্ব প্রদানে সহযোগিতা করবেন।', 'Help lead key campaigns and initiatives.'),
      ],
    },
    {
      icon: Briefcase,
      bn: 'সাধারণ সম্পাদক',
      en: 'General Secretary',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      duties: [
        t('সংগঠনের দৈনন্দিন কার্যক্রম পরিচালনা ও সমন্বয় করবেন।', 'Manage and coordinate daily operations.'),
        t('সভা আহ্বান ও সিদ্ধান্ত বাস্তবায়নে প্রধান ভূমিকা রাখবেন।', 'Convene meetings and drive implementation of decisions.'),
        t('সংগঠনের পরিকল্পনা ও কর্মসূচি বাস্তবায়ন করবেন।', 'Implement organizational plans and programs.'),
        t('সভাপতি ও অন্যান্য সম্পাদকদের সঙ্গে নিয়মিত সমন্বয় করবেন।', 'Maintain regular coordination with the President and secretaries.'),
        t('সংগঠনের সার্বিক কার্যক্রমের অগ্রগতি পর্যবেক্ষণ করবেন।', 'Monitor overall progress of all organizational activities.'),
      ],
    },
    {
      icon: Users,
      bn: 'যুগ্ম সাধারণ সম্পাদক',
      en: 'Joint General Secretary',
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200',
      duties: [
        t('সাধারণ সম্পাদককে সার্বিক কাজে সহযোগিতা করবেন।', 'Support the General Secretary in all organizational duties.'),
        t('সাধারণ সম্পাদকের অনুপস্থিতিতে দায়িত্ব পালন করবেন।', 'Discharge duties in the absence of the General Secretary.'),
        t('বিভিন্ন কর্মসূচির অগ্রগতি পর্যবেক্ষণ ও সমন্বয়ে সহযোগিতা করবেন।', 'Assist in tracking and coordinating program progress.'),
        t('সংগঠনের সিদ্ধান্ত বাস্তবায়নে প্রয়োজনীয় সহায়তা করবেন।', 'Provide necessary support in implementing organizational policies.'),
      ],
    },
    {
      icon: UserPlus,
      bn: 'সাংগঠনিক সম্পাদক',
      en: 'Organizational Secretary',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      duties: [
        t('সংগঠনের সদস্যদের মধ্যে সমন্বয় ও যোগাযোগ বজায় রাখবেন।', 'Maintain coordination and communication among members.'),
        t('নতুন সদস্য সংগ্রহ ও সাংগঠনিক কার্যক্রম পরিচালনা করবেন।', 'Lead new member enrollment and organizational campaigns.'),
        t('বিভিন্ন এলাকার প্রতিনিধিদের সঙ্গে যোগাযোগ রাখবেন।', 'Liaise with community representatives across areas.'),
        t('সদস্যদের সক্রিয়ভাবে সংগঠনের কার্যক্রমে সম্পৃক্ত করবেন।', 'Keep members actively engaged in organizational programs.'),
        t('সংগঠনের সাংগঠনিক কাঠামো আরও সুসংগঠিত করতে কাজ করবেন।', 'Strengthen and streamline the organizational structure.'),
      ],
    },
    {
      icon: Users,
      bn: 'সহ-সাংগঠনিক সম্পাদক',
      en: 'Asst. Organizational Secretary',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 border-yellow-200',
      duties: [
        t('সাংগঠনিক সম্পাদককে সার্বিক সহযোগিতা করবেন।', 'Assist the Organizational Secretary in all tasks.'),
        t('সদস্যদের কার্যক্রমে সম্পৃক্ত করতে কাজ করবেন।', 'Engage members actively in grassroots work.'),
        t('বিভিন্ন সাংগঠনিক কর্মসূচি বাস্তবায়নে সহায়তা করবেন।', 'Help execute various organizational agendas.'),
        t('সদস্য ও প্রতিনিধিদের সঙ্গে যোগাযোগ রক্ষায় সহযোগিতা করবেন।', 'Support liaison with representatives and members.'),
      ],
    },
    {
      icon: Landmark,
      bn: 'অর্থ সম্পাদক',
      en: 'Finance Secretary',
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      duties: [
        t('সংগঠনের আয়-ব্যয়ের হিসাব সঠিকভাবে সংরক্ষণ করবেন।', 'Maintain accurate books of accounts and transactions.'),
        t('অনুদান ও অর্থ সংগ্রহের হিসাব রাখবেন।', 'Keep diligent records of donations and fundraising.'),
        t('প্রতিটি ব্যয়ের যথাযথ হিসাব ও প্রমাণ সংরক্ষণ করবেন।', 'Preserve valid receipts and vouchers for every expense.'),
        t('প্রয়োজন অনুযায়ী আয়-ব্যয়ের প্রতিবেদন উপস্থাপন করবেন।', 'Present financial statements and audit reports as required.'),
        t('সংগঠনের আর্থিক স্বচ্ছতা ও জবাবদিহিতা বজায় রাখতে কাজ করবেন।', 'Ensure absolute financial integrity and transparency.'),
      ],
    },
    {
      icon: FileText,
      bn: 'দপ্তর সম্পাদক',
      en: 'Office Secretary',
      color: 'text-blue-700',
      bg: 'bg-blue-50 border-blue-200',
      duties: [
        t('সংগঠনের প্রয়োজনীয় কাগজপত্র ও নথি সংরক্ষণ করবেন।', 'Safeguard all organizational files, assets, and records.'),
        t('সভার নোটিশ, কার্যবিবরণী ও অফিসিয়াল নথিপত্র প্রস্তুত ও সংরক্ষণ করবেন।', 'Draft meeting notices, minutes, and official correspondence.'),
        t('সংগঠনের প্রশাসনিক কাজে সহযোগিতা করবেন।', 'Support general administrative operations.'),
        t('গুরুত্বপূর্ণ সিদ্ধান্ত ও সাংগঠনিক তথ্য সুশৃঙ্খলভাবে সংরক্ষণ করবেন।', 'Systematically record decisions and administrative data.'),
      ],
    },
    {
      icon: Megaphone,
      bn: 'প্রচার ও প্রকাশনা সম্পাদক',
      en: 'Publicity & Publication Secretary',
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200',
      duties: [
        t('সংগঠনের কার্যক্রম প্রচার ও প্রকাশ করবেন।', 'Manage public relations and media coverage.'),
        t('ফেসবুক পেজসহ সামাজিক যোগাযোগমাধ্যমে সংগঠনের কার্যক্রমের তথ্য প্রকাশ করবেন।', 'Publish updates across social media platforms like Facebook.'),
        t('পোস্টার, ব্যানার, বিজ্ঞপ্তি ও প্রচারমূলক লেখা প্রস্তুতে সমন্বয় করবেন।', 'Coordinate banners, posters, press releases, and publications.'),
        t('সংগঠনের ইতিবাচক ও মানবিক কার্যক্রম মানুষের কাছে তুলে ধরবেন।', 'Highlight humanitarian and developmental success stories.'),
        t('প্রচারের ক্ষেত্রে সঠিক ও দায়িত্বশীল তথ্য প্রকাশ নিশ্চিত করবেন।', 'Ensure authenticity and accountability in all communications.'),
      ],
    },
    {
      icon: HeartHandshake,
      bn: 'সমাজকল্যাণ সম্পাদক',
      en: 'Social Welfare Secretary',
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      duties: [
        t('অসহায়, দরিদ্র ও বিপদগ্রস্ত মানুষের পাশে দাঁড়ানোর কার্যক্রম পরিচালনা করবেন।', 'Direct relief initiatives for underprivileged and distressed people.'),
        t('চিকিৎসা সহায়তা, শীতবস্ত্র বিতরণ, খাদ্য সহায়তা ইত্যাদি কর্মসূচিতে সমন্বয় করবেন।', 'Coordinate medical aid, winter clothing, and food relief drives.'),
        t('সমাজের প্রয়োজন অনুযায়ী কল্যাণমূলক কর্মসূচির প্রস্তাব দেবেন।', 'Propose welfare initiatives tailored to community needs.'),
        t('মানবিক সহায়তার প্রয়োজন রয়েছে এমন ব্যক্তিদের বিষয়ে সংগঠনকে অবহিত করবেন।', 'Identify vulnerable individuals requiring humanitarian support.'),
      ],
    },
    {
      icon: GraduationCap,
      bn: 'শিক্ষা ও সাংস্কৃতিক সম্পাদক',
      en: 'Education & Cultural Secretary',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200',
      duties: [
        t('শিক্ষামূলক ও সাংস্কৃতিক কার্যক্রম পরিচালনায় দায়িত্ব পালন করবেন।', 'Lead educational and cultural programs.'),
        t('শিক্ষার্থীদের শিক্ষা ও জ্ঞানচর্চায় উৎসাহিত করবেন।', 'Inspire students towards academic excellence and knowledge.'),
        t('কুইজ, আলোচনা, পাঠচক্র ও শিক্ষামূলক আয়োজন সমন্বয় করবেন।', 'Organize quizzes, debates, study circles, and seminars.'),
        t('সাংস্কৃতিক অনুষ্ঠান ও সৃজনশীল কার্যক্রম আয়োজন করবেন।', 'Host cultural functions and creative talent initiatives.'),
        t('তরুণদের মেধা ও প্রতিভা বিকাশে উৎসাহিত করবেন।', 'Foster youth talent, creativity, and intellectual development.'),
      ],
    },
    {
      icon: Trophy,
      bn: 'ক্রীড়া সম্পাদক',
      en: 'Sports Secretary',
      color: 'text-orange-600',
      bg: 'bg-orange-50 border-orange-200',
      duties: [
        t('খেলাধুলার আয়োজন ও পরিচালনায় দায়িত্ব পালন করবেন।', 'Manage sports fixtures and athletic competitions.'),
        t('যুবকদের খেলাধুলায় উৎসাহিত করবেন।', 'Motivate youth to participate in sports and physical fitness.'),
        t('বিভিন্ন ক্রীড়া প্রতিযোগিতা আয়োজন ও সমন্বয় করবেন।', 'Organize tournaments and outdoor recreational events.'),
        t('তরুণদের সুস্থ বিনোদন ও শারীরিক কর্মকাণ্ডে সম্পৃক্ত করতে কাজ করবেন।', 'Engage youth in healthy hobbies and constructive recreation.'),
      ],
    },
    {
      icon: Laptop,
      bn: 'তথ্য ও প্রযুক্তি সম্পাদক',
      en: 'IT & Technology Secretary',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 border-cyan-200',
      duties: [
        t('সংগঠনের ডিজিটাল কার্যক্রম পরিচালনায় সহযোগিতা করবেন।', 'Lead digital infrastructure and IT initiatives.'),
        t('অনলাইন সভা, ডিজিটাল ফাইল ও তথ্য ব্যবস্থাপনায় দায়িত্ব পালন করবেন।', 'Manage online meetings, cloud files, and digital records.'),
        t('সংগঠনের প্রয়োজনীয় তথ্য ও ডিজিটাল উপকরণ সংরক্ষণ করবেন।', 'Safeguard digital media, databases, and IT assets.'),
        t('প্রযুক্তির মাধ্যমে সংগঠনের কার্যক্রমকে আরও সহজ ও কার্যকর করতে কাজ করবেন।', 'Harness technology to streamline organizational efficiency.'),
        t('প্রয়োজনীয় ডিজিটাল প্ল্যাটফর্ম ব্যবহারে সদস্যদের সহযোগিতা করবেন।', 'Train and assist members in utilizing modern tech tools.'),
      ],
    },
    {
      icon: Activity,
      bn: 'স্বাস্থ্য বিষয়ক সম্পাদক',
      en: 'Health Affairs Secretary',
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-200',
      duties: [
        t('সংগঠনের স্বাস্থ্যসেবামূলক কার্যক্রম পরিচালনা ও সমন্বয় করবেন।', 'Direct and coordinate public health and medical drives.'),
        t('অসহায় ও দরিদ্র মানুষের চিকিৎসা সহায়তায় প্রয়োজনীয় উদ্যোগ গ্রহণ করবেন।', 'Facilitate healthcare support for destitute and ailing patients.'),
        t('রক্তদান কর্মসূচি, রক্তের গ্রুপ নির্ণয় ও জরুরি রক্তদানে সদস্যদের উৎসাহিত করবেন।', 'Drive voluntary blood camps, blood grouping, and emergency requests.'),
        t('স্বাস্থ্য সচেতনতা, পরিচ্ছন্নতা ও রোগ প্রতিরোধ বিষয়ে সচেতনতামূলক কর্মসূচি আয়োজন করবেন।', 'Promote community hygiene, hygiene drives, and disease prevention.'),
        t('চিকিৎসক ও স্বাস্থ্যসেবাদানকারী প্রতিষ্ঠানের সঙ্গে প্রয়োজন অনুযায়ী যোগাযোগ ও সমন্বয় করবেন।', 'Liaise with doctors, clinics, and medical institutions.'),
        t('স্বাস্থ্য ক্যাম্প, ফ্রি চিকিৎসা ও ওষুধ বিতরণ কার্যক্রম বাস্তবায়নে সহযোগিতা করবেন।', 'Execute free health check-up camps and medicine distribution.'),
      ],
    },
    {
      icon: Trees,
      bn: 'পরিবেশ বিষয়ক সম্পাদক',
      en: 'Environment Affairs Secretary',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      duties: [
        t('পরিবেশ সংরক্ষণমূলক কর্মসূচি পরিচালনা করবেন।', 'Lead environmental conservation and green projects.'),
        t('বৃক্ষরোপণ, পরিচ্ছন্নতা অভিযান ও পরিবেশ সচেতনতামূলক কার্যক্রম আয়োজন করবেন।', 'Conduct massive tree plantation and cleanliness campaigns.'),
        t('মাদক, প্লাস্টিক ও পরিবেশ দূষণের বিরুদ্ধে সচেতনতা তৈরিতে কাজ করবেন।', 'Campaign against drugs, single-use plastic, and environmental pollution.'),
        t('পরিবেশ রক্ষায় তরুণ ও স্থানীয় জনগণকে সম্পৃক্ত করবেন।', 'Involve local youth and communities in ecological protection.'),
        t('পরিচ্ছন্ন ও সবুজ সমাজ গঠনে প্রয়োজনীয় উদ্যোগ গ্রহণ করবেন।', 'Work towards building a green, clean, and sustainable society.'),
      ],
    },
    {
      icon: UserCheck,
      bn: 'কার্যকরী সদস্যগণ',
      en: 'Executive Members',
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      duties: [
        t('সংগঠনের সকল কার্যক্রমে সক্রিয়ভাবে অংশগ্রহণ করবেন।', 'Actively participate in all organizational endeavors.'),
        t('বিভিন্ন কর্মসূচি বাস্তবায়নে দায়িত্বপ্রাপ্তদের সহযোগিতা করবেন।', 'Support portfolio secretaries in executing their programs.'),
        t('সংগঠনের সিদ্ধান্ত বাস্তবায়নে মাঠপর্যায়ে কাজ করবেন।', 'Implement decisions proactively on the ground.'),
        t('প্রয়োজন অনুযায়ী বিশেষ দায়িত্ব পালন করবেন।', 'Take on special ad-hoc responsibilities as assigned.'),
        t('সংগঠনের শৃঙ্খলা, ঐক্য ও পারস্পরিক সহযোগিতা বজায় রাখতে ভূমিকা রাখবেন।', 'Uphold unity, mutual respect, and organizational discipline.'),
      ],
    },
  ];

  return (
    <section id="structure" className="py-20 md:py-28 bg-[#f8fafc] relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Network className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('ধারা–১৩ থেকে ১৫ : প্রাতিষ্ঠানিক রূপরেখা', 'Articles 13–15: Institutional Framework')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {t('সাংগঠনিক ', 'Organizational ')}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              {t('কাঠামো ও পরিষদসমূহ', 'Structure & Councils')}
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'সুশৃঙ্খল পরিচালনা নিশ্চিত করতে সংগঠনের তিনটি পরিষদ ও বিশেষায়িত উপ-কমিটির কাঠামো নির্ধারিত রয়েছে।',
              'A well-defined three-council and specialized sub-committee structure for orderly administration.'
            )}
          </p>
        </div>

        {/* 4 Organizational Bodies Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {bodies.map((body, idx) => {
            const Icon = body.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`p-3 rounded-2xl ${body.bg} border shrink-0`}>
                      <Icon className={`w-6 h-6 ${body.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-0.5">
                        {t(body.bn, body.en)}
                      </h3>
                      <p className="text-blue-600 text-xs font-semibold">{body.role}</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-100">
                    {body.duties.map((duty, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-slate-700 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Executive Committee Roles & Responsibilities Section */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-lg">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 shrink-0">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {t('কার্যনির্বাহী কমিটির ১৬টি পদ ও নির্দিষ্ট দায়িত্ব', '16 Executive Committee Portfolios & Responsibilities')}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  {t(
                    'যেকোনো পদে ক্লিক করে তাদের সুনির্দিষ্ট দায়িত্বসমূহ বিস্তারিত দেখুন',
                    'Click on any portfolio to expand its specific duties and responsibilities'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {t('মোট ১৬টি পদ', '16 Portfolios')}
              </span>
            </div>
          </div>

          {/* Interactive Accordion Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
            {executiveRoles.map((role, idx) => {
              const Icon = role.icon;
              const isOpen = openPos === idx;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-blue-50/40 border-blue-400 shadow-md ring-1 ring-blue-400/30'
                      : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-white shadow-xs'
                  }`}
                >
                  {/* Clickable Header Button */}
                  <button
                    onClick={() => togglePos(idx)}
                    className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl ${role.bg} border flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${role.color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-600 shrink-0">
                            {lang === 'bn' ? `${toBengaliNumber(idx + 1)}.` : `${String(idx + 1).padStart(2, '0')}.`}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {t(role.bn, role.en)}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {t(role.en, role.bn)} • {role.duties.length} {t('টি মূল দায়িত্ব', 'duties')}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-300'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Animated Expandable Responsibilities Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="px-4 pb-4.5 pt-1 border-t border-blue-100">
                      <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{t('সুনির্দিষ্ট দায়িত্ব ও কর্তব্য:', 'Specific Duties & Responsibilities:')}</span>
                      </p>
                      <ul className="space-y-2">
                        {role.duties.map((duty, dIdx) => (
                          <li
                            key={dIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-slate-100 shadow-2xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{duty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Common General Responsibility for All Office Bearers */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-amber-50/50 border border-blue-200 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5 shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {t('সকল পদধারীর জন্য সাধারণ দায়িত্ব', 'General Duties for All Office Bearers')}
                </h4>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                  {t(
                    'সংগঠনের গঠনতন্ত্র, শৃঙ্খলা, স্বচ্ছতা, জবাবদিহিতা ও পারস্পরিক সম্মান বজায় রেখে মানবসেবা, সামাজিক উন্নয়ন ও কল্যাণমূলক কার্যক্রমে ঐক্যবদ্ধভাবে কাজ করা।',
                    'Working unitedly in humanitarian service, social development, and welfare initiatives while upholding the constitution, discipline, transparency, accountability, and mutual respect.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
