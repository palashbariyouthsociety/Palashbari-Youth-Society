'use client';

import { useLang } from '@/context/LanguageContext';
import {
  IdCard,
  User,
  Sparkles,
  HeartHandshake,
  Award,
  Shield,
  FileCheck2,
  Scale,
  AlertOctagon,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export default function MembershipSection() {
  const { t } = useLang();

  const memberTypes = [
    {
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      bn: 'সাধারণ সদস্য',
      en: 'General Member',
      descBn: 'যারা নিয়মিতভাবে সংগঠনের সামাজিক কার্যক্রমে আন্তরিকভাবে অংশগ্রহণ করবেন।',
      descEn: 'Those who actively participate regularly in organizational activities.',
    },
    {
      icon: Sparkles,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      bn: 'সক্রিয় সদস্য',
      en: 'Active Member',
      descBn: 'যারা নিয়মিত সভা, সেবামূলক কর্মসূচি ও নির্দিষ্ট সাংগঠনিক দায়িত্ব পালন করবেন।',
      descEn: 'Those fulfilling regular meetings, service duties, and organizational roles.',
    },
    {
      icon: HeartHandshake,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      bn: 'সহযোগী সদস্য',
      en: 'Associate Member',
      descBn: 'যারা আর্থিকভাবে, বুদ্ধিবৃত্তিকভাবে বা যেকোনোভাবে কার্যক্রমে সার্বিক সহযোগিতা করবেন।',
      descEn: 'Those supporting activities with financial, intellectual or resource backing.',
    },
    {
      icon: Award,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      bn: 'সম্মানিত সদস্য',
      en: 'Honorary Member',
      descBn: 'সমাজসেবায় বিশেষ অবদান রাখায় কার্যনির্বাহী কমিটির মাধ্যমে মনোনীত বিশিষ্ট নাগরিক।',
      descEn: 'Distinguished citizens honored and nominated for remarkable social contributions.',
    },
    {
      icon: Shield,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200',
      bn: 'প্রতিষ্ঠাতা সদস্য',
      en: 'Founding Member',
      descBn: '২০২২ সালে সংগঠনের প্রতিষ্ঠা লগ্নে যারা প্রত্যক্ষভাবে যুক্ত থেকে ভিত্তি স্থাপন করেছেন।',
      descEn: 'Pioneering members directly involved in founding the organization in 2022.',
    },
  ];

  const requirements = [
    t('সংগঠনের লক্ষ্য ও উদ্দেশ্যের প্রতি অটুট শ্রদ্ধা ও আন্তরিক অঙ্গীকার থাকতে হবে।', 'Must respect and commit to the organization\'s goals and objectives.'),
    t('নিঃস্বার্থ স্বেচ্ছাসেবী ও সামাজিক কল্যাণমূলক কর্মকাণ্ডে প্রবল আগ্রহ থাকতে হবে।', 'Must have genuine interest in voluntary and humanitarian work.'),
    t('সংগঠনের গঠনতন্ত্র ও যাবতীয় বিধিবিধান নিষ্ঠার সাথে অক্ষরে অক্ষরে মেনে চলতে হবে।', 'Must adhere strictly to the constitution and organizational rules.'),
    t('সংগঠনের সামাজিক সুনাম, বিশ্বাসযোগ্যতা ও মর্যাদা সর্বদা অক্ষুণ্ণ রাখতে হবে।', 'Must protect the public reputation and dignity of the organization.'),
    t('নির্ধারিত সদস্যপদ আবেদন ফরম সম্পূর্ণ সত্য তথ্য দিয়ে যথাযথভাবে পূরণ করতে হবে।', 'Must truthfully and completely fill out the official membership form.'),
    t('কার্যকরী পরিষদের আনুষ্ঠানিক যাচাই ও অনুমোদনের পরই সদস্যপদ কার্যকর হবে।', 'Membership takes effect only after Executive Council approval.'),
  ];

  const rights = [
    t('সংগঠনের সাধারণ সভা ও বিশেষ অধিবেশনে অংশগ্রহণের পূর্ণ অধিকার থাকবে।', 'Full right to attend general meetings and special assemblies.'),
    t('সংগঠনের যেকোনো নীতি বা সিদ্ধান্তে গঠনমূলক মতামত ও প্রস্তাব প্রকাশ করার সুযোগ।', 'Right to express constructive opinions and proposals on policies.'),
    t('সংগঠনের সকল সামাজিক, মানবিক ও সেবামূলক কার্যক্রমে সরাসরি অংশগ্রহণের সুযোগ।', 'Direct participation in all humanitarian and community drives.'),
    t('দক্ষতা, নিষ্ঠা ও সক্রিয়তার ভিত্তিতে সাংগঠনিক যেকোনো পদে দায়িত্ব গ্রহণের যোগ্যতা।', 'Eligibility for organizational executive posts based on dedication.'),
    t('গঠনতন্ত্রের নিয়মাবলি অনুযায়ী সাধারণ পরিষদের ভোটাধিকার প্রয়োগের ক্ষমতা।', 'Voting rights in General Council meetings as per constitution.'),
  ];

  const restrictions = [
    t('সংগঠনের নাম, সিল বা পরিচয় ব্যবহার করে কোনো ব্যক্তিগত অন্যায় সুবিধা নেওয়া যাবে না।', 'Cannot use the organization\'s name, seal or title for personal gain.'),
    t('কার্যকরী পরিষদের লিখিত অনুমতি ব্যতীত কোনো ধরনের চাঁদা বা অর্থ সংগ্রহ নিষিদ্ধ।', 'Strictly forbidden to collect funds without official written authorization.'),
    t('সংগঠনের অন্য কোনো সদস্য বা সাধারণ মানুষকে অসম্মান বা হুমকি প্রদর্শন করা যাবে না।', 'Zero tolerance for harassment, disrespect, or threats to any person.'),
    t('সংগঠনের নামে কোনো বিভ্রান্তিকর বা অসত্য তথ্য প্রচার ও বিভ্রান্তি সৃষ্টি নিষিদ্ধ।', 'Prohibited from propagating false or defamatory information.'),
    t('মাদকাসক্তি, সন্ত্রাস, দুর্নীতি বা যেকোনো ফৌজদারি অপরাধমূলক কাজে লিপ্ত হওয়া নিষিদ্ধ।', 'Zero tolerance for involvement in narcotics, crime, or illicit acts.'),
  ];

  return (
    <section id="membership" className="py-20 md:py-28 bg-white relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <IdCard className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('ধারা–৮ থেকে ১২ : সদস্য নীতিমালা', 'Articles 8–12: Membership Guidelines')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {t('সদস্যপদ ও ', 'Membership ')}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              {t('সদস্যশ্রেণি রূপরেখা', 'Categories & Rights')}
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'সংগঠনের সদস্য হওয়ার যোগ্যতা, ধরন, অধিকার ও পালনীয় বিধিনিষেধ সংক্রান্ত বিস্তারিত বিধান।',
              'Detailed constitution framework covering eligibility, categories, member rights and prohibited acts.'
            )}
          </p>
        </div>

        {/* 5 Member Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-16">
          {memberTypes.map((type, idx) => {
            const Icon = type.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className={`p-3 rounded-2xl ${type.bg} border inline-flex mb-3.5`}>
                    <Icon className={`w-5 h-5 ${type.color}`} />
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm mb-1.5">{t(type.bn, type.en)}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{t(type.descBn, type.descEn)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Requirements, Rights & Restrictions Triplet */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* 1. Requirements */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/80 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200">
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                  <FileCheck2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('সদস্যপদের শর্তাবলি', 'Membership Criteria')}
                  </h3>
                  <p className="text-slate-500 text-xs">{t('ধারা–৯ : যোগ্যতা', 'Article 9: Eligibility')}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm leading-relaxed">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. Rights */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/80 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <Scale className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('সদস্যদের অধিকার ও সুযোগ', 'Member Rights & Privileges')}
                  </h3>
                  <p className="text-slate-500 text-xs">{t('ধারা–১০ : অধিকার', 'Article 10: Rights')}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {rights.map((right, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm leading-relaxed">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Restrictions */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/80 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200">
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                  <AlertOctagon className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('নিষিদ্ধ কর্মকাণ্ড ও আচরণ', 'Prohibited Conduct')}
                  </h3>
                  <p className="text-slate-500 text-xs">{t('ধারা–১১ : শৃঙ্খলাভঙ্গ', 'Article 11: Violations')}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {restrictions.map((res, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm leading-relaxed">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Direct Google Form Application Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-semibold backdrop-blur-sm mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('সদস্যপদ আহ্বান', 'Join Our Movement')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              {t('পলাশবাড়ী ইয়াং সোসাইটির সদস্য হতে চান?', 'Ready to Become a Member?')}
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
              {t(
                'আমাদের অফিসিয়াল গুগল ফ্রমে সরাসরি তথ্য পূরণ করে আবেদন সম্পন্ন করুন। কার্যকরী পরিষদ যাচাইপূর্বক আপনার সাথে যোগাযোগ করবে।',
                'Complete your application directly via our official Google Form. The Executive Council will contact you upon review.'
              )}
            </p>
          </div>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSepz2DFB9DiUsPE60qgl3eiWEFAd9OP-n3jHXWtE4MQhinKiw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-7 py-3.5 bg-white text-blue-700 hover:bg-slate-50 font-bold text-sm sm:text-base rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
          >
            <span>{t('গুগল ফ্রমে সরাসরি আবেদন করুন', 'Apply via Google Form')}</span>
            <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
